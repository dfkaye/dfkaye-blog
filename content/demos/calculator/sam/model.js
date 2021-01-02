
export { model }

function model(state) {
  var data = {

  }

  function merge(data) {
    return data
  }

  var steps = {

  }

  var model = {
    propose({ action, value }) {
      var data = steps[action]({ value })

      // Demonstrate the dependency on state.
      state.change({ data })
    }
  }

  return model
}
