---
title: "Test suite: Safer math operations in JavaScript."
date: 2020-08-17T11:01:43-07:00
description: "Test suite for safer math operations in JavaScript."
draft: false

# load styles and scripts in strict order

styles: 
- https://unpkg.com/mocha/mocha.css
- /css/demos/mocha-css-override.css

scripts: 
- https://unpkg.com/mocha/mocha.js
- https://unpkg.com/chai/chai.js
- https://unpkg.com/fast-check@1.26.0/lib/bundle.js
- /js/demos/mocha-setup.js
- /js/demos/safe-math/suite.js
- /js/demos/mocha-run.js
---

This demo contains a test suite using mocha, chai, module-type scripts, and ES2016 import/export syntax all within [Hugo](https://gohugo.io) to develop a working module.

*<time>18 August 2020</time>: This demo has been refactored. For details, scroll to the [Update](#Update) section.*

## Contents

+ [Suite](#suite)
+ [Approach](#approach)
+ [Goals](#goals)
+ [Out of scope](#out-of-scope-for-now)
+ [Module](#module)
+ [Update](#update) <time>18 August 2020</time>
+ [The `expand()` helper function](#the-expand-helper-function)
+ [Tests](#tests)

## Suite

Click on test names in the report below to display each assertion.

{{< rawhtml >}}
<div id="fixture"></div>
<div id="mocha"></div>
{{< /rawhtml >}}

## Approach

- Use TDD while running `hugo server` locally to develop the tests and modules.
  - This turned out to be a pleasant experience. [Hugo](https://gohugo.io) rebuilds and reloads the demo page very quickly. It is very much like running a test page with [live-server](https://github.com/tapio/live-server), e.g.
- Use mocha, chai, module-type scripts, and ES2016 import/export syntax.
  - Using `<script type="module">` even for remote scripts from another domain *works right now.* This makes it a snap to create an ES2016 module locally.

## Goals
- 0.1 + 0.2 should return 0.3 instead of 0.30000000000000004.
- 0.1 * 0.1 should return 0.01 instead of 0.010000000000000002.
- Should take a single value argument.
- Should take multiple value arguments (i.e., more than 2).
- Should accept a values array argument (i.e., a series of values).
- Should accept booleans as 1 and 0.
- Should accept *any* "functionally numeric" objects (for example: `{ valueOf() { return 0.1 } }`).

## Out of Scope for now

- Handling localized currency values, percentages, etc. (i.e., "unformatting").

## Module 

The main idea {{< rawhtml >}}<del>is</del><ins>was</ins>{{< /rawhtml >}} to apply an operation to a series of values. Below, `apply()` and `sum()` are functions, with sum being the operation:

    import { apply, sum, product } from "/js/lib/safe-math.js";

    var test = apply(sum, [1,2,3]);

    assert(test === 6);

## Update

*<time>18 August 2020</time>: This section created with detail taken and modified from the previous section.*

In trying to add an `avg()` function to the module, I found the "apply" strategy to be indirect and called in the wrong order. I also found a couple of bugs, one in `expand()`, one in `avg()`, and was able to fix them quickly while running the suite in the browser.

The `apply()` function has been renamed `getValues()` and instead of `apply()` calling `sum()` as the reducing function on the given values, `sum()` calls `getValues()` and reduces that to the result.

Here they are before refactoring:

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

And after:

    function getValues(...values) {
      if (Array.isArray(values[0])) {
        values = values[0];
      }

      return values.filter(isNumeric);
    }

    export function sum(...values) {
      return getValues(...values)
        .reduce(function (current, next) {
          var { left, right, by } = expand(current, next);
          return (left + right) / by;
        }, 0);
    }

Note that `getValues()` filters by `isNumeric()`. Here's what that looks like:

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

## The `expand()` helper function

*Originally I created this in 2017 as a gist at https://gist.github.com/dfkaye/c2210ceb0f813dda498d22776f98d48a.*

The brains behind the whole operation is the `expand()` function (note call in the `sum()` function). `expand()` is a helper that returns a coerced left & right number pair, plus an expansion factor.

Here's the `expand()` function:

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

{{< rawhtml >}}
You can view the source of the safe-math module at <a href="/js/lib/safe-math.js">/js/lib/safe-math.js</a>.
{{< /rawhtml >}}

## Tests

The test suite is laid out like this:

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

{{< rawhtml >}}
You can view the source of the test suite at<a href="/js/demos/safe-math/suite.js">/js/demos/safe-math/suite.js</a>.
{{< /rawhtml >}}
