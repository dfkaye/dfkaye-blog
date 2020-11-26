---
title: "Test suite: Safer math operations in JavaScript"
date: 2020-08-17T11:01:43-07:00
lastmod: 2020-11-25T22:21:41-07:00
description: "Test suite for safe-math.js module."
tags:
- "TDD"
- "JavaScript"
- "Safety"

# load styles and scripts in strict order

styles: 
- https://unpkg.com/mocha/mocha.css
- /css/demos/mocha-css-override.css

scripts: 
- https://unpkg.com/mocha/mocha.js
- https://unpkg.com/chai/chai.js
- /js/demos/mocha-setup.js
- https://unpkg.com/@dfkaye/safe-math@0.0.12/test/browser-suite.js
- /js/demos/mocha-run.js
---

This demo contains the test suite I used to drive the safe-math.js module described in my post on [Safer Math operations](/posts/2020/08/17/safer-math-operations-in-javascript-using-tdd/).

The suite uses [mocha.js](https://mochajs.org/), [chai.js](https://www.chaijs.com/), module-type scripts, and ES2016 import/export syntax, and is served up by [Hugo](https://gohugo.io).

You can view the source of the test suite at https://github.com/dfkaye/safe-math/blob/main/test/browser-suite.js.

## Suite

Click on test names in the report below to display each assertion.

{{< rawhtml >}}
<div id="fixture"></div>
<div id="mocha"></div>
{{< /rawhtml >}}
