---
title: "Safer math operations in JavaScript (using TDD)."
date: 2020-08-17T11:01:43-07:00
description: "Use safe-math.js to work around the binary-decimal mismatch, so that 0.1 + 0.2 adds up to 0.3."
tags: 
  - "JavaScript"
  - "Math"
  - "Safety"
  - "TDD"
draft: false
---

## Contents

+ [Problem](#problem)
+ [Approach](#approach)
+ [Goals](#goals)
+ [Out of scope](#out-of-scope-for-now)
+ [First attempt](#first-attempt)
+ [Second attempt](#second-attempt) <time>18 August 2020</time>
+ [The `expand()` helper function](#the-expand-helper-function)
+ [Tests](#tests)
+ [Suite](#suite)

## Problem

Everybody and their aunt and uncle complains about certain math operations in certain computing languages. You are probably familiar with the addition operation, `0.1 + 0.2`, that returns a surprising result, `0.30000000000000004`. 

In this post we examine a `safe-math.js` module that enables safer math operations.

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

## First attempt 

The main idea {{< rawhtml >}}<del>is</del> <ins>was</ins>{{< /rawhtml >}} to apply an operation to a series of values. Below, `apply()` and `sum()` are functions, with sum being the operation:

    import { apply, sum, product } from "/js/lib/safe-math.js";

    var test = apply(sum, [1,2,3]);

    assert(test === 6);

That turned out to be inflexible and needlessly indirect, as I discovered when attempting to add an `avg()` function to the API. While refactoring, I found a couple of bugs, one in `expand()`, one in `avg()`, that I was able to fix quickly while running the suite in the browser.

## Second attempt

*<time>21 August 2020</time>: This section created with detail taken and modified from the previous section and the test suite.*

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

### Two things to note

1. The `getValues()` function filters by `isNumeric()`, a helper that returns only coercible "functionally numeric" values. Here's what `isNumeric()` looks like:

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

2. The `sum()` function reduces each "current, next" value pair, first passing these to the `expand()` function

## The `expand()` helper function

*Originally I created this in 2017 as a gist at https://gist.github.com/dfkaye/c2210ceb0f813dda498d22776f98d48a.*

The brains behind the whole operation is the `expand()` function, a helper that returns a coerced left & right number pair, plus an expansion factor (named "by" for the moment).

The function measure's each value's decimal length and uses the larger of the two to create the expansion factor. The function then returns an object containing each value multiplied by the expansion factor, meaning that both are integers instead of floating point numbers, along with the expansion factor itself for use by the client to restore the decimal (dividing the result by it in the case of `sum()` or by the square of it in the case of `product()`).

Here's the `expand()` function.

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

{{< rawhtml >}}
There is more to cover, but I'll stop here. You can view the source of the safe-math module at <a href="/js/lib/safe-math.js">/js/lib/safe-math.js</a>.
{{< /rawhtml >}}

## Tests

The test suite gives you an idea how to use the safe-math module. At the high level, the tests are laid out like this:

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

## Suite

You can visit the demo [test suite for safe-math.js](/demos/safe-math-test-suite/).
