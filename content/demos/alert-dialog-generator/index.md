---
title: "Demo: Alert-Dialog Polyfill"
date: 2021-08-06T09:36:29-07:00
lastmod: 2021-08-11T13:05:29-07:00
description: "Demo of a vanilla JavaScript polyfill for the browser's modal dialog methods alert(), confirm(), and prompt(), in case Google really removes them and breaks the web."
tags:
- "Alert-Dialog"
- "Accessibility"
- "Polyfill"
- "JavaScript"
- "Vanilla"

# load styles and scripts in strict order

#styles:
#- ./to-do.css

scripts:
- ./alert-dialog.js
---

## Summary

The modal dialog polyfill uses `async/await` syntax and a `generator` function to return responses to awaited `Promises`. For more detail, [consult this post](/posts/2021/08/10/alert-dialog-generator/)

## Results

+ Reasonably accessible on screen readers, but I've tested only with Windows Navigator and Jaws so far.
+ Tested on Chrome, Edge, Firefox, and Falkon on a Windows 10 laptop.
+ Tested on iOS Safari (iPhone 7-plus; however, top-level `await` is not supported), as of {{< rawhtml >}}<time datetime="2021-08-10">10 August 2021</time>{{< /rawhtml >}}.

## Accessibility

To close a custom modal dialog, you can either press the {{< rawhtml >}}<kbd>Escape</kbd>{{< /rawhtml >}} key, or press {{< rawhtml >}}<kbd>Tab</kbd>{{< /rawhtml >}} to the `OK` button and press the button or the {{< rawhtml >}}<kbd>Enter</kbd>{{< /rawhtml >}} key.

## Code samples

1. Use it in an event listener:

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

2. Use it in the developer console on this page right now:

```js
var response = await window.prompt(
  "Make any changes and save this prompt.",
  "Some default text."
);

console.warn(response);
```

3. Try one of the following buttons. (Open the developer console to read the responses.)

{{< rawhtml >}}
<p>
<button type="button" data-alert-opener>Open alert()</button>
<button type="button" data-confirm-opener>Open confirm()</button>
<button type="button" data-prompt-opener>Open prompt()</button>
{{< /rawhtml >}}

## The alert-dialog script

View the JavaScript source file, [alert-dialog.js](./alert-dialog.js).
