
export { action }

function action(model) {
  var action = {
    next({ action, value }) {
      if (!action || typeof action != "string") {
        return `Invalid action specified, "${action}"`
      }

      if (/^digit$/.test(action) && ! /^\d$/.test(value)) {
        return `Invalid value specified for digit, "${value}"`
      }

      if (/^nextOp$/.test(action) && ! /^(plus|minus|multiply|divide)/.test(value)) {
        return `Invalid value specified for nextOp, "${value}"`
      }

      // Demonstrate the dependency on model.
      model.propose({ action, value })
    }
  }

  return action
}
