import { add, divide, minus, multiply } from "https://unpkg.com/@dfkaye/safe-math@0.0.15/safe-math.js"

export { model }

var ops = {
  divide,
  minus,
  multiply,
  plus: add
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
  var data = {}

  function merge({ data, changes }) {
    // First, enforce any type safety requirements
    if ('output' in changes) {
      changes.output = String(changes.output);
    }

    // First, enforce any type safety requirements
    if (!('error' in changes)) {
      changes.error = base.error;
    }

    // Merge changes directly into data.
    return Object.assign(data, changes);
  }

  function shiftOperands({ data, newValue }) {
    var newOperands = data.operands.slice();

    // Replace last added value in operand, which may be left or right.
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
      reset();
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
    var newValue = operand == '.'
      ? ['0' + operand].join('')
      : operand;

    var newOperands = shiftOperands({ data, newValue });

    var changes = {
      output: newValue,
      last: newValue,
      operands: newOperands
    };

    return merge({ data, changes });
  }

  function calculate({ step }) {
    if (!data.nextOp) {
      // take current output and append "=" to the expression
      var changes = {
        nextOp: step,
        expression: [data.output, symbols[step]]
      }

      return merge({ data, changes })
    }

    // Destructuring to the rescue. Sure is nice here.
    var [left, right] = data.operands;
    var op = ops[data.nextOp]
    var newValue = op(left, right).toString();

    var lastIndex = data.expression.length - 1;
    var lastEntry = data.expression[lastIndex];
    var { equals } = symbols;

    // Logic here is tricky. If the expression ends with '=', then we're ready to
    // shorten its output, so replace the expression with a new array of
    // operands and operators. Otherwise, append the right operand and the '='
    // operator.
    var newExpression = lastEntry === equals
      ? [left, symbols[data.nextOp], right, equals]
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

      var newValue = output.substring(0, output.length - 1);

      if (!newValue) {
        // If the last digital character is removed, replace it with 0.
        newValue = "0";
      }

      var newOperands = shiftOperands({ data, newValue });

      var changes = {
        output: newValue,
        last: newValue,
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

      var newValue = Number(output) > 0
        ? output * -1 // convert to negative
        : output.substring(1); // left-trim the negative sign

      var newOperands = shiftOperands({ data, newValue });

      var changes = {
        output: newValue,
        last: newValue,
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

      var { output } = data;

      var lastIndex = data.expression.length - 1;
      var lastEntry = data.expression[lastIndex];
      var symbol = symbols[value]

      // If the expression ends with an operator, replace it with the incoming
      // operator. Otherwise, append it to the output expression.
      var newExpression = !/\d(\.)?/.test(lastEntry)
        ? data.expression.slice(0, lastIndex).concat(symbol)
        : data.expression.concat(symbol);

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

      var newOutput = 0

      // get operands
      var { operands, expression } = data
      var { length } = operands

      if (length) {
        var [a, b] = operands

        if (!/\d/.test(b)) {
          b = a
        }

        newOutput = a * b / 100
      }

      var newExpression = shiftExpression({ data, symbols })

      newExpression.push(`${newOutput}`)

      var changes = {
        output: newOutput.toString(),
        expression: newExpression
      }

      return merge({ data, changes })
    },

    reciprocal() {
      var { output, expression } = data

      var error = (Number(output) < 0)
        ? "Cannot divide by zero"
        : ""

      var newOutput = error
        ? output
        : 1 / output

      var newExpression = shiftExpression({ data, symbols })

      newExpression.push(`1/(${output})`)

      var changes = {
        output: newOutput.toString(),
        expression: newExpression,
        error
      }

      return merge({ data, changes })
    },

    square() {
      var { output, expression } = data

      var newOutput = output * output

      var newExpression = shiftExpression({ data, symbols })

      newExpression.push(`sqr(${output})`)

      var changes = {
        output: newOutput.toString(),
        expression: newExpression
      }

      return merge({ data, changes })
    },

    squareroot() {
      var { output } = data

      var error = (Number(output) < 0)
        ? `invalid input for square root, "${output}"`
        : ""

      var newOutput = error
        ? output
        : Math.sqrt(output)

      var newExpression = shiftExpression({ data, symbols })

      newExpression.push(`sqrt(${output})`)

      var changes = {
        output: newOutput.toString(),
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
