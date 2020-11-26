---
title: "Using Hugo for TDD With Javascript"
date: 2020-11-22T14:23:42-08:00
lastmod: 2020-11-22T14:23:42-08:00
description: "How I use Hugo server for test-driving JavaScript development, with hugo server, github, npm, and unpkg."
tags:
- "TDD"
- "Hugo"
- "Node.js"
- "unpkg"
- "github"
- "npm"
draft: true
---

*[DRAFT: Nov 22, 2020]*

As a fan of test-driven development (TDD), I was delighted to discover a way to do it directly in web pages served by [Hugo](https://gohugo.io/), while running `hugo server` locally.

Initial demo [using mocha, chai, and fast-check](/demos/mocha+chai+fast-check/)

Initial post on [why I switched to Hugo](/posts/2019/11/11/first-post-why-hugo/)

- [Mocha](https://mochajs.org)
- [Chai](https://www.chaijs.com)
- [fast-check](https://www.npmjs.com/package/fast-check)
- [Node.js](https://nodejs.org)
- [github](https://github.com)
- [npm](https://www.npmjs.com)
- [unpkg](https://unpkg.com)

<!--more-->

The proof of concept is the first demo on this site, [Test suite setup with mocha, chai, and fast-check](/demos/mocha+chai+fast-check/).

This turned out to be a pleasant experience as [Hugo](https://gohugo.io) rebuilds and reloads my test suite pages very quickly. It is very much like running a test page with [live-server](https://github.com/tapio/live-server).

## Local development

Create a page that will create script tags for mocha, chai

Use mocha, chai, module-type scripts, and ES2016 import/export syntax.
- Using `<script type="module">` even for remote scripts from another domain *works right now.* This makes it a snap to create an ES2016 module locally.

Once we're "done", we push the library to its own github repo, refactor the test approach as necessary (node vs browser) using await import browser test from node, then publish to npm.

Now we refactor the blog test page to import the browser test from unpkg.com/name@version/main - need the @version part to pull the desired npm version, otherwise, you'll get a cached ES module in your browser.

- ES modules on node.js
  - create browser suite that will be requested from unpkg but should run locally
  - create node suite that imports chai sets it on global, imports jsdom if necessary, and then imports the browser suite
  

