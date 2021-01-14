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
          var { output, input } = data

          expect(output).to.be.an("string")
          expect(output).to.equal("0")
          expect(input).to.be.an("array")
          expect(input.length).to.equal(0)
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

      it("pushes digit to the input and output", () => {
        state.transition = function ({ data }) {
          var { output, input } = data

          expect(input.length).to.equal(1)
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
          var { output, input } = data

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
          var { output, input } = data

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
          var { output, input } = data

          expect(output).to.equal("0.")
        }

        model.propose({ action: "decimal" })
      })

      it("ignores entry if decimal already present", () => {
        state.transition = function ({ data }) {
          var { output, input } = data

          expect(output).to.equal("0.")
        }

        model.propose({ action: "decimal" })
        model.propose({ action: "decimal" })
        model.propose({ action: "decimal" })
      })
    })

    describe("equals", () => {
      it("pending")
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
          var { output, input } = data

          expect(output).to.equal("-123")
        }

        model.propose({ action: "negate" })
      })

      it("negates negative entry to positive", () => {
        var entry;

        state.transition = function ({ data }) {
          var { output, input } = data

          entry = output
        }

        model.propose({ action: "negate" })
        model.propose({ action: "negate" })

        expect(entry).to.equal("123")
      })
    })


    describe("nextOp", () => {

      describe("divide", () => {
        it("pending")
      })
      describe("minus", () => {
        it("pending")
      })
      describe("multiply", () => {
        it("pending")
      })
      describe("plus", () => {
        it("pending")
      })
    })

    describe("percent", () => {
      // https://devblogs.microsoft.com/oldnewthing/20080110-00/?p=23853
      var { model, state } = app;

      beforeEach(() => {
        state.transition = function ({ data }) { }

        model.propose({ action: "clear" })
      })

      it("needs to be refactored after nextOp is done")

      it("resets to 0 if no operator has been entered", () => {
        var result

        state.transition = function ({ data }) {
          result = data
        }

        model.propose({ action: "percent" })

        var { output, input, expression } = result

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

        var { output, input, expression } = result

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

        var { output, input, expression } = result

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

        var { output, input, expression } = result

        expect(output).to.equal("0.45")
      })

      it("processes end of input", () => {
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
        model.propose({ action: "digit", value: "5" })

        model.propose({ action: "percent" })

        var { output, input, expression } = result

        expect(output).to.equal("0.3")
      })
    })

    describe("reciprocal", () => {
      var { model, state } = app;

      beforeEach(() => {
        state.transition = function ({ data }) { }

        model.propose({ action: "clear" })
      })

      it("returns the reciprocal of current entry", () => {
        var result

        state.transition = function ({ data }) {
          var { output, input } = data

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
      var { model, state } = app;

      beforeEach(() => {
        state.transition = function ({ data }) { }

        model.propose({ action: "clear" })
      })

      it("returns the square of current entry", () => {
        var result

        state.transition = function ({ data }) {
          var { output, input } = data

          result = output
        }

        model.propose({ action: "digit", value: "9" })
        model.propose({ action: "square" })

        expect(result).to.equal("81")
      })
    })

    describe("squareroot", () => {
      var { model, state } = app;

      beforeEach(() => {
        state.transition = function ({ data }) { }

        model.propose({ action: "clear" })
        model.propose({ action: "digit", value: "9" })
      })

      it("returns square root of current entry", () => {
        state.transition = function ({ data }) {
          var { output, input } = data

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
