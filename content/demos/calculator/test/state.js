import { state } from "../sam/state.js"
import { define } from "/js/lib/dependency/define.js"

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

  describe("history", () => {
    var app = define({ state })

    var data = {
      output: "6", expression: ["6"], error: "", last: "6"
    }

    it("returns list of transitions in current computation", () => {
      var { state, view } = app

      view.render = function ({ data }) { }
      state.transition({ data })

      var entries = state.history()
      var { current } = entries
      var { output, expression, error, last } = current.shift()

      expect(output).to.equal("6")
      expect(expression).to.deep.equal(["6"])
      expect(error).to.equal("")
      expect(last).to.equal("6")
    })

    it("saves and renders transitions only if they differ from the previous", () => {
      var { state, view } = app

      view.render = function ({ data }) { }

      var transitions = [
        data,
        data,
        data
      ]

      transitions.forEach(transition => {
        state.transition({ data: transition })
      })

      var entries = state.history()
      var { current, completed } = entries

      expect(current.length).to.equal(1)
      expect(completed.length).to.equal(0)
    })

    it("represents completed computations ending with an equals step", () => {
      var { state, view } = app

      var result

      view.render = function ({ data }) {
        result = data
      }

      var transitions = [
        data,
        { last: "equals", output: "done", expression: ["done"] },
      ]

      transitions.forEach(transition => {
        state.transition({ data: transition })
      })

      var entries = state.history()
      var { current, completed } = entries

      expect(current.length).to.equal(0)
      expect(completed.length).to.equal(1)
      expect(result.output).to.equal("done")
    })
  })
})
