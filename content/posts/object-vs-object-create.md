---
title: "JavaScript's Object() vs. Object.create()"
date: 2020-08-20T12:18:43-07:00
description: "Some differences between JavaScript's Object() and Object.create() functions."
tags: 
- "JavaScript"
- "Object"
- "Prototype"

---

## About this post

This post started as a gist on github at https://gist.github.com/dfkaye/e5e2ce68acd70b1358c62b9ac641df81.

+ First post: 30 Sept 2016
+ Update 14 Feb 2017: Calling a function wrapped by Object.create(function).
+ Update 11 Sep 2017: Comparing Object(null) and Object.create(null)

I have amended that with additional examples.


## Passing primitive arguments to `Object()`

`Object()` wraps the incoming argument of non-object types and returns an instance of that type with the same value - which is to say, it 'boxes' primitives to instances.

```js
console.info(
  Object(false)
  // Boolean{ }
)

console.info(
  Object(42)
  // Number{ }
)

console.info(
  Object('test')
  // String { 0="t",  1="e",  2="s",  more...}
)
```

## Passing `null` and `undefined` arguments to `Object()`

If the argument is 'null' or 'undefined, then a simple object is returned.

```js
console.info(
  Object()
  // Object{ }
)

console.info(
  Object(null)
  // Object{ }
)
```

## Passing objects to `Object()`

If the argument is an object, it is returned unchanged.

```js
console.info((function() {
    var a = {name: 'a'}
    return Object(a) === a
  }())
  // true
)
```

Arrays are objects, too.

```js
console.info(
  Object([1,2,3])
  // [1, 2, 3]
)
```

So are functions, which are instances of the `Function()` constructor, and which, like all functions, has a prototype that inherits from `Object` (the `valueOf()` method, e.g.).

```js
console.info( 
  Object(function A(){})
  // A()
)

console.info((function() {
  function a() {}
  a.hello = 'c' // an own property on the function
  return Object.keys(Object(a))
  // ["hello"]
  }())
)

console.info((function() {
  function unchanged() {}
  return Object(unchanged) === unchanged
  // true
  }())
)
```

## `Object.create()`

`Object.create()`, on the other hand, requires an "object" type argument that it uses as a prototype to create a new object.

```js
console.info( 
  Object.getPrototypeOf( Object.create({name: 'b'}) )
  // Object { name="b"}
)

console.info( 
  Object.getPrototypeOf( Object.create(null) )
  // null
)
```

The `null` argument works because its type is "object'."

```js
console.info( 
  typeof null
  // object
)
```

An `undefined` or *non-object* argument results in an error.

```js
Object.create()
// Uncaught TypeError: Object prototype may only be an Object or null: undefined

Object.create("hello")
// Uncaught TypeError: Object prototype may only be an Object or null: hello
```

## The "created" object's prototype

Because `Object.create()` uses the argument as a prototype for a new object, the prototype's keys are not 'own' keys on the object - e.g., `Object.keys()` does not include them in the returned array.

```js
console.info( 
  Object.keys(Object.create({name: 'b'}))
  // []
)

console.info( 
  Object.keys(Object.create(null))
  // []
)
```

Compare that with some erroneous arguments by type, e.g., missing, undefined, primitives...

```js
console.info((function () {
  try { Object.create()} catch (e) { return e }
  // TypeError: Object.create requires more than 0 arguments
  }())
)

console.info((function () {
  try { Object.create(undefined)} catch (e) { return e }
  // TypeError: undefined is not an object or null
  }())
)

console.info((function () {
  try { Object.create(1)} catch (e) { return e }
  // TypeError: 1 is not an object or null
  }())
)
```

## We can inherit from a `function`

Yes, we can, but *don't do this*.

Functions inherit from the `Function` constructor, as they are also objects.

`Object.create()` returns an object whose prototype is the function passed in.

```js
console.info((function () {
  var f = Object.create(function base(){ return 'hello' });
  return Object.getPrototypeOf(f)
  // base()
  }())
)
```

That will display in the console as `Function {}`&hellip;

```js
console.info(
  Object.create(function base(){ return 'hello' })
  // Function {}
)
```

&hellip;but it is *not* callable.

```js
console.info((function () {
  try { 
    var f = Object.create(function base(){ return 'hello' });
    f()
  } catch (e) { return e }
  // TypeError: f is not a function
  }())
)
```

And neither is its `.prototype` (Note from 14 Feb 2017).

```js
console.info((function () {
  try { 
    var f = Object.create(function base(){ return 'hello' });
    
    console.log( f.prototype ); // an object rather than function

    f.prototype()
  } catch (e) { return e }
  // TypeError: f is not a function
  }())
)
```

However, the returned object's `__proto__` field *is* callable, when using the `Object.getPrototypeOf()` method.

```js
console.warn((function() {
  var f = Object.create(function test(s){ return s || 'fail' })
  var p = Object.getPrototypeOf(f);
  
  console.log( p ); // test(s)
  console.log( p === f.__proto__ ); // true
  
  return [p(), p('success')].join(', ')
  // 'fail, success'
}()))
```

## Comparing `Object(null)` and `Object.create(null)`

(Note from 11 Sep 2017)

An object created with `null` as its base type inherits from `Object.prototype`.

```js
Object(null).hasOwnProperty
// function hasOwnProperty()
```

`JSON` serializing/deserializing has the same effect.

```js
JSON.parse(JSON.stringify({})).hasOwnProperty
```

On the other hand, an object created with `Object.create(null)` does *not* inherit from `Object.prototype`, returning instead a bare object, useful for raw data objects.

```js
Object.create(null).hasOwnProperty
// undefined
// ReferenceError: reference to undefined property "hasOwnProperty"
```

## A couple of use cases

1. Safe use of `Object.keys` and `Object.assign`.

`Object.keys()` will return an error if the argument is `'null` or `undefined` &mdash; which is surprising in the `null` case as `null` is an object.

```js
Object.keys(null)
// Uncaught TypeError: Cannot convert undefined or null to object
```

To prevent that, use the `Object(value)` approach.

```js
Object.keys(Object())
// []
```

2. A pure data object without inheritance.

If you want to create a base data type to which you add fields, like a map, pass a `null` argument to `Object.create()`.

```js
Object.create(null)
```

This *used to be helpful* in the days when `for ... in` loops would iterate over inherited keys as well as *own* keys.

## Further reading

For more about `Object()` see my post, [JavaScript's under-appreciated Object constructor](/posts/2020/08/05/javascripts-under-appreciated-object-constructor/).
