
import { register } from "/js/lib/sam/register.js"

export { view }

function view(action) {
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
        /^Arrow(Up|Down|Right|Left)$/.test(key) && keypad.Arrow(e);

        // next digit
        /^\d$/.test(key)
          ? keypad.Digit({ key })
          : keypad.Action({ key });
      }
    }
  }

  return view
}

