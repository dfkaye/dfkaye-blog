import {
  add as safe_plus,
  divide as safe_divide,
  minus as safe_minus,
  multiply as safe_multiply,
  percent as safe_percent,
  reciprocal as safe_recripocal,
  square as safe_square,
  sqrt as safe_sqrt
} from "https://unpkg.com/@dfkaye/safe-math@0.0.15/safe-math.js"

export { model }

var ops = {
  divide: safe_divide,
  minus: safe_minus,
  multiply: safe_multiply,
  plus: safe_plus
}

var symbols = {
  equals: "=",
  divide: "/",
  minus: "-",
  multiply: "*",
  plus: "+"
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
    // Enforce any type consistency requirements.

    if ('output' in changes) {
      changes.output = String(changes.output);
    }

    if ('operands' in changes) {
      changes.operands = changes.operands.map(entry => entry.toString())
    }

    if ('expression' in changes) {
      changes.expression = changes.expression.map(entry => entry.toString())
    }

    if (!('error' in changes)) {
      changes.error = base.error;
    }

    // Merge changes directly into data.
    return Object.assign(data, changes);
  }

  function shiftOperands({ data, newValue }) {
    var newOperands = data.operands.slice();

    // Replace last added value in operands, which may be left or right.
    newOperands[newOperands.length - 1] = newValue;

    return newOperands;
  }

  function shiftExpression({ data, symbols }) {
    var { expression } = data

    var newExpression = expression.slice()
    var token = newExpression[newExpression.length - 1]
    var values = Object.values(symbols);
    var found = values.some(value => token === value)

    if (!found) {
      newExpression.pop()
    }

    return newExpression
  }

  function append({ value }) {
    if (data.last == "equals") {
      // If last action was calculate(), reinitialize to clean state.
      steps.clear();
    }

    // If last entry is numeric, continue with it; otherwise, it was an
    // operation request, so start a new operand.
    var operand = /\d|\./.test(data.last)
      ? data.output
      : '';

    // Ignore input if value is decimal and a decimal has already been entered.
    if (/\./.test(value) && /\./.test(operand)) {
      return
    }

    // Send error to state if value is neither digit or decimal.
    if (/([^\d^\.])/.test(value)) {
      return merge({
        data, changes: {
          error: `invalid digit value, "${value}"`
        }
      });
    }

    // If the current display value is non-zero, append the new character;
    // otherwise replace it.
    operand = Number(operand) || operand.length > 1
      ? operand + value
      : value;

    // If all we have is the decimal point, prefix '0' to it.
    var value = operand == '.'
      ? ['0' + operand].join('')
      : operand;

    var newValue = value.toString()


    var newOperands = shiftOperands({ data, newValue });

    var changes = {
      output: newValue,
      last: newValue,
      operands: newOperands
    };

    return merge({ data, changes });
  }

  function calculate({ step }) {
    if (!data.nextOp && step == "equals") {
      // take current output and append "=" to the expression
      var changes = {
        // last: step,
        expression: [data.output, symbols[step]],
        operands: [data.output, data.output]
      }

      return merge({ data, changes })
    }

    if (!ops[data.nextOp]) {
      // console.error("not ready to calculate with ", data.nextOp)
      return
    }

    // Destructuring to the rescue. Sure is nice here.
    var [left, right] = data.operands;
    // run math operation...
    var value = ops[data.nextOp](left, right)
    var newValue = value.toString()

    var lastIndex = data.expression.length - 1;
    var lastEntry = data.expression[lastIndex];
    var { equals } = symbols;

    console.log({
      last: data.last,
      operands: data.operands,
      expression: data.expression
    })

    // Logic here is tricky. If the expression ends with '=', then we're ready to
    // shorten its output, so replace the expression with a new array of
    // operands and operators. Otherwise...
    var newExpression = lastEntry === equals
      ? [left, symbols[data.nextOp], right, equals]
      : /\d/.test(lastEntry)
        // ...it's more tricky: if the lastEntry in the expression is numeric,
        // append the equals operator; otherwise, append the right operand and
        // the equals operator.
        ? data.expression.concat(equals)
        : data.expression.concat(right, equals);

    var changes = {
      output: newValue,
      // Assign the calculated value to the result field
      // BUT leave the right operand value unchanged.
      operands: [newValue, right],
      expression: newExpression,
      // append() tests this on first digit after calculate() call.
      last: step
    };

    return merge({ data, changes });
  }

  var steps = {
    backspace() {
      var { output } = data;

      if (!Math.abs(output)) {
        // If absolute value is already 0, don't update.
        return { message: 'Value is already 0' };
      }

      var value = output.substring(0, output.length - 1);

      if (!value) {
        // If the last digital character is removed, replace it with 0.
        value = 0;
      }

      var newValue = value.toString()
      var newOperands = shiftOperands({ data, newValue });

      var changes = {
        last: newValue,
        output: newValue,
        operands: newOperands
      };

      return merge({ data, changes });
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
        return
      }

      var value = Number(output) > 0
        ? output * -1 // convert to negative
        : output.substring(1); // left-trim the negative sign

      var newValue = value.toString()
      var newOperands = shiftOperands({ data, newValue });

      var changes = {
        last: newValue,
        output: newValue,
        operands: newOperands
      };

      return merge({ data, changes });
    },

    nextOp({ value }) {
      if (value === data.last) {
        return { message: `Operation [${value}] already pending.` };
      }

      if (!data.expression.length) {
        // When user has selected an operation with the default value displayed.
        // prefix that value to the display expression.
        data.expression.unshift(data.output);
      }

      if (/\d|\./.test(data.last)) {
        // Call calculate() if last entry was numeric.
        // Remember, the data is mutated by this call.
        calculate({ step: value });
      }

      console.log("nextOp", value)
      console.log(data)

      var { output } = data;

      var lastIndex = data.expression.length - 1;
      var lastEntry = data.expression[lastIndex];
      var symbol = symbols[value]

      // If the expression ends with an operator, replace it with the incoming
      // operator. Otherwise, append it to the output expression.
      var newExpression = !/\d(\.)?/.test(lastEntry)
        ? data.expression.slice(0, lastIndex).concat(symbol)
        : data.expression.concat(symbol);

      console.warn(newExpression)

      var changes = {
        nextOp: value,
        last: value,
        // Assign the calculated value to the result field
        // AND set the calculated value as the new right operand value.
        operands: [output, output],
        expression: newExpression
      };

      return merge({ data, changes });
    },

    percent() {
      // https://devblogs.microsoft.com/oldnewthing/20080110-00/?p=23853
      // 100 + 5% = 105
      // 9 + 9% => 9 + 0.81 (9% of 9) = 9.81
      // Apply percent to current entry, then multiply that by the previous entry,
      // and replace the current entry with that answer.

      var value = 0

      // get operands
      var { operands } = data
      var { length } = operands

      if (length) {
        var [a, b] = operands

        if (!/\d/.test(b)) {
          b = a
        }

        // safe-math combo
        value = safe_multiply(a, safe_percent(b))
      }

      var newValue = value.toString()
      var newOperands = shiftOperands({ data, newValue });
      var newExpression = shiftExpression({ data, symbols })

      newExpression.push(newValue)

      var changes = {
        last: "percent",
        operands: newOperands,
        output: newValue,
        expression: newExpression
      }

      return merge({ data, changes })
    },

    reciprocal() {
      var { output } = data

      var error = !Number(output)
        ? "Cannot divide by zero"
        : ""

      var value = error
        ? output
        // safe-math
        : safe_recripocal(output)

      var newValue = value.toString()
      var newOperands = shiftOperands({ data, newValue });
      var newExpression = shiftExpression({ data, symbols })

      newExpression.push(`1/(${output})`)

      var changes = {
        last: "reciprocal",
        operands: newOperands,
        output: newValue.toString(),
        expression: newExpression,
        error
      }

      return merge({ data, changes })
    },

    square() {
      var { output, expression } = data

      var lastEntry = expression.length < 3
        ? output
        : expression[expression.length - 1]

      // Safe multiply for 0.2 * 0.2 => 0.04
      // and 0.04000000000000001
      var value = safe_square(output)
      var newValue = value.toString()
      var newOperands = shiftOperands({ data, newValue })
      var newExpression = shiftExpression({ data, symbols })

      newExpression.push(`sqr(${lastEntry})`)

      var changes = {
        last: "square",
        operands: newOperands,
        output: newValue,
        expression: newExpression
      }

      return merge({ data, changes })
    },

    squareroot() {
      var { output, expression } = data

      var error = (Number(output) < 0)
        ? `invalid input for square root, "${output}"`
        : ""

      var lastEntry = expression.length < 3
        ? output
        : expression[expression.length - 1]

      var value = error
        ? output
        // safe-math
        : safe_sqrt(output)

      var newValue = value.toString()
      var newExpression = shiftExpression({ data, symbols })

      newExpression.push(`&radic;(${lastEntry})`)

      var changes = {
        last: "squareroot",
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
        // send error to state
        return state.transition({
          data: Object.assign({}, data, {
            error: `invalid action step, "${action}"`
          })
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
