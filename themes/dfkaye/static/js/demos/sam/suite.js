import { Sam } from "/js/lib/sam.js";

describe("Sam pattern Countdown demo", function () {

  var expect = chai.expect;

  /*
   * This suite demonstrates a minimal API required for a SAM application, and
   * support for user events. The Countdown consists of four factory functions:
   * state, action, model, and view. The Sam function takes all four, creates
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
        model.propose({ action, value })
      }
    }

    return action
  }

  // model.propose({ action: 'reset', value: 'any' })
  // model.propose({ action: 'decrement', value: 'any' })
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
      propose({ action, value }) {
        var data = steps[action]({ value })

        // Demonstrate the dependency on state.
        state.change({ data })
      }
    }

    return model
  }

  // state.change({ data })
  var state = function (view, action) {
    // Use this timeout to smooth out restart on click events.
    var timeout;

    var state = {
      change({ data }) {
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
    function register(handler) {
      if (typeof handler != 'function' && typeof handler.handleEvent != "function") {
        return;
      }

      function onReadyStateChange() {
        if (document.readyState == "complete") {
          exec(handler);
          return true
        }
      }

      onReadyStateChange() || (
        document.addEventListener('readystatechange', onReadyStateChange, { once: true })
      )
    }

    function exec(handler) {
      typeof handler.handleEvent == "function"
        ? handler.handleEvent.call(handler)
        : typeof handler == "function"
          ? handler.call(document)
          : 0;
    }

    var view = {
      init(handler) {
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
        meter.max = from
        meter.high = from - 1
        meter.value = progress
      },
      on: {
        click(e) {
          // Demonstrate the dependency on action.
          action.next({ action: "reset" })
        }
      }
    }

    return view
  }

  /* tests start here */

  describe("Sam function dependency injection", () => {
    it("Creates instance from other factory functions", () => {
      var sam = Sam({ action, model, state, view })

      // action
      expect(sam.action.next).to.be.a("function")
      // model
      expect(sam.model.propose).to.be.a("function")
      // state
      expect(sam.state.change).to.be.a("function")
      // view
      expect(sam.view.render).to.be.a("function")
      expect(sam.view.render).to.be.a("function")
    })

    it("Replaces missing dependencies with empty objects", () => {
      var sam = Sam({ action, model })

      expect(sam.state).to.be.an("object")

      // state is an empty object because the factory function is not provided.
      expect(Object.keys(sam.state).length).to.equal(0)

      // view is a dependency of state whose factory is not provided, so...
      expect(sam.view).to.be.undefined
    })
  })

  describe("Countdown app", () => {
    var sam = Sam({ action, model, state, view })

    it("Starts with view.init(fn) call", () => {
      sam.view.init(() => {
        sam.action.next({ action: "reset", value: "15" })

        // Enable our auditors to click anywhere to re-start the countdown.
        document.body.addEventListener("click", sam.view.on.click)
      })
    })

    it("OK to call view.init(fn) multiple times", function (done) {
      var count = 0;

      [1, 2, 3, 4, 5].forEach((next) => {
        sam.view.init(() => {
          count = count + 1
          expect(count).to.equal(next)
        })
      })

      done()
    })
  })
});
