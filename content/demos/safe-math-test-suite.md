---
title: "Test suite: Safer math operations in JavaScript."
date: 2020-08-17T11:01:43-07:00
lastmod: 2020-09-07T17:37:41-07:00
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
- /js/demos/safe-math/suite.js
- /js/demos/mocha-run.js
---

This demo contains a test suite using mocha, chai, module-type scripts, and ES2016 import/export syntax all within [Hugo](https://gohugo.io) to develop a working module.

{{< rawhtml >}}
You can view the source of the test suite at <a href="/js/demos/safe-math/suite.js">/js/demos/safe-math/suite.js</a>.
{{< /rawhtml >}}

## Suite

Click on test names in the report below to display each assertion.

{{< rawhtml >}}
<div id="fixture"></div>
<div id="mocha"></div>
{{< /rawhtml >}}
