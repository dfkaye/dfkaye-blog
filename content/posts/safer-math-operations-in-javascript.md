---
title: "Safer math operations in JavaScript (using TDD)"
date: 2020-08-17T11:01:43-07:00
lastmod: 2020-10-18T20:17:28-07:00
description: "In this post we examine my safe-math.js module that enables floating-point math operations that return results we expect, so that 0.1 + 0.2 adds up to 0.3, e.g."
tags: 
- "JavaScript"
- "Math"
- "Safety"
- "TDD"

---

## Contents

+ [Problem](#problem)
+ [Approach](#approach)
+ [Goals](#goals)
+ [Out of scope](#out-of-scope-for-now)
+ [First attempt](#first-attempt)
+ [Second attempt](#second-attempt) {{< rawhtml >}}<time>18 August 2020</time>{{< /rawhtml >}}
+ [The `expand()` helper function](#the-expand-helper-function)
+ [Library functions so far](#library-functions-so-far) {{< rawhtml >}}<time>18 October 2020</time>{{< /rawhtml >}}
+ [Tests](#tests)
+ [Suite](#suite)

## Problem

Everybody and their aunt and uncle complains about floating-point arithmetic operations in JavaScript (among other programming languages) which occasionally return a surprising result, as in the following table.

| operation | expected | actual |
| --------- | -------- | ------- |
| 0.1 + 0.2 |  0.3     |  0.30000000000000004 |
| 0.1 * 0.1 |  0.01    |  0.010000000000000002 |
| 0.1 - 0.3 | -0.2     | -0.19999999999999998 |
| 0.15 / 0.1|  1.5     |  1.4999999999999998 |

You can read more about the why's and wherefore's in [What Every Computer Scientist Should Know About Floating-Point Arithmetic](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html).

## Approach

- Use TDD while running `hugo server` locally to develop the tests and modules.
  - This turned out to be a pleasant experience. [Hugo](https://gohugo.io) rebuilds and reloads the demo page very quickly. It is very much like running a test page with [live-server](https://github.com/tapio/live-server), e.g.
- Use mocha, chai, module-type scripts, and ES2016 import/export syntax.
  - Using `<script type="module">` even for remote scripts from another domain *works right now.* This makes it a snap to create an ES2016 module locally.

## Goals
- 0.1 + 0.2 should return 0.3 instead of 0.30000000000000004.
- 0.1 * 0.1 should return 0.01 instead of 0.010000000000000002.
- 0.1 - 0.3 should return -0.2 instead of -0.19999999999999998.
- 0.15 / 0.1 should return 1.5 instead of 1.4999999999999998.
- Should take a single value argument.
- Should take multiple value arguments (i.e., more than 2).
- Should accept a values array argument (i.e., a series of values).
- Should accept scientific or exponential notation (i.e., 1.23e6).
- Should accept negative values.
- Should accept comma-formatted numeric strings.
- Should accept String objects.
- Should accept booleans as 1 and 0.
- Should accept *any* "functionally numeric" objects (for example: `{ valueOf() { return 0.1 } }`).

## Out of Scope for now

- Handling localized currency values, percentages, etc. (i.e., "unformatting").

## First attempt 

The main idea {{< rawhtml >}}<del>is</del> <ins>was</ins>{{< /rawhtml >}} to apply an operation to a series of values. Below, `apply()` and `sum()` are functions, with sum being the operation:

```js
import { apply, sum, product } from "/js/lib/safe-math.js";

var test = apply(sum, [1,2,3]);

assert(test === 6);
```

That turned out to be inflexible and needlessly indirect, as I discovered when attempting to add an `avg()` function to the API. While refactoring, I found a couple of bugs, one in `expand()`, one in `avg()`, that I was able to fix quickly while running the suite in the browser.

## Second attempt

*<time>21 August 2020</time>: This section created with detail taken and modified from the previous section and the test suite.*

The `apply()` function has been renamed `getValues()` and instead of `apply()` calling `sum()` as the reducing function on the given values, `sum()` calls `getValues()` and reduces that to the result.

Here they are before refactoring:

```js
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
```

And after:

```js
function getValues(...values) {
  if (Array.isArray(values[0])) {
    values = values[0];
  }

  return values.filter(isNumeric).sort((a, b) => {
    if (a < b) {
      return -1
    }

    if (a > b) {
      return 1;
    }

    return 0;
  });
}

export function sum(...values) {
  return getValues(...values)
    .reduce(function (current, next) {
      var { left, right, by } = expand(current, next);

      return (left + right) / by;
    }, 0);
}
```

### Two things to note

1. The `getValues()` function filters by `isNumeric()`, a helper that returns only coercible "functionally numeric" values. Here's what `isNumeric()` looks like:

```js
function isNumeric(a) {

  /*
   * If it's a string, remove commas and trim it.
   * Otherwise take the value.
   */

  var v = /^string/.test(typeof a)
    ? a.replace(/[,]/g, '').trim()
    : a;

  /*
   * Test and return whether value is not NaN, null, undefined, or an empty
   * string,
   */

  var reNan = /^(NaN|null|undefined|)$/;

  return !reNan.test(v);
}
```

2. The `sum()` function reduces each `<current, next>` value pair, first passing these to the `expand()` function

## The `expand()` helper function

*Originally I created this in 2017 as a gist at https://gist.github.com/dfkaye/c2210ceb0f813dda498d22776f98d48a.*

The brains behind the whole operation is the `expand()` function, a helper that returns a coerced `<left, right>` number pair, plus an expansion factor (named "by" for the moment).

The function measure's each value's decimal length and uses the larger of the two to create the expansion factor. The function then returns an object containing each value multiplied by the expansion factor, meaning that both are integers instead of floating point numbers, along with the expansion factor itself for use by the client to restore the decimal (dividing the result by it in the case of `sum()` or by the square of it in the case of `product()`).

Here's the `expand()` function.

```js
function expand(left, right) {
  // valueOf() trick for "functionally numeric" objects.
  left = Object(left).valueOf();
  right = Object(right).valueOf();

  // coerce to strings to numbers (and remove formatting commas)
  var reMatch = /string/
  var reCommas = /[\,]/g

  if (reMatch.test(typeof left)) {
    left = +left.toString()
      .replace(reCommas, '');
  }

  if (reMatch.test(typeof right)) {
    right = +right.toString()
      .replace(reCommas, '');
  }

  // expand to integer values based on largest mantissa length.
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
```

## Library functions so far

In all, the safe-math.js module exports the following functions which accept any number of parameters as series data (arrays or comma-delimited).

+ `sum`, for safely adding numbers.
+ `product`, for safely multiplying numbers.
+ `mean`, for safely calculating the average of a series of numbers.
+ `median`, for safely calculating the middle value of a series of numbers.
+ `mode`, for safely calculating the highest occurring numbers in a series. Note that function always returns an array. If the incoming series is empty, an empty array is returned.
+ `range`, for safely calculating the difference between the largest and smallest values in a series. If there are less than two values in the series, then 0 is returned.

You can view the source of the safe-math module at [{{< baseurl >}}js/lib/safe-math.js]({{< baseurl >}}js/lib/safe-math.js).

## Tests

The test suite gives you an idea how to use the safe-math module. At the high level, the tests are laid out like this:

```js
import { sum, product, avg } from "/js/lib/safe-math.js";

describe("safe-math", function () {
  var assert = chai.assert;

  describe("sum", function () {
    it('adds 0.1 + 0.2 to get 0.3', () => {
      var actual = sum([0.1, 0.2]);
      assert(actual === 0.3);
    });
  });

  describe("product", function () {
    it("multiplies 0.1 * 0.1 to get 0.01", () => {
      var actual = product([0.1, 0.1]);
      assert(actual === 0.01);
    });
  });
  
  describe("avg", function () {
    it("returns average value of a series", () => {
      var actual = avg([1, 2, 3, 4]);
      assert(actual === 2.5);
    });
  });

  /* and so on */
});
```

## Suite

You can visit the safe-math.js test suite running at [{{< baseurl >}}demos/safe-math-test-suite/]({{< baseurl >}}demos/safe-math-test-suite/).
