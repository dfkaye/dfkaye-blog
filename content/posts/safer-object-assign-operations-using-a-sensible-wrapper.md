---
title: "Safer Object.assign() operations using a sensible wrapper."
date: 2020-08-21T12:04:43-07:00
lastmod: 2020-08-31T14:22:41-07:00
description: "Use safe-assign to merge each object or array onto another (p) only if p is an object or array, and return a copy of p; otherwise, return p."
tags: 
- "JavaScript"
- "Object"
- "Assignment"
- "Safety"

---

*Original gist on github at https://gist.github.com/dfkaye/e5e2ce68acd70b1358c62b9ac641df81.*

## Test

You can visit the [test suite for safe-assign.js](/demos/safe-assign-test-suite/).

## Source

{{< rawhtml >}}
You can view the source of the safe-assign module at <a href="/js/lib/safe-assign.js">/js/lib/safe-assign.js</a>.
{{< /rawhtml >}}

## Rationale

`Object.assign()` allows for accidental pollution of built-in objects, and creation of non-object types.

The point of `safe-assign` is to allow users to pass anything,

1. without blowing up,
2. retain the initial value if it is not an object or array,
3. obtain a modified copy of the initial object or array to be updated,
4. mixing only objects or arrays into the new model.

## How `Object.assign()` works

`Object.assign()` and the object spread notation allow you to merge unlike objects, i.e., arrays into objects, objects into arrays.

```js
// merging an array into an object
var o = Object.assign({}, {name: 'dog'}, [1,2,3]);

console.log(o);
// Object { 0: 1, 1: 2, 2: 3, name: "dog" }

// merging an object into an array
var a = Object.assign([], {name: 'dog'});

console.log(a.name);
// "dog" - name entry is inserted
```

That feels unwise, and, while it is occasionally useful, even the
`JSON` module disagrees with object keys on an array. You can remove non-index keys from an array with `JSON.parse( JSON.stringify(array) )`:

```js
var a = Object.assign( [], {name: 'dog'} );
var json = JSON.stringify(a, null, 2);

console.log( JSON.parse(json).name );
// undefined - `name` entry is removed
```

That applies to nested arrays.

```js
var json = JSON.stringify( { array: a }, null, 2 );

console.log( JSON.parse( json ).array.name );
// undefined - `name` entry is removed from the `array` property.
```

Assigning to objects, `Object.assign()` works in fairly predictable manner (for JS), assigning and/or creating keys from the source onto the target.

```js
console.log( Object.assign({}, { name: 'hello' }) ); // Object { name: "hello" }
console.log( Object.assign([], ['hello']) ); // Array [ "hello" ]

console.log( Object.assign({}, ['hello']) );
/* Object(1)
0: "hello"
*/

console.log( Object.assign([], { name: 'hello' }) );
/* Array []
length: 0
name: "hello"
*/
```

## How safe-assign works

The `safe assign()` function works the same way, merging arrays onto objects and objects onto arrays.

```js
console.warn( assign({}, ['world']) );
/* Object [ "world" ]
0: "world"
*/

console.warn( assign([], { name: 'world' }) );
/* Array []
length: 0
name: "world"
*/

console.warn( assign({ 1: 'one' }, ['a', 'b' ]) );
/* Object(2)
0: "a"
1: "b"
*/

console.warn( assign(['a', 'b'], { 0: 'one' }) );
// Array [ "one", "b" ]
```

## What they share.

Both allow you to merge multiple source objects.

```js
console.log(
  Object.assign({ first: 'first' }, { middle: 'middle' }, { last: 'last' })
);
// Object { first: "first", middle: "middle", last: "last" }

console.log( assign({ first: 'first' }, { middle: 'middle' }, { last: 'last' }));
// Object { first: "first", middle: "middle", last: "last" }
```

## Problems with `Object.assign()` that `safe assign` addresses.

If the source is a string and the target is an object, `Object.assign()` mixes the string's indexes into the target as new keys.

```js
console.log( Object.assign({}, 'hello') );
// Object(5) [ "h", "e", "l", "l", "o" ]

console.log( Object.assign([], 'hello') );
// Array(5) [ "h", "e", "l", "l", "o" ]
```

That can produce unfortunate results like this:

```js
console.log( Object.assign(['a', 'b'], "should not copy", { 2: 'SEE' }) );
// Array(15)
//["s", "h", "SEE", "u", "l", "d", " ", "n", "o", "t", " ", "c", "o", "p", "y"]
```

We would rather expect the above to produce the following, without errors or mix ups:

```js
console.log( Object.assign(['a', 'b'], { 2: 'SEE' }) );
// Array(3) [ "a", "b", "SEE" ]
```

The `safe assign` function produces that result:

```js
console.warn( assign(['a', 'b'], "should not copy", { 2: 'three' }) );
// Array(3) [ "a", "b", "three" ]
```

## Other surprising results.

### Numbers

In the case of assigning data to a primitive number, e.g., `Object.assign()` creates a `Number` object, and adds string indexes to it.

```js
var n = Object.assign(1, 'hello');

console.log( n );
/* 
Number
0: "h"
1: "e"
2: "l"
3: "l"
4: "o"
*/
console.log( n[0] ); // 'h'
```

You can update the `Number` object with a string index.

```js
console.log( Object.assign( n, 'Q' ));
/* 
Number
0: "Q"
1: "e"
2: "l"
3: "l"
4: "o"
*/
```

The `safe assign` function instead returns the orignal value, not a new `number` object.

```js
console.warn( assign(1, 'hello') ); // 1
console.warn( assign(1, 'hello')[0] ); // undefined
```

### Strings

`Object.assign()` will create a `String` object from an initial string argument.

```js
console.log( Object.assign('name') ); // String { "name" }
```

However, in the case of merging to a `String`, the result is alarming. `Object.assign()` throws an error, treating any non-empty index in the string as 'immutable', rather than returning the `String` object unmodified.

```js
try {
  Object.assign('x', 'hello');
} catch(e) {
  console.log(e);
  // TypeError: 0 is read-only
} finally {
  // This works because no slots have been assigned.
  console.log( Object.assign('', 'hello') );
  /* 
  String
  0: "h"
  1: "e"
  2: "l"
  3: "l"
  4: "o"
  */  
}
```

The `safe assign` function doesn't blow up when faced with a string target, but returns the original value without modification.

```js
console.warn( assign('x', 'hello') ); // 'x'
```

### `null` and `undefined` 

The same is true when assigning to `null` (and `undefined`).

`Object.assign(null, ...)` results in an error, whereas the `safe assign` function returns `null`.

```js
try {
  Object.assign(null, ['a', 'b' ]);
} catch(e) {
  console.log(e);
  // TypeError: can't convert null to object
} finally {
  console.warn( assign(null, ['a', 'b' ]) );
  // null
}
```

### Typed objects.

As with objects and arrays, `Object.assign()` will merge keys from another object or string onto typed object targets - for example, a `RexExp` object:

```js
console.log( Object.assign(new RegExp('123'), 'abc'));
/* /123/
0: "a"
1: "b"
2: "c"
global: false
ignoreCase: false
lastIndex: 0
multiline: false
source: "123"
sticky: false
unicode: false
*/
```

The `safe assign` function returns the original `RegExp` object unmodified.

```js
console.log( assign(new RegExp('123'), 'abc') );
```

That means you can't modify the window or global environment with the `safe assign` function.

```js
console.log( assign(Math, {
  idea: function() {
    return new Error('not a good one');
  }
}).idea );
// undefined
```

Instead, you can create a copy...

```js
console.log( assign({}, Math, {
  idea: function() {
    return 'good one';
  }
}).idea() );
// 'good one'
```

...which is what you should do with Object.assign() anyway...

```js
console.log( Object.assign({}, Math, {
  idea: function() {
    return 'yes';
  }
}).idea() );
// 'yes'
```

...and that is the point.

## Conclusion

`Object.assign()` allows for accidental pollution of built-in objects, and creation of non-object types, whereas the `safe assign` function avoids exactly that.

Stay sane. Stay safe. Use safe-assign.
