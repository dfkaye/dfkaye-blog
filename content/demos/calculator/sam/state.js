export { state }

function state(view, action) {

  // Time-travel depends not on the model but on the state, specifically the
  // state representation. Store representations in a history using unshift()
  // and retrieving "last" as history[0].

  var representations = [];
  var completions = []

  var state = {
    history() {
      // Allows us to inspect the current sequence of transitions.
      return {
        current: representations.slice(),
        completed: completions.slice()
      }
    },

    transition({ data }) {
      // Turn transition data into a representation for views or clients.

      var { output, expression, error, last } = data

      var representation = Object.assign({}, {
        output,
        expression: expression.slice(),
        error,
        last // I save this one for test verification.
      })

      // Render only if there's a computational difference between the state
      // transitions (representations). For simplistic apps like this one (all
      // strings and arrays), the string comparisons are good enough for now.
      // Note that the history should be empty at start so that the first
      // transition results in an update.

      var previous = representations[0];

      var diff = !previous || Object.keys(previous).some(key => {
        return previous[key].toString() !== representation[key].toString()
      })

      if (diff) {
        // Demonstrate the dependency on view.
        view.render({ data: representation })

        // Save this transition.
        representations.unshift(representation)

        // Demonstrate the time-travel of history.
        // console.log(representations)

        // The history of representations can get very long if we're not
        // careful, so we'll watch for the "last" step - when it's "equals",
        // the user has requested a completed calculation. We can empty the
        // current store of representations.

        if (last == "equals") {
          representations.length = 0
          completions.push(representation)
        }
      }

      // Demonstrate dependency on next action.
      // However, for this calculator, we don't have a countdown or a next step
      // transition.

      if (!error) {
        //   // this will return an error in the next transition, and prevent the
        //   // this action from repeating
        //   // console.log("state calling next action with 'test'")
        // action.next({ action: "test", value: "" })
      }
    }
  }

  return state
}
