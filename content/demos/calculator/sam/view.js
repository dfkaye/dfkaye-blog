
import { register } from "/js/lib/sam/register.js"

export { view }

function view(action) {

  // TODO: pass calculator root or keypad root selector
  // and [value] selector from view init(() => {
  //    view.calculator ... 
  //    view.keys
  // })
  var calculator = document.querySelector("#fixture [calculator]")
  var keys = Array.from(calculator.querySelectorAll("[value]"))

  /* arrow key traversal */

  var traverse = {
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
      var { rows, find } = traverse

      // Traverse next key in keypad, according to rows layout.

      var { key, target } = e
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

  /* keypad */

  var operators = {
    "+": "plus",
    "-": "minus",
    "*": "multiply",
    "/": "divide",
    "=": "equals"
  }

  var keypad = {
    Action({ key }) {
      // trim rightmost
      /^Backspace$/.test(key) && keypad.Backspace(key);

      // clear entry
      /^Delete$/.test(key) && keypad.Delete(key);

      // clear all
      /^Escape$/.test(key) && keypad.Escape(key);

      // decimal
      /^\.$/.test(key) && keypad.Decimal(key);

      // next digit
      // /^\d$/.test(key) && keypad.Digit(key);

      // negate (positive-negative)
      /^F9$/.test(key) && keypad.Negate(key);

      // percent
      /^\%$/.test(key) && keypad.Percent(key);

      // reciprocal
      /^r$/.test(key) && keypad.Reciprocal(key);

      // square
      /^q$/.test(key) && keypad.Square(key);

      // square root
      /^@$/.test(key) && keypad.Squareroot(key);

      // next op
      /^(\+|\-|\*|\/|\=)$/.test(key) && keypad.Operator(key);
    },
    Command({ key }) {
      // next op
      /^(plus|minus|multiply|divide|equals)$/.test(key)
        ? action.next({ action: "nextOp", value: key })
        : action.next({ action: key, value: key })
    },
    Digit({ key }) {
      action.next({ action: "digit", value: key })
    },
    Operator(key) {
      action.next({ action: "nextOp", value: operators[key] })
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
    Escape(key) {
      action.next({ action: "clear", value: key })
    },
    Negate(key) {
      action.next({ action: "negate", value: key })
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
  }

  /* interface */

  var view = {
    init(handler) {
      if (!handler) {
        return
      }

      register(handler)
    },
    render({ data }) {
      // Modify the DOM with new data.
    },
    on: {
      click(e) {
        var { value } = e.target;

        /^\d$/.test(value)
          ? keypad.Digit({ key: value })
          : keypad.Command({ key: value })
      },
      keydown(e) {
        var { key } = e;

        // traversal
        /^Arrow(Up|Down|Right|Left)$/.test(key) && traverse.Arrow(e);

        // next digit
        /^\d$/.test(key)
          ? keypad.Digit({ key })
          : keypad.Action({ key });
      }
    }
  }

  return view
}

