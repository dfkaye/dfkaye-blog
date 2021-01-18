import { format } from "/js/lib/sam/numbers.js"

export { state }

function state(view, action) {

  var state = {
    transition({ data }) {

      // TODO:
      // format values for output and alert
      // pass expression array

      var representation = Object.assign({}, data)

      // Demonstrate the dependency on view.
      view.render({ data: representation })

      // Demonstrate dependency on next action.
      action.next({ action: "test", value: "" })
    }
  }

  return state
}
