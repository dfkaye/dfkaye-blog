import { view } from "../sam/view.js"
import { define } from "/js/lib/sam/define.js"

describe("view", () => {
  var { expect } = chai

  // var app = define({
  //   view, action: {
  //     next() {

  //     }
  //   }
  // })

  // describe("init", () => {
  //   app.view.init(() => {
  //     var { view, action } = app;

  //     var calculator = document.querySelector("#fixture [calculator]");

  //     calculator.addEventListener("keydown", view.on.keydown);
  //     calculator.addEventListener("click", view.on.click);

  //     action.next({ action: "reset" })
  //   })
  // })

  // describe("render", () => {

  // })

  describe("on", () => {
    describe("keydown", () => {

      var app = define({ view })

      it("handles Backspace keys", () => {
        var { view, action } = app

        var key = "Backspace"

        action.next = function ({ action, value }) {
          expect(action).to.equal("backspace")
          expect(value).to.equal(key)
        }

        view.on.keydown({ key })
      })

      it("handles Decimal keys", () => {
        var { view, action } = app

        var key = "."

        action.next = function ({ action, value }) {
          expect(action).to.equal("decimal")
          expect(value).to.equal(key)
        }

        view.on.keydown({ key })
      })

      it("handles Delete (Clear Entry) keys", () => {
        var { view, action } = app

        var key = "Delete"

        action.next = function ({ action, value }) {
          expect(action).to.equal("clearentry")
          expect(value).to.equal(key)
        }

        view.on.keydown({ key })
      })

      it("handles Digit keys", () => {
        var { view, action } = app
        var digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        var calls = 0

        digits.forEach((ignore, index) => {
          var key = index.toString()

          action.next = function ({ action, value }) {
            calls += 1

            expect(action).to.equal("digit")
            expect(value).to.equal(key)
          }

          view.on.keydown({ key })
        })

        expect(calls).to.equal(digits.length)
      })

      it("handles Escape (Clear) keys", () => {
        var { view, action } = app

        var key = "Escape"

        action.next = function ({ action, value }) {
          expect(action).to.equal("clear")
          expect(value).to.equal(key)
        }

        view.on.keydown({ key })
      })

      it("handles F9 (positive-negative) keys", () => {
        var { view, action } = app

        var key = "F9"

        action.next = function ({ action, value }) {
          expect(action).to.equal("negate")
          expect(value).to.equal(key)
        }

        view.on.keydown({ key })
      })

      it("handles % (percent) keys", () => {
        var { view, action } = app

        var key = "%"

        action.next = function ({ action, value }) {
          expect(action).to.equal("percent")
          expect(value).to.equal(key)
        }

        view.on.keydown({ key })
      })

      it("handles 'r' (reciprocal) keys", () => {
        var { view, action } = app

        var key = "r"

        action.next = function ({ action, value }) {
          expect(action).to.equal("reciprocal")
          expect(value).to.equal(key)
        }

        view.on.keydown({ key })
      })

      it("handles 'q' (square) keys", () => {
        var { view, action } = app

        var key = "q"

        action.next = function ({ action, value }) {
          expect(action).to.equal("square")
          expect(value).to.equal(key)
        }

        view.on.keydown({ key })
      })

      it("handles '@' (square root) keys", () => {
        var { view, action } = app

        var key = "@"

        action.next = function ({ action, value }) {
          expect(action).to.equal("squareroot")
          expect(value).to.equal(key)
        }

        view.on.keydown({ key })
      })

      it("handles Operator keys", () => {
        var { view, action } = app

        var operators = [
          { key: "+", name: "plus" },
          { key: "-", name: "minus" },
          { key: "*", name: "multiply" },
          { key: "/", name: "divide" },
          { key: "=", name: "equals" }
        ]

        var calls = 0

        operators.forEach((event, index) => {
          var { key } = event

          action.next = function ({ action, value }) {
            calls += 1

            expect(action).to.equal("nextOp")
            expect(value).to.equal(operators[index].name)
          }

          view.on.keydown({ key })
        })

        expect(calls).to.equal(operators.length)
      })

      describe("TODO: traversal with Arrow keys", () => {
        it("left")
        it("up")
        it("right")
        it("down")
      })
    })

    describe("click", () => {
      var app = define({ view })

      it("handles Backspace", () => {
        var { view, action } = app

        var value = "backspace"

        action.next = function ({ action, value }) {
          expect(action).to.equal("backspace")
          expect(value).to.equal(value)
        }

        view.on.click({ target: { value } })
      })

      it("handles CE (clear entry)", () => {
        var { view, action } = app

        var value = "clearentry"

        action.next = function ({ action, value }) {
          expect(action).to.equal("clearentry")
          expect(value).to.equal(value)
        }

        view.on.click({ target: { value } })
      })

      it("handles C (clear all)", () => {
        var { view, action } = app

        var value = "clear"

        action.next = function ({ action, value }) {
          expect(action).to.equal("clear")
          expect(value).to.equal(value)
        }

        view.on.click({ target: { value } })
      })

      it("handles Negate (positive-negative)", () => {
        var { view, action } = app

        var value = "negate"

        action.next = function ({ action, value }) {
          expect(action).to.equal("negate")
          expect(value).to.equal(value)
        }

        view.on.click({ target: { value } })
      })

      it("handles Percent", () => {
        var { view, action } = app

        var value = "percent"

        action.next = function ({ action, value }) {
          expect(action).to.equal("percent")
          expect(value).to.equal(value)
        }

        view.on.click({ target: { value } })
      })

      it("handles Reciprocal", () => {
        var { view, action } = app

        var value = "reciprocal"

        action.next = function ({ action, value }) {
          expect(action).to.equal("reciprocal")
          expect(value).to.equal(value)
        }

        view.on.click({ target: { value } })
      })

      it("handles Square", () => {
        var { view, action } = app

        var value = "square"

        action.next = function ({ action, value }) {
          expect(action).to.equal("square")
          expect(value).to.equal(value)
        }

        view.on.click({ target: { value } })
      })

      it("handles Squareroot", () => {
        var { view, action } = app

        var value = "squareroot"

        action.next = function ({ action, value }) {
          expect(action).to.equal("squareroot")
          expect(value).to.equal(value)
        }

        view.on.click({ target: { value } })
      })

      it("handles Decimal separator", () => {
        var { view, action } = app

        var value = "decimal"

        action.next = function ({ action, value }) {
          expect(action).to.equal("decimal")
          expect(value).to.equal(value)
        }

        view.on.click({ target: { value } })
      })

      it("handles Digit keys", () => {
        var { view, action } = app
        var digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        var calls = 0

        digits.forEach((ignore, index) => {
          var value = index.toString()

          action.next = function ({ action, value }) {
            calls += 1

            expect(action).to.equal("digit")
            expect(value).to.equal(value)
          }

          view.on.click({ target: { value } })
        })

        expect(calls).to.equal(digits.length)
      })

      it("handles Operator keys", () => {
        var { view, action } = app

        var operators = [
          { value: "plus" },
          { value: "minus" },
          { value: "multiply" },
          { value: "divide" },
          { value: "equals" }
        ]

        var calls = 0

        operators.forEach((target, index) => {
          var { value } = target

          action.next = function ({ action, value }) {
            calls += 1

            expect(action).to.equal("nextOp")
            expect(value).to.equal(value)
          }

          view.on.click({ target: { value } })
        })

        expect(calls).to.equal(operators.length)
      })
    })
  })
})
