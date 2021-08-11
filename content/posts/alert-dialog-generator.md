---
title: "Alert-Dialog Generator"
date: 2021-08-10T11:27:18-07:00
lastmod: 2021-08-11T13:05:18-07:00
description: "A vanilla JavaScript polyfill for the browser dialog methods alert(), confirm(), prompt(), in case Google really decides to remove them all and break the web."
tags:
- "Alert-Dialog"
- "Accessibility"
- "Polyfill"
- "JavaScript"
- "Vanilla"
---

## Demo?

[This way...](/demos/alert-dialog-generator/)

## Background

Last week (circa August 3, 2021), several people worried over the Google Chrome team's attempt to remove the `alert()`, `confirm()`, and `prompt()` methods from embedded `<iframe>` elements. Fear, Uncertainty, and Doubt ensued.

**Update**: Rich Harris posted an overview of the matter as I was writing this post. Read it [here](https://dev.to/richharris/stay-alert-d).

I figured creating a polyfill couldn't be *that* hard, but allowed that it *might* turn out to be impossible. It's somewhere in between, depending on what you want.

## First problem: Emulating synchronous blocking behavior

All three native methods are synchronous, meaning they block other processing while displaying the modal dialogs. (There may an exception to this with respect to the `alert()` method in some browsers.)

So, after getting the dialog open-and-display logic working, I tried several approaches that would block execution at the point of these calls. What follows is the most successful approach.

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

And to get that Promise, we have to return an *unfulfilled* Promise from the dialog opener, along with the response object we will update when a user's response value is determined.

```js
var response = { done: false };

// ... code omitted for brevity

return {
  response,
  wait: new Promise(init)
};
```

The `wait` Promise is initialized by a function that attaches a reference to the `resolve` function that a Promise calls on itself to finish processing.

```js
function init(resolve, reject) {
  response.resolve = resolve;
}
```

## Second problem: Detecting the response update

I tried two approaches to solve this problem.

First, I used polling with `setTimeout()` that repeated every 500ms to detect whether the response object's `done` field had been set. It worked; however, I realized that could waste battery energy on long-lived (open) dialogs.

I then tried using a `generator function` because generators use a *suspend-and-resume* mechanism. When they `yield`, they are suspended, and so do not consume any resources, They are resumed by another caller using `generator.next([value])` passing an optional value.

So, rather then checking on the state of the response, I let the dialog's action event handler call the generator and pass the response to it when the user has decided to close the dialog.

In the follwing snippet, I used a `co()` function (not my own as you'll read in the code comment) that accepts a generator, initializes it, advances it once with `gen.next()`, then returns a function `send` that allows the `keyup` and `click` event handler inside the dialog to update the `response` object, then call the `resolve()` function directly.

```js
// A coroutine generator, from http://syzygy.st/javascript-coroutines/,
// which sadly no longer exists. This version is copied from Adam Boduch,
// "JavaScript Concurrency", Packt Publishing, 2015, p. 86.
function co(G, options) {
  var g = G(options);
  g.next();
  return (data) => g.next(data);
}

var send = co(function* G(response, data) {
  while (true) {
    data = yield; // This is invoked by calling g.next(data).
    Object.assign(response, data);
    if (Object(response).done) { // Make sure the response is an object.
      return response.resolve(response);
    }
  }
}, response);
```

Inside the dialog we listen for `keyup` and `click` events on various elements. The event handler checks whether the event `type` and `target` or key `code` are valid, then determines what value should be set in the response, and then removes the dialog and its event handlers from the DOM.

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

Even chained dialog calls in succesion (such as `alert( await confirm("OK") );`) seem to work.

To do that, you have to capture the return value.

And to do that, you have to add the `await` keyword in front of `confirm()` and `prompt()` calls.

```js
var answer = await window.confirm("Yes?");

console.log(answer); // true or false
```

Luckily we don't need to use `await` if we don't need to capture that value, so `alert() and window.alert()` should just work.

And luckily, this solution is *only needed in the evergreen browsers* that may remove the modal methods.

## Aesthetics

Could do better.

+ All the styles are defined on inline `style` attributes.
+ Whatever styles are defined are affected by (i.e., inherit from) rules in this site's own CSS file.
+ The dialog width is percentage-based, rather than fixed unit, so the dialog will expand its width as the viewport width increases. 
+ The JavaScript itself is a single execution that does not export anything. That could be added when the time comes for modular re-use.

## Tests

In a break from habit, I did *not* use test-driven development for this as I:

+ did not know what I did not know,
+ only wanted to arrive at a working solution rather than a bullet-proof one,
+ don't intend to publish the solution to NPM.

## Bugs

+ A press on the {{< rawhtml >}}<kbd>Space</kbd>{{< /rawhtml >}} key still scrolls the document body behind the dialog and underlay elements.
+ Opening a dialog from an {{< rawhtml >}}<kbd>Enter</kbd>{{< /rawhtml >}} key press on a button may result in closing the dialog immediately after opening.

These are fixes I leave to the reader (or myself at a later time).

## Accessibility

OK, but may need improvement.

+ Reasonably accessible on screen readers (Navigator and Jaws) that I've tested so far.
+ Works on Chrome, Edge, Firefox, and Falkon on a Windows 10 laptop.
+ Works on iOS Safari. (Note: top-level `await` is not supported by iOS Safari as of {{< rawhtml >}}<time datetime="2021-08-10">10 August 2021</time>{{< /rawhtml >}}).

## Try it out

There are some code samples on the demo page, where you may [judge for yourself](/demos/alert-dialog-generator/).
