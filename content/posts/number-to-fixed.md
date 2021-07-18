---
title: "Fixing Number.toFixed()"
description: "I found a rounding bug in Number.toFixed() in every JavaScript environment I've tried (Chrome, Firefox, Internet Explorer, Brave, and Node.js). The fix is surprisingly simple. Read on…"
date: 2021-07-17T16:57:27-07:00
lastmod: 2021-07-18T10:17:27-07:00
tags: 
- "JavaScript"
- "Testing"
- "Troubleshooting"

---

## What's in this post?

We create a test function to exercise JavaScript's `Number.toFixed()` method with several series to identify the pattern that results in the rounding bug. We also include a polyfill that fixes this issue.

This post first appeared in 2017 previously in a gist at https://gist.github.com/dfkaye/e977af36e668aa134c0ce55bab5bb15f and on my old wordpress blog.

This post is also a bit long. If you're not interested in the testing approach, you may skip to the addendum with my [latest thoughts](#better-solution).

## First things first

I'm aware that this is part of the whole integer-to-binary bug set introduced in the 1960s. I am still surprised that it has been tolerated for over 50 years.

## Acknowledgement

May 28, 2020, the original polyfill created in this post was updated with a fix from reader **A. Shah**, to account for the padding case, so that `(1.005).toFixed(4)` produces "1.0050" and not "1.0051".

## Warm up

I found this version of the rounding bug in `toFixed()` while revising a number-formatting function that performs the same kind of thing as `Intl.NumberFormat.format()`.

```js
(1.015).toFixed(2)
```

That returns "1.01" instead of "1.02".

The failing test is on line 42 here: https://gist.github.com/dfkaye/0d84b88a965c5fae7719d941e7b99e2e#file-number-format-js-L42. 

I had missed that result until yesterday (4 Dec 2017), and that spurred me to check for other problems.

## Bug reports

There is a long history of bug reports with respect to rounding errors using `toFixed()`.

- Chrome https://forums.asp.net/t/1966237.aspx?toFixed+not+working+in+Chrome
- Firefox http://forums.mozillazine.org/viewtopic.php?f=9&t=999945
  - see also https://bugzilla.mozilla.org/show_bug.cgi?id=186563
- Internet Explorer https://stackoverflow.com/questions/10470810/javascript-tofixed-bug-in-ie6

Here is a short sample of StackOverflow questions about this problem:

+ August 24, 2012, [https://stackoverflow.com/questions/12105787/tofixed-javascript-function-giving-strange-results](toFixed javascript function giving strange results?) - 
+ March 11, 2011, [https://stackoverflow.com/questions/5490687/broken-tofixed-implementation](broken toFixed implementation).

In general, these point out *a* bug for *a* value, but none reports a range or pattern of values returning erroneous results (at least none that I have found, I may have missed something). That leaves the programmers to focus on the small without seeing a larger pattern. I don't blame them for that.

## Finding the pattern

Unexpected results based on input must arise from a shared pattern in the input. So, rather than review the [specification for `Number().toFixed()`](https://262.ecma-international.org/6.0/#sec-number.prototype.tofixed), I focused on testing with a series of values to determine where the bug shows up in each series.

## Test function

I created the following test function to exercise `toFixed()` over a series of integers ranging from 1 to a `maxValue`, adding the `fraction` such as .005 to each integer. The `fixed` (number of digits) argument to `toFixed()` is calculated from the length of the `fraction` value.

```js
function test({fraction, maxValue}) {
  // Happy side-effect: `toString()` removes trailing zeroes.
  fraction = fraction.toString()

// Use this in toFixed() calls in in the filter and map functions below.
  var fixLength = fraction.split('.')[1].length - 1
  
  // All this to create the expectedFraction message...
  var last = Number(fraction.charAt(fraction.length - 1))
  var fixDigit = Number(fraction.charAt(fraction.length - 2))
  last >= 5 && (fixDigit = fixDigit + 1)
  
  // Replace last two digits with single `fixDigit`
  var expectedFraction = fraction.replace(/[\d]{2,2}$/, fixDigit)
  
  return Array(maxValue).fill(0)
    .map(function(ignoreValue, index) { return index + 1 })
    .filter(function(integer) {
      // Compares 1.015 to 1.0151 b/c fixing by more than one decimal place rounds correctly.
      
      var number = integer + Number(fraction) // number 1.015
      var actual = number.toFixed(fixLength) // string "1.015"
      var expected = Number(number + '1').toFixed(fixLength) // string "1.0151"
      
      // Report failures
      return expected != actual
    })
    .map(function(integer) {
      // Format reported failures
      var number = Number(integer) + Number(fraction)
      
      return {
        given: number.toString(),
        expected: (Number(integer.toFixed(0)) + Number(expectedFraction)).toString(), actual: number.toFixed(fixLength)
      }
    })
}
```

## Usage

The following example executes on integers 1 through 128, adding the fraction .015 to each, and returns an array of "unexpected" results. Each result contains a `given`, `expected`, and `actual` field. Here we consume the array and print each item.

```js
test({ fraction: .015, maxValue: 128 })
  .forEach(function(item) {
    console.log(item)
  })
```

## Output

For this case, there are 6 unexpected results.

```js
{given: "1.015", expected: "1.02", actual: "1.01"}
{given: "4.015", expected: "4.02", actual: "4.01"}
{given: "5.015", expected: "5.02", actual: "5.01"}
{given: "6.015", expected: "6.02", actual: "6.01"}
{given: "7.015", expected: "7.02", actual: "7.01"}
{given: "128.015", expected: "128.02", actual: "128.01"}
```

## Findings

I found the bug consists of three parts:

1. The last significant digit in the fraction must be 5 (.015 and .01500 produce the same result).
2. The fixing length must shorten the fraction by only one digit.
3. The bug appears inconsistently as different integer values are applied.

## Inconsistently?

Yes. For example, `(value).toFixed(2)` with different 3-digit fractions ending in 5, for integers 1 though 128, produces these results:

+ fixing numbers ending with .005 **always** fails (!!)
+ fixing numbers ending with .015 fails for 1, then 4 through 7, then 128
+ fixing numbers ending with .025 fails 1, 2, 3, then 16 through 63
+ fixing numbers ending with .035 fails for 1, then 32 through 128
+ fixing numbers ending with .045 fails for 1 through 15, then 128
+ fixing numbers ending with .055 fails for 1, then 4 through 63
+ fixing numbers ending with .065 fails for 1, 2, 3, then 8 through 15, then 32 through 128
+ fixing numbers ending with .075 fails for 1, then 8 through 31, then 128
+ fixing numbers ending with .085 fails for 1 through 7, then 64 through 127 (!!)
+ fixing numbers ending with .095 fails for 1, then 4 through 7, then 16 through 128

Those of you with more binary and floating-point math knowledge than I have can probably reason out the underlying cause. I leave that as an exercise for the reader.

## Fixing `toFixed()`

Fixing a value *by more than one decimal place* always rounds correctly.

Recall earlier that we tested various 3-digit fractions against a fixing length of 2. The rounding error disappears if we add another digit to the fraction, so that, for example, `(1.0151).toFixed(2)` returns "1.02" as expected. (Both the test and polyfill use that knowledge for their correctness checks.)

That means there's a simple fix for all implementations of `toFixed()`: If the value contains a decimal, append "1" to the end of the string version of the value to be modified. That may not be "to spec," but it means we will get the results we expect without having to revisit lower-level binary or floating-point operations.

## Polyfill

Until all implementations are modified, you can use the following polyfill to overwrite `toFixed()`, if you're comfortable doing that (not everyone is).

```js
(1.005).toFixed(2) == "1.01" || (function (prototype) {
  var toFixed = prototype.toFixed;

  prototype.toFixed = function(fractionDigits) {
    var split = this.toString().split('.');
    var string = !split[1]
      ? split[0]
      : split[1].length >= fractionDigits
          ? split.join('.') + '1'
          : split.join('.');
    var number = Number(string);

    return toFixed.call(number, fractionDigits);
  }
}(Number.prototype));
```

Then run the test again and check that the length of the results is zero.

```js
test({ fraction: .0015, maxValue: 516 }) // Array []
test({ fraction: .0015, maxValue: 516 }).length // 0
```

Or just run the initial conversion that started off this post.

```js
(1.015).toFixed(2) // returns "1.02" as expected
```

## Better solution

Meanwhile, in February 2020 on StackOverflow, I found [another solution]((https://stackoverflow.com/questions/1726630/formatting-a-number-with-exactly-two-decimals-in-javascript/1726662#1726662)) that uses the built-in `Number.toLocaleString()` method without string hacking.

```js
(1.005).toFixed(2) == "1.01" || (function() {
  Number.prototype.toFixed = function(fractionDigits) {
    return this.toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    });
  };
}());
```

Thanks go to [{{< rawhtml >}}Christian Salvad&oacute;{{< /rawhtml >}}](https://stackoverflow.com/users/5445/christian-c-salvad%c3%b3). That's definitely more elegant.
