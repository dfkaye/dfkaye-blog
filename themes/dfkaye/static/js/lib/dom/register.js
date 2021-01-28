export { register }

// Enables multiple init() calls, even after document is ready.

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

/*
// Need to think this through better.

export { dom }

function dom(selector) {
  var root = selector
    ? document.querySelector(selector)
    : document;

  var events = {
    pausing: false
  }

  function ready(handler) {
    typeof handler.handleEvent == "function"
      ? handler.handleEvent.call(handler)
      : typeof handler == "function"
        ? handler.call(document)
        : 0;
  }

  function remove(h) {
    root.querySelector(h.selector)
      .removeEventListener(h.type, h.handler)
  }

  function restore(h) {
    root.querySelector(h.selector)
      .addEventListener(h.type, h.handler)
  }

  var dom = {
    init(handler) {
      if (typeof handler != 'function' && typeof handler.handleEvent != "function") {
        return;
      }

      function onReadyStateChange() {
        if (document.readyState == "complete") {
          ready(handler);
          return true
        }
      }

      onReadyStateChange() || (
        document.addEventListener('readystatechange', onReadyStateChange, { once: true })
      )
    },
    on({ type, selector, handler }) {
      // Object(type).toString() === type
      // Object(selector).toString() === selector
      // Object(handler).valueOf()

      if (typeof handler != 'function' && typeof handler.handleEvent != "function") {
        return;
      }

      var e = events[type] || (events[type] = [])

      e.push({ selector, handler })

      var element = selector
        ? root.querySelector(selector)
        : root;

      element.addEventListener(type, handler)
    },
    pause(type) {
      var handlers = (events[type] || events).pausing;

      if (handlers.pausing) {
        return
      }

      handlers.pausing = true

      if (type) {
        return handlers.forEach(remove) & true
      }

      // else remove all event handlers
      Object.keys(events).forEach(type => {
        events[type].forEach(remove)
      })
    },
    resume(type) {
      var handlers = (events[type] || events).pausing;

      if (handlers.pausing) {
        return
      }

      handlers.pausing = false

      if (type) {
        return handlers.forEach(restore) & true
      }

      // else restore all event handlers
      Object.keys(events).forEach(type => {
        events[type].forEach(restore)
      })
    },
    select(selector) {
      return root.querySelector(selector)
    }
  }

  return dom
}
*/

/*
import { dom } from "dom.js"

function view(action) {
  var dom = dom()

  var view = {
    init(h) {
      dom.init(h)
    },
    pause(type) {
      dom.pause(type)
      action.next({ action: "pause" })
    },
    resume(type) {
      dom.resume(type)
      action.next({ action: "resume" })
    },
    render(data) {
      dom.select(selectors.name).textContent = data.textContent;
    },
    traverse(e) {

    }
  }

  return view
}
 */
