import { action } from "../sam/action.js"
import { define } from "/js/lib/sam/define.js"

describe("action", () => {
  var { expect } = chai

  var app = define({ action })

  it("runs", () => {
    var { action, model } = app

    expect(action.next).to.be.a("function")
  })
})
