import { define } from "/js/lib/sam/define.js";
import { register } from "/js/lib/sam/register.js"

describe("SAM pattern Countdown demo", function () {

  var expect = chai.expect;

  /*
   * This suite demonstrates a minimal API required for a SAM application, and
   * support for user events. The Countdown consists of four factory functions:
   * state, action, model, and view. The define function takes all four, creates
   * an object, and calls them with slots in the object created for each
   * dependency.
   */

  /* Factories for action, model, state, and view. */

  // action.next({ action: 'decrement', value: 'any' })
  var action = function (model) {

    var action = {
      next({ action, value }) {
        if (!action) {
          return
        }

        // Demonstrate the dependency on model.
        model.present({ action, value })
      }
    }

    return action
  }

  // model.present({ action: 'reset', value: 'any' })
  // model.present({ action: 'decrement', value: 'any' })
  var model = function (state) {
    var data = { from: 0, remaining: 0, progress: 0 }

    function merge(data) {
      data.progress = Math.floor(data.from - data.remaining)

      return data
    }

    var steps = {
      reset({ value = NaN }) {
        data.from = +(value) || 10
        data.remaining = data.from

        return merge(data)
      },
      decrement({ value }) {
        if (!data.remaining) {
          return
        }

        data.remaining = data.remaining - 1;

        return merge(data)
      }
    }

    var model = {
      present({ action, value }) {
        if (!(action in steps)) {
          return
        }

        var data = steps[action]({ value })

        // Demonstrate the dependency on state.
        state.transition({ data })
      }
    }

    return model
  }

  // state.transition({ data })
  var state = function (view, action) {
    // Use this timeout to smooth out restart on click events.
    var timeout;

    var state = {
      transition({ data }) {
        clearTimeout(timeout)

        var representation = Object.assign({}, data)

        // Demonstrate the dependency on view.
        view.render({ data: representation })

        // remaining is a control state
        if (!data.remaining) {
          return
        }

        timeout = setTimeout(() => {
          // Demonstrate the dependency on action.
          action.next({ action: 'decrement', value: data.remaining })
        }, 1000)
      }
    }

    return state
  }

  var view = function (action) {
    // view.init() uses the register handler function.

    var view = {
      init(handler) {
        if (!handler) {
          return
        }

        // Enables multiple init() calls, even after document is ready.
        register(handler)
      },
      render({ data }) {
        // Modify the DOM with new data.
        var { from, remaining, progress } = data;
        var fixture = document.querySelector("#fixture")
        var time = fixture.querySelector("[remaining]")
        var meter = fixture.querySelector("[progress]")

        time.textContent = remaining

        if (meter.max != from) {
          meter.max = from
          meter.high = from - 1
        }

        meter.value = progress
      },
      on: {
        click({ value }) {
          // Demonstrate the dependency on action.
          action.next({ action: "reset", value })
        }
      }
    }

    return view
  }

  /* tests start here */

  describe("The define() function for dependency injection", () => {

    // Two example factories, a and b, depend on each other (thus we have a cycle).
    // They return the same kind of send and receive API containing closures over
    // their function name. The send() methods have access to their dependencies'
    // APIs.

    function a(b) {
      var name = a.name;
      return {
        send() { b.receive(`${name} says hi.`) },
        receive(msg) { console.log(`${msg} received by ${name}.`) }
      }
    }

    function b(a, c, d) {
      var name = b.name;
      return {
        send() { a.receive(`${name} says hi.`) },
        receive(msg) { console.log(`${msg} received by ${name}.`) },
        test() { c.test(), d.test() }
      }
    }

    it("binds dependencies from factory functions", () => {
      var app = define({ a, b })

      expect(app.a.send).to.be.a("function")
      expect(app.b.send).to.be.a("function")
    })

    it("provides object slots for missing dependencies", () => {
      var app = define({ a })

      expect(app.b).to.be.an("object")
    })

    it("accepts objects in place of factories", () => {
      var B = {
        tested: false,
        receive() { this.tested = "tested" }
      }

      var app = define({ a, b: B })

      app.a.send()

      expect(app.b.tested).to.equal("tested")
    })
  })

  describe("SAM pattern API", () => {

    describe("action.next()", () => {
      var sam = define({ action })

      it("calls model.present()", () => {
        sam.model.present = function (proposal) {
          expect(proposal.action).to.equal("test")
        }

        sam.action.next({ action: "test" })
      })

      it("expects an action and a value", () => {
        sam.model.present = function (proposal) {
          var { action, value } = proposal;

          expect(action).to.equal("test")
          expect(value).to.equal("tested")
        }

        sam.action.next({ action: "test", value: "tested" })
      })
    })

    describe("model.present()", () => {
      var sam = define({ model })

      it("calls state.transition()", () => {
        sam.state.transition = function ({ data }) {
          expect(data.remaining).to.equal(10)
        }

        sam.model.present({ action: "reset" })
      })

      it("ignores unrecognized action", () => {
        var called = false

        sam.state.transition = function ({ data }) {
          called = true
        }

        sam.model.present({ action: "bonk" })

        expect(called).to.equal(false)
      })
    })

    describe("state.transition()", () => {
      it("calls view.render()", () => {
        var sam = define({ state })

        sam.view.render = function ({ data }) {
          expect(data.remaining).to.equal(0)
        }

        sam.state.transition({ data: { remaining: 0 } })
      })

      it("calls action.next() if control state is not done (i.e., time remaining)", () => {
        var sam = define({ state })

        sam.view.render = function ({ data }) {
          expect(data.remaining).to.equal(1)
        }

        sam.action.next = function ({ action, value }) {
          expect(action).to.equal("decrement")
        }

        sam.state.transition({ data: { remaining: 1 } })
      })

      it("does not call action.next() if control state is done (i.e., no time remaining)", () => {
        var sam = define({ state })

        var called = "";

        sam.view.render = function ({ data }) {
          called = "render"
        }

        sam.action.next = function ({ action, value }) {
          throw new Error("should not be called")
        }

        sam.state.transition({ data: { remaining: 0 } })

        expect(called).to.equal("render")
      })
    })

    describe("view.init()", function () {
      it("expects a handler function...", (done) => {
        var sam = define({ view })

        var promise = Promise.resolve()

        var ok = () => {
          return 42
        }

        // does not throw
        sam.view.init()

        var handler = () => {
          promise.then(ok).then(result => {
            expect(result).to.equal(42)
            done()
          })
        }

        sam.view.init(handler)
      })

      it("...or a handler using the handleEvent interface", (done) => {
        var sam = define({ view })

        // does not throw
        sam.view.init({ handleEvent: {} })

        var handler = {
          promise: Promise.resolve(),
          ok: () => "OK",
          handleEvent: () => {
            handler.promise.then(handler.ok).then(result => {
              expect(result).to.equal("OK")

              done()
            })
          }
        }

        sam.view.init(handler)
      })
    })
  })

  describe("Countdown app", () => {
    var sam = define({ action, model, state, view })

    it("starts with view.init handler that calls action.next()", () => {
      sam.view.init(() => {
        sam.action.next({ action: "reset", value: "15" })

        // Enable users to re-start countdown from new T-minus time.
        document.querySelector("[restart]").closest("form").addEventListener("submit", (e) => {
          e.preventDefault()

          var input = e.target.querySelector("#t-minus")
          var value = input.value

          sam.view.on.click({ value })
        })
      })
    })

    it("can call view.init(fn) multiple times", function (done) {
      var count = 0;

      [1, 2, 3, 4, 5].forEach((next) => {
        sam.view.init(() => {
          count = count + 1
          expect(count).to.equal(next)

          if (count == 5) {
            done()
          }
        })
      })
    })
  })
});
