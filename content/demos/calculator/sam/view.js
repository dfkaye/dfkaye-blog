
import { register } from "/js/lib/sam/register.js"

export { view }

function view(action) {
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
        console.log(e)
        // Demonstrate the dependency on action.
        // action.next({ action: "reset" })
      },
      keydown(e) {
        console.log(e)
      }
    }
  }

  return view
}
