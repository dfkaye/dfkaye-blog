---
title: "Alert-Dialog Generator"
date: 2021-08-06T09:36:29-07:00
lastmod: 2021-08-06T09:36:29-07:00
description: "Polyfill the window alert(), confirm(), prompt() methods in case Google really decides to remove them all and break the web."
tags:
- "Alert-Dialog"
- "Accessibility"
- "Polyfill"

# load styles and scripts in strict order

#styles:
#- ./to-do.css

scripts:
- ./alert-dialog.js
---

## Async modal dialogs

Summary: This page uses a custom modal dialog with async/await syntax and a generator function to return responses to awaited Promises. 

+ Reasonably accessible on screen readers, but I've tested only with Windows Navigator and Jaws so far.
+ Works on Chrome and Firefox on Windows 10 laptop.
+ Works on iOS Safari (iPhone 7-plus; however, top-level `await` is not supported), as of 10 August 2021.

## Accessibility

To close a custom modal dialog, you can either press the {{< rawhtml >}}<kbd>Escape</kbd>{{< /rawhtml >}} key, or {{< rawhtml >}}<kbd>Tab</kbd>{{< /rawhtml >}} over to the OK button and press the button or the {{< rawhtml >}}<kbd>Enter</kbd>{{< /rawhtml >}} key.

## Code samples

Use it in an event listener:

```js
document.querySelector("[data-bullpen-prompt]")
  .addEventListener("click", async function (e) {
    var response = await window.prompt(
      "Make any changes and save this prompt.",
      "Some default text."
    );

    console.warn(response);
  });
```

Use it in the console on this page right now:

```js
var response = await window.prompt(
  "Make any changes and save this prompt.",
  "Some default text."
);

console.warn(response);
```

Try it by choosing one of the following buttons:

{{< rawhtml >}}
<p>
<button type="button" data-alert-opener>Open alert()</button>
<button type="button" data-confirm-opener>Open confirm()</button>
<button type="button" data-prompt-opener>Open prompt()</button>

<p>
<button type="button" data-bullpen-alert>Bullpen alert</button>
<button type="button" data-bullpen-confirm>Bullpen confirm</button>
<button type="button" data-bullpen-prompt>Bullpen prompt</button>
{{< /rawhtml >}}

## alert-dialog script

View the JavaScript "alert-dialog.js" [source file](./alert-dialog.js);
