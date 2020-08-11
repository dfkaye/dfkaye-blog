---
title: "My Web Development Philosophy"
date: 2020-06-12T14:10:43-07:00
description: "A few red lines in the sand (subject to revision without notice)."
tags: []
draft: false
---

<!--more-->

After some 20 years as a (mainly) front-end engineer, I have arrived at some surprising conclusions.

## Prefer minimalism

{{< rawhtml >}}
Read this post by Tero Piirainen from <time>2019</time> on <a href="https://volument.com/blog/minimalism-the-most-undervalued-development-skill">Minimalism: The most undervalued development skill</a>.
{{< /rawhtml >}}

Everything else on this page flows from this concept.

## Almost never use classes.

### HTML: use custom tag names and attribute names


Instead of plain divs with class attributes like so,

```
<div class="clock ticking">
```

You can write the following not-so-valid HTML which browsers can parse into a real element of "unknown" type with the custom attribute.

```
<clock ticking>
```

You'll then need CSS to display the clock element the way you want.

### CSS: use attribute selectors (and combinators)

Instead of writing multiple mix-and-match classes, like so,

```
.clock { ... }
.ticking { ... }
```

consider styling only from the custom attribute value.

```
clock { display: block | flex | whatever }
[ticking] { ... }
[ticking="loudly"] { ... }
```

That gives you style control bsed on the element's state.
 
### JavaScript: use data and functions

```
var data = {};

function process(in) {
    var out = {};
    return Object.assign(out, Object(in), {
        modified: "with love"
    });
}
```

The above is simpler and less coupled to anything than the usual object-oriented mistake of implmentation inheritance.

It's also easier to test, thanks to ES6 modules.

## DOM: separate keyboard traversal handlers from model updating logic.

Learn JavaScript well enough to manipulate the DOM directly.

## Test *everything*.

Lean on a suite of tests exercising the source in its target runtime (browser, server, cloud).

A browser suite consisting of unit and integration tests, exercising startup, utilities, rendering, error handling, *and* making network calls to your services, will unearth booby traps, incorrect assumptions, and undocumented changes faster than an end-to-end suite or even the unit tests for the service.

You need not strive for "100% code coverage" or adhere strictly to the test-driven "red-green-refactor" cycle. You should almost always sketch out your solution first, lest you go in circles. Article by Peter Siebel, [Unit testing in *Coders at Work*](https://gigamonkeys.wordpress.com/2009/10/05/coders-unit-testing/).

Snapshot testing does not count. Article by Artem Sapegin, [What’s wrong with snapshot tests
](https://blog.sapegin.me/all/snapshot-tests/).

## Always test with a screen reader.

You will learn a ton about the keyboard and `aria` attributes and states in a hurry.

## Frameworks are training wheels.

Learn what you can, but get off them as soon as possible.

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

\[ more to come... \]
