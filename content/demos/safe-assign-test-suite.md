---
title: "Test suite: Safe assign wrapper for Object.assign()"
date: 2020-08-21T11:56:43-07:00
lastmod: 2020-09-07T17:37:41-07:00
description: "Test suite for safe-assign.js module."
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
- /js/demos/safe-assign/suite.js
- /js/demos/mocha-run.js
---

This demo contains the test suite I used to drive the safe-assign.js module described in my post on [Safer Object.assign() operations](/posts/2020/08/21/safer-object.assign-operations-using-a-sensible-wrapper/).

The suite uses [mocha.js](https://mochajs.org/), [chai.js](https://www.chaijs.com/), module-type scripts, and ES2016 import/export syntax, and is served up by [Hugo](https://gohugo.io).

You can view the source of the test suite at [{{< baseurl >}}/js/demos/safe-assign/suite.js]({{< baseurl >}}/js/demos/safe-assign/suite.js).

## Suite

Click on test names in the report below to display each assertion.

{{< rawhtml >}}
<div id="fixture"></div>
<div id="mocha"></div>
{{< /rawhtml >}}
