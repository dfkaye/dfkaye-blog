---
title: "mocha+chai+fast-check"
draft: false
---

<!-- ![alt](//via.placeholder.com/480x150) -->

This page runs [mocha](https://mochajs.org/), [chai](https://www.chaijs.com/), and [fast-check](https://github.com/dubzzz/fast-check/) in the browser.

There are some customizations and overrides in the CSS to make it fit properly on this blog.

You can see roughly the same setup [at this codepen](https://codepen.io/dfkaye/pen/XWXgQxZ).

{{< rawhtml >}}
<link rel="stylesheet" href="https://unpkg.com/mocha/mocha.css">

<style mocha-css-override>
#mocha {
	border-top: 1px solid deepskyblue;
	margin: unset;
}

#mocha-stats {
	position: relative;
	top: unset;
	right: unset;
	text-align: right;
	border-bottom: 1px dotted green;
}
</style>

<!--
idea copied from Robert Blixt,
https://codepen.io/devghost/pen/eZWxmo
-->
<div id="fixture"></div>
<div id="mocha"></div>

<script crossorigin src="https://unpkg.com/mocha/mocha.js"></script>
<script crossorigin src="https://unpkg.com/chai/chai.js"></script>
<script crossorigin src="https://unpkg.com/fast-check@*/lib/bundle.js"></script>

<script>

// code to be tested goes up here

// ...

// mocha, chai, and fastcheck are globals
// loaded from unpkg.com

mocha.setup("bdd");

describe("mocha + chai", function() {
  var expect = chai.expect;
  var assert = chai.assert;
  var fixture = document.querySelector('[id="fixture"]');
	
  describe("expect", () => {
    it('works', () => {
      expect(true).to.equal(true);
    });
  });
  
  describe("asserts", () => {
    it('works', () => {
      assert(1);
    });
  });

  describe("fixture", () => {
    it('exists', () => {
      expect(fixture.id).to.equal("fixture");
    });
  });
	
	describe("fastcheck passing", function() {
		var fc = fastcheck;
		
		// Code under test
		var contains = (text, pattern) => text.indexOf(pattern) >= 0;

		// string text always contains itself
		it('should always contain itself', () => {
			fc.assert(fc.property(fc.string(), text => contains(text, text)));
		});
		
		// string a + b + c always contains b, whatever the values of a, b and c
		it('should always contain its substrings', () => {
			fc.assert(fc.property(fc.string(), fc.string(), fc.string(), (a,b,c) => {
				// Alternatively: no return statement and direct usage of expect or assert
				// return contains(a+b+c, b);
				
				assert(contains(a+b+c, b));
			}));
		});
	});
	
	describe("fastcheck failing", function() {
		var fc = fastcheck;
		
		// Code under test
		var add = (a, b) => a + b;

		it('should fail by returning 0 when the check is boolean', () => {
			fc.assert(fc.property(fc.integer(), fc.integer(), (a,b) => {
				return add(a, b);
			}));
		});
		
		// string a + b + c always contains b, whatever the values of a, b and c
		it('should also fail', () => {
			fc.assert(fc.property(fc.string(), fc.string(), (a,b) => {
				// Alternatively: no return statement and direct usage of expect or assert
				// return add(a, b);
				console.log(a, b);
				assert(typeof add(a, b) == "number", "should return a number");
			}));
		});

	});
});

mocha.run();

</script>
{{< /rawhtml >}}

You can open the console to see some of the generated arguments for the failing tests.

Examples:

		>jq5 /!!
		"v&"%"t# &*


### Tech used

* [rawhtml shortcode](https://anaulin.org/blog/hugo-raw-html-shortcode/) by Ana Ulin.
* packages from unpkg.com:
	* [mocha.css](https://unpkg.com/mocha/mocha.css)
	* [mocha.js](https://unpkg.com/mocha/mocha.js)
	* [chai.js](https://unpkg.com/chai/chai.js)
	* [fast-check library bundle](https://unpkg.com/fast-check@*/lib/bundle.js)

