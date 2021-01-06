
import { register } from "/js/lib/sam/register.js"

export { view }

function view(action) {

  var view = {
    init(handler) {
      if (!handler) {
        return
      }

      register(handler)
    },

    keypad: {
      operators: {
        "+": "plus",
        "-": "minus",
        "*": "multiply",
        "/": "divide",
        "=": "equals"
      },

      Action({ key }) {
        // Keyboard shortcuts
        // https://www.webnots.com/keyboard-shortcuts-for-calculator-app-in-windows-10/

        var { keypad } = view;

        // trim rightmost
        /^Backspace$/.test(key) && keypad.Backspace(key);

        // clear entry
        /^Delete$/.test(key) && keypad.Delete(key);

        // clear all
        /^Escape$/.test(key) && keypad.Escape(key);

        // decimal
        /^\.$/.test(key) && keypad.Decimal(key);

        // digit
        /^\d$/.test(key) && keypad.Digit(key);

        // negate (positive-negative)
        /^F9$/.test(key) && keypad.Negate(key);

        // next op key
        /^(\+|\-|\*|\/|\=)$/.test(key) && keypad.Operator(key);

        // next op button click
        /^(plus|minus|multiply|divide|equals)$/.test(key) && keypad.Operator(key);

        // percent
        /^\%$/.test(key) && keypad.Percent(key);

        // reciprocal
        /^r$/.test(key) && keypad.Reciprocal(key);

        // square
        /^q$/.test(key) && keypad.Square(key);

        // square root
        /^@$/.test(key) && keypad.Squareroot(key);
      },

      Backspace(key) {
        action.next({ action: "backspace", value: key })
      },
      Decimal(key) {
        action.next({ action: "decimal", value: key })
      },
      Delete(key) {
        action.next({ action: "clearentry", value: key })
      },
      Digit(key) {
        action.next({ action: "digit", value: key })
      },
      Escape(key) {
        action.next({ action: "clear", value: key })
      },
      Negate(key) {
        action.next({ action: "negate", value: key })
      },
      Operator(key) {
        var { keypad } = view;

        action.next({
          action: "nextOp",
          value: keypad.operators[key]
        })
      },
      Percent(key) {
        action.next({ action: "percent", value: key })
      },
      Reciprocal(key) {
        action.next({ action: "reciprocal", value: key })
      },
      Square(key) {
        action.next({ action: "square", value: key })
      },
      Squareroot(key) {
        action.next({ action: "squareroot", value: key })
      }
    },

    on: {
      click(e) {
        var { value } = e.target;
        var { keypad } = view;

        keypad.Action({ key: value })
      },
      keydown(e) {
        var { key } = e;
        var { traverse, keypad } = view;

        // traversal
        /^Arrow(Up|Down|Right|Left)$/.test(key)
          ? traverse.Arrow(e)
          : keypad.Action({ key });
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
    },

    traverse: {
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
        var { traverse } = view;

        var { rows } = traverse

        rows.some((row, i) => {
          var col = row.indexOf(index)

          if (col > -1) {
            data.row = i
            data.col = col
            data.index = index

            return data
          }
        })

        return data
      },
      Arrow(e) {
        var { selectors, traverse } = view;
        var { rows, find } = traverse

        // Traverse next key in keypad, according to rows layout.

        var { key, target } = e

        // Find our keypad buttons.
        var calculator = document.querySelector(selectors.calculator)
        var keys = Array.from(calculator.querySelectorAll(selectors.keys))

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
      }
    }
  }

  return view
}
