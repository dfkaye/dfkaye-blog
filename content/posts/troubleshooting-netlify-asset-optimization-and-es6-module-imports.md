---
title: "Troubleshooting: Netlify asset optimizations and ES2015 modules"
date: 2020-09-07T20:16:41-07:00
lastmod: 2020-09-07T20:16:41-07:00
description: "How I fixed a CORS misnomer for JavaScript module imports by customizing how Netlify bundles CSS and JavaScript assets for Hugo."
tags:
- "Hugo"
- "Netlify"
- "CORS"
- "JavaScript"
- "Troubleshooting"

---

## My Hugo blog's JavaScript demos stopped working

I use [Netlify](https://www.netlify.com) to host my [Hugo](https://gohugo.io) blog. On <time>September 7, 2020</time>, I discovered that two demos on my site that use ES2015 module imports no longer worked. 

<!--more-->

## Troubleshooting Netlify optimization steps

Netlify bundles your static CSS and JavaScript assets and serves them from the `cloudfront.net` domain. If your JavaScript uses ES2105 modules, and runs on a custom domain (such as `dfkaye.com`), this can lead to Cross-Origin Request (CORS) policy blocking messages.

## Example: The "safe-assign" test suite

The Safe-Assign test suite runs at https://dfkaye.com/demos/safe-assign-test-suite/.

The test suite imports one JavaScript file, `https://dfkaye.com/js/demos/safe-assign.js`, with this statement:

```js
import { assign } from "/js/lib/safe-assign.js";
```

However, when the page ran, the console displayed this message:

```js
Access to script at 'https://d33wubrfki0l68.cloudfront.net/js/lib/safe-assign.js' from origin 'https://dfkaye.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

But when I loaded that URL directly into the browser location bar, the page displayed:

```html
CDN object Not Found - Request ID: c69c9f74-474a-4ef6-ab40-7f3dbd3426fb-17861605
```

But when I loaded the normal lib URL (https://dfkaye.com/js/lib/safe-assign.js) in the browser location bar, the JavaScript source loaded successfully.

**Diagnosis**: The 'Access-Control-Allow-Origin' header error was a misnomer. The dependency itself was not part of the optimization process and so did not reside on the `cloudfront` domain.

When I loaded the normal demo URL (https://dfkaye.com/js/demos/safe-assign.js) in the browser location bar, the result was the 404 page.

Inspection in the Network panel of the browser tools revealed that `https://dfkaye.com/js/demos/safe-assign.js` was being bundled and aliased as 
`https://d33wubrfki0l68.cloudfront.net/bundles/c309fd079def3c9aaf7a09774e9c96648769ddad.js`.

**Diagnosis**: The import path was domain-relative, requesting the lib file from `cloudfront` where it did not actually reside.

## Solution: Turn off Netlify optimizations for CSS and JS

We want to ensure that modules and their dependencies with relative paths reside on the same domain.

Netlify by default will bundle CSS and JavaScript assets and serve them from the `cloudfront` domain, but does not resolve all the module dependencies, leaving them unbundled.

We can turn the bundling step off in the `netlify.toml` file with these directives and thereby import files from our custom domain:

```toml
[build.processing.css]
  bundle = false
  minify = false

[build.processing.js]
  bundle = false
  minify = false
```

We can still optimize other asset types, such as images, for example.

```toml
[build.processing.images]
  compress = true
```

## Victory

Once I added that and pushed the changes, the demo pages started working again.

For more information, read [Configure Builds on Netlify](https://docs.netlify.com/configure-builds/file-based-configuration/#post-processing).
