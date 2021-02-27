---
title: "Data-driven testing with wheredoc"
date: 2020-12-02T14:30:21-08:00
lastmod: 2020-12-02T14:30:21-08:00
description: "wheredoc is the ES6-friendly successor to where.js, a JavaScript module for data-driven tests in Mocha, QUnit, tape, and others."
tags:
- "Testing"
- "JavaScript"

---

<!--more-->

*The previous incarnation of this project is [where.js](https://github.com/dfkaye/where.js) created in 2014, now deprecated as of November 17, 2020.*

## Data-driven tests

The intial inspiration comes from a post by [JP Castro](https://twitter.com/jphsf) from 2012, [DRYing Up Your JavaScript Jasmine Tests With the Data Provider Pattern](http://blog.jphpsf.com/2012/08/30/drying-up-your-javascript-jasmine-tests).

Here's JP's example with a custom `using()` function that wraps each Jasmine `it()` test.

```js
describe("username validation", function() {
  using("valid values", ["abc", "longusername", "john_doe"], function(value){
    it("should return true for valid usernames", function() {
      expect(validateUserName(value)).toBeTruthy();
    })
  })

  using("invalid values", ["ab", "name_too_long", "no spaces", "inv*alid"], function(value){
    it("should return false for invalid usernames", function() {
      expect(validateUserName(value)).toBeFalsy();
    })
  })
})
```

JP's `using()` function accepts an array of values plus a test callback that runs over each item in the array.

## wheredoc

My main goal was to remove the need for a lengthy array argument.

With wheredoc, you can use docstring-like data tables in JavaScript tests, [Spock's `where:` block](http://spockframework.org/spock/docs/1.0/data_driven_testing.html) and [Cucumber's Scenario Outline `Examples:` block](https://javapointers.com/automation/cucumber/cucumber-scenario-outline-example/).

The data table can be specified inside a function using a labeled statement followed by a template literal or multiline string.

```js
describe("Using Mocha and Chai.expect", (done) => {
  function spec(a, b, c) {
    expect(c).to.equal(a + b)

    where: `
      a  |  b  |  c
      1  |  2  |  3
      4  | -5  | -1
    `;
  }

  where(spec).forEach({ params, test } => {
    var { a, b, c } = params

    it(`${c} should equal ${a} + ${b}.`, test)
  })

  done()
})
```

## Alternate syntax

Instead of a spec function, you can define an object with a `doc` string containing the data table, and a `test` function.

```js
describe("Using Mocha and Chai.expect", (done) => {
  var spec = {
    test: function(a, b, c) {
      expect(c).to.equal(a + b)
    },
    doc: `
      a  |  b  |  c
      1  |  2  |  3
      4  | -5  | -1
    `
    }
  };

  where(spec).forEach({ params, test } => {
    var { a, b, c } = params

    it(`${c} should equal ${a} + ${b}.`, test)
  })

  done()
})
```

## Scenarios

The `where` function returns an array of scenarios (or corrections to be made if there are formatting errors). You run these with `forEach`, passing a callback.

## Live Test Suite

You can view a demo of the wheredoc test suite running on this blog at [{{< baseurl >}}/demos/wheredoc-test-suite/]({{< baseurl >}}/demos/wheredoc-test-suite/).

## Github repo

View the README for more information, examples, etc., at https://github.com/dfkaye/wheredoc.

## More documentation

[Details](https://github.com/dfkaye/wheredoc/blob/master/docs/details.md) contains a deep dive into spec formats, how the design is simplified, handling scenarios, how and why the whole API is exposed (though you only need to use the `where` function).

[Examples](https://github.com/dfkaye/wheredoc/blob/master/docs/examples.md) shows how to use different testing libraries on Node.js and the browser.

[Node.js, ES modules and CommonJS](https://github.com/dfkaye/wheredoc/blob/master/docs/esm-cjs.md) covers details on importing CommonJS and ES2015 modules in Node.js.

[Data table value types](https://github.com/dfkaye/wheredoc/blob/master/docs/values.md) lists the different "types" of values you can define in the docstring table.
