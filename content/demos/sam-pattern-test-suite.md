---
title: "Test Suite: SAM pattern Countdown demo"
date: 2020-12-21T20:06:29-08:00
lastmod: 2021-01-02T15:10:54-08:00
description: "Test suite and Countdown demo for a SAM pattern module that uses dependency injection and factory functions."
tags:
- "SAM pattern"
- "dependency injection"

# load styles and scripts in strict order

styles: 
- https://unpkg.com/mocha/mocha.css
- /css/demos/mocha-css-override.css

scripts: 
- https://unpkg.com/mocha/mocha.js
- https://unpkg.com/chai/chai.js
- /js/demos/mocha-setup.js
- /js/demos/sam/suite.js
- /js/demos/mocha-run.js
---

This test suite exercises a Countdown application built with the SAM pattern.

The suite uses [mocha.js](https://mochajs.org/), [chai.js](https://www.chaijs.com/), module-type scripts, and ES2016 import/export syntax, and is served up by [Hugo](https://gohugo.io).

You can view the source of the test suite at [{{< baseurl >}}/js/demos/sam/suite.js]({{< baseurl >}}/js/demos/sam/suite.js).

## Demo

The countdown in progress is started by the test suite. You can restart the countdown at any time using the form input below.

{{< rawhtml >}}
<div id="fixture">
  <p role="alert" aria-live="polite">T minus <b remaining role="alert" aria-live="assertive"></b> seconds.</p>
  <p><meter progress style="width: 100%;"></meter></p>
  <form>
    <label for="t-minus">Enter a countdown in seconds (optional)</label>
    <input id="t-minus" aria-label="Enter a countdown in seconds and press the Re-start button."/>
    <button type="submit" restart>Re-start</button>
  </form>
</div>
{{< /rawhtml >}}

## Suite

Click on test names in the report below to display each assertion.

{{< rawhtml >}}
<div id="mocha"></div>
{{< /rawhtml >}}
