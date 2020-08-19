// Our safer math helper against 0.1 + 0.2 (0.30000000000000004),
// 0.1 * 0.1 (0.010000000000000002), and so on.

export function sum(...values) {
  return getValues(...values).reduce(function (current, next) {
    var { left, right, by } = expand(current, next);

    return (left + right) / by;
  }, 0);
}

export function product(...values) {
  return getValues(...values).reduce(function (current, next) {
    var { left, right, by } = expand(current, next);

    return (left * right) / (by * by);
  }, 1);
}

export function avg(...values) {
  var size = 0;

  var result = getValues(...values).reduce(function (current, next) {
    // Expand only next value.
    var e = expand(next);

    /*
     * If next is a number, call sum() and increment the set size.
     * Else just return current sum.
     */

    return +e.left === +e.left
      ? (size += 1, sum(current, next))
      : current;
  }, size);

  return size > 0
    ? result / size
    : size;
}

// apply() repurposed to get values
// and filter out the functionally non-numeric values.
function getValues(...values) {
  if (Array.isArray(values[0])) {
    values = values[0];
  }

  return values.filter(isNumeric);
}

// @returns {boolean} true if the value is "functionally numeric"
// (valueOf() returns number).
function isNumeric(a) {
  // If it's a string, remove commas and trim it.
  // Otherwise wrap it in its type with Object() and get the value.
  var v = /^string/.test(typeof a)
    ? a.replace(/[,]/g, '').trim()
    : Object(a).valueOf();

  // Not NaN, null, undefined, or the empty string.
  var reNan = /^(NaN|null|undefined|)$/;
  return !reNan.test(v);
}

// https://gist.github.com/dfkaye/c2210ceb0f813dda498d22776f98d48a
// `expand()` is a helper function that returns a coerced left & right number pair,
// plus an expansion factor.
function expand(left, right) {
  // valueOf() trick for "functionally numeric" objects.
  left = Object(left).valueOf();
  right = Object(right).valueOf();

  // coerce to strings to numbers (and remove formatting commas)
  var reMatch = /string/
  var reCommas = /[\,]/g

  if (reMatch.test(typeof left)) {
    left = +left.toString().replace(reCommas, '');
  }

  if (reMatch.test(typeof right)) {
    right = +right.toString().replace(reCommas, '');
  }

  // expand to integer values based on largest mantissa length
  var reDecimal = /[\.]/
  var ml = reDecimal.test(left) && left.toString().split('.')[1].length
  var mr = reDecimal.test(right) && right.toString().split('.')[1].length
  var pow = ml > mr ? ml : mr
  var by = Math.pow(10, pow)

  // left & right number pair, plus the expansion factor.
  // The multiplication operator, *, coerces non-numerics to their equivalent,
  // e.g., {} => NaN, true => 1, [4] => '4' => 4      
  return { left: left * by, right: right * by, by }
}
