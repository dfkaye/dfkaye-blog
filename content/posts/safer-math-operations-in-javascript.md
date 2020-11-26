---
title: "Safer math operations in JavaScript (using TDD)"
date: 2020-08-17T11:01:43-07:00
lastmod: 2020-11-25T20:17:43-07:00
description: "In this post we examine my safe-math.js module that enables floating-point math operations that return results we expect, so that 0.1 + 0.2 adds up to 0.3, e.g."
tags:
- "functionally numeric"
- "floating-point"
- "JavaScript"
- "Math"
- "Safety"
- "TDD"

---

*{{< rawhtml >}}<time>22 November 2020</time>{{< /rawhtml >}}: This post has been completely rewritten and (one hopes) simplified.*

## Problem

Everybody and their aunt and uncle complains about floating-point arithmetic operations in JavaScript (among other programming languages) which occasionally return a surprising result, as in the following examples.

+ `0.1 + 0.2` should return `0.3` but actually returns `0.30000000000000004`.
+ `0.1 * 0.1` should return `0.01` but actually returns `0.010000000000000002`.
+ `0.1 - 0.3` should return `-0.2` but actually returns `-0.19999999999999998`.
+ `0.15 / 0.1` should return `1.5` but actually returns `1.4999999999999998`.

You can read more about the why's and wherefore's in [What Every Computer Scientist Should Know About Floating-Point Arithmetic](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html).

## Solution

The simplest solution to this problem is to convert the two operands of an operator to integer values by multiplying them with the exponent based on the length of the longer mantissa (decimal fraction), and dividing them by that exponent following the actual operation involved.

In other words, given `1.23 + 1.234`, we expand each by 10 to the power of 3 where 3 is the length of the longer mantissa (234), that is, `1230 + 1234`, with an exponent of 1000.

## The `expand` function

That was a mouthful. Here's a function I came up with that performs that expansion.

*Originally I created this in 2017 as a gist at https://gist.github.com/dfkaye/c2210ceb0f813dda498d22776f98d48a.*

```js
function expand(x, y) {
  // Object(value).valueOf() trick for "functionally numeric" objects.

  x = Object(x).valueOf();
  y = Object(y).valueOf();

  // Format strings and convert into numbers.

  var reCommas = /[\,]/g

  if (typeof x == "string") {
    x = +x.toString().replace(reCommas, '');
  }

  if (typeof y == "string") {
    y = +y.toString().replace(reCommas, '');
  }

  // Determine exponent based on largest mantissa length.

  var reDecimal = /[\.]/
  var a = reDecimal.test(x) && x.toString().split('.')[1].length
  var b = reDecimal.test(y) && y.toString().split('.')[1].length
  var c = a > b ? a : b
  var d = Math.pow(10, c)

  /*
   * Expand x and y to integer values multiplying by exponent, converting
   * non-numeric values to their numeric equivalent. For examples,
   *  {} becomes NaN,
   *  true becomes 1,
   *  [4] becomes '4' which becomes 4,
   * and so on.
   */

  return {
    left: x * d,
    right: y * d,
    exponent: d
  }
}
```

## Example

If we want to add 2 values, we pass the values to `expand()`, take the `left` and `right` fields from the result, add them, then divide the resulting sum by the `exponent` field.

Here's a simple `add` function that does that.

```js
function add(a, b) {
  var { left, right, exponent } = expand(a, b);

  return (left + right) / exponent;
}
```

## safe-math.js library

I've created a safe-math library of functions that utilize this expansion technique.

You can view the source of the safe-math module at https://github.com/dfkaye/safe-math/blob/main/safe-math.js.

## Test Suite

You can view the safe-math.js test suite running on this blog at [{{< baseurl >}}/demos/safe-math-test-suite/]({{< baseurl >}}/demos/safe-math-test-suite/).

## Interface

Every function in the library accepts any number of parameters as series data (either as arrays or as comma-delimited arguments).

- a single value param
- multiple value params - 2 or more values in a series
- an array of values - 1 or more values in a series

*Note, however, that the conversion functions (percent, reciprocal, square root,et al) process only the first parameter passed.*

You can pass anything, but only coercibly numeric values are processed, any `NaN`s are ignored.

- numbers and Number objects
- Number constants (e.g., `Number.POSITIVE_INFINITY`)
- scientific or exponential notation (i.e., `1.23e6`).
- negative values
- comma-formatted numeric strings (e.g., `"12,345.6789"`)
- String objects (`new String(12345)`, e.g.)
- boolean values and objects (where `true` and `false` convert to `1` and `0`, respectively)
- *functionally numeric* objects whose `valueOf()` method returns a number or numeric string, such as `{ valueOf() { return 0.1 } }`).

## API

As of November 25, 2020, the safe-math.js module exports the following functions.

### Operators

+ `add`, for safely adding numbers.
+ `minus`, for safely subtracting numbers.
+ `multiply`, for safely multiplying numbers.
+ `divide`, for safely dividing numbers.

### Calculations

+ `mean`, for safely calculating the average of a series of numbers.
+ `median`, for safely calculating the middle value of a series of numbers.
+ `mode`, for safely calculating the highest occurring numbers in a series. Note that function *always* returns an **Array**. If the incoming series is empty, an empty array is returned.
+ `range`, for safely calculating the difference between the largest and smallest values in a series. If there are less than two values in the series, then `0` is returned.

### Conversions


Most of the conversion functions process only the first or `value` argument rather than a series, whereas the `power` function requires two named arguments, `{ value, exponent }`.

+ `percent`, for safely calculating 1/100th of a value. If a percent cannot be calculated, the value is returned.
+ `power`, for safely calculating a value raised to an exponent. If a power cannot be calculated, the value is returned. If the value is not provided, an **Error** will be *thrown*. If the exponent is not provided, it is assigned 1 by default, to mitigate these cases with `Math.pow()`:
    - `Math.pow(9, undefined) => NaN`
    - `Math.pow(9, null) => 1`
    - `Math.pow(9, "") => 1`
    - `Math.pow(9, "  ") => 1`
  Finally, `power` delegates the calculation to `multiply` and not to `Math.pow` to avoid `Math.pow(1.1, 2)` which returns 1.2100000000000002 instead of 1.21.
+ `repricoal`, for safely calculating `1 / value`. If a reciprocal cannot be calculated, the value is returned. Function `reciprocal` delegates to `power`.
+ `square`, for safely multiplying a value by itself. If a square cannot be calculated, the value is returned. Function `square` delegates to `power`.
+ `sqrt`, for safely calculating the square root of a value. If a square root cannot be calculated, an **`Error`** is returned (*but not thrown*).

## Future plans

I plan to build a demos for a Calculator and a Spreadsheet with this library. As requirements and ability improve, I may add more functions to it.

There you have it.
