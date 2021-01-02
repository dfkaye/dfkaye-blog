
export { action }

function action(model) {
  var action = {
    next({ action, value }) {
      if (!action) {
        return
      }

      // Demonstrate the dependency on model.
      model.propose({ action, value })
    }
  }

  return action
}
