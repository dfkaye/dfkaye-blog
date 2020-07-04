---
title: "About Me"
date: 2020-06-12T14:10:43-07:00
tags: []
draft: false
---

<!--
This is my About page.

Using `layouts/_default/single.html`
-->

## Web development philosophy

After some 20 years as a (mainly) front-end engineer, I have arrived at some surprising conclusions.

1. Almost never use classes.

	- HTML: use custom tag names and attribute names

			`<clock ticking>` over `<div class="clock ticking">`
			
	- CSS: use attribute selectors (and combinators)

			clock {}
			clock[ticking] {} 
			
		over 
		
			.clock {}
			.ticking {}

	- JS: use data and functions

			var data = {};
			
			function process(in) {
				var out = {};
				return Object.assign(out, Object(in), { modified: "with love" });
			}

	- DOM: separate keyboard traversal handlers from so-called "logic".

2. Test everything.

I do not mean "100% code coverage" but rather a suite of tests exercising the source in its target runtime (browser, server, cloud).

A browser suite consisting of unit and integration tests, exercising startup, utilities, rendering, error handling, *and* making network calls to your services, will unearth booby traps, incorrect assumptions, and undocumented changes faster than an end-to-end suite or even the unit tests for the service.

3. Always test with a screen reader.

You will learn a ton about the keyboard and `aria` attributes and states in a hurry.

4. Frameworks are training wheels

Learn what you can, but get off them as soon as possible. 

They are gravity fields that favor *their* innovation over the innovation you bring to your project that makes it unique.

Having built one I know this surprising limitation first-hand.

5. TypeScript is a monumental mistake

Allow me to be bold: Type-safe code is an illusion of safety.

Duck typing is safe.

Prefer **user safety** over type safety.

