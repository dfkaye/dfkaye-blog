
export { Sam }

/**
 * 
 * @param {{ action: function, model: function, state: function, view: function }} entries 
 * @returns {object} sam instance
 */
function Sam(entries) {
  var api = {/* This is what will return. */ }

  // Non-object coercion to an object so we don't iterate keys on null, undefined, or worse.
  var fns = Object(entries)

  Object.keys(fns).forEach(key => {
    var fn = fns[key]

    // This is a trick that Angular v1 used to create an array of objects mapped to each
    // param name, so that function a(b, c, d) {...} will be parsed to an array,
    // [api["b"], api["c"], api["d"]].

    var dependencies = fn.toString()

      // match "b, c, d" from "function a(b, c, d)"
      .match(/[\(]([^\)]*)[\)]/)[1]

      // split "b, c, d" into ["b", " c", " d"]
      .split(",")

      // map ["b", " c", " d"] into [api["b"], api["c"], api["d"]]
      .map(k => {
        var n = k.trim()

        // If a slot for the dependency hasn't been defined as an object on the api, add it.
        n in api || (api[n] = {})

        return api[n]
      })

    // If the slot hasn't been defined as an object on the api, add it.
    key in api || (api[key] = {})

    // Apply the factory function with its array of dependencies.
    Object.assign(api[key], fn.apply(void 0, dependencies))
  })

  return api
}
