---
title: "Alert-Dialog Generator"
date: 2021-08-10T11:27:18-07:00
lastmod: 2021-08-10T11:27:18-07:00
description: "Polyfilling the window alert(), confirm(), prompt() methods in case Google really decides to remove them all and break the web."
tags:
- "Alert-Dialog"
- "Accessibility"
- "Polyfill"
---

## tl;dr

I've created a JavaScript polyfill for the `window`-level `alert()`, `confirm()`, and `prompt()` methods. [Visit the demo](/demos/alert-dialog-generator/).

## Background

Last week (circa August 3, 2021), several people worried over the Google Chrome team's attempt to remove the `alert()`, `confirm()`, and `prompt()` methods from embedded `<iframe>` elements.

Emotion, and fighting back, and sarcasm, and so on, all ensued in the pseudo-public pseudo-forum of Twitter.

Already overwhelmed with a pandemic and its deniers, an insurrection and its deniers, climate change and its deniers, the audience kept on arguing with each other.

## Meanwhile&hellip;

{{< rawhtml >}}

<q prose lang="en-US">
Showing the best and dividing it from the worst age vexes age,<br/>
Knowing the perfect fitness and equanimity of things, while they discuss I am silent, and go <del>bathe and admire</del> <ins>work on a solution</ins> myself.
</q>
<cite>&mdash;Walt Whitman, "Leaves of Grass"</cite>
{{< /rawhtml >}}

## Emulating synchronous blocking behavior

All three native methods are synchronous, meaning they block other processing while displaying the modal dialogs. (There may an exception to this with respect to the `alert()` method in some browsers.)

So, after getting the dialog open-and-display logic working, I tried several approaches that would block execution at the point of these calls.

```js
var answer = window.confirm("Yes?");

console.log(answer); // true or false
```

To do that, we have to use `async/await` functions that `await` a `Promise` field called "wait" in the response returned by the dialog opener (named `Modal` in this example).

```js
async function prompt(title, defaultValue = "") {
  var { wait, response } = Modal({ type: "prompt", message: title, defaultValue });

  await wait;

  return response.value;
}
```

And to get that promise, we have to return an *unfulfilled* promise from the dialog opener, along with the response object we will update when a user's response value is determined.

```js
var response = { done: false };

// ... code omitted for brevity

return {
  response,
  wait: new Promise(init)
};
```

The `wait` promise is initialized by a function that attaches a reference to the `resolve` function that a Promise calls on itself to finish processing.

```js
function init(resolve, reject) {
  response.resolve = resolve;
}
```

We first tried polling with `setTimeout()` but decided that could waste battery energy on long-lived (open) dialogs.

Then we tried using a `generator function` because that generators use a *suspend-and-resume* mechanism. When they `yield`, they are suspended, and so do not consume any resources and they are called again with `generator.next()`.

In the follwing snippet, I used a `co()` function that accepts a generator, initializes it, advances it once with `gennext()`, then returns a function `send` that allows the `keyup` and `click` event handler inside the dialog to update the `response` object, then call the `resolve()` function directly.

```js
function co(G, data) {
  var g = G(data);
  g.next();
  return (data) => g.next(data);
}

var send = co(function* G(response, data) {
  console.log(response)
  while (true) {
    data = yield;
    Object.assign(response, data);
    if (Object(response).done) {
      return response.resolve(response);
    }
  }
}, response);
```

Inside the dialog we listen for keyup and click events on various elements. The event handler checks whether the event type and target or key code are valid, then determines what value should be set in response, and then removes the dialog and its event handlers from the DOM.

I've omitted a lot of detail in the following snippet that shows this logic.

```js
function handler(e) {
  var config = shouldClose(e);

  if (!config.done) {
    return;
  }

  Object.assign(config, { input, prompt, confirm });

  send({ done: true, value: getValue(config) });

  remove({ dialog, underlay, ok, cancel, handler });
}

ok.addEventListener("click", handler);
cancel && (cancel.addEventListener("click", handler));
document.body.addEventListener("keyup", handler);
```

## Results

Pretty close!

Even chained dialog calls in succesion (e.g., `alert( await confirm("OK") );`) seem to work.

To do that, we have to capture the return value. And to do that, we have to add the `await` keyword in front of `window.confirm()` calls.

```js
var answer = await window.confirm("Yes?");

console.log(answer); // true or false
```

Luckily we don't need to use `await` if we don't need to capture that value.

Also, this solution is only needed in the evergreen browsers that may remove the modal methods.

## Aesthetics

Could do better.

+ All the styles are defined on inline `style` attributes.
+ Whatever styles are defined are affected by (i.e., inherit from) rules in this site's own CSS file.
+ The dialog width is percentage-based, rather than fixed unit, so the dialog will expand its width as the viewport width increases. 
+ The JavaScript itself is a single execution that does not export anything. That could be added when the time comes for modular re-use.

## Accessibility

OK, but may need improvement.

+ Reasonably accessible on the Windows Navigator screen reader so far.
+ Works on Chrome, Edge, and Firefox on Windows 10 laptop.
+ Works on iOS Safari (however, top-level await not supported as of 10 August 2021).

## Try it out

There are some code samples on the demo page, where you may [judge for yourself](/demos/alert-dialog-generator/).
