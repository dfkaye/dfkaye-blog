import { view } from "./sam/view.js";
import { action } from "./sam/action.js";
import { model } from "./sam/model.js";
import { state } from "./sam/state.js";

import { define } from "/js/lib/sam/define.js";

console.log("loaded")

var f = function () {
  console.log(document.querySelectorAll(".fail").length)

  var { view, action } = app;

  view.init(() => {
    //view.selectors.calculator = "#calculator"
    var calculator = document.querySelector(view.selectors.calculator);

    console.log("should run")
    calculator.addEventListener("keydown", view.on.keydown);
    calculator.addEventListener("click", view.on.click);

    action.next({ action: "clear" })
  })
}
var app = define({ view, action, model, state })

setTimeout(f, 5000)