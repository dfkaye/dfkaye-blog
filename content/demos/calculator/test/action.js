import { action } from "../sam/action.js"
import { define } from "/js/lib/sam/define.js"

describe("action", () => {
  var { expect } = chai

  describe("define({ action })", () => {
    var app = define({ action })

    it("returns app with action and model", () => {
      var { action, model } = app

      expect(action).to.be.an("object")
      expect(model).to.be.an("object")
    })
  })

  describe("action.next", () => {
    var app = define({ action })

    it("proposes simple actions to the model", () => {
      var { action, model } = app

      var actions = [
        "backspace",
        "clear",
        "clearentry",
        "decimal",
        "delete",
        "equals",
        "negate",
        "percent",
        "reciprocal",
        "square",
        "squareroot"
      ]

      var calls = 0

      actions.forEach(entry => {
        model.propose = function ({ action, value }) {
          expect(action).to.equal(entry)
          calls += 1
        }

        action.next({ action: entry })
      })

      expect(calls).to.equal(actions.length)
    })

    it("proposes value actions to the model", () => {
      var { action, model } = app

      var actions = [
        { action: "digit", value: "3" },
        { action: "nextOp", value: "plus" },
        { action: "nextOp", value: "minus" },
        { action: "nextOp", value: "multiply" },
        { action: "nextOp", value: "divide" }
      ]

      var calls = 0

      actions.forEach(entry => {
        model.propose = function (proposal) {
          var { action, value } = proposal

          expect(action).to.equal(entry.action)
          expect(value).to.equal(entry.value)
          calls += 1
        }

        action.next({ action: entry.action, value: entry.value })
      })

      expect(calls).to.equal(actions.length)
    })

    describe("on empty actions and invalid values", () => {
      var { action, model } = app

      model.propose = function (proposal) {
        throw new Error(`Should not forward proposal to the model, {action: ${entry.action}, value: ${entry.value}}.`)
      }

      it("returns message for empty action", () => {
        var error = action.next({ action: "", value: "minus" })

        expect(error).to.equal(`Invalid action specified, ""`)
      })

      it("returns message for invalid action", () => {
        var error = action.next({ action: 0, value: "minus" })

        expect(error).to.equal(`Invalid action specified, "0"`)
      })

      it("returns message for invalid digit value", () => {
        var error = action.next({ action: "digit", value: "x" })

        expect(error).to.equal(`Invalid value specified for digit, "x"`)
      })

      it("returns message for invalid nextOp value", () => {
        var error = action.next({ action: "nextOp", value: "x" })

        expect(error).to.equal(`Invalid value specified for nextOp, "x"`)
      })
    })
  })
})
