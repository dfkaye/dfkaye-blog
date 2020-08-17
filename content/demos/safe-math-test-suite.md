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

Originally I created this in 2017 as a gist at https://gist.github.com/dfkaye/c2210ceb0f813dda498d22776f98d48a.

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

The main idea is to apply an operation to a series of values. Below, `apply()` and `sum` are functions, with sum being the operation:

    import { apply, sum, product } from "/js/lib/safe-math.js";

    var test = apply(sum, [1,2,3]);

    assert(test === 6);

Here are the `apply()` and `sum` functions:

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

The brains behind the whole operation is `expand()` function (note call in the `sum()` function). `expand` is a helper that returns a coerced left & right number pair, plus an expansion factor.

{{< rawhtml >}}
You can view the source of the safe-math module at <a href="/js/lib/safe-math.js">/js/lib/safe-math.js</a>.
{{< /rawhtml >}}

## Tests

The suite starts like this:

    import { apply, sum, product } from "/js/lib/safe-math.js";

    describe("Math.apply", function () {

      var assert = chai.assert;

      it('adds 0.1 + 0.2 to get 0.3', () => {
        var actual = apply(sum, [0.1, 0.2]);

        assert(actual === 0.3);
      });

      it("multiplies 0.1 * 0.1 to get 0.01", () => {
        var actual = apply(product, [0.1, 0.1]);

        assert(actual === 0.01);
      });

      /* and so on */
    });

{{< rawhtml >}}
You can view the source of the test suite at<a href="/js/demos/safe-math/suite.js">/js/demos/safe-math/suite.js</a>.
{{< /rawhtml >}}

## Suite

Click on test names in the report below to display each assertion.

{{< rawhtml >}}
<div id="fixture"></div>
<div id="mocha"></div>
{{< /rawhtml >}}
