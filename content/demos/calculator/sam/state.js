export { state }

function state(view, action) {

  var state = {
    transition({ data }) {
      var { output, expression, error } = data

      // TODO:
      // do not format output
      // join the expression array
      // pass error if non-empty

      var representation = Object.assign({}, {
        output,
        expression: expression.join(" "),
        error
      })

      // Demonstrate the dependency on view.
      view.render({ data: representation })

      // Demonstrate dependency on next action.
      action.next({ action: "test", value: "" })
    }
  }

  return state
}
