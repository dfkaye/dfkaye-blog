export { state }

function state(view, action) {

  var state = {
    transition({ data }) {
      var { output, expression, error } = data

      var representation = Object.assign({}, {
        output,
        expression: expression.slice(),
        error
      })

      // Demonstrate the dependency on view.
      view.render({ data: representation })

      // Demonstrate dependency on next action.
      // if (!error) {
      //   // this will return an error in the next transition, and prevent the
      //   // this action from repeating
      //   // console.log("state calling next action with 'test'")
      //   // action.next({ action: "test", value: "" })
      // }
    }
  }

  return state
}
