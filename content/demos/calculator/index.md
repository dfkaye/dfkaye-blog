---
title: "Test Suite: SAM pattern Calculator demo"
date: 2021-01-28T14:38:27-08:00
lastmod: 2021-07-14T21:20:27-08:00
description: "Test suite and demo for an Accessible Calculator supporting keyboard navigation and input, built with CSS grid, ARIA alert, and vanilla JavaScript, using the SAM pattern and dependency injection."

tags:
- "SAM pattern"
- "Accessibility"
- "JavaScript"
- "Vanilla"
- "Dependency injection"

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

+ *{{<rawhtml>}}<time datetime="2020-12-19">December 19, 2020</time>{{</rawhtml>}}: Work begun in earnest.*
+ *{{<rawhtml>}}<time datetime="2021-01-08">January 8, 2021</time>{{</rawhtml>}}: Work in progress. Functionality still being implemented.*
+ *{{<rawhtml>}}<time datetime="2021-01-23">January 23, 2021</time>{{</rawhtml>}}: Tests passing; more needed; calculator app runs after 5 second delay.*
+ {{<rawhtml>}}<time datetime="2021-01-27">January 27, 2021</time>{{</rawhtml>}}:
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
+ {{<rawhtml>}}<time datetime="2021-01-28">January 28, 2021</time>{{</rawhtml>}}:
  - *remove this*: added `state.history()` for fun
  - **Calling it done.  Blog post to follow.**
+ {{<rawhtml>}}<time datetime="2021-05-20">May 20, 2021</time>{{</rawhtml>}}:
  - re-think the history part: state can generate a history for the view to store.
  - why? the view is the *client* and therefore must manage its own concerns separately from "the state."
+ {{<rawhtml>}}<time datetime="2021-07-14">July 14, 2021</time>{{</rawhtml>}}:
  - Bug fix for appending digits: When new value exceeds safe integer limit, do *not* append new digit.
  - Add decimal test for appending when output less than or equal safe integer limit.
  - Fix view test for `document.readyState`.

### Blog post elements to cover

+ list of key aliases for actions (e.g., Escape for Clear, Enter and Space for a click, `r` for `reciprocal`, `q`, `@`, `F9`, and so on).
+ accessibility support - screen readers, alert text, keyboard navigation and input
+ mimmicking MS Windows Calculator expressions: output is fairly straight-forward, but the expression text logic is **complicated**.
+ 2 safe-math bugs found
+ no update if next digit creates output greater than safe integer limit
+ appends decimal even if output at safe integer limit
+ Edge case in JavaScript numbers, MAX + 0.4 === MAX, MAX + 0.5 === MAX.5
  - tweet: https://twitter.com/dfkaye/status/1415520827047485442
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
