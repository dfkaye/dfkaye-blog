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
