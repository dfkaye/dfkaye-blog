---
title: "Facebook Still Breaking Things"
date: 2020-11-07T12:34:49-08:00
lastmod: 2020-12-02T12:58:49-08:00
description: "Mocha v8.1.0 breaking change due to new Facebook library dependency"
tags:
- "Testing"
- "JavaScript"
- "Content Security Policy"
- "Function"
---

I've been deprecating my old library, [where.js](https://github.com/dfkaye/where.js), this month and replacing it as [wheredoc](https://github.com/dfkaye/wheredoc), which uses ES6 import syntax, which means it always runs in "strict" mode. 

While working on browser tests for wheredoc using [Mocha](https://mochajs.org/) version 8.2.0, around November 6 and 7, I started seeing Content-Security-Policy "eval not allowed" errors.

## Updates

### 8 November 2020

Things work in the browser when using Mocha 7.0.1, but not Mocha 8.1.0. The breaking change is in Mocha 8.x.x.

### 2 December 2020

Things work **best** when fetching a single script that contains all the `import` statements.

```html
<script type="module" nonce="..." src="/examples/mocha/setup.js"></script>
```

```js
/* setup.js */
import "https://unpkg.com/mocha/mocha.js"
import "https://unpkg.com/chai/chai.js"
import { where } from '../../where.js';

mocha.setup('bdd')

// et cetera

mocha.checkLeaks();
mocha.run();

console.log('Tests complete. <Guy Fieri/>');
```

***The CSP error occurs when using an ES module `import` statement in an inline script to fetch mocha from unpkg.com...***

```html
<script type="module" nonce="...">
import "https://unpkg.com/mocha/mocha.js"
...
```

***...or when running `mocha.setup()` outside the scope of the context that imports mocha.***

Here we use a `<script>` element's `src` attribute to fetch mocha from unpkg.com, but then refer to mocha the global in another context.

```html
<script type="module" nonce="..." src="https://unpkg.com/mocha/mocha.js"></script>
<script nonce="...">
  // This will fail in strict CSP.
  mocha.setup()

  // et cetera
</script>
```

## Details

I was pretty sure this used to work in Mocha v5.2.0, but I may not remember the setup correctly. We avoided `Function()` in our source code in other projects, but we did use a no-eval CSP and ES6 imports in our test page, circa 2018-2019.

Anyway, here's the Mocha v8.1.3 source that comes bundled with v0.13 of regenerator/runtime.js, line 726, approximately:

```js
}( // In sloppy mode, unbound `this` refers to the global object, fallback to
// Function constructor if we're in global strict mode. That is sadly a form
// of indirect eval which violates Content Security Policy.
function () {
  return this;
}() || Function("return this")());
```

See github for a longer, more condescending comment:
https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js#L735-L748

## What that means

If you're testing in a no-eval CSP setting and using ES6 imports, Mocha now fails, *whether your own code calls `Function()` or not*. You have to set 'unsafe-eval' in your `script-src` CSP definition.

Worse, projects depending on this stuff, even battle-tested Mocha, are apparently unaware of what is going on.

## Why?

The surprise is that the regenerator code was created without import syntax or strict mode in mind. At least that team acknowledges the issue. But I'm surprised that given Facebook's embrace-the-future-of-syntax approach (TypeScript, e.g.), the team did not start with the most restrictive and hostile environment in mind.
