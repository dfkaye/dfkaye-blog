
import { register } from "/js/lib/sam/register.js"

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
        var { rows, find } = keypad;
        var { selectors } = view;

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
        var { value } = e.target;
        var { handle } = view;

        handle.input({ key: value })
      },
      keydown(e) {
        var { key } = e;
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
      var equation = calculator.querySelector(selectors.equation)
      var output = calculator.querySelector(selectors.output)
      var alert = calculator.querySelector(selectors.alert)

      // Modify the DOM with new data.
      output.textContent = data.display.formatted
      equation.textContent = data.equation.join(" ")

      // This is to mimic MS Calculator output when read by Narrator.
      var alertContent = data.equation.length == 2 // if ["6", "+"]
        ? data.equation.join(" ") // show "6 +"
        : data.display.formatted;

      alert.textContent = `Display is ${alertContent}`.trim()
    },

    selectors: {
      calculator: "#fixture [calculator]",
      keys: "[value]",
      equation: "[equation]",
      output: '[output]',
      alert: '[role="alert"]'
    }
  }

  return view
}