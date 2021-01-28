import {
  add as safe_plus,
  divide as safe_divide,
  minus as safe_minus,
  multiply as safe_multiply,
  percent as safe_percent,
  reciprocal as safe_recripocal,
  square as safe_square,
  sqrt as safe_sqrt
} from "https://unpkg.com/@dfkaye/safe-math@0.0.16/safe-math.js"

export { model }

var ops = {
  divide: safe_divide,
  minus: safe_minus,
  multiply: safe_multiply,
  plus: safe_plus
}

var symbols = {
  equals: "&equals;",
  divide: "&divide;",
  minus: "&minus;",
  multiply: "&times;",
  plus: "&plus;"
}

var base = {
  error: "",
  expression: [],
  last: "",
  nextOp: "",
  operands: [],
  output: "0" // display value
}

function model(state) {
  var data = Object.assign({}, base)

  function merge({ data, changes }) {
    // Manage error state first.
    if (data.error.length && !('error' in changes)) {
      // Clear previous errors if no new errors coming.
      changes.error = base.error

      // Clear previous expression if no new expression coming.
      if (data.expression.length && !('expression' in changes)) {
        changes.expression = base.expression.slice()
      }
    }

    // Enforce any type consistency requirements.

    if ('output' in changes) {
      changes.output = String(changes.output)
    }

    if ('operands' in changes) {
      changes.operands = changes.operands.map(entry => String(entry))
    }

    if ('expression' in changes) {
      changes.expression = changes.expression.map(entry => String(entry))
    }

    // Merge changes directly into data.
    return Object.assign(data, changes)
  }

  function shiftOperands({ data, newValue }) {
    var newOperands = data.operands.slice()

    // Replace last added value in operands, which may be left or right.
    newOperands[newOperands.length - 1] = newValue

    return newOperands
  }

  function shiftExpression({ data, symbols }) {
    var { expression } = data

    var newExpression = expression.slice()
    var token = newExpression[newExpression.length - 1]
    var values = Object.values(symbols)
    var found = values.some(value => token === value)

    if (!found) {
      newExpression.pop()
    }

    return newExpression
  }

  function append({ value }) {
    if (data.last == "equals") {
      // If last action was calculate(), reinitialize to clean state.
      steps.clear()
    }

    var { expression } = data;
    var { length } = expression;

    if (length < 3 && expression[length - 1] === symbols.equals) {
      // 27 January 2021 - Special case:
      // If "6 =", then "3", should become "3 ="

      // If all we have is the decimal point, prefix '0' to it.
      var newValue = value == '.'
        ? "0" + value
        : value;

      var changes = {
        output: newValue,
        operands: [newValue],
        expression: [newValue, expression[length - 1]],
        last: newValue
      }

      return merge({ data, changes })
    }

    // If last entry is numeric, continue with it; otherwise, it was an
    // operation request, so start a new operand.
    var entry = /\d|\./.test(data.last)
      ? data.output
      : '';

    // Ignore input if value is decimal and a decimal has already been entered.
    if (/\./.test(value) && /\./.test(entry)) {
      return
    }

    // Send error to state if value is neither digit or decimal.
    if (/([^\d^\.])/.test(value)) {
      var changes = {
        error: `Invalid digit value, "${value}"`
      }

      return merge({ data, changes })
    }

    // If the current display value is non-zero, append the new character;
    // otherwise replace it.
    var operand = Number(entry) || entry.length > 1
      ? entry + value
      : value;

    // If all we have is the decimal point, prefix '0' to it.
    var newOperand = operand == '.'
      ? "0" + operand
      : operand;

    var newValue = newOperand.toString()
    var newOperands = shiftOperands({ data, newValue })

    var changes = {
      output: newValue,
      last: newValue,
      operands: newOperands
    }

    return merge({ data, changes })
  }

  function calculate({ step }) {
    if (!data.nextOp /*&& step == "equals"*/) {
      // Take current output
      // append "=" to the expression
      // return without calculating.
      var changes = {
        // last: step,
        expression: [data.output, symbols[step]],
        operands: [data.output]
      }

      return merge({ data, changes })
    }

    if (!ops[data.nextOp]) {
      // console.error("not ready to calculate with ", data.nextOp)
      return
    }

    // Destructuring to the rescue. Sure is nice here.
    var [left, right] = data.operands
    // Run math operation...
    var value = ops[data.nextOp](left, right)
    var newValue = value.toString()

    var lastIndex = data.expression.length - 1
    var lastEntry = data.expression[lastIndex]
    var { equals } = symbols

    // Logic here is tricky. If the expression ends with '=', then we're ready to
    // shorten its output, so replace the expression with a new array of
    // operands and operators. Otherwise...
    var newExpression = lastEntry === equals
      ? [left, symbols[data.nextOp], right]
      : !/\d/.test(lastEntry)
        // ...it's more tricky: if the lastEntry in the expression is an
        // operator, append the right operand; otherwise, use the current
        // expression.
        ? data.expression.concat(right)
        : data.expression;

    // Append equals symbol if the requested step is the equals calculation.
    if (step == "equals") {
      newExpression.push(equals)
    }

    var changes = {
      // Assign the calculated value to the result field...
      output: newValue,
      // ... but leave the right operand value unchanged.
      operands: [newValue, right],
      expression: newExpression,
      // append() tests this on first digit after calculate() call.
      last: step
    }

    return merge({ data, changes })
  }

  var steps = {
    backspace() {
      var { output } = data;

      if (!Math.abs(output)) {
        // If absolute value is already 0, don't update.
        // return { message: 'Value is already 0' }
      }

      var value = output.substring(0, output.length - 1)

      if (!value) {
        // If the last digital character has been removed, replace it with 0.
        value = 0
      }

      var newValue = value.toString()
      var newOperands = shiftOperands({ data, newValue })

      var changes = {
        last: newValue,
        output: newValue,
        operands: newOperands
      }

      return merge({ data, changes })
    },

    clear() {
      var changes = Object.assign({}, base)

      return merge({ data, changes })
    },

    clearentry() {
      var changes = { output: base.output }

      return merge({ data, changes })
    },

    decimal() {
      // Defer to append.
      return append({ value: "." })
    },

    digit({ value }) {
      // Defer to append.
      return append({ value })
    },

    equals() {
      // Defer to calculate.
      return calculate({ step: "equals" })
    },

    negate() {
      var { output } = data

      if (!Math.abs(output)) {
        // Don't negate zero.
        return
      }

      var value = Number(output) > 0
        ? output * -1 // convert to negative
        : output.substring(1); // left-trim the negative sign

      var newValue = value.toString()
      var newOperands = shiftOperands({ data, newValue })

      var changes = {
        last: newValue,
        output: newValue,
        operands: newOperands
      }

      return merge({ data, changes })
    },

    nextOp({ value }) {
      if (value === data.last) {
        return { message: `Operation [${value}] already pending.` }
      }

      if (!data.expression.length) {
        // When user has selected an operation with the default value
        // displayed, prefix that value to the display expression.
        data.expression.unshift(data.output)
      }

      if (/\d|\./.test(data.last)) {
        // Call calculate() if last entry was numeric.
        // Remember, the data is mutated by this call.
        calculate({ step: value })
      }

      var { output, expression } = data

      var lastIndex = expression.length - 1
      var lastEntry = expression[lastIndex]
      var symbol = symbols[value]

      // If the expression ends with an operator, replace it with the incoming
      // operator. Otherwise, append the incoming operator to
      // the current expression.
      var newExpression = !/\d/.test(lastEntry)
        ? expression.slice(0, lastIndex).concat(symbol)
        : expression.concat(symbol);

      // Shorten the expression if the last op was "equals" and the nextOp
      // is NOT "equals".
      if (data.last == "equals" && symbol != symbols.equals) {
        newExpression = [output, symbol]
      }

      var changes = {
        nextOp: value,
        last: value,
        // Assign the calculated value to the result field
        // AND set the calculated value as the new right operand value.
        operands: [output, output],
        expression: newExpression
      }

      return merge({ data, changes })
    },

    percent() {
      // https://devblogs.microsoft.com/oldnewthing/20080110-00/?p=23853
      // 100 + 5% = 105
      // 9 + 9% => 9 + 0.81 (9% of 9) = 9.81
      // Apply percent to current entry, then multiply that by the previous
      // entry, and replace the current entry with that answer.
      var { operands, last } = data
      var value = 0
      var newOperands = []

      if (operands.length) {
        var [left, right] = operands

        if (!/\d/.test(right) || last === "equals") {
          // The right operand may not have been entered yet.
          right = left
        }

        // safe-math combo
        value = safe_multiply(left, safe_percent(right))

        newOperands = [safe_percent(right)]
      }

      var newValue = value.toString()

      var newExpression = last === "equals"
        ? [newValue]
        : shiftExpression({ data, symbols })
          .concat(newValue);

      newExpression.length < 2
        ? newOperands = [newValue]
        : newOperands.concat(newValue)

      var changes = {
        last: newValue,
        operands: newOperands,
        output: newValue,
        expression: newExpression
      }

      return merge({ data, changes })
    },

    reciprocal() {
      var { output, last } = data

      var error = !Number(output)
        ? "Cannot divide by zero"
        : "";

      var value = error
        ? output
        // safe-math
        : safe_recripocal(output);

      var newValue = value.toString()
      var newOperands = shiftOperands({ data, newValue })

      // Update expression to account for 1/(value) notation.
      var exprValue = `1/(${output})`
      var newExpression = last === "equals"
        ? [exprValue]
        : shiftExpression({ data, symbols })
          .concat(exprValue);

      var changes = {
        last: newValue,
        operands: newOperands,
        output: newValue,
        expression: newExpression,
        error
      }

      return merge({ data, changes })
    },

    square() {
      var { output, expression, last } = data

      // Safe multiply for 0.2 * 0.2 => 0.04
      // and 0.04000000000000001
      var value = safe_square(output)
      var newValue = value.toString()
      var newOperands = shiftOperands({ data, newValue })

      // Update expression to account for sqr(value) notation.
      var lastToken = expression[expression.length - 1]
      var lastEntry = !/\d/.test(lastToken)
        ? output
        : lastToken;
      var exprValue = `sqr(${lastEntry})`
      var newExpression = last === "equals"
        ? [exprValue]
        : shiftExpression({ data, symbols })
          .concat(exprValue);

      if (newExpression.length < 2) {
        newOperands = [newValue]
      }

      var changes = {
        last: newValue,
        operands: newOperands,
        output: newValue,
        expression: newExpression
      }

      return merge({ data, changes })
    },

    squareroot() {
      var { output, expression, last } = data

      var error = (Number(output) < 0)
        ? `Invalid input for square root, "${output}"`
        : "";

      var value = error
        ? output
        // safe-math
        : safe_sqrt(output);
      var newValue = value.toString()
      var newOperands = shiftOperands({ data, newValue })

      // Update expression to account for sqrt(value) notation.
      var lastToken = expression[expression.length - 1]
      var lastEntry = !/\d/.test(lastToken)
        ? output
        : lastToken;
      var exprValue = `&radic;(${lastEntry})`
      var newExpression = last === "equals"
        ? [exprValue]
        : shiftExpression({ data, symbols })
          .concat(exprValue);

      if (newExpression.length < 2) {
        newOperands = [newValue]
      }

      var changes = {
        last: newValue,
        operands: newOperands,
        output: newValue,
        expression: newExpression,
        error
      }

      return merge({ data, changes })
    }
  }

  var model = {
    propose({ action, value }) {
      if (!(action in steps)) {
        // Send error to state.
        return state.transition({
          data: Object.assign({}, data, {
            error: `Invalid action step, "${action}"`
          })
        })
      }

      var changes = steps[action]({ value })

      if (changes !== data) {
        // Skip transition if data not updated.
        return
      }

      state.transition({ data: Object.assign({}, changes) })
    }
  }

  return model
}
