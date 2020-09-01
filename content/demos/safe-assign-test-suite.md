---
title: "Test suite: Safe assign wrapper for Object.assign()."
date: 2020-08-21T11:56:43-07:00
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
- https://unpkg.com/fast-check@1.26.0/lib/bundle.js
- /js/demos/mocha-setup.js
- /js/demos/safe-assign/suite.js
- /js/demos/mocha-run.js
---

This demo contains a test suite using mocha, chai, module-type scripts, and ES2016 import/export syntax all within [Hugo](https://gohugo.io) to develop a working module.

{{< rawhtml >}}
You can view the source of the test suite at <a href="/js/demos/safe-assign/suite.js">/js/demos/safe-assign/suite.js</a>.
{{< /rawhtml >}}

## Suite

Click on test names in the report below to display each assertion.

{{< rawhtml >}}
<div id="fixture"></div>
<div id="mocha"></div>
{{< /rawhtml >}}
