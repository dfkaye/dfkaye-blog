/* /posts/teach-yourself-accessibility.md */

document.querySelectorAll("[js-button]")
  .forEach(function (button) {
    button
      .addEventListener('keydown', function (event) {
        if (/^(Space)|(Enter)$/.test(event.code)) {
          button.click();
        }
      });
  });

function handleKey(event) {
  if (/^(Space)|(Enter)$/.test(event.code)) {
    var button = event.target;
    var next = button.getAttribute('aria-pressed', true);

    // Toggle pressed true to false, false to true.
    button.setAttribute('aria-pressed', !Boolean(next));
  }
}

function toggle(event) {
  var button = event.target;
  var next = button.getAttribute('aria-pressed', true);

  // Toggle pressed true to false, false to true.
  button.setAttribute('aria-pressed', !Boolean(next));
}

document.querySelectorAll("[js-button]")
  .forEach(function (button) {
    button
      .addEventListener('keydown', handleKey);

    button
      .addEventListener('keyup', handleKey);

    button
      .addEventListener('click', toggle);
  });

document.querySelectorAll("button")
  .forEach(function (button) {
    button
      .addEventListener('click', toggle);
  });
