---
title: "Wheredoc Test Suite"
date: 2020-12-02T12:36:59-08:00
lastmod: 2020-12-02T12:36:59-08:00
description: "Test suite for wheredoc data table testing module."
tags:
- "TDD"
- "JavaScript"

# load styles and scripts in strict order

styles: 
- https://unpkg.com/mocha/mocha.css
- /css/demos/mocha-css-override.css

scripts: 
- https://unpkg.com/mocha/mocha.js
- https://unpkg.com/chai/chai.js
- /js/demos/mocha-setup.js
- https://unpkg.com/wheredoc@0.0.7/test/suite.js
- /js/demos/mocha-run.js
---

This demo contains the test suite I used to drive the wheredoc.js module described in my *soon-to-be-published* post on [Data-driven testing]() - link reloads this page.

<!--[Data-driven testing](/posts/2020/08/17/safer-math-operations-in-javascript-using-tdd/).-->

The suite uses [mocha.js](https://mochajs.org/), [chai.js](https://www.chaijs.com/), module-type scripts, and ES2016 import/export syntax, and is served up by [Hugo](https://gohugo.io).

You can view the source of the test suite at https://github.com/dfkaye/wheredoc/blob/main/test/suite.js.

## Suite

Click on test names in the report below to display each assertion.

{{< rawhtml >}}
<div id="fixture"></div>
<div id="mocha"></div>
{{< /rawhtml >}}
