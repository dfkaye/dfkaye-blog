import { action } from "../sam/action.js"
import { define } from "/js/lib/sam/define.js"

describe("action", () => {
  var { expect } = chai

  describe("define({ action })", () => {
    var app = define({ action })

    it("returns app with action and model", () => {
      var { action, model } = app;

      expect(action).to.be.an("object")
      expect(model).to.be.an("object")
    })
  })

  describe("action.next", () => {
    var app = define({ action })

    it("presents simple actions to the model", () => {
      var { action, model } = app;

      var actions = [
        "backspace",
        "clear",
        "clearentry",
        "decimal",
        "delete",
        "negate",
        "percent",
        "reciprocal",
        "square",
        "squareroot"
      ]

      var calls = 0;

      actions.forEach(entry => {
        model.present = function ({ action, value }) {
          expect(action).to.equal(entry)
          calls += 1
        }

        action.next({ action: entry })
      })

      expect(calls).to.equal(actions.length)
    })

    it("presents value actions to the model", () => {
      var { action, model } = app;

      var actions = [
        { action: "digit", value: "3" },
        { action: "nextOp", value: "plus" },
        { action: "nextOp", value: "minus" },
        { action: "nextOp", value: "multiply" },
        { action: "nextOp", value: "divide" },
        { action: "nextOp", value: "equals" }
      ]

      var calls = 0;

      actions.forEach(entry => {
        model.present = function (proposal) {
          var { action, value } = proposal

          expect(action).to.equal(entry.action)
          expect(value).to.equal(entry.value)
          calls += 1
        }

        action.next({ action: entry.action, value: entry.value })
      })

      expect(calls).to.equal(actions.length)
    })

    it("ignores empty action and invalid value actions", () => {
      var { action, model } = app;

      var actions = [
        { action: 0, value: "minus" },
        { action: "", value: "minus" },
        { action: "digit", value: "x" },
        { action: "nextOp", value: "x" },
      ]

      var calls = 0;

      actions.forEach(entry => {
        model.present = function (proposal) {
          throw new Error(`Should not forward proposal to the model, {action: ${entry.action}, value: ${entry.value}}.`)
        }

        action.next({ action: entry.action, value: entry.value })
      })

      expect(calls).to.equal(0)
    })
  })
})
