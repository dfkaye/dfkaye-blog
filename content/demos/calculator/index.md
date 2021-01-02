---
title: "Demo: Calculator App built with the SAM pattern"
date: 2020-12-19T15:31:27-08:00
lastmod: 2020-12-19T15:31:27-08:00
description: "Accessible calculator built with the SAM pattern."

draft: true

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
- ./test/suite.js
- /js/demos/mocha-run.js

- ./calculator.js
---

***Dec 19, 2020: Work in progress, functionality not implemented.*** 

## Calculator

This page contains the running calculator and the test suite used for driving and isolating the parts.

The TAB key navigates the keypad in the same order as the Windows Calculator app.

{{< rawhtml >}}
<div calculator>
  <div equation>equation</div>
  <output output>[ Calculator not initialized. ]</output>
  <output role="alert" aria-live="polite" aria-atomic="false" visually-hidden a11y-output></output>
  <div keypad>
    <button value="percent" aria-label="Percent">%</button>
    <button value="clearentry" aria-label="Clear Entry">CE</button>
    <button value="clear" aria-label="Clear">C</button>
    <button value="backspace" aria-label="Backspace">&ltdot;</button>
    <button value="reciprocal" aria-label="Reciprocal"><sup>1</sup>/x</button>
    <button value="square" aria-label="Square">x<sup>2</sup></button>
    <button value="squareroot" aria-label="Square Root"><sup>2</sup>&radic;x</button>
    <div operators>
      <button value="divide" aria-label="Divide By">&divide;</button>
      <button value="multiply" aria-label="Multiply By">&times;</button>
      <button value="plus" aria-label="Plus">&plus;</button>
      <button value="minus" aria-label="Minus">&minus;</button>
      <button value="equals" aria-label="Equals">&equals;</button>
    </div>
    <div numbers>
      <button value="0">0</button>
      <button value="1">1</button>
      <button value="2">2</button>
      <button value="3">3</button>
      <button value="4">4</button>
      <button value="5">5</button>
      <button value="6">6</button>
      <button value="7">7</button>
      <button value="8">8</button>
      <button value="9">9</button>
      <button value="decimal" aria-label="Decimal Separator">.</button>
      <button value="negate" aria-label="Positive-Negative"><sup>+</sup>/-</button>
    </div>
  </div>
</div>
{{< /rawhtml >}}

## Suite

Click on test names in the report below to display each assertion.

{{< rawhtml >}}
<div id="mocha"></div>
{{< /rawhtml >}}
