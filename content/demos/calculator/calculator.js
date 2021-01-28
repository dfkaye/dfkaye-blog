import { view } from "./sam/view.js";
import { action } from "./sam/action.js";
import { model } from "./sam/model.js";
import { state } from "./sam/state.js";

import { define } from "/js/lib/dependency/define.js";

var app = define({ view, action, model, state })

var start = function () {
  if (document.querySelectorAll("#mocha-report .fail").length) {
    // Dependency on mocha report.
    console.log("there were some failed tests")
  }

  var { view, action } = app;

  view.init(() => {
    //view.selectors.calculator = "#calculator"
    var calculator = document.querySelector(view.selectors.calculator);

    calculator.addEventListener("keydown", view.on.keydown);
    calculator.addEventListener("click", view.on.click);

    action.next({ action: "clear" })
  })
}

// Give the test suite a moment to finish, then call start().
setTimeout(start, 5000)