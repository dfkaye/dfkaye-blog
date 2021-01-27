import { state } from "../sam/state.js"
import { define } from "/js/lib/sam/define.js"

describe("state", () => {
  var { expect } = chai

  describe("define({ state })", () => {
    var app = define({ state })

    it("returns app with state, view and action", () => {
      var { state, view, action } = app

      expect(state).to.be.an("object")
      expect(view).to.be.an("object")
      expect(action).to.be.an("object")
    })
  })

  describe("transition", () => {
    var app = define({ state })

    var representation = {
      output: "",
      expression: [],
      error: ""
    }

    it("transition calls render and next action", () => {
      var { state, view, action } = app

      var data = Object.assign({}, representation, {
        output: "1234.567890",
        expression: ["1234.567890", "+", "0", "="]
      })

      view.render = function ({ data }) {
        expect(data.output).to.equal("1234.567890")
        expect(data.expression).to.deep.equal(["1234.567890", "+", "0", "="])
      }

      action.next = function ({ action, value }) {
        expect(action).to.equal("test")
      }

      state.transition({ data })
    })

    it("passes HTML entities in expression unchanged", () => {
      var { state, view, action } = app

      var data = Object.assign({}, representation, {
        output: "3",
        expression: ["5", "+", "&radic;(9)"]
      })

      view.render = function ({ data }) {
        expect(data.output).to.equal("3")
        expect(data.expression).to.deep.equal(["5", "+", "&radic;(9)"])
      }

      action.next = function ({ action, value }) { }

      state.transition({ data })
    })
  })
})
