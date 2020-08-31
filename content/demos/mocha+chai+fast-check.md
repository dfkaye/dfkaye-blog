---
title: "A mocha, chai, and fast-check test suite setup"
date: 2020-07-07T12:10:43-07:00
description: "Running example of a JavaScript test suite in the browser, using mocha, chai, and fast-check testing libraries"
tags:
- "demo"
- "suites"
- "TDD"
- "JavaScript"

# load styles and scripts in strict order

styles: 
- https://unpkg.com/mocha/mocha.css
- /css/demos/mocha-css-override.css

scripts: 
- https://unpkg.com/mocha/mocha.js
- https://unpkg.com/chai/chai.js
- https://unpkg.com/fast-check@1.26.0/lib/bundle.js
- /js/demos/mocha-setup.js
- /js/demos/mocha-chai-fast-check-suite.js
- /js/demos/mocha-run.js

---

This page is running a test suite including [mocha.js](https://mochajs.org/), [chai.js](https://www.chaijs.com/), and [fast-check.js](https://github.com/dubzzz/fast-check/) downloaded from [https://unpkg.com](unpkg.com).

There are some customizations and overrides in the CSS to make it fit properly on this blog.

You can find roughly the same setup [at this code-pen](https://codepen.io/dfkaye/pen/XWXgQxZ).

{{< rawhtml >}}
<div id="fixture"></div>
<div id="mocha"></div>
{{< /rawhtml >}}

You can open the console to read some of the generated arguments for the failing tests.

Some examples:

```js
>jq5 /!!
"v&"%"t# &*
```

### Tech used

* [rawhtml shortcode](https://anaulin.org/blog/hugo-raw-html-shortcode/) by Ana Ulin.
* packages from unpkg.com:
	* [mocha.css](https://unpkg.com/mocha/mocha.css)
	* [mocha.js](https://unpkg.com/mocha/mocha.js)
	* [chai.js](https://unpkg.com/chai/chai.js)
	* [fast-check library bundle](https://unpkg.com/fast-check@*/lib/bundle.js)
