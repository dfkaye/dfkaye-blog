
export { state }

function state(view, action) {
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
