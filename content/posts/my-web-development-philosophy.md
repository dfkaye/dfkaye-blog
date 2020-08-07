---
title: "My Web Development Philosophy (subject to revision without notice)"
date: 2020-06-12T14:10:43-07:00
description: "A few hard lines in the sand concerning software."
tags: []
draft: false
---

After some 20 years as a (mainly) front-end engineer, I have arrived at some surprising conclusions.

## Almost never use classes.

### HTML: use custom tag names and attribute names

  Prefer

```
<clock ticking>
```

  over

```
<div class="clock ticking">
```

### CSS: use attribute selectors (and combinators)

  Prefer

```
clock { ... }
clock[ticking] { ... }
```

  over

```
.clock { ... }
.ticking { ... }
```

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

### DOM: separate keyboard traversal handlers from model updating logic.

Learn JavaScript well enough to manipulate the DOM directly.

## Test everything.

Lean on a suite of tests exercising the source in its target runtime (browser, server, cloud).

A browser suite consisting of unit and integration tests, exercising startup, utilities, rendering, error handling, *and* making network calls to your services, will unearth booby traps, incorrect assumptions, and undocumented changes faster than an end-to-end suite or even the unit tests for the service.

You need not strive for "100% code coverage" or adhere strictly to the test-driven "red-green-refactor" cycle. You should almost always strive to sketch out your solution first. Article by Peter Siebel, [Unit testing in *Coders at Work*](https://gigamonkeys.wordpress.com/2009/10/05/coders-unit-testing/).

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

