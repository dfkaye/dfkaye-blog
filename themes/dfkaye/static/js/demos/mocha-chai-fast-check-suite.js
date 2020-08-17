/* mocha, chai, fast-check demo suite */

describe("mocha + chai", function () {
	var expect = chai.expect;
	var assert = chai.assert;
	var fixture = document.querySelector('[id="fixture"]');

	describe("expect", () => {
		it('works', () => {
			expect(true).to.equal(true);
		});
	});

	describe("assert", () => {
		it('works', () => {
			assert(1);
		});
	});

	describe("fixture", () => {
		it('exists', () => {
			expect(fixture.id).to.equal("fixture");
		});
	});

	describe("fastcheck passing", function () {
		var fc = fastcheck;

		// Code under test
		var contains = (text, pattern) => text.indexOf(pattern) >= 0;

		// string text always contains itself
		it('should always contain itself', () => {
			fc.assert(fc.property(fc.string(), text => contains(text, text)));
		});

		// string a + b + c always contains b, whatever the values of a, b and c
		it('should always contain its substrings', () => {
			fc.assert(fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
				// Alternatively: no return statement and direct usage of expect or assert
				// return contains(a+b+c, b);

				assert(contains(a + b + c, b));
			}));
		});
	});

	describe("fastcheck failing", function () {
		var fc = fastcheck;

		// Code under test
		var add = (a, b) => a + b;

		it('should fail by returning 0 when the check is boolean', () => {
			fc.assert(fc.property(fc.integer(), fc.integer(), (a, b) => {
				return add(a, b);
			}));
		});

		// string a + b + c always contains b, whatever the values of a, b and c
		it('should also fail', () => {
			fc.assert(fc.property(fc.string(), fc.string(), (a, b) => {
				// Alternatively: no return statement and direct usage of expect or assert
				// return add(a, b);
				console.log(a, b);
				assert(typeof add(a, b) == "number", "should return a number");
			}));
		});

	});
});
