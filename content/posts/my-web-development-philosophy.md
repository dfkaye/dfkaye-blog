---
title: "My Web Development Philosophy"
date: 2020-06-12T14:10:43-07:00
description: "A few red lines in the sand (subject to revision without notice)."
tags: []
draft: false
---

<!--more-->

After some 20 years as a (mainly) front-end engineer, I have arrived at some conclusions that may surprise you.

## Writing what you need is not reinventing the wheel.

Using someone else's package is no safer than writing from scratch. Read this post by @rachelbythebay on [Tripping over the potholes in too many libraries](https://rachelbythebay.com/w/2020/08/09/lib/).

### Minimalism is a skill.

{{< rawhtml >}}
Read this post by Tero Piirainen from <time>2019</time> on <a href="https://volument.com/blog/minimalism-the-most-undervalued-development-skill">Minimalism: The most undervalued development skill</a>.
{{< /rawhtml >}}

Everything else on this page flows from this concept.

## Stop writing classes.

Inspired by Jack Diederich's talk at PyCon 2012, [Stop Writing Classes](https://www.youtube.com/watch?v=o9pEzgHorH0).

People disagree with this because they've trained themselves to live with classes per industry demand.

### HTML: Use custom tag names and attribute names.

Instead of a plain `<div>` with `class` attributes,

```
<div class="clock ticking">
```

you can write the following not-so-valid HTML which browsers will parse into a real element of `HTMLUnknownElement` type with the custom attribute:

```
<clock ticking>
```

You'll then need CSS to display the `clock` element the way you want.

```
clock { display: block | flex | whatever }
```

### CSS: Use attribute selectors (and combinators).

Instead of writing multiple mix-and-match state classes in <abbr title="Block-Element-Modifier">BEM</abbr>-like fashion, like so,

```
.clock { ... }
.clock__ticking { ... }
.clock__ticking--loudly { ... }
```

consider styling only from the custom attribute value:

```
[ticking] { ... }
[ticking="loudly"] { ... }
```

That gives you style control based on the element's state.
 
### JavaScript: Use data and functions.

Use pure functions. Pass data in, update parts, return either only the parts or return the data, or a modified copy of the data.

```
var data = {};

function process(in) {
    var out = {};

    return Object.assign(out, Object(in), {
        modified: "with love"
    });
}

process(data);
// { modified: "with love" }
```

The above is simpler and less coupled to anything, avoiding the usual object-oriented coupling via implementation inheritance.

And it's easier to test, thanks to ES6 modules.

## MVC is an anti-pattern.

The model-view-controller pattern has run its course and should be abandoned.

There are new and better patterns. Consider the [SAM pattern](https://medium.com/@metapgmr/hex-a-no-framework-approach-to-building-modern-web-apps-e43f74190b9c) by Jean Jacques Dubray.

## Test *everything*.

Lean on a suite of tests exercising the source in its target runtime (browser, server, cloud).

A browser suite consisting of unit and integration tests, exercising startup, utilities, rendering, error handling, *and* making network calls to your services, will unearth booby traps, incorrect assumptions, and undocumented changes faster than an end-to-end suite or even the unit tests for the service.

You need not strive for "100% code coverage" or adhere strictly to the test-driven "red-green-refactor" cycle. You should almost always sketch out your solution first, lest you go in circles. Article by Peter Siebel, [Unit testing in *Coders at Work*](https://gigamonkeys.wordpress.com/2009/10/05/coders-unit-testing/).

Snapshot testing does not count. Article by Artem Sapegin, [What’s wrong with snapshot tests
](https://blog.sapegin.me/all/snapshot-tests/).

## Always test with a screen reader.

You will learn a ton about the keyboard and `aria` attributes and states in a hurry.

## Frameworks are training wheels.

The frameworks used to be object-oriented polyfills for cross-browser development, but have now become custom template DSLs that require build processing and bundling.

Learn what you can, but get off them as soon as possible.

Learn JavaScript well enough to manipulate the DOM directly.

They are gravity fields that favor *their* innovation over the innovation you bring to your project that makes it unique.

Having built one (twice), I know this surprising limitation first-hand.

## TypeScript is a monumental mistake.

Allow me to be bold: *Type-safe code is an illusion of safety.*

{{< rawhtml >}}
Read this post by Jeremy Bowers from <time>2011</time> on <a href="http://www.jerf.org/iri/post/2954">Why Duck typing is safe</a>.
{{< /rawhtml >}}

If you absolutely must include TypeScript in a project, use it inside of JSDoc rather than inside the code (i.e., as ".ts" or ".tsx" files).

{{< rawhtml >}}
Read this post from <time>2018</time> on developing <a href="https://medium.com/@trukrs/type-safe-javascript-with-jsdoc-7a2a63209b76">Type Safe JavaScript with JSDoc</a>.
{{< /rawhtml >}}

## Prefer *user safety* over *type* safety.

Requirements don't change. It is your understanding of requirements that will change. Your type definitions do not matter if you can't help your user out of an unsafe state in the application.
