---
title: "Functionally Numeric Objects"
date: 2020-11-22T14:07:36-08:00
lastmod: 2020-11-22T14:07:36-08:00
description: "Quick note to answer, what is a functionally numeric object and how would you create and use one?"
tags:
- "functionally numeric"
- "JavaScript"
- "TDD"

---

In my post on [Safer Math operations](/posts/2020/08/17/safer-math-operations-in-javascript-using-tdd/), I listed "functionally numeric objects" as acceptable parameters.

## What is a functionally numeric object?

A functionally numeric object is one whose `valueOf()` method returns a numeric value.

## How do you create and use one?

We can create a `time` object, for example, whose `valueOf()` method returns a new timestamp every time it is called directly or coerced by an operator.

```js
var time = {
  valueOf: function () { return Date.now() }
}

console.log(time.valueOf()) // 1606080742455
console.log(+time); // 1606080742456
console.log(""+time); // "1606080742457"
```

We can add a getter property that calls that method as well (so you don't have to rely on operator coercion).

```js
Object.defineProperty(time, 'now', {
  get: () => time.valueOf()
});

console.log(time.now) // 1606081022267
```

## Why do that?

It's fun to try things at the edges and strengthen testing skills.

The `time.valueOf()` method will return a different value each time it is called, so we can't test that it equals a fixed value. Instead, we can test that it returns value greater than a previous value at a specific moment, namely, the start of the test.

Here's a made-up example.

```js
test("time should advance", () => {
  var now = Date.now();

  // Run this to allow the click to advance.
  expect(now).to.equal(now);

  // Verify that time has advanced.
  expect(time.now).to.be.above(now);
})

```

## In reality...

We found a CUID bug based on *consecutive `Date.now()` calls that returned identical timestamps* a couple years back. When we requested entities using those CUIDs, we received HTTP 403 errors indicating the entities could not be distinguished and so would fail to return access tokens. That led us to add tests around CUID creation as a separate function.

Anyway.
