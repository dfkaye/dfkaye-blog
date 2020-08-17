/* Math apply: operate over a sequence of values. */
import { apply, sum, product } from "/js/lib/safe-math.js";

describe("Math.apply", function () {

  var assert = chai.assert;

  it("takes a single value", () => {
    var actual = apply(sum, 1);

    assert(actual === 1);
  });

  it('takes multiple values', () => {
    var actual = apply(sum, 1, 2, 3);

    assert(actual === 6);
  });

  it('takes values array', () => {
    var actual = apply(sum, [1, 2, 3]);

    assert(actual === 6);
  });

  it('takes comma-formatted string values', () => {
    var actual = apply(sum, "1,000", 1);

    assert(actual === 1001);
  });

  it('takes scientific notation', () => {
    var actual = apply(sum, [
      987.654E6, // numeric
      "987.654E6" // string
    ]);

    assert(actual === 2 * "987.654E6");
  });

  it('takes negative values', () => {
    var actual = apply(sum, [
      -987.654E6, // numeric
      "987.654E6" // string
    ]);

    assert(actual === 0);
  });

  it('takes boolean values', () => {
    var actual = apply(sum, [
      true,
      false,
      Boolean(true),
      Boolean(false),
      new Boolean(true),
      new Boolean(false)
    ]);

    assert(actual === 3);
  });

  it('takes String objects', () => {
    var actual = apply(sum, [
      new String(0.1),
      new String(0.2)
    ]);

    assert(actual === 0.3);
  });

  it("takes 'functionally numeric' objects", () => {
    var actual = apply(sum, [
      {
        valueOf() { return 0.1 }
      },
      {
        valueOf() { return 0.2 }
      }
    ]);

    assert(actual === 0.3);
  });

  it('adds 0.1 + 0.2 to get 0.3', () => {
    var actual = apply(sum, [0.1, 0.2]);

    assert(actual === 0.3);
  });

  it("multiplies 0.1 * 0.1 to get 0.01", () => {
    var actual = apply(product, [0.1, 0.1]);

    assert(actual === 0.01);
  });

  /* start with this but keep it at the bottom */
  describe("mocha + chai setup", function () {
    describe("chai", () => {
      it('works', () => {
        chai.assert(1);
        chai.expect(1).to.equal(1);
      });
    });

    describe("mocha fixture", () => {
      var fixture = document.querySelector('[id="fixture"]');

      it('exists', () => {
        chai.expect(fixture.id).to.equal("fixture");
      });
    });
  });
});
