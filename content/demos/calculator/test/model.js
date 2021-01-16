import { model } from "../sam/model.js"
import { define } from "/js/lib/sam/define.js"

describe("model", () => {
  var { expect } = chai

  describe("define({ model })", () => {
    var app = define({ model })

    it("returns app with model and state", () => {
      var { model, state } = app;

      expect(state).to.be.an("object")
      expect(model).to.be.an("object")
    })
  })

  describe("steps", () => {
    var app = define({ model })

    it("unified error api")

    it("sends error to state on invalid action step", () => {
      var { model, state } = app;

      state.transition = function ({ error }) {
        expect(error).to.equal(`invalid action step, "bonk"`)
      }

      model.propose({ action: "bonk" })
    })

    describe("clear", () => {
      it("clears the model", () => {
        var { model, state } = app;

        state.transition = function ({ data }) {
          var { output } = data

          expect(output).to.equal("0")
        }

        model.propose({ action: "clear" })
      })
    })

    describe("digit", () => {
      var { model, state } = app;

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
        state.transition = function ({ error }) {
          expect(error).to.equal(`invalid digit value, "6y6"`)
        }

        model.propose({ action: "digit", value: "6y6" })
      })
    })

    describe("clearentry", () => {
      var { model, state } = app;

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
      var { model, state } = app;

      beforeEach(() => {
        state.transition = function ({ data }) { }

        model.propose({ action: "clear" })
        model.propose({ action: "digit", value: "123" })
      })

      it("removes last character", () => {
        state.transition = function ({ data }) {
          var { output } = data

          expect(output).to.equal("12")
        }

        model.propose({ action: "backspace" })
      })
    })

    describe("decimal", () => {
      var { model, state } = app;

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
      var { model, state } = app;

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
        expect(expression.join(" ")).to.equal("0 =")
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
        expect(expression.join(" ")).to.equal("123 + 123 =")
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
        expect(expression.join(" ")).to.equal("246 + 123 =")
      })
    })

    describe("negate", () => {
      var { model, state } = app;

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
        var entry;

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
        var { model, state } = app;

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
          expect(expression.join(" ")).to.equal("123 /")
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
          expect(expression.join(" ")).to.equal("123 / 123 /")
        })
      })

      describe("minus", () => {
        var { model, state } = app;

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
          expect(expression.join(" ")).to.equal("123 -")
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
          expect(expression.join(" ")).to.equal("123 - 120 -")
        })
      })

      describe("multiply", () => {
        var { model, state } = app;

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
          expect(expression.join(" ")).to.equal("10 *")
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
          expect(expression.join(" ")).to.equal("10 * 10 *")
        })
      })

      describe("plus", () => {
        var { model, state } = app;

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
          expect(expression.join(" ")).to.equal("10 +")
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
          expect(expression.join(" ")).to.equal("10 + 10 +")
        })
      })

      describe("uses safe math operations", () => {
        var { model, state } = app;

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
          expect(expression.join(" ")).to.equal("0.1 + 0.2 =")
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
          expect(expression.join(" ")).to.equal("0.1 * 0.1 =")
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
          expect(expression.join(" ")).to.equal("0.1 - 0.3 =")
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
          expect(expression.join(" ")).to.equal("0.15 / 0.1 =")
        })
      })
    })

    describe("percent", () => {

      it("updates last expression")

      // https://devblogs.microsoft.com/oldnewthing/20080110-00/?p=23853
      var { model, state } = app;

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

        var { output, expression } = result

        expect(output).to.equal("0")
        // expect(result.expression).to.equal("")
      })

      it("resets to 0 if next operator not entered", () => {
        var result

        state.transition = function ({ data }) {
          result = data
        }

        model.propose({ action: "digit", value: "4" })
        model.propose({ action: "percent" })

        var { output, expression } = result

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

        expect(result.output).to.equal("6")

        model.propose({ action: "digit", value: "5" })
        model.propose({ action: "percent" })

        var { output, expression, operands } = result
        var [left, right] = operands

        expect(output).to.equal("0.3")
        expect(left).to.equal("6")
        expect(right).to.equal("5")
      })
    })

    describe("reciprocal", () => {

      it("updates last expression")

      var { model, state } = app;

      beforeEach(() => {
        state.transition = function ({ data }) { }

        model.propose({ action: "clear" })
      })

      it("returns the reciprocal of current entry", () => {
        var result

        state.transition = function ({ data }) {
          var { output } = data

          result = output
        }

        model.propose({ action: "digit", value: "4" })
        model.propose({ action: "reciprocal" })

        expect(result).to.equal("0.25")
      })

      it("returns error if current entry is less than zero", () => {
        var result

        state.transition = function ({ data = {}, error = "" }) {
          result = error
        }

        model.propose({ action: "digit", value: "4" })
        model.propose({ action: "negate" })
        model.propose({ action: "reciprocal" })

        expect(result).to.equal("Cannot divide by zero")
      })
    })

    describe("square", () => {

      it("updates last expression")

      var { model, state } = app;

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
    })

    describe("squareroot", () => {

      it("updates last expression")

      var { model, state } = app;

      beforeEach(() => {
        state.transition = function ({ data }) { }

        model.propose({ action: "clear" })
        model.propose({ action: "digit", value: "9" })
      })

      it("returns square root of current entry", () => {
        state.transition = function ({ data }) {
          var { output } = data

          expect(output).to.equal("3")
        }

        model.propose({ action: "squareroot" })
      })

      it("returns error if current entry is less than zero", () => {
        var entry, message

        state.transition = function ({ data = {}, error = {} }) {
          entry = data.output
          message = error
        }

        model.propose({ action: "clear" })
        model.propose({ action: "digit", value: "9" })
        model.propose({ action: "negate" })

        model.propose({ action: "squareroot" })

        expect(message).to.equal(`invalid input for square root, "-9"`)
      })
    })
  })
})
