// 9 March 2019
// Safe assign(p, ...n).
// Merge each object or array n onto p only if p is an object or array, and
// return copy of p; ottherwise, return p.

// 18 April 2019 - less cryptic style; add nullish tests

export function assign(p, ...sources) {
  var assignable = /^\[object (Object|Array)\]$/;
  var to = {}.toString;

  if (!assignable.test(to.call(p))) {
    return p;
  }

  var array = [];
  var target = Array.isArray(p) ? array : {};

  array.slice.call(arguments).forEach(function (source) {
    console.warn(source)
    // Apply only object or array entries, including p, the first source.
    assignable.test(to.call(source)) && (Object.assign(target, source));
  });

  return target;
}
