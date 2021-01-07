import { state } from "../sam/state.js"
import { define } from "/js/lib/sam/define.js"

describe("state", () => {
  var { expect } = chai

  describe("define({ state })", () => {
    var app = define({ state })

    it("returns app with state, view and action", () => {
      var { state, view, action } = app;

      expect(state).to.be.an("object")
      expect(view).to.be.an("object")
      expect(action).to.be.an("object")
    })

    it("transition calls render and next action", () => {
      var { state, view, action } = app;
      var data = {
        output: {
          value: "12345.67890",
          formatted: "12,345.67890"
        }
      }

      view.render = function ({ data }) {
        expect(data.output.formatted).to.equal("12,345.67890")
      }

      action.next = function ({ action, value }) {
        expect(action).to.equal("test")
      }

      state.transition({ data })
    })

    it("format value")
    it("output value")
    it("equation")
    it("alert value")
  })
})
