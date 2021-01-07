
export { action }

function action(model) {
  var action = {
    next({ action, value }) {
      if (!action || typeof action != "string") {
        console.error(`Invalid action specified, "${action}"`)
        return
      }

      if (/^digit$/.test(action) && ! /^\d$/.test(value)) {
        console.error(`Expected value for action "digit" to be a digit, but was "${value}"`)
        return
      }

      if (/^nextOp$/.test(action) && ! /^(plus|minus|multiply|divide|equals)/.test(value)) {
        console.error(`Expected value for action "nextOp" to be an operator, but was "${value}"`)
        return
      }

      // Demonstrate the dependency on model.
      model.present({ action, value })
    }
  }

  return action
}
