---
title: "JavaScript's eval() and Function() constructor"
date: 2021-06-02T16:11:08-07:00
lastmod: 2021-06-02T16:11:08-07:00
description: In a *future* post, I argue that the `Function()` constructor in JavaScript can be used for good, solving specific problems. Preparatory to that, in *this* post, I examine the `eval()` function and the `Function()` constructor to highlight their similarities as well as their subtle differences, and how to use them without problems.
tags:
- "JavaScript"
- "eval"
- "Function"
- "metaprogramming"
- "performance"
---

*First published {{<rawhtml>}}<time datetime="2014-03-14">March 14, 2014</time>{{</rawhtml>}} on the hexo+github blog. I have cleaned this version a little bit, but left older browser references and ES5 code practices in place.*

<!-- more -->

## Good or bad?

As JavaScript developers we have long been warned about using the functions 1. `eval()`, 2. `Function()`, 3. `setInterval()` and 4. `setTimeout()`, most famously by [Douglas Crockford](https://crockford.com/code.html) (*scroll to the bottom*).

Since then several authors have shown safe use cases for the `eval()` function and the `Function()` constructor:

+ [Simon Willison](https://blog.simonwillison.net/): [Don't be eval](https://24ways.org/2005/dont-be-eval/)
+ [Ben Nadel](https://www.bennadel.com/index.cfm): 
  [Faking Context In Javascript's Function() Constructor](https://www.bennadel.com/blog/1927-Faking-Context-In-Javascript-s-Function-Constructor.htm)
  in which he uses `eval()` inside a loop inside a `Function()` constructor string.
+ {{< rawhtml >}}[Alex Young](http://twitter.com/alex_young): 
  <del>[JS101: The Function Constructor](http://dailyjs.com/2012/07/09/function-2/)</del>{{< /rawhtml >}} - Find this one on the Internet Archive at https://web.archive.org/web/20120714003308/http://dailyjs.com/2012/07/09/function-2.
+ [Nicholas Zakas](https://www.nczonline.net/blog): 
  [eval() isn't evil, just misunderstood](https://www.nczonline.net/blog/2013/06/25/eval-isnt-evil-just-misunderstood/) 
+ [Christopher Wellons](https://github.com/skeeto): 
  [JavaScript Function Metaprogramming](https://nullprogram.com/blog/2013/08/17/)

We'll list some problems with these methods - at a higher level - then proceed 
with the API, and how to work around the problems in code.

## Problems

### Overuse

The general case we are warned against is *naive overuse*. The following example is taken from a [stackoverflow](http://stackoverflow.com/a/87260) thread on not using `eval()` - to wit, doing this

```js
eval('document.' + potato + '.style.color = "red"');
```

instead of using either DOM Level 1 element access,

```js
document[potato].style.color = 'red';
```

or DOM Level 2 element access,

```js
document.getElementById(potato).style.color = 'red';
```

### Errors

The special case is passing in source code from over the wire - an Ajax response, for example - in order to create an object and apply it to already running code.  The danger is that malicious or malformed code will result in errors, causing your application to misbehave or stop behaving altogether.

In response to this issue in particular, Douglas Crockford promoted the use of `JSON.parse()` and `JSON.stringify()` methods for processing Ajax response text to avoid evaluating Json as JavaScript.

### Local scope access

The `eval()` function also has access to any variables within the calling context or execution scope (i.e., inside the function) in which it is used. That makes it unsafe, if you want to avoid clobbering local variables inadvertently.

The `Function()` constructor, in contrast, does __not__ have access to the calling scope, but malicious or malformed code will still cause problems.

### Global scope access

The `eval()` function has access to the global scope, so it can clobber any globals as well. The `Function()` constructor shares this problem.

### Debuggers

The `eval()` function acts as a code generator of sorts. Code generated at runtime is harder to debug - that is, step through with a debugger - because you can't set break points on code that hasn't been evaluated. The `Function()` constructor shares this problem.

### Performance

Another problem is the performance hit that the `eval()` function incurs because it must parse, evaluate, then interpret, source code of unpredictable size - it may contain few statements, or very many. The `Function()` constructor shares this problem.

That last point, that the input size is not knowable beforehand, means that code minifiers can't minify the blocks of strings ahead of time, and that runtime engines may not be able to optimize lookahead caching (a fancy way of saying, they can't compile it).

## How to use them anyway (the API)

The `eval()` function evaluates a string representing JavaScript code and executes it.

```js
eval(code)
```

The `Function()` constructor can be called with or without the `new` operator. The `Function()` constructor takes 
one or more string arguments and produces a new function object. The last argument is a string representing JavaScript code. 
        
Here's an example using no parameter names,

```js
var F = Function(code)
```

Arguments before the code are evaluated as parameter names to be applied to the new function object.  This can take one of 3 forms.

1. Explicit param name strings

```js
var F = Function('a', 'b', code);
```

2. Comma-separated param names in a string

```js
var F = Function('a, b', code);
```

3. An array of param name strings

```js
var F = Function(['a', 'b'], code);
```
    
The array signature turns out to be quite handy, not only for the param names,

```js
var argNames = ['a', 'b'];
```

...but for the code or function body parts, too,

```js     
var lines = [
  "console.log(arguments.length);",
  "console.log(a);",
  "console.log(b)"
];
```

...allowing us to create a factory that takes two arrays of strings and returns a new function we can test out,

```js
function factory(params, lines) {
  
  // ...preprocessing statements here...
  
  return Function(params || '', lines.join('\n'));
}

var test = factory(argNames, lines);
```

where `argNames` is the array ['a', 'b'], and `lines` is the list of console statements.

The following example `test` function calls show the expected console output in comments.

```js
test(3, 5); // 2, 3, 5
test(88); // 1, 88, undefined
test(0, 1, 4); // 3, 0, 1
test(null); // 1, null, undefined   
```

## Scope of `this`

### `eval()` function

In the `eval()` function, `this` refers to the scope of the calling context. In *general*, `this` will refer to the global scope

```js
(function testEval() {
  eval('console.log(this);'); // window or global
}());

(function testEval() {
  (function nested() {
    eval('console.log(this);'); // window or global
  }());
}());
```

### Constructor usage

Where the `eval()` function is called inside a function invoked with the `new` operator, `this` refers to the *constructor* (rather than the newly created object). In he following example, calling `new EvalTest` results in "EvalTest" (surprisingly) and "true" being printed to the console.

```js
function EvalTest() {
  eval('console.log(this);'); // EvalTest !
  eval('console.log(this instanceof EvalTest);'); // true
}
```

That can be done with inline definition and instantiation.

```js
new (function EvalTest(){
  eval('console.log(this);'); // EvalTest !
  eval('console.log(this instanceof EvalTest);'); // true      
});
```

### `Function()`
    
In the `Function()` constructor, `this` is the global scope by default. The following examples use immediate invocations of the new function object,

1. inside a function,

```js
(function testFunction() {     
  Function('console.log(this);')(); // window or global
}());
```

2. as an anonymous constructor (note the `new` keyword),

```js
(function testFunction() {     
  new Function('console.log(this);')(); // window or global
}());
```

3. inside another constructor (note the `new` keyword),

```js    
new (function testFunction() {
  Function('console.log(this);')();  // Window or global
});
```

### Named constructors

When the created function object is invoked as a *named* constructor with the `new` keyword, `this` refers to the instantiated object.

```js
(function testFunction() {
  var F = Function('console.log(this.toString());');

  F(); // [object Window]

  new F();  // [object Object]
}());
```

### Using `call()` and `apply()`

If you set the scope dynamically, as with any function, using `call` or `apply`, then `this` refers to that scope,

```js
(function testFunction() {     
  Function('console.log(this.id);').call({ id: 'fake' }); // 'fake'
}());
```

When `call` or `apply` are invoked with `null` or undefined scope, `this` refers to the global scope,

```js
(function testFunction() {     
  Function('console.log(this);').apply(); // Window or global
}());
```

## Scope access

### `eval()`

Because the `eval()` function has access to the global scope, the following `eval` execution *creates* a new global variable,

```js
(function testEval() {
  eval('answer = 42');

  console.log(answer); // 42
}());

console.log(answer); // 42
```

However, because the `eval()` function has access to the calling or local scope, the `eval()` function will clobber named variables declared inside that scope without affecting the global scope. 

For example, while the `answer` variable is defined externally, it is also defined internally to the test function. In this case, `eval()` will affect only the internal variable.

```js
var answer = 'default';

(function testEval() {
  var answer;

  eval('answer = 42');

  console.log(answer); // 42
}());

console.log(answer); // 'default'
```

### `Function()`

The `Function()` constructor has access to the global scope and can create or clobber global variables

```js
(function testFunction() {     
  Function('answer = 42')();

  console.log(answer); // 42
}());

console.log(answer); // 42 ! here's our leak
```

The `Function()` constructor does __not__ have access to the local scope

```js
(function testFunction() {
  var answer = 'default';

  Function('answer = 42')();

  console.log(answer); // 'default'
}());
```

However, that last example will create or clobber any global variable named `answer`.

```js
console.log(answer); // 42 ! here's our leak
```

## re Strict mode

As Nicholas Zakas argues, we can [start using strict mode](http://www.nczonline.net/blog/2012/03/13/its-time-to-start-using-javascript-strict-mode/) in ES5 runtimes to *prevent* the accidental creation and/or clobbering of globals.  

Here's the general usage of strict mode within a function where an undeclared variable is assigned a value, resulting in a `ReferenceError`.

```js
(function testFunction() {     
  "use strict";

  (function() {
    answer = 42; // ReferenceError: assignment to undeclared variable answer
  })();

  console.log(answer); // n/a
}());
```

### Strictly `eval()`

We can use strict mode with the `eval()` function to prevent leaking and clobbering from within a local scope, even when declaring "use strict" inside of `eval`,

```js
(function testEval() {
  var answer;

  eval('"use strict"; answer = 42');

  console.log(answer); // 42
}());
```

When the variable is not declared, strict mode throws a `ReferenceError`, whether "use strict" is external to `eval`,

```js
(function testEval() {
  "use strict";

  eval('answer = 42'); // ReferenceError: assignment to undeclared variable answer

  console.log(answer); // n/a
}());
```

...or internal,

```js
(function testEval() {
  eval('"use strict"; answer = 42'); // ReferenceError: assignment to undeclared variable answer

  console.log(answer); // n/a
}());
```

## Strict mode in the `Function()` constructor

Because `Function()` does not have access to the local scope, the "use strict" pragma must be included in the `Function()` body in order to prevent leaking and clobbering from within a local scope.  

The following example fails (i.e., fails to prevent an accidental global),

```js
(function testFunction() {     
  "use strict";

  Function('answer = 42')();
  
  console.log(answer); // 42 -- expected
}());

console.log(answer); // 42 -- leaking
```

The following example works (i.e., resulting in a `ReferenceError`),

```js
(function testFunction() {     
  Function('"use strict"; answer = 42')(); // ReferenceError: assignment to undeclared variable answer
  
  console.log(answer); // n/a
}());
```

## The *paranoid sandbox* pattern

For runtimes that do not support strict mode, you need to implement a sandbox that cleans up any accidental or temporary globals created when running the `Function()` constructor or the `eval()` function.

Here's a short implementation of such a sandbox function,

```js
function sandbox(fn) {

  // hack for cross-platform global
  global = global || window;
  
  var keys = {};
  var result, k;
  
  for (k in global) {
    keys[k] = k;
  }
  
  result = fn();
  
  for (k in global) {
    if (!(k in keys)) {
      delete global[k];
    }
  }
  
  return result;
}
```

First, we run a pre-test that collects all keys currently assigned to the global namespace. Then, after the target function is run, we clean up any new keys found in the global namespace.

The following is a drastically reduced example of using it,

```js
var context = {
  name: 'david',
  occupation: 'typist'
};

var code = [
  'for (var key in context) {',
  '  if (context.hasOwnProperty(key)) {',
  '    console.log(key);',
  '  }',
  '}'
];

sandbox(function () {
  Function('context', code.join('\n'))(context);

  return context;
});
```

**The key is to use the `Function()` constructor *inside* another function that is actually passed to the `sandbox` function.**

## Debugging, breakpoints, dev-tools, etc.

I confess I do not use line debuggers when isolating problems in JavaScript, as I prefer the healthy practice of [test-driven development](/posts/2020/06/12/my-web-development-philosophy/#test-everything). However, following Paul Irish's Chrome dev-tools [live recompilation demo](http://www.youtube.com/watch?v=WQZio5DlSXM), I was able to live edit this fragment using breakpoints, live-edit, {{< rawhtml >}}<kbd>CTRL+S</kbd> or <kbd>CMD+S</kbd>{{< /rawhtml >}}, and play with a successful result.

```js
;(function () {
  var id = 'rest'; // should be 'result' instead

  var code = [
    'var result = document.getElementById(\'' + id + '\');',
    
    'result.textContent = \'success\';'
  ];

  Function(code.join('\n'))();
}());
```

So, yes, it can be done, as our tools are maturing.

## Evaluating Performance

It depends. Not all JavaScript runtimes optimize the same things, or even in the same way. OK, truism, yes. Everyone immersed in the performance wars has learned that performance varies, and not all things require performance optimization.

Nicholas Zakas in [High Performance JavaScript](http://shop.oreilly.com/product/9780596802806.do), 
illustrates the performance cost that use of the `eval()` function or the `Function()` constructor incurs. [Here's the relevant excerpt](http://answers.oreilly.com/topic/1374-avoid-double-evaluation-for-faster-javascript/) with a data table showing the cost in time for each browser runtime.

Published in 2010, that table shows performance slowing by whole orders of magnitude (10 to 100 times) depending which runtime is used. Since then, the browser engine wars have narrowed this difference significantly.

From this [jsperf test](http://jsperf.com/function-vs-constructor-vs-eval), comparing the `eval()` function, the `Function()` constructor, and `function expressions`, the only consistent results I've seen on so far include:

+ The `Function()` constructor is consistently slowest on FF 27 by 60% or more ~ this is the worst 
disparity among the three approaches on any of the modern browsers I've tried.
+ No strategy wins on IE 11 ~ each approach has shown up as 'fastest' on repeated test runs
+ Performance distribution is narrowest on Chrome 33 and Opera 19

(BTW, [Don't abuse JSPerf](https://medium.com/p/bafed6cc7979) ~ thanks ;)

## Projects with `eval` in the wild

Initially I examined these cases after looking through a couple of interesting projects for node.js.  

+ [load](https://github.com/3rd-Eden/load) ~ a "paranoid sandbox" that executes browser-like JavaScript on node.js without the module pattern, and removing global assignments after use.
+ [Testing Private State and Mocking Dependencies](http://howtonode.org/testing-private-state-and-mocking-deps) ~ interesting example using the node.js `vm` module as a code sandbox for mocking during tests.

You can also visit some projects I have done using the `Function()` constructor in various ways:

+ [vm-shim](https://github.com/dfkaye/vm-shim) ~ create a code sandbox similar to node.js `vm.runInContext`, `vm.runInNewContext`, and `vm.runInThisContext` methods, using the "paranoid sandbox" technique.
+ [metafunction](https://github.com/dfkaye/metafunction) ~ introspection module for mocking and testing a function's internals, also uses the "paranoid sandbox" technique.
+ [wheredoc](https://github.com/dfkaye/wheredoc) ~ test library helper method for running data-driven tests against a commented text data table directly in the test.
