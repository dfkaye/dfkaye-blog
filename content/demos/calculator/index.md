---
title: "Test Suite: Calculator App built with the SAM pattern"
date: 2020-12-19T15:31:27-08:00
lastmod: 2021-01-08T13:26:27-08:00
description: "Test suite for an Accessible calculator built with JavaScript using the SAM pattern and dependency injection."

draft: false

tags:
- "SAM pattern"
- "Accessibility"
- "JavaScript"
- "dependency injection"

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

## Track work in progress
+ *December 19, 2021: Work begun in earnest.*
+ *January 8, 2021: Work in progress. Functionality still being implemented.*
+ *January 23, 2021: Tests passing; more needed; calculator app runs after 5 second delay.*

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
