---
title: "Test Suite: SAM pattern Calculator app"
date: 2021-01-28T14:38:27-08:00
lastmod: 2021-01-28T14:38:27-08:00
description: "Test suite for an Accessible Calculator supporting keyboard navigation and input, built with CSS grid, ARIA alert, and vanilla JavaScript using the SAM pattern and dependency injection."

tags:
- "SAM pattern"
- "Accessibility"
- "vanilla JavaScript"
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

## Calculator

This page contains the running calculator and the test suite used for driving and isolating the parts.

The {{< rawhtml >}}<kbd>TAB</kbd>{{< /rawhtml >}} key navigates the keypad in the same key order as the Windows Calculator app.

The {{< rawhtml >}}<kbd>Arrow</kbd>{{< /rawhtml >}} keys navigate the keypad by rows or columns, in the same order as the Windows Calculator app.

The keypad accepts click and touch events on each key.

The calculator container accepts focus in order to accept keyboard events.

## Status

January 28, 2021: **Calling it done.  Blog post to follow.**

+ *December 19, 2021: Work begun in earnest.*
+ *January 8, 2021: Work in progress. Functionality still being implemented.*
+ *January 23, 2021: Tests passing; more needed; calculator app runs after 5 second delay.*
+ January 27, 2021:
  - Getting very close now! The model logic is the most involved part, when trying to match the behavior of the Microsoft Windows Calculator.
  - Found another safe-math issue, this time *inside* `expand()` - `.14 * 100` returns `14.000000000000002` where 100 is the exponsion factor. Solve with parseInt(), fallback to previous if that results in `NaN`.
  - Covered the remaining expression update sequence issues:
    + ("6 =, then 3, should print 3 =") // Yes!
    + ("3 =, then +, should print 3 +")
    + ("3 +, then =, should print 3 + 3 =, output is 6")
    + ("7 + 8, then =, should print 7 + 8 =, output is 15")
    + ("7 + 8 =, then *, should print 15 *, output is 15") // Yes!!!
    + ("15 *, then 6, then =, should print 15 * 6 =, output is 90") // Yes!!
    + ("15 * 6 =, then =, should print 90 * 6 =, output is 540")
+ January 28, 2021:
  - *remove this*: added `state.history()` for fun
  - Calling it done.
+ May 20, 2021:
  - re-think the history part: state can generate a history for the view to store.
  - why? the view is the *client* and therefore must manage its own concerns separately from "the state."


### Blog post elements to cover

+ list of key aliases for actions (e.g., Escape for Clear, Enter and Space for a click, `r` for `reciprocal`, `q`, `@`, `F9`, and so on).
+ accessibility support - screen readers, alert text, keyboard navigation and input
+ mimmicking MS Windows Calculator expressions: output is fairly straight-forward, but the expression text logic is **complicated**.
+ 2 safe-math bugs found
+ error states
+ explain CSS grid rules to mimic keyboard navigation in MS Windows Calculator
+ explain SAM pattern and why the calculator is based on it
+ explain Dependency injection and why the pattern uses it (tests!)
+ fix expression text overflow (layout breakages)
+ the view is the *client* and therefore must manage its own concerns separately from "the state."

{{< rawhtml >}}
<div id="fixture">
{{< calculator >}}
</div>
{{< /rawhtml >}}

## Suite

Click on test names in the report below to display each assertion.

{{< rawhtml >}}
<div id="mocha"></div>
{{< /rawhtml >}}
