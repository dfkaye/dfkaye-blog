import { view } from "./sam/view.js";
import { action } from "./sam/action.js";
import { model } from "./sam/model.js";
import { state } from "./sam/state.js";

import { define } from "/js/lib/dependency/define.js";

var app = define({ view, action, model, state })

var start = function () {
  // Dependency on mocha report.
  var failing = document.querySelectorAll("#mocha-report .fail");
  var { length = 0 } = failing;

  if (length) {
    console.log(`%cThere were ${length} failing tests.`, `color: red; font-weight: bold;`);
    failing.forEach(test => {
      console.info(test.querySelector("h2").firstChild.textContent)
      console.error(test.querySelector(`[class="error"]`).textContent)
      console.log(test.querySelector("a").href)
    })
  }

  if (!length) {
    console.log(`%cAll tests are passing.`, `color: green; font-weight: bold;`);
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