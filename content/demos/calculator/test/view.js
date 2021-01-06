import { view } from "../sam/view.js"
import { define } from "/js/lib/sam/define.js"

describe("view", () => {
  var { expect } = chai

  describe("define({ view })", () => {
    var app = define({ view })

    it("returns app with view and action", () => {
      var { view, action } = app;

      expect(view).to.be.an("object")
      expect(action).to.be.an("object")
    })
  })

  describe("init", () => {
    var app = define({ view })

    it("runs handler on document ready", (done) => {
      var { view } = app;
      var calls = 0

      var handler = function () {
        calls += 1
      }

      view.init(handler)

      setTimeout(() => {
        expect(calls).to.equal(1)
        done()
      })
    })
  })

  describe("render", () => {
    var app = define({ view })

    var { selectors } = app.view

    var calculator = document.querySelector(selectors.calculator)
    var equation = calculator.querySelector(selectors.equation)
    var output = calculator.querySelector(selectors.output)
    var alert = calculator.querySelector(selectors.alert)

    var representation = {
      display: {},
      equation: [],
      alert: ""
    }

    it("output", () => {
      var { view } = app;
      var data = Object.assign({}, representation, {
        display: {
          value: "1234.567890",
          formatted: "1,234.567890"
        }
      })

      view.render({ data })

      expect(output.textContent).to.equal("1,234.567890")
    })

    it("equation", () => {
      var { view } = app;

      var data = Object.assign({}, representation, {
        display: {
          value: "9",
          formatted: "9"
        },
        equation: ["6", "+", "3", "+"]
      })

      view.render({ data })

      expect(output.textContent).to.equal("9")
      expect(equation.textContent).to.equal("6 + 3 +")
    })

    describe("alert", () => {
      var { view } = app;

      it("contains equation when equation contains 2 or less inputs", () => {

        var data = Object.assign({}, representation, {
          display: {
            value: "6",
            formatted: "6"
          },
          equation: ["6", "+"]
        })

        view.render({ data })

        expect(alert.textContent).to.equal("Display is 6 +")
        expect(equation.textContent).to.equal("6 +")
      })

      it("contains display value when equation has 3 or more inputs", () => {

        var data = Object.assign({}, representation, {
          display: {
            value: "9",
            formatted: "9"
          },
          equation: ["6", "+", "3", "+"]
        })

        view.render({ data })

        expect(alert.textContent).to.equal("Display is 9")
        expect(equation.textContent).to.equal("6 + 3 +")
      })
    })
  })

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

      describe("arrow traversal", () => {
        var calculator = document.querySelector("#fixture [calculator]")
        var keys = Array.from(calculator.querySelectorAll("[value]"))
          .reduce((map, key) => {
            map[key.value] = key

            return map
          }, {})

        it("count keys", () => {
          expect(Object.keys(keys).length).to.equal(24)
        })

        describe("ArrowUp", () => {
          var app = define({ view })

          it("no effect in top row", () => {
            var { view } = app;

            ["percent", "clearentry", "clear", "backspace"].forEach(key => {
              var target = keys[key]

              target.focus()

              view.on.keydown({ key: "ArrowUp", target })

              expect(document.activeElement).to.equal(target)
            })
          })

          it("moves focus up one row", () => {
            var { view } = app;

            var target = keys["negate"]

            target.focus()

            view.on.keydown({ key: "ArrowUp", target })

            expect(document.activeElement).to.equal(keys["1"])
          })
        })

        describe("ArrowRight", () => {
          it("no effect in right column", () => {
            var { view } = app;

            ["backspace", "divide", "multiply", "plus", "minus", "equals"].forEach(key => {
              var target = keys[key]

              target.focus()

              view.on.keydown({ key: "ArrowRight", target })

              expect(document.activeElement).to.equal(target)
            })
          })

          it("moves focus right one column", () => {
            var { view } = app;

            var target = keys["percent"]

            target.focus()

            view.on.keydown({ key: "ArrowRight", target })

            expect(document.activeElement).to.equal(keys["clearentry"])
          })
        })

        describe("ArrowDown", () => {
          var app = define({ view })

          it("no effect in bottom row", () => {
            var { view } = app;

            ["negate", "0", "decimal", "equals"].forEach(key => {
              var target = keys[key]

              target.focus()

              view.on.keydown({ key: "ArrowDown", target })

              expect(document.activeElement).to.equal(target)
            })
          })

          it("moves focus down one row", () => {
            var { view } = app;

            var target = keys["squareroot"]

            target.focus()

            view.on.keydown({ key: "ArrowDown", target })

            expect(document.activeElement).to.equal(keys["9"])
          })
        })

        describe("ArrowLeft", () => {
          var app = define({ view })

          it("no effect in left column", () => {
            var { view } = app;

            ["percent", "reciprocal", "7", "4", "1", "negate"].forEach(key => {
              var target = keys[key]

              target.focus()

              view.on.keydown({ key: "ArrowLeft", target })

              expect(document.activeElement).to.equal(target)
            })
          })

          it("moves focus left one column", () => {
            var { view } = app;

            var target = keys["3"]

            target.focus()

            view.on.keydown({ key: "ArrowLeft", target })

            expect(document.activeElement).to.equal(keys["2"])
          })
        })
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

      it("handles Digits", () => {
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

      it("handles Operators", () => {
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
