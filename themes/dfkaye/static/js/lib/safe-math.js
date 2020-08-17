// Our safer math helper against 0.1 + 0.2 (0.30000000000000004),
// 0.1 * 0.1 (0.010000000000000002), and so on.

export function apply(fn, ...values) {
  if (Array.isArray(values[0])) {
    values = values[0];
  }

  return values.reduce(fn);
};

export function sum(a, b) {
  var { left, right, by } = expand(a, b);

  return (left + right) / by;
}

export function product(a, b) {
  var { left, right, by } = expand(a, b);

  return (left * right) / (by * by);
}

// https://gist.github.com/dfkaye/c2210ceb0f813dda498d22776f98d48a
// `expand()` is a helper function that returns a coerced left & right number pair,
// plus an expansion factor.
function expand(left, right) {
  // valueOf() trick for "functionally numeric" objects.
  left = Object(left).valueOf();
  right = Object(right).valueOf();

  // coerce to strings to numbers (and remove formatting commas)
  let reMatch = /string/
  let reCommas = /[\,]/g

  reMatch.test(typeof left) && (left = +left.toString().replace(reCommas, ''))
  reMatch.test(typeof right) && (right = +right.toString().replace(reCommas, ''))

  // expand to integer values based on largest mantissa length
  let reDecimal = /[\.]/
  let ml = reDecimal.test(left) && left.toString().split('.')[1].length
  let mr = reDecimal.test(right) && right.toString().split('.')[1].length
  let pow = ml > mr ? ml : mr
  let by = Math.pow(10, pow)

  // left & right number pair, plus the expansion factor.
  // The multiplication operator, *, coerces non-numerics to their equivalent,
  // e.g., {} => NaN, true => 1, [4] => '4' => 4      
  return { left: left * by, right: right * by, by }
}
