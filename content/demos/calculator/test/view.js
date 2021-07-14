import { view } from "../sam/view.js"
import { define } from "/js/lib/dependency/define.js"

describe("view", (done) => {
  var { expect } = chai

  describe("define({ view })", () => {
    var app = define({ view })

    it("returns app with view and action", () => {
      var { view, action } = app

      expect(view).to.be.an("object")
      expect(action).to.be.an("object")
    })
  })

  describe("init", () => {
    var app = define({ view })

    it("runs handler when document.readystate is complete", (done) => {
      var { view } = app

      var handler = () => {
        expect(document.readyState).to.equal("complete")
        done()
      };

      view.init(handler)
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

      it("handles Equals keys", () => {
        var { view, action } = app

        var key = "Equals"

        action.next = function ({ action, value }) {
          expect(action).to.equal("equals")
          expect(value).to.equal(key)
        }

        view.on.keydown({ key })
      })

      it(`handles "=" symbol`, () => {
        var { view, action } = app

        var key = "="

        action.next = function ({ action, value }) {
          expect(action).to.equal("equals")
          expect(value).to.equal(key)
        }

        view.on.keydown({ key })
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
          { key: "/", name: "divide" }
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
            var { view } = app

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
            var { view } = app

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
            var { view } = app

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
            var { view } = app

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

        var key = "backspace"

        action.next = function ({ action, value }) {
          expect(action).to.equal("backspace")
          expect(value).to.equal(key)
        }

        var target = document.createElement("button")
        target.value = key
        view.on.click({ target })
      })

      it("handles CE (clear entry)", () => {
        var { view, action } = app

        var key = "clearentry"

        action.next = function ({ action, value }) {
          expect(action).to.equal("clearentry")
          expect(value).to.equal(key)
        }

        var target = document.createElement("button")
        target.value = key
        view.on.click({ target })
      })

      it("handles C (clear all)", () => {
        var { view, action } = app

        var key = "clear"

        action.next = function ({ action, value }) {
          expect(action).to.equal("clear")
          expect(value).to.equal(key)
        }

        var target = document.createElement("button")
        target.value = key
        view.on.click({ target })
      })

      it("handles '=' (Equals)", () => {
        var { view, action } = app

        var key = "equals"

        action.next = function ({ action, value }) {
          expect(action).to.equal("equals")
          expect(value).to.equal(key)
        }

        var target = document.createElement("button")
        target.value = key
        view.on.click({ target })
      })

      it("handles Negate (positive-negative)", () => {
        var { view, action } = app

        var key = "negate"

        action.next = function ({ action, value }) {
          expect(action).to.equal("negate")
          expect(value).to.equal(key)
        }

        var target = document.createElement("button")
        target.value = key
        view.on.click({ target })
      })

      it("handles Percent", () => {
        var { view, action } = app

        var key = "percent"

        action.next = function ({ action, value }) {
          expect(action).to.equal("percent")
          expect(value).to.equal(key)
        }

        var target = document.createElement("button")

        target.value = key

        view.on.click({ target })
      })

      it("handles Reciprocal", () => {
        var { view, action } = app

        var key = "reciprocal"

        action.next = function ({ action, value }) {
          expect(action).to.equal("reciprocal")
          expect(value).to.equal(key)
        }

        var target = document.createElement("button")

        target.value = key

        view.on.click({ target })
      })

      it("handles Square", () => {
        var { view, action } = app

        var key = "square"

        action.next = function ({ action, value }) {
          expect(action).to.equal("square")
          expect(value).to.equal(key)
        }

        var target = document.createElement("button")

        target.value = key

        view.on.click({ target })
      })

      it("handles Squareroot", () => {
        var { view, action } = app

        var key = "squareroot"

        action.next = function ({ action, value }) {
          expect(action).to.equal("squareroot")
          expect(value).to.equal(key)
        }

        var target = document.createElement("button")

        target.value = key

        view.on.click({ target })
      })

      it("handles Decimal separator", () => {
        var { view, action } = app

        var key = "decimal"

        action.next = function ({ action, value }) {
          expect(action).to.equal("decimal")
          expect(value).to.equal(key)
        }

        var target = document.createElement("button")

        target.value = key

        view.on.click({ target })
      })

      it("handles Digits", () => {
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

          var target = document.createElement("button")

          target.value = key

          view.on.click({ target })
        })

        expect(calls).to.equal(digits.length)
      })

      it("handles Operators", () => {
        var { view, action } = app

        var operators = [
          { value: "plus" },
          { value: "minus" },
          { value: "multiply" },
          { value: "divide" }
        ]

        var calls = 0

        operators.forEach((target, index) => {
          var key = target.value

          action.next = function ({ action, value }) {
            calls += 1

            expect(action).to.equal("nextOp")
            expect(value).to.equal(key)
          }

          var target = document.createElement("button")

          target.value = key

          view.on.click({ target })
        })

        expect(calls).to.equal(operators.length)
      })
    })
  })

  describe("render", () => {
    var app = define({ view })

    var { selectors } = app.view

    var calculator = document.querySelector(selectors.calculator)
    var expression = calculator.querySelector(selectors.expression)
    var output = calculator.querySelector(selectors.output)
    var alert = calculator.querySelector(selectors.alert)

    var representation = {
      output: "",
      expression: [""],
      error: ""
    }

    describe("output", () => {
      var { view } = app

      it("should be formatted", () => {
        var data = Object.assign({}, representation, {
          output: "1234.567890"
        })

        view.render({ data })

        expect(output.textContent).to.equal("1,234.567890")
      })
    })

    describe("expression", () => {
      var { view } = app

      it("should render as string", () => {
        var data = Object.assign({}, representation, {
          expression: ["6", "+", "3", "+"]
        })

        view.render({ data })

        expect(expression.textContent).to.equal("6 + 3 +")
      })
    })

    describe("alert", () => {
      var { view } = app

      it("should contain expression when expression has exactly 2 entries", () => {
        var data = Object.assign({}, representation, {
          output: "6",
          expression: ["6", "+"]
        })

        view.render({ data })

        expect(alert.textContent).to.equal(`Display is "6 +"`)
      })

      it("should contain output when expression has less than 2 inputs", () => {
        var data = Object.assign({}, representation, {
          output: "9",
          expression: [""]
        })

        view.render({ data })

        expect(alert.textContent).to.equal(`Display is "9"`)
      })

      it("should contain output when expression has more than 2 inputs", () => {
        var data = Object.assign({}, representation, {
          output: "9",
          expression: ["should", "ignore", "this"]
        })

        view.render({ data })

        expect(alert.textContent).to.equal(`Display is "9"`)
      })
    })

    describe("error state", () => {
      var { view } = app

      it("should set error attribute on calculator element", () => {
        var data = Object.assign({}, representation, {
          error: "Cannot divide by zero",
          expression: ["1/(0)"]
        })

        view.render({ data })

        expect(calculator.getAttribute("error")).to.be
      })

      it("should remove error attribute when error text removed", () => {
        var data = Object.assign({}, representation, {
          error: "",
          expression: ["1/(0)"],
          output: "All is good"
        })

        view.render({ data })

        expect(calculator.getAttribute("error")).not.to.be
      })

      it("should render error text in place of output", () => {
        var data = Object.assign({}, representation, {
          error: "Cannot divide by zero",
          expression: ["1/(0)"]
        })

        view.render({ data })

        expect(output.textContent).to.equal("Cannot divide by zero")
      })

      it("should render error text in place of alert text", () => {
        var data = Object.assign({}, representation, {
          error: "Cannot divide by zero",
          expression: ["1/(0)"]
        })

        view.render({ data })

        expect(alert.textContent).to.equal(`Display is "Cannot divide by zero"`)
      })
    })
  })
})
