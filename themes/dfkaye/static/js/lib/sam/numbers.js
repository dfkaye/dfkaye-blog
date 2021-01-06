export { format }

/*
 * This one took some time to figure out.
 *
 * Format a numeric string with commas, preserving minus sign for negative
 * numbers, and the decimal point.
 *
 * format(999.999) => "999.999"
 * format(1000.999) => "1,000.999"
 * format(-999.999) => "-999.999"
 * format(-1000.999) => "-1,000.999"
 */
function format(value) {
  if (Math.abs(value) < 1000) {
    return value;
  }

  var decimal = value.indexOf('.');
  var fractional = decimal > 0;
  var fraction = fractional ? value.substring(decimal) : '';

  // Can't use this as it removes trailing zeroes from fraction digits.
  //  return new Intl.NumberFormat({ minimumFractionDigits: fraction.length })
  //    .format(value);

  // Rolled by hand...
  var integer = value.substring(0, fractional ? decimal : value.length);
  var result = Array(integer.length);

  integer.split('').forEach(function (v, i, integer) {
    // Iterates the array of integer characters from index 0, but reads from
    // integer string and inserts in result array at `length - 1 - index`.
    var at = integer.length - i - 1;
    var value = integer[at];

    // Get value at next lower index. If current index is 0, next value is
    // undefined.
    var nextValue = integer[at - 1];
    var offset = integer.length - at;

    // Insert comma when value and nextValue are digits, and insertion offset
    // is divisible by 3.
    var digit = /\d/.test(value) && /\d/.test(nextValue) && offset % 3 == 0
      ? ',' + value
      : value;

    result[at] = digit;
  });

  return result.join('') + fraction;
}
