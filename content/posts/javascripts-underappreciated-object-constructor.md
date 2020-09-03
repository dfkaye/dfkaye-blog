---
title: "JavaScript's under-appreciated Object() constructor"
date: 2020-08-05T11:40:58-30:00
description: "Instead of guard clauses or type annotations, you can use JavaScript's Object() constructor for safe type and value access."
tags: 
- "JavaScript"
- "Object"
- "Safety"

---

<!--more-->

*Response to [Umaar's question on twitter](https://twitter.com/umaar/status/1290262055144980480).*

In this preliminary example, each function takes a parameter, and tests it for some equivalence.

```js
function looselyEqual(value) {
  return value == 'some';
}

function strictlyEqual(value) {
  return value === 'some';
}
```

If the value is a string primitive, 'some', both comparisons are valid because both `value` and `'some'` are the same 'type.'

However, if the value is a `new String` *instance* with value 'some', the loose equality check passes, while the strict equality check fails, as a `String` is an object.

```js
var v = 'some';
var s = new String(v);

looselyEqual(s);
// true

strictlyEqual(s);
// false
```

While type matching *feels* correct, it introduces some fragility.  After all, we're comparing string values, not whether a value is a primitive or an object.

Let's look at some ways to relax this restriction.

## First remedy: use a `typeof` guard clause

The usual first approach is to introduce the `typeof` check on parameters. Here's `strictlyEqual()` with such a check.

```js
function strictlyEqual(value) {
  if (typeof value != 'string')
    return new TypeError('parameter value should a primitive string');
  }
  
  return value === 'some';
}
```

That doesn't throw an error, but it does create and return one if the types don't match.

## Second remedy: use wrapping parentheses

We can wrap the incoming value with parentheses, which effectively "autoboxes" the value with an object interface based on the value's prototype, and dispatch a method call. 

```js
(s).valueOf() === 'some';
// true
```

That works when *s* is a value, but will crash when *s* is a "non-value" such as `null` or `undefined`.

```js
(null).valueOf() === 'some';
// Uncaught TypeError: Cannot read property 'valueOf' of null at <anonymous>:1:8

(undefined).valueOf()
// Uncaught TypeError: Cannot read property 'valueOf' of undefined at <anonymous>:1:13
```

## Real remedy: `Object()`constructor to the rescue

To handle possible non-values safely, use the `Object()` constructor. You don't need the `new` keyword as the constructor automatically creates an object or returns the parameter if it's already an object.

```js
var v = null;
Object(v).valueOf()
// {}
```

The `Object()` constructor takes any value, and returns an object based on one of three rules:

+ If the value is an object type (object, array, function, date instance, `Math`, etc.), then the original value is returned unchanged.
+ If the value is `null` or `undefined`, a new `Object` instance is returned, whose `valueOf()` method points to itself.
+ If the value is any other primitive, then a new object based on the value's primitive type is created, whose `valueOf()` method points to the original value. For example, Object('hello') returns a `String()` object with value of 'hello'.

## Build useful things with confidence

Now that we'll always get an object, we can build things with confidence.

We can build something useful to test whether a value is a primitive or an object.
```js
function isObject(value) {
  return value === Object(value);
}

isObject([]); // true
isObject(new String('test')); // true

function isPrimitive(value) {
  return value !== Object(value);
}

isPrimitive([]); // false
isPrimitive(new String('test'));
```

## Check values and types with `valueOf()`

Using `valueOf()` in combination with `Object()`, we can check whether values match certain types.

```js
function isNumber(value) {
  // The + operator coerces the value to number.
  return +(value) === Object(value).valueOf();
}

isNumber(0) // true
isNumber('0') // false
```

Note that `NaN` is not equal to itself and will result in `false` being returned here:

```js
isNumber(NaN) // false
```

We can devise a function that checks whether a value is the value `NaN`.

```js
function isNaN(value) {
  var n = Object(value).valueOf();
  return n !== n;
}

isNaN(NaN) // true

isNaN('NaN') // false
isNaN(undefined) // false
isNaN(null) // false
isNaN() // false
```

## Safely iterating on keys

A surprising result, `Object.keys(null)` throws an error:

```js
// Uncaught TypeError: Cannot convert undefined or null to object
```

whereas `Object.keys(NaN)` returns an empty array:

```js
// []
```

We can define two ways to iterate safely over non-values, using `Object()` internally.

Checking for all keys in an object, including those that are inherited, we can use it to avoid potential `x in y` crashes where *y* is a primitive.

```js
function isIn(key, y) {
  return key in Object(y);
}

isIn('toString', {}); // true
isIn('toString', 'hello'); // true
```

If you don't need to check inherited properties, you can use the `hasOwnProperty` method instead of the `in` operator.

```js
function isOwn(key, y) {
  return Object(y).hasOwnProperty(key);
}

isOwn('toString', {}); // false
isOwn('toString', 'hello'); // false
```

Both of those operations are `NaN`-safe.

```js
isIn('toString', NaN); // true
isOwn('toString', NaN); // false
```

The `isIn` result may be surprising, but remember that `NaN` is a primitive number and can be cast to a Number instance using the parentheses remedy:

```js
(NaN).constructor
// Number() { [native code] }
(NaN).toString()
// "NaN"
```

## Arrays with empty (unassigned) slots

You can even use `Object()` to find any empty slots in an array. 

Array iterator methods like `forEach`, `map`, `filter`, `some`, and so on, do not process items at indexes where values have not been assigned.

The following array has an empty slot at index 1.

```js
var array = [ 'first', , 'third' ];
```

The `map` method will return only the two items assigned:

```js
array.map(item => item).length
// 2
```

That's OK, but we may want to know whether an array has empty slots, and where they are located. 

The following function returns an array containing indexes of empty slots in an array. We make this function safe by creating a new object from the parameter, which may be a non-value or not an object.

```js
function emptySlots(arr) {
  var indexes = [];
  var subject = Object(arr);
  
  for (var i = 0; i < subject.length; i++ ) {

    // Alternative: `if (!(i in subject)) { ... }`
    if (!subject.hasOwnProperty(i)) {
      indexes.push(i);
    }
  }
  
  return indexes;
}

emptySlots(array);
// [ 1 ];
```

And that is `null` safe:

```js
emptySlots(null);
// []
```

## Conclusion

These are just a few examples, but you can see we avoid boilerplate in the form of guard clauses and type checks by using JavaScript's `Object()` constructor for gradual type and value access safety.
