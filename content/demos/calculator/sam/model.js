
export { model }

function model(state) {
  var base = {
    input: [],
    output: "0"
  }

  var data = {}

  function change({ data, changes }) {

    // Merge changes directly into data.
    return Object.assign(data, changes);
  }

  var steps = {
    backspace() {
      var { output } = data

      var changes = {
        output: output.substring(0, output.length - 1)
      }

      return change({ data, changes })
    },

    clear() {
      var changes = Object.assign({}, base)

      return change({ data, changes })
    },

    clearentry() {
      var changes = { output: base.output }

      return change({ data, changes })
    },

    decimal() {
      var { output } = data

      if (output.indexOf(".") != -1) {
        // Ignore repeated decimal input.
        return
      }

      var changes = {
        output: output + "."
      }

      return change({ data, changes })
    },

    digit({ value }) {
      if (/\D/.test(value)) {
        // Notify state of errors
        return state.transition({
          error: `invalid digit value, "${value}"`
        })
      }

      var { input } = data
      var last = input[input.length - 1]

      // If last action was equals(), reinitialize to clean state.
      if (last == "equals") {
        steps.clear()
      }

      var input = data.input.slice()

      input.push(value)

      var { output } = data

      output = output == 0
        ? value
        : output + value

      var changes = { input, output }

      return change({ data, changes })
    },

    negate() {
      var { output } = data

      if (!Math.abs(output)) {
        return
      }

      var value = output *= -1

      var changes = {
        output: value.toString()
      }

      return change({ data, changes })
    },

    percent() {
      // https://devblogs.microsoft.com/oldnewthing/20080110-00/?p=23853
      // 100 + 5% = 105
      // 9 + 9% => 9 + 0.81 (9% of 9) = 9.81
      // Apply percent to current entry, then multiply that by the previous entry,
      // and replace the current entry with that answer.
      // So now we need to use the input array...


    },

    reciprocal() {
      var { output } = data

      if (Number(output) < 0) {
        // Notify state of errors
        return state.transition({
          error: `Cannot divide by zero`
        })
      }

      var value = (1 / output)

      var changes = {
        output: value.toString()
      }

      return change({ data, changes })
    },

    square() {
      var { output } = data

      var value = output * output

      var changes = {
        output: value.toString()
      }

      return change({ data, changes })
    },

    squareroot() {
      var { output } = data

      if (Number(output) < 0) {
        // Notify state of errors
        return state.transition({
          error: `invalid input for square root, "${output}"`
        })
      }

      var value = Math.sqrt(output)

      var changes = {
        output: value.toString()
      }

      return change({ data, changes })
    }
  }

  var model = {
    propose({ action, value }) {
      if (!(action in steps)) {
        // send error to state
        return state.transition({
          error: `invalid action step, "${action}"`
        })
      }

      var changes = steps[action]({ value })

      if (changes !== data) {
        // skip transition if data not updated
        return
      }

      state.transition({ data: Object.assign({}, changes) })
    }
  }

  return model
}
