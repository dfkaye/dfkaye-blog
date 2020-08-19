/* Math apply: operate over a sequence of values. */
import { sum, product, avg } from "/js/lib/safe-math.js";

describe("safe-math", function () {

  var assert = chai.assert;

  describe("sum", function () {
    it("takes a single value", () => {
      var actual = sum(1);

      assert(actual === 1);
    });

    it('takes multiple values', () => {
      var actual = sum(1, 2, 3);

      assert(actual === 6);
    });

    it('takes values array', () => {
      var actual = sum([1, 2, 3]);

      assert(actual === 6);
    });

    it('takes comma-formatted string values', () => {
      var actual = sum("1,000", 1);

      assert(actual === 1001);
    });

    it('takes scientific notation', () => {
      var actual = sum([
        987.654E6, // numeric
        "987.654E6" // string
      ]);

      assert(actual === 2 * "987.654E6");
    });

    it('takes negative values', () => {
      var actual = sum([
        -987.654E6, // numeric
        "987.654E6" // string
      ]);

      assert(actual === 0);
    });

    it('takes boolean values', () => {
      var actual = sum([
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
      var actual = sum([
        new String(0.1),
        new String(0.2)
      ]);

      assert(actual === 0.3);
    });

    it("takes 'functionally numeric' objects", () => {
      var actual = sum([
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
      var actual = sum([0.1, 0.2]);

      assert(actual === 0.3);
    });
  })

  describe("product", function () {
    it("takes a single value", () => {
      var actual = product(1);

      assert(actual === 1);
    });

    it('takes multiple values', () => {
      var actual = product(1, 2, 3);

      assert(actual === 6);
    });

    it('takes values array', () => {
      var actual = product([1, 2, 3]);

      assert(actual === 6);
    });

    it('takes comma-formatted string values', () => {
      var actual = product("1,000", 1);

      assert(actual === 1000);
    });

    it('takes scientific notation', () => {
      var actual = product([
        987.654E6, // numeric
        "987.654E6" // string
      ]);

      assert(actual === 987.654E6 * "987.654E6");
    });

    it('takes negative values', () => {
      var actual = product([
        -987.654E6, // numeric
        "987.654E6" // string
      ]);

      assert(actual === 987.654E6 * "987.654E6" * -1);
    });

    it('takes boolean values', () => {
      var actual = product([
        true,
        false,
        Boolean(true),
        Boolean(false),
        new Boolean(true),
        new Boolean(false)
      ]);

      assert(actual === 0);
    });

    it('takes String objects', () => {
      var actual = product([
        new String(0.1),
        new String(0.2)
      ]);

      assert(actual === 0.02);
    });

    it("takes 'functionally numeric' objects", () => {
      var actual = product([
        {
          valueOf() { return 0.1 }
        },
        {
          valueOf() { return 0.2 }
        }
      ]);

      assert(actual === 0.02);
    });

    it("multiplies 0.1 * 0.1 to get 0.01", () => {
      var actual = product([0.1, 0.1]);

      assert(actual === 0.01);
    });
  });

  describe("avg", function () {
    it("returns 0 if no values", () => {
      // 18 Aug 2020, This found a bug, where avg() always divided the result by 0.
      var actual = avg();

      assert(actual === 0);
    });

    it("returns average value of a series", () => {
      var actual = avg([1, 2, 3, 4]);

      assert(actual === 2.5);
    });

    it("ignores functionally non-numeric values", () => {
      // 18 Aug 2020, This found a bug, where '' is coerced to 0 by expand().
      var actual = avg(NaN, 1, null, 2, undefined, 3, '', 4);

      assert(actual === 2.5);
    });

    it("returns average value of a series of functionally numeric values", () => {
      var actual = avg([
        {
          valueOf() { return 3 }
        },
        new String('2'),
        true // 1
      ]);

      assert(actual === (6 / 3));
    });

    it("handles POSITIVE_INFINITY or NEGATIVE_INFINITY as values, but not both (returns NaN)", () => {
      // 18 Aug 2020, Interesting finding.
      assert(avg(Infinity, Infinity) === Infinity);
      assert(avg(-Infinity, -Infinity) === -Infinity);
      assert(avg(-Infinity, Infinity).toString() === "NaN");
    });
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
