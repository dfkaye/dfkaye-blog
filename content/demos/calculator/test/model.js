import { model } from "../sam/model.js"
import { define } from "/js/lib/sam/define.js"

describe("model", () => {
  var { expect } = chai

  describe("define({ model })", () => {
    var app = define({ model })

    it("returns app with model and state", () => {
      var { model, state } = app

      expect(state).to.be.an("object")
      expect(model).to.be.an("object")
    })
  })

  describe("model.propose", () => {
    var app = define({ model })

    it("sends error to state on invalid action step", () => {
      var { model, state } = app

      state.transition = function ({ data }) {
        var { error } = data

        expect(error).to.equal(`Invalid action step, "bonk"`)
      }

      model.propose({ action: "bonk" })
    })

    describe("clear", () => {
      it("clears the model", () => {
        var { model, state } = app

        state.transition = function ({ data }) {
          var { output } = data

          expect(output).to.equal("0")
        }

        model.propose({ action: "clear" })
      })
    })

    describe("digit", () => {
      var { model, state } = app

      beforeEach(() => {
        state.transition = function ({ data }) { }

        model.propose({ action: "clear" })
      })

      it("pushes digit to output", () => {
        state.transition = function ({ data }) {
          var { output } = data

          expect(output).to.equal("123")
        }

        model.propose({ action: "digit", value: "123" })
      })

      it("sends error to state if value is not a digit", () => {
        var result

        state.transition = function ({ data }) {
          result = data
        }

        model.propose({ action: "digit", value: "6y6" })

        var { error } = result

        expect(error).to.equal(`Invalid digit value, "6y6"`)
      })
    })

    describe("clearentry", () => {
      var { model, state } = app

      beforeEach(() => {
        state.transition = function ({ data }) { }

        model.propose({ action: "clear" })
        model.propose({ action: "digit", value: "123" })
      })

      it("clears current entry ", () => {
        state.transition = function ({ data }) {
          var { output } = data

          expect(output).to.equal("0")
        }

        model.propose({ action: "clearentry" })
      })
    })

    describe("backspace", () => {
      var { model, state } = app

      beforeEach(() => {
        state.transition = function ({ data }) { }

        model.propose({ action: "clear" })
        model.propose({ action: "digit", value: "123" })
      })

      it("removes last digit", () => {
        state.transition = function ({ data }) {
          var { output } = data

          expect(output).to.equal("12")
        }

        model.propose({ action: "backspace" })
      })

      it("removes decimal", () => {
        var result

        state.transition = function ({ data }) {
          result = data
        }

        model.propose({ action: "decimal" })
        model.propose({ action: "backspace" })

        var { output } = result

        expect(output).to.equal("123")
      })
    })

    describe("decimal", () => {
      var { model, state } = app

      beforeEach(() => {
        state.transition = function ({ data }) { }

        model.propose({ action: "clear" })
      })

      it("pushes decimal separator", () => {
        state.transition = function ({ data }) {
          var { output } = data

          expect(output).to.equal("0.")
        }

        model.propose({ action: "decimal" })
      })

      it("ignores entry if decimal already present", () => {
        var result

        state.transition = function ({ data }) {
          result = data
        }

        model.propose({ action: "decimal" })
        model.propose({ action: "digit", value: "3" })
        model.propose({ action: "decimal" })

        var { output } = result

        expect(output).to.equal("0.3")
      })
    })

    describe("equals", () => {
      var { model, state } = app

      beforeEach(() => {
        state.transition = function ({ data }) { }

        model.propose({ action: "clear" })
      })

      it("with no entry, should only update expression to 0 =", () => {
        var result

        state.transition = function ({ data }) {
          result = data
        }

        model.propose({ action: "equals" })

        var { output, expression } = result

        expect(output).to.equal("0")
        expect(expression.join(" ")).to.equal("0 &equals;")
      })

      it("should update expression with several operations", () => {
        var result

        state.transition = function ({ data }) {
          result = data
        }

        model.propose({ action: "digit", value: "123" })
        model.propose({ action: "nextOp", value: "plus" })
        model.propose({ action: "digit", value: "123" })
        model.propose({ action: "equals" })

        var { output, expression } = result

        expect(output).to.equal("246")
        expect(expression.join(" ")).to.equal("123 &plus; 123 &equals;")
      })

      it("should reset expression on consecutive equals actions", () => {
        var result

        state.transition = function ({ data }) {
          result = data
        }

        model.propose({ action: "digit", value: "123" })
        model.propose({ action: "nextOp", value: "plus" })
        model.propose({ action: "digit", value: "123" })
        model.propose({ action: "equals" })

        model.propose({ action: "equals" })

        var { output, expression } = result

        expect(output).to.equal(String(246 + 123))
        expect(expression.join(" ")).to.equal("246 &plus; 123 &equals;")
      })

      it(`given "6 =", then "3", should print expression: "3 ="`, () => {
        var result

        state.transition = function ({ data }) {
          result = data
        }

        model.propose({ action: "digit", value: "6" })
        model.propose({ action: "equals" })
        model.propose({ action: "digit", value: "3" })

        var { output, expression } = result

        expect(output).to.equal("3")
        expect(expression.join(" ")).to.equal("3 &equals;")
      })

      it(`given "7 + 8 =", then "*", should print expression "15 *", output "15"`, () => {
        var result

        state.transition = function ({ data }) {
          result = data
        }

        model.propose({ action: "digit", value: "7" })
        model.propose({ action: "nextOp", value: "plus" })
        model.propose({ action: "digit", value: "8" })
        model.propose({ action: "equals" })
        model.propose({ action: "nextOp", value: "multiply" })

        var { output, expression } = result

        expect(output).to.equal("15")
        expect(expression.join(" ")).to.equal("15 &times;")
      })
    })

    describe("negate", () => {
      var { model, state } = app

      beforeEach(() => {
        state.transition = function ({ data }) { }

        model.propose({ action: "clear" })
        model.propose({ action: "digit", value: "123" })
      })

      it("negates current entry", () => {
        state.transition = function ({ data }) {
          var { output } = data

          expect(output).to.equal("-123")
        }

        model.propose({ action: "negate" })
      })

      it("negates negative entry to positive", () => {
        var entry

        state.transition = function ({ data }) {
          var { output } = data

          entry = output
        }

        model.propose({ action: "negate" })
        model.propose({ action: "negate" })

        expect(entry).to.equal("123")
      })
    })

    describe("nextOp", () => {
      describe("divide", () => {
        var { model, state } = app

        beforeEach(() => {
          state.transition = function ({ data }) { }

          model.propose({ action: "clear" })
          model.propose({ action: "digit", value: "123" })
        })

        it("sets last action, updates expression", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "divide" })

          var { expression, last } = result

          expect(last).to.equal("divide")
          expect(expression.join(" ")).to.equal("123 &divide;")
        })

        it("calculates when nextOp is set", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "divide" })
          model.propose({ action: "digit", value: "123" })
          model.propose({ action: "nextOp", value: "divide" })

          var { output, expression } = result

          expect(output).to.equal("1")
          expect(expression.join(" ")).to.equal("123 &divide; 123 &divide;")
        })
      })

      describe("minus", () => {
        var { model, state } = app

        beforeEach(() => {
          state.transition = function ({ data }) { }

          model.propose({ action: "clear" })
          model.propose({ action: "digit", value: "123" })
        })

        it("sets last action, updates expression", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "minus" })

          var { expression, last } = result


          expect(last).to.equal("minus")
          expect(expression.join(" ")).to.equal("123 &minus;")
        })

        it("calculates when nextOp is set", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "minus" })
          model.propose({ action: "digit", value: "120" })
          model.propose({ action: "nextOp", value: "minus" })

          var { output, expression } = result

          expect(output).to.equal("3")
          expect(expression.join(" ")).to.equal("123 &minus; 120 &minus;")
        })
      })

      describe("multiply", () => {
        var { model, state } = app

        beforeEach(() => {
          state.transition = function ({ data }) { }

          model.propose({ action: "clear" })
          model.propose({ action: "digit", value: "10" })
        })

        it("sets last action, updates expression", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "multiply" })

          var { expression, last } = result

          expect(last).to.equal("multiply")
          expect(expression.join(" ")).to.equal("10 &times;")
        })

        it("calculates when nextOp is set", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "multiply" })
          model.propose({ action: "digit", value: "10" })
          model.propose({ action: "nextOp", value: "multiply" })

          var { output, expression } = result

          expect(output).to.equal("100")
          expect(expression.join(" ")).to.equal("10 &times; 10 &times;")
        })
      })

      describe("plus", () => {
        var { model, state } = app

        beforeEach(() => {
          state.transition = function ({ data }) { }

          model.propose({ action: "clear" })
          model.propose({ action: "digit", value: "10" })
        })

        it("sets last action, updates expression", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "plus" })

          var { expression, last } = result

          expect(last).to.equal("plus")
          expect(expression.join(" ")).to.equal("10 &plus;")
        })

        it("calculates when nextOp is set", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "10" })
          model.propose({ action: "nextOp", value: "plus" })

          var { output, expression } = result

          expect(output).to.equal("20")
          expect(expression.join(" ")).to.equal("10 &plus; 10 &plus;")
        })
      })

      describe("uses safe math operations", () => {
        var { model, state } = app

        beforeEach(() => {
          state.transition = function ({ data }) { }

          model.propose({ action: "clear" })
        })

        it("0.1 + 0.2 = 0.3", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          // 15 Jan 2021: this sequence found a bug in decimal and digit.
          model.propose({ action: "decimal" })
          model.propose({ action: "digit", value: "1" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "decimal" })
          model.propose({ action: "digit", value: "2" })
          model.propose({ action: "nextOp", value: "equals" })

          var { output, expression } = result

          expect(output).to.equal("0.3")
          expect(expression.join(" ")).to.equal("0.1 &plus; 0.2 &equals;")
        })

        it("0.1 * 0.1 = 0.01", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "decimal" })
          model.propose({ action: "digit", value: "1" })
          model.propose({ action: "nextOp", value: "multiply" })
          model.propose({ action: "decimal" })
          model.propose({ action: "digit", value: "1" })
          model.propose({ action: "nextOp", value: "equals" })

          var { output, expression } = result

          expect(output).to.equal("0.01")
          expect(expression.join(" ")).to.equal("0.1 &times; 0.1 &equals;")
        })

        it("0.1 - 0.3 = -0.2", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "decimal" })
          model.propose({ action: "digit", value: "1" })
          model.propose({ action: "nextOp", value: "minus" })
          model.propose({ action: "decimal" })
          model.propose({ action: "digit", value: "3" })
          model.propose({ action: "nextOp", value: "equals" })

          var { output, expression } = result

          expect(output).to.equal("-0.2")
          expect(expression.join(" ")).to.equal("0.1 &minus; 0.3 &equals;")
        })

        it("0.15 / 0.1 = 1.5", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          // 15 Jan 2021: this sequence found an error in safe-math divide!
          model.propose({ action: "decimal" })
          model.propose({ action: "digit", value: "1" })
          model.propose({ action: "digit", value: "5" })
          model.propose({ action: "nextOp", value: "divide" })
          model.propose({ action: "decimal" })
          model.propose({ action: "digit", value: "1" })
          model.propose({ action: "nextOp", value: "equals" })

          var { output, expression } = result

          expect(output).to.equal("1.5")
          expect(expression.join(" ")).to.equal("0.15 &divide; 0.1 &equals;")
        })

        it("0.14 * 100 = 14", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          // 27 Jan 2021: this found an error in safe-math expand()!
          model.propose({ action: "decimal" })
          model.propose({ action: "digit", value: "14" })
          model.propose({ action: "nextOp", value: "multiply" })
          model.propose({ action: "digit", value: "100" })
          model.propose({ action: "nextOp", value: "equals" })

          var { output, expression } = result

          expect(output).to.equal("14")
          expect(expression.join(" ")).to.equal("0.14 &times; 100 &equals;")
        })
      })
    })

    describe("percent", () => {
      // See How the percent key works in Windows Calculator at
      // https://devblogs.microsoft.com/oldnewthing/20080110-00/?p=23853
      describe("output", () => {
        var { model, state } = app

        beforeEach(() => {
          state.transition = function ({ data }) { }

          model.propose({ action: "clear" })
        })

        it("resets to 0 if no operator has been entered", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "percent" })

          var { output } = result

          expect(output).to.equal("0")
        })

        it("resets to 0 if next operator not entered", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "4" })
          model.propose({ action: "percent" })

          var { output } = result

          expect(output).to.equal("0")
        })

        it("uses current digital output if last step is an operator", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "percent" })

          var { output, expression } = result

          expect(output).to.equal("0.81")
        })

        it("uses next digital input if present", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "5" })
          model.propose({ action: "percent" })

          var { output, expression } = result

          expect(output).to.equal("0.45")
        })

        it("processes only last two operands", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "1" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "2" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "3" })
          model.propose({ action: "nextOp", value: "plus" })

          // checkpoint
          expect(result.output).to.equal("6")

          model.propose({ action: "digit", value: "5" })

          // previous output 6, current output 5
          expect(result.operands).to.deep.equal(["6", "5"])

          model.propose({ action: "percent" })
          expect(result.output).to.equal("0.3")
        })
      })

      describe("expression", () => {
        var { model, state } = app

        beforeEach(() => {
          state.transition = function ({ data }) { }

          model.propose({ action: "clear" })
        })

        it("returns 0 on default entry", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "percent" })

          var { expression } = result

          expect(expression.join(" ")).to.equal("0")
        })

        it("returns 0 if next operator not entered", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "percent" })

          var { expression } = result

          expect(expression.join(" ")).to.equal("0")
        })

        it("returns current, operator, and current * (current / 100) if operator entered", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "percent" })

          var { expression } = result

          expect(expression.join(" ")).to.equal("9 &plus; 0.81")
        })

        it("returns current, operator, and current * (next / 100) if next digit entered", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "5" })
          model.propose({ action: "percent" })

          var { expression } = result

          expect(expression.join(" ")).to.equal("9 &plus; 0.45")
        })

        it("after an equals op, percent op should clear the expression", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "5" })
          model.propose({ action: "equals" })

          model.propose({ action: "percent" })

          var { expression } = result

          // 27 January 2021: 14 * .14 - which turned up a bug in safe-math
          // expand(): should use parseInt(x * d), etc.
          expect(expression.join(" ")).to.equal("1.96")
        })
      })
    })

    describe("reciprocal", () => {
      describe("output", () => {
        var { model, state } = app

        beforeEach(() => {
          state.transition = function ({ data }) { }

          model.propose({ action: "clear" })
          model.propose({ action: "digit", value: "4" })
        })

        it("returns the reciprocal of current entry", () => {
          var result

          state.transition = function ({ data }) {
            var { output } = data

            result = output
          }

          model.propose({ action: "reciprocal" })

          expect(result).to.equal("0.25")
        })

        it("returns error if current entry is zero", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "clear" })
          model.propose({ action: "reciprocal" })

          var { error } = result

          expect(error).to.equal("Cannot divide by zero")
        })
      })

      describe("expression", () => {
        var { model, state } = app

        beforeEach(() => {
          state.transition = function ({ data }) { }

          model.propose({ action: "clear" })
          model.propose({ action: "digit", value: "4" })
        })

        it("returns current output", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "reciprocal" })

          var { expression } = result

          expect(expression.join(" ")).to.equal("1/(4)")
        })

        it("returns current, operator, and current * (current / 100) if operator entered", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "reciprocal" })

          var { expression } = result

          expect(expression.join(" ")).to.equal("4 &plus; 1/(4)")
        })

        it("returns current, operator, and 1/current if operator entered", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "reciprocal" })

          var { expression } = result

          expect(expression.join(" ")).to.equal("4 &plus; 1/(4)")
        })

        it("returns current, operator, and 1/next if next value entered", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "8" })
          model.propose({ action: "reciprocal" })

          var { expression } = result

          expect(expression.join(" ")).to.equal("4 &plus; 1/(8)")
        })

        it("after an equals op, reciprocal op should clear the expression", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "5" })
          model.propose({ action: "equals" })

          model.propose({ action: "reciprocal" })

          var { expression } = result

          // R of 4+ 5 =; 9 in outupt
          expect(expression.join(" ")).to.equal("1/(9)")
        })
      })
    })

    describe("square", () => {
      describe("output", () => {
        var { model, state } = app

        beforeEach(() => {
          state.transition = function ({ data }) { }

          model.propose({ action: "clear" })
        })

        it("returns the square of current entry", () => {
          var result

          state.transition = function ({ data }) {
            var { output } = data

            result = output
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "square" })

          expect(result).to.equal("81")
        })

        it("0.2 * 0.2 returns 0.04", () => {
          var result

          state.transition = function ({ data }) {
            var { output } = data

            result = output
          }

          model.propose({ action: "digit", value: "5" })
          model.propose({ action: "reciprocal" })
          // converts to 0.2
          model.propose({ action: "square" })

          // 0.2 * 0.2 => 0.04 (not 0.04000000000000001)
          expect(result).to.equal("0.04")
        })

        it("9 + sqr(5) + should print 34", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "5" })
          model.propose({ action: "square" })
          model.propose({ action: "nextOp", value: "plus" })

          var { output } = result

          // sqr of 9 + 25 =; 25 in output
          expect(output).to.equal("34")
        })
      })

      describe("expression", () => {
        var { model, state } = app

        beforeEach(() => {
          state.transition = function ({ data }) { }

          model.propose({ action: "clear" })
          model.propose({ action: "digit", value: "9" })
        })

        it("returns current output", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "square" })

          var { expression } = result

          expect(expression.join(" ")).to.equal("sqr(9)")
        })

        it("returns current output, operator, sqr(current)", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "square" })

          var { expression } = result

          expect(expression.join(" ")).to.equal("9 &plus; sqr(9)")
        })

        it("returns current output, operator, sqr(next) if next value entered", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "8" })
          model.propose({ action: "square" })

          var { expression } = result

          expect(expression.join(" ")).to.equal("9 &plus; sqr(8)")
        })

        it("returns 9 + sqr(sqr(8)) on consecutive square operations", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "8" })
          model.propose({ action: "square" })
          model.propose({ action: "square" })

          var { expression } = result

          expect(expression.join(" ")).to.equal("9 &plus; sqr(sqr(8))")
        })

        it("should append &plus; after 9 + sqr(5)", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "5" })
          model.propose({ action: "square" })
          model.propose({ action: "nextOp", value: "plus" })

          var { expression } = result

          // sqr of 9 + 25 =; 25 in output
          expect(expression.join(" ")).to.equal("9 &plus; sqr(5) &plus;")
        })

        it("after an equals op, square op should clear the expression", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "5" })
          model.propose({ action: "equals" })
          model.propose({ action: "square" })

          var { expression } = result

          // sqr of 9 + 5 =; 14 in outupt
          expect(expression.join(" ")).to.equal("sqr(14)")
        })
      })
    })

    describe("squareroot", () => {
      describe("output", () => {
        var { model, state } = app

        beforeEach(() => {
          state.transition = function ({ data }) { }

          model.propose({ action: "clear" })
        })

        it("returns square root of current entry", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "squareroot" })

          var { output } = result

          expect(output).to.equal("3")
        })

        it("returns error if current entry is less than zero", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "negate" })
          model.propose({ action: "squareroot" })

          var { error } = result

          expect(error).to.equal(`Invalid input for square root, "-9"`)
        })

        it("5 + sqrt(9) + should print 8", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "5" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "squareroot" })
          model.propose({ action: "nextOp", value: "plus" })

          var { output } = result

          // 5 + sqrt(9) =; 8 in output
          expect(output).to.equal("8")
        })
      })

      describe("expression", () => {
        var { model, state } = app

        var symbol = "&radic;"

        beforeEach(() => {
          state.transition = function ({ data }) { }

          model.propose({ action: "clear" })
        })

        it(`return current output`, () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "squareroot" })

          var { expression } = result

          expect(expression.join(" ")).to.equal(`${symbol}(9)`)
        })

        it(`return current output, operator, Q(current)`, () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "squareroot" })

          var { expression } = result

          expect(expression.join(" ")).to.equal(`9 &plus; ${symbol}(9)`)
        })

        it("returns current output, operator, Q(next) if next value entered", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "8" })
          model.propose({ action: "squareroot" })

          var { expression } = result

          expect(expression.join(" ")).to.equal(`9 &plus; ${symbol}(8)`)
        })

        it("returns 9 + Q(Q(current)) on consecutive operations", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "8" })
          model.propose({ action: "squareroot" })
          model.propose({ action: "squareroot" })

          var { expression } = result

          expect(expression.join(" ")).to.equal(`9 &plus; ${symbol}(${symbol}(8))`)
        })

        it("updates expression even when operation results in error", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "negate" })
          model.propose({ action: "squareroot" })

          var { expression } = result

          expect(expression.join(" ")).to.equal(`${symbol}(-9)`)
        })

        it("should append &plus; after 5 + sqrt(9)", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "5" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "squareroot" })
          model.propose({ action: "nextOp", value: "plus" })

          var { expression } = result

          // sqr of 5 + 3 =; 8 in output
          expect(expression.join(" ")).to.equal("5 &plus; &radic;(9) &plus;")
        })

        it("after an equals op, squareroot op should clear the expression", () => {
          var result

          state.transition = function ({ data }) {
            result = data
          }

          model.propose({ action: "digit", value: "9" })
          model.propose({ action: "nextOp", value: "plus" })
          model.propose({ action: "digit", value: "5" })
          model.propose({ action: "equals" })
          model.propose({ action: "squareroot" })

          var { expression } = result

          // sqrt of 9 + 5 =; 14 in outupt
          expect(expression.join(" ")).to.equal("&radic;(14)")
        })
      })
    })
  })
})
