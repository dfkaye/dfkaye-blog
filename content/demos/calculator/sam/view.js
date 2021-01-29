import { register } from "/js/lib/dom/register.js"
import { format } from "/js/lib/numbers/format.js"
import { normalize } from "/js/lib/dom/text-normalize.js"

export { view }

function view(action) {

  // input action names and symbols
  // For keyboard shortcuts, see
  // https://www.webnots.com/keyboard-shortcuts-for-calculator-app-in-windows-10/
  var actions = {
    "Backspace": "backspace",
    "backspace": "backspace",
    "Escape": "clear",
    "clear": "clear",
    "Delete": "clearentry",
    "clearentry": "clearentry",
    ".": "decimal",
    "decimal": "decimal",
    "Equals": "equals",
    "equals": "equals",
    "=": "equals",
    "F9": "negate",
    "negate": "negate",
    "%": "percent",
    "percent": "percent",
    "r": "reciprocal",
    "reciprocal": "reciprocal",
    "q": "square",
    "square": "square",
    "@": "squareroot",
    "squareroot": "squareroot"
  }

  // operator action names and symbols
  var operators = {
    "+": "plus",
    "plus": "plus",
    "-": "minus",
    "minus": "minus",
    "*": "multiply",
    "multiply": "multiply",
    "/": "divide",
    "divide": "divide"
  }

  // arrow key traversal
  var keypad = {
    rows: [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [19, 20, 21, 8],
      [16, 17, 18, 9],
      [13, 14, 15, 10],
      [23, 12, 22, 11]
    ],
    find(index) {
      var data = {}

      keypad.rows.some((row, i) => {
        var col = row.indexOf(index)

        if (col > -1) {
          // add props to data
          data.row = i
          data.col = col

          // exit some()
          return true
        }
      })

      return data
    }
  }

  var view = {
    init(handler) {
      if (!handler) {
        return
      }

      register(handler)
    },

    handle: {
      arrow(e) {
        var { key, target } = e
        var { rows, find } = keypad
        var { selectors } = view

        // Find our keypad buttons.
        var calculator = document.querySelector(selectors.calculator)
        var keys = Array.from(calculator.querySelectorAll(selectors.keys))

        // Traverse next key in keypad according to rows index order.
        var index = keys.indexOf(target)
        var { row, col } = find(index)
        var element = (
          (/Up$/.test(key) && row)
          && keys[rows[row - 1][col]]

          || (/Down$/.test(key) && row < rows.length - 1)
          && keys[rows[row + 1][col]]

          || (/Right$/.test(key) && col < rows[0].length - 1)
          && keys[rows[row][col + 1]]

          || (/Left$/.test(key) && col)
          && keys[rows[row][col - 1]]
        )

        element && (element.focus());
      },

      input({ key }) {
        if (key in actions) {
          return action.next({ action: actions[key], value: key })
        }

        if (key in operators) {
          return action.next({ action: "nextOp", value: operators[key] })
        }

        if (/^\d$/.test(key)) {
          return action.next({ action: "digit", value: key })
        }
      }
    },

    on: {
      click(e) {
        var { target } = e

        target.matches("[value]") || (target = target.closest("[value]"))

        if (!target) {
          return
        }

        var { value } = target
        var { handle } = view

        handle.input({ key: value })
      },
      keydown(e) {
        var { key } = e
        var { handle } = view;

        /^Arrow(Up|Down|Right|Left)$/.test(key)
          ? handle.arrow(e)
          : handle.input({ key });
      }
    },

    render({ data }) {
      var { selectors } = view

      // Find our output elements.
      var calculator = document.querySelector(selectors.calculator)
      var expression = calculator.querySelector(selectors.expression)
      var output = calculator.querySelector(selectors.output)
      var alert = calculator.querySelector(selectors.alert)

      // format output
      var displayValue = format(data.output)

      // normalize expression text
      var expressionText = normalize(data.expression.join(" "))

      // normalize error text
      var errorText = normalize(data.error)

      if (errorText) {
        calculator.setAttribute("error", errorText)
        displayValue = errorText
      } else {
        calculator.removeAttribute("error")
      }

      // Modify the DOM with new data.
      output.textContent = displayValue
      expression.textContent = expressionText

      // This is to mimic MS Calculator output when read by Narrator.
      var alertText = !errorText && data.expression.length == 2 // if ["6", "+"]
        ? expressionText // show "6 +"
        : displayValue;

      alert.textContent = `Display is "${alertText}"`.trim()
    },

    selectors: {
      calculator: "[calculator]",
      keys: "[value]",
      expression: "[expression]",
      output: '[output]',
      alert: '[role="alert"]'
    }
  }

  return view
}
