
export { define }

// 10 December 2020

// This is a simple example of binding cyclic dependencies into an API object.
// It is not intended as a framework or even a library for re-use, but only to
// illustrate the pattern that emerges when we use factory functions to create
// objects (or return other functions). It allows us to create them independently,
// so they don't need to import each other, and to bind them at a later time.

// There is still a testing story to be filled out which I defer for now.

// 28 December 2020 testing update:
// 1. Added "mock" without dependencies to verify 0-dep works.
// 2. Verified we can extend a missing dependency after creation.

// We'll use `define()` as the injection function (the name is subject to revision).
// The param, factories, is an object containing factory functions.
// Each factory accepts any number of dependencies.
// Each factory returns an object containing methods.
// `define()` returns an object containing all the returned factory objects.

function define(factories) {
  var api = {/* This is what will return. */ }

  // Non-object coercion to an object so we don't iterate keys on null, undefined, or worse.
  factories = Object(factories)

  Object.keys(factories).forEach(key => {
    var F = factories[key];

    // Add the slot for the factory if it hasn't been defined on the api yet.
    var slot = key in api ? api[key] : (api[key] = {})

    if (typeof F != 'function') {
      // If the factory is not a function, map its keys onto the slot, and stop processing F.
      return Object.assign(slot, F)
    }

    // This is a trick that Angular v1 and require.js use to create an array of
    // objects mapped to each param name, so that function a(b, c, d) {...} will
    // be parsed to an array, as in `[ api["b"], api["c"], api["d"] ]`.

    var dependencies = F.toString()

      // match "b, c, d" from "function a(b, c, d)"
      .match(/[\(]([^\)]*)[\)]/)[1]

      // split "b, c, d" into ["b", " c", " d"]
      .split(",")

      // map ["b", " c", " d"] into [api["b"], api["c"], api["d"]]
      .map(k => {
        var n = k.trim()

        // Add a slot for the dependency if it hasn't been defined on the api yet.
        n in api || (api[n] = {})

        return api[n]
      })

    // Apply the factory function with its array of dependencies.
    Object.assign(slot, F.apply(void 0, dependencies))
  })

  return api
}
