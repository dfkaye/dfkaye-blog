---
title: "We Threw Out the Rule book"
date: 2020-09-19T13:12:43-07:00
lastmod: 2020-09-19T15:00:43-07:00
description: "How we wrote a plain JavaScript app from scratch using Mocha for test-driven development and ParcelJS for bundling."
tags: 
- "Minimalism"
- "Attributes"
- "Testing"
- "TDD"
- "Accessibility"
- "Safety"
- "Vanilla"
- "JavaScript"

---

Last year (2018) we threw out the "rules" around front-end app development and testing.

<!--more-->

We created a JavaScript widget to be downloaded by our clients, allowing their users to connect to our microservices without any back-end traffic.

## Constraints

We could not assume the client used any app libraries, frameworks, CSS conventions, etc. Everything had to be scoped to our widget without leaking into the client's page.

We could not assume the client used or did not use Content Security Policy headers. Thus, we could not assume that calls to `eval()` or `Function()` were permitted.

We could not assume that the client would provide well-formed `JSON` either. That meant we would have to parse it ourselves, comb out any errors, before sending it to `JSON.parse()`.

## Approach

We assumed that the client would prohibit `eval()` in their Content Security Policy, so we created a test page that set the policy to [strict-dynamic](https://content-security-policy.com/strict-dynamic/).

We used *mutable data,* and *functions*, and *XHR* (`XMLHttpRequests`), and [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). That's it. No classes, no data hiding, no `Promises`, no `async/await`, no `fetch()`.

We derived the initial state data from the incoming client JSON, which we normalized before parsing. We used the `MutationObserver` interface to detect attribute changes on the element that contained our app. Any time the client changed this attribute with stringified JSON, we would re-start the application flow with the new data.

We would then pass the data from function to function, rendering greetings, forms, user status, etc., almost like a state machine.

## Styling

To prevent styles from leaking into the client app, we obtained built-in namespacing or scoping using only HTML `data` attributes and CSS [attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors).

Every element we created contained our data-company attribute where we would save state or locale information. If an element was purely textual or semantic - such as an `<h2>` or `<p>` - we assigned the element name to that attribute and used `[data-company="p"]` to style the `<p>` element.

## Accessibility

We used the attribute approach to drive our application's accessibility, using `aria-` and `role` attributes as additional state or landmark hooks.

Credit goes to [Heydon Pickering](https://heydonworks.com/) for suggesting this approach over the years. (For context, read about his approach to [Tabbed Interfaces](https://inclusive-components.design/tabbed-interfaces/).) We were happy to demonstrate how well it could work in place of the customary `class` and `tagname` approach.

## Testing

We broke the "No True Scotsman" rules around unit tests.

We tested our request modules over the network. These requests depended on short-lived tokens that made them hard to exercise with [Postman](https://www.postman.com/).

We wrote unit tests for everything, using [live-server](http://tapiov.net/live-server/) from the command line, downloading [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/) from [unpkg.com](https://unpkg.com/) right into the HTML test page, all using ES6 imports.

We tested the token request modules, the handful of data request endpoints we needed, and even the configuration data from within the app.

We tested the build output from the [parcel bundler](https://parceljs.org/), along with the build helpers.

We tested localized HTML output for seven different currencies and 30 languages.

All together we ran 400 test cases every time we changed a test or module.

## Results

We found bombs in our microservices that no one had thought of - *especially* in our microservices - where we found the business asked engineering to relax the constraint against duplication of entities.

Our bundled CSS was *this* big - that is, 10 kilobytes.

The entire minified app was 127 kilobytes - aside from the image files (PNGs, SVGs).

## Justification

We were a team of 3, one remote, two on-site. I was the only one with front-end test-driven experience, and had more experience working with DOM APIs (as opposed to [jQuery](https://jquery.com/) or [React](https://reactjs.org/)). The other two were very skeptical about this, which meant I would have to take work they were not comfortable with. I wanted them always to be comfortable so they could make progress, learn from their experience, our code reviews, etc.

When we found changes in the microservice responses, my on-site teammate came to me smiling and said, "Now I get it. Because of the tests, I know exactly where to look in the code to troubleshoot."

## Mindset

We delivered the full experience in 14 weeks. We were able to provide full localization over an additional 4 weeks (it was a late request from the business).

We delivered *because* we threw out the rules that enforced artificial restrictions ("don't test over the network").

We didn't worry about the obfuscation that libraries and frameworks produce.

We openly *embraced danger* in our app and tests from the start, by choosing *mutable data* and small functions that focused on returning updated data, requesting and/or refreshing data, saving and validating data, updating the interface based on the *state* of the data.

## Tooling vs. Dependencies

You don't need [Typescript](https://www.typescriptlang.org/), or a SPA framework like ReactJS, a library like jQuery, moment, lodash - or any of the other "modern tooling" to succeed. These are not tools, they are dependencies. You can roll your own specific, focused functions to cover what these offer, especially if you need only a tiny subset.

The real tooling, the live-server, the parcel bundler, the unpkg.com versions of mocha and chai, plus [npm](https://www.npmjs.com/), [github](https://github.com/), [VS Code](https://code.visualstudio.com/), and the terminal - these we could not have replicated on our own, and we were grateful for their ease of use and reliability.

Everything else we built from scratch - with tests - and delivered.

**I encourage you to try it, too.**
