---
title: "Demo: Calculator App built with the SAM pattern"
date: 2020-12-19T15:31:27-08:00
lastmod: 2020-12-19T15:31:27-08:00
description: "Accessible calculator built with the SAM pattern."

draft: false

tags:
- "SAM pattern"
- "Accessibility"

# load styles and scripts in strict order

styles:
- https://unpkg.com/mocha/mocha.css
- /css/demos/mocha-css-override.css

- ./calculator.css

scripts:
- https://unpkg.com/mocha/mocha.js
- https://unpkg.com/chai/chai.js
- /js/demos/mocha-setup.js
- ./suite.js
- /js/demos/mocha-run.js

- ./calculator.js
---

***Dec 19, 2020: Work in progress, functionality not implemented.*** 

## Calculator

This page contains the running calculator and the test suite used for driving and isolating the parts.

The TAB key navigates the keypad in the same order as the Windows Calculator app.

## Suite

Click on test names in the report below to display each assertion.

{{< rawhtml >}}
<div id="mocha"></div>
<div id="fixture">
{{< calculator >}}
</div>
{{< /rawhtml >}}
