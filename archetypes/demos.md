---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
lastmod: {{ .Date }}
description: {{ "describe this demo" }}
tags:
- "tag"

# load styles and scripts in strict order

styles: 
- https://unpkg.com/mocha/mocha.css
- /css/demos/mocha-css-override.css

scripts: 
- https://unpkg.com/mocha/mocha.js
- https://unpkg.com/chai/chai.js
- /js/demos/mocha-setup.js
- unpkg.or.local.url.here
- /js/demos/mocha-run.js
---

Introductory paragraph.

The suite uses [mocha.js](https://mochajs.org/), [chai.js](https://www.chaijs.com/), module-type scripts, and ES2016 import/export syntax, and is served up by [Hugo](https://gohugo.io).

You can view the source of the test suite at github-or-local-url.

## Suite

Click on test names in the report below to display each assertion.

{{< rawhtml >}}
<div id="fixture"></div>
<div id="mocha"></div>
{{< /rawhtml >}}
