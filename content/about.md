---
title: "About This Site"
date: 2020-06-12T14:10:43-07:00
description: "Some things about the dfkaye site and author."
tags: []
draft: false
---

<!--
This is my About page.

Using `layouts/_default/single.html`
-->


### Built with Hugo

*This should be part of the Switching to Hugo post.*

{{< rawhtml >}}
<a svg="hugo" href="https://gohugo.io/" target="_blank" title="Hugo link"
  rel="noopener" aria-label="follow Hugo——Opens in a new window">
  Built with Hugo
  <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <title>Hugo icon</title>
    <path d="M11.754 0a3.998 3.998 0 00-2.049.596L3.33 4.532a4.252 4.252 0 00-2.017 3.615v8.03c0 1.473.79 2.838 2.067 3.574l6.486 3.733a3.88 3.88 0 003.835.018l7.043-3.966a3.817 3.817 0 001.943-3.323V7.752a3.57 3.57 0 00-1.774-3.084L13.817.541a3.998 3.998 0 00-2.063-.54zm.022 1.674c.413-.006.828.1 1.2.315l7.095 4.127c.584.34.941.96.94 1.635v8.462c0 .774-.414 1.484-1.089 1.864l-7.042 3.966a2.199 2.199 0 01-2.179-.01l-6.485-3.734a2.447 2.447 0 01-1.228-2.123v-8.03c0-.893.461-1.72 1.221-2.19l6.376-3.935a2.323 2.323 0 011.19-.347zm-4.7 3.844V18.37h2.69v-5.62h4.46v5.62h2.696V5.518h-2.696v4.681h-4.46V5.518Z"/>
  </svg>
</a>
{{< /rawhtml >}}

The selling point of Hugo is its speed, and support for Markdown, plus the Go programming language itself.

However, once you're in the Markdown and need raw HTML, you have to learn shortcodes, or replace Markdown files with HTML files.

### Web development philosophy

*This should be its own blog post*

After some 20 years as a (mainly) front-end engineer, I have arrived at some surprising conclusions.

1. **Almost never use classes.**

- HTML: use custom tag names and attribute names

  Prefer

	`<clock ticking>`
	
  over

	`<div class="clock ticking">`

- CSS: use attribute selectors (and combinators)

  Prefer

		clock {}

		clock[ticking] {}

  over

		.clock {}

		.ticking {}

- JS: use data and functions

		var data = {};

		function process(in) {
			var out = {};
			return Object.assign(out, Object(in), {
				modified: "with love"
			});
		}

- DOM: separate keyboard traversal handlers from so-called "logic".

2. **Test everything.**

I do not mean "100% code coverage" but rather a suite of tests exercising the source in its target runtime (browser, server, cloud).

A browser suite consisting of unit and integration tests, exercising startup, utilities, rendering, error handling, *and* making network calls to your services, will unearth booby traps, incorrect assumptions, and undocumented changes faster than an end-to-end suite or even the unit tests for the service.

3. **Always test with a screen reader.**

You will learn a ton about the keyboard and `aria` attributes and states in a hurry.

4. **Frameworks are training wheels.**

Learn what you can, but get off them as soon as possible.

They are gravity fields that favor *their* innovation over the innovation you bring to your project that makes it unique.

Having built one I know this surprising limitation first-hand.

5. **TypeScript is a monumental mistake.**

Allow me to be bold: *Type-safe code is an illusion of safety.*

{{< rawhtml >}}
Read this post by Jeremy Bowers from <time>2011</time> on <a href="http://www.jerf.org/iri/post/2954" target="_blank" rel="noopener"
  aria-label="Why Duck Typing is safe——Opens in a new window">Why Duck typing is safe</a>.
{{< /rawhtml >}}

Prefer **user safety** over type safety.

