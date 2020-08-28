---
title: "Teach Yourself Accessibility"
date: 2020-08-27T11:12:43-07:00
description: "Make web interfaces that are accessible to keyboard navigation and screen readers."
tags: 
  - "CSS"
  - "Accessibility"
  - "ARIA"
  - "Responsive UI"
  - "Semantic HTML"

styles:
- /css/lib/teach-yourself-accessibility.css

scripts:
- /js/lib/teach-yourself-accessibility.js

---

## Previously on this site&hellip;

In my previous blog post and demo, I walked through an accessibility upgrade for a [tab control layout using only CSS](/posts/2020/08/23/accessible-css-driven-tabs-without-javascript/).

In this post we walk through resolving some accessibility differences between a native button element, a div styled to look like a button, and a custom element styled to look like a button.

## First things first

The first rule of {{< rawhtml >}}<abbr title="Accessible Rich Internet Applications">ARIA</abbr>{{< /rawhtml >}} is not to use ARIA, but rather

> If you *can* use a native HTML element or attribute with the semantics and behavior you require **already built in**, instead of re-purposing an element and adding an ARIA role, state or property to make it accessible, **then do so**.

For more advice on ARIA, see https://www.w3.org/TR/using-aria/#rule1.

## Here's what we'll do

- [Write the HTML first](#write-the-html-first)
- [Add some CSS to manage basic layout](#add-some-css-to-manage-basic-layout)
- [Use keyboard navigation to verify that elements receive focus](#use-keyboard-navigation-to-verify-that-elements-receive-focus)
- [Add `tabindex="0"` to elements that we want to be focusable](#add-tabindex0-to-elements-that-we-want-to-be-focusable)
- [Use a screen reader to verify that element types or roles are announced properly](#use-a-screen-reader-to-verify-that-element-types-or-roles-are-announced-properly)
- [Add `role` attributes to let screen readers announce the desired role](#add-role-attributes-to-let-screen-readers-announce-the-desired-role)
- [Test hover, focus, and pressed (active) states](#test-hover-focus-and-pressed-active-states)
- [Trigger behavior with `Space` and `Enter` keys](#trigger-behavior-with-space-and-enter-keys)
- [Add keydown handlers in JavaScript to detect `Space` and `Enter` key events](#add-keydown-handlers-in-javascript-to-detect-space-and-enter-key-events)
- [Add JavaScript to set `aria` state attributes](#add-javascript-to-set-aria-state-attributes)

## Write the HTML first

The following HTML is said to be *semantic* as the tag name "button" describes the native element.

```html
<button onclick="alert('button says hello');">Click this button!</button>
```

{{< rawhtml >}}
<button onclick="alert('button says hello');">Click this button!</button>
{{< /rawhtml >}}

The following HTML is semantic but neither describes a semantic button nor does it render like a button.

```html
<div onclick="alert('div says hello');">Click this div styled like a button!</div>
```

Which gives us this:

{{< rawhtml >}}
<div onclick="alert('div says hello');">Click this div styled like a button!</div>
{{< /rawhtml >}}

The following HTML is semantic but does not describes a semantic button, but *accidentally* renders like a button.

```html
<custom onclick="alert('custom says hello');">Click this custom tag styled like a button!</custom>
```

Which gives us this:

{{< rawhtml >}}
<custom onclick="alert('custom says hello');">Click this custom tag styled like a button!</custom>
{{< /rawhtml >}}

Note that this last "custom" element is *not* the same as a web component created with  `window.customElements.define()` &mdash; that's a more complicated topic for another time. Browsers instead use this `<custom>` tag to create an `HTMLUnknownElement`, which "represents an invalid HTML element and derives from the `HTMLElement` interface, but without implementing any additional properties or methods" (thanks to [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/API/HTMLUnknownElement)).

## Add some CSS to manage basic layout

For the purpose of demonstrating our accessibility enhancements, we will use the following CSS using a custom attribute, `custom-button`, to select only our custom buttons.

```css
[custom-button]:not(button) {
    align-items: flex-start;
    appearance: button;
    background-color: rgb(239, 239, 239, .67);
    border: .5px solid gray;
    border-radius: 1px;
    cursor: default;
    display: inline-block;
    font: 400 13.3333px Arial;
    padding: 4px 1px;
    text-align: center;
    text-indent: 0;
    text-shadow: none;
}
```

Update our div and custom elements by adding that attribute.

```html
<div custom-button ...>
<custom custom-button ...>
```

Here are our controls so far.

{{< rawhtml >}}
<button onclick="alert('button says hello');">Click this button!</button>
{{< /rawhtml >}}

{{< rawhtml >}}
<div custom-button onclick="alert('div says hello');">Click this div styled like a button!</div>
{{< /rawhtml >}}

{{< rawhtml >}}
<custom custom-button onclick="alert('custom says hello');">Click this custom tag styled like a button!</custom>
{{< /rawhtml >}}

## Use keyboard navigation to verify that elements receive focus

Our native button will receive {{< rawhtml >}}<kbd>Tab</kbd>{{< /rawhtml >}} key focus.

Click the button below then press {{< rawhtml >}}<kbd>Tab</kbd>{{< /rawhtml >}}.

{{< rawhtml >}}
<button onclick="alert('button says hello');">Click this button!</button>
{{< /rawhtml >}}

Our div and custom buttons will not.

{{< rawhtml >}}
<div custom-button onclick="alert('div says hello');">Click this div styled like a button!</div>
{{< /rawhtml >}}

{{< rawhtml >}}
<custom custom-button onclick="alert('custom says hello');">Click this custom tag styled like a button!</custom>
{{< /rawhtml >}}

{{< rawhtml >}}
<p>
<a id="tab-key-catch" tabindex="0">You probably ended up here.</a>
</p>
{{< /rawhtml >}}

## Add `tabindex="0"` to elements that we want to be focusable

```html
<div tabindex="0" ...>
<custom tabindex="0" ...>
```

Now our div and custom elements will receive keyboard focus.

{{< rawhtml >}}
<div tabindex="0" custom-button onclick="alert('div says hello');">Click this div styled like a button!</div>
{{< /rawhtml >}}

{{< rawhtml >}}
<custom tabindex="0" custom-button onclick="alert('custom says hello');">Click this custom tag styled like a button!</custom>
{{< /rawhtml >}}

## Use a screen reader to verify that element types or roles are announced properly.

I use Windows 10 Narrator. For the native button element, Narrator announces the element's text, then announces "button".

{{< rawhtml >}}
<button onclick="alert('button says hello');">Click this button!</button>
{{< /rawhtml >}}

But for our div and custom elements, Narrator announces the type as "group" instead.

{{< rawhtml >}}
<div tabindex="0" custom-button onclick="alert('div says hello');">Click this div styled like a button!</div>
{{< /rawhtml >}}

{{< rawhtml >}}
<custom tabindex="0" custom-button onclick="alert('custom says hello');">Click this custom tag styled like a button!</custom>
{{< /rawhtml >}}

## Add `role` attributes to let screen readers announce the desired role

Our div and custom elements need the "role" attribute set to "button".

```html
<div role="button" ...>
<custom role="button" ...>
```

Now Narrator announces the element's text, then announces "button" as expected.

{{< rawhtml >}}
<div role="button" tabindex="0" custom-button onclick="alert('div says hello');">Click this div styled like a button!</div>
{{< /rawhtml >}}

{{< rawhtml >}}
<custom role="button" tabindex="0" custom-button onclick="alert('custom says hello');">Click this custom tag styled like a button!</custom>
{{< /rawhtml >}}

## Test hover, focus, and pressed (active) states

Our native button should show some changes between hover, focus, and pressed (active) states.

Our div and custom elements need some CSS to show these states using `:active`, `:focus`, and `:hover` pseudo-classes.

*For this demo only, we'll add separate atributes to indicate hover, focus, and active state. Normally I would re-use `[custom-button]` to style these states.*

```css
[custom-hover]:not(button):hover {
    background-color: rgb(239, 239, 239, 1);
}

[custom-focus]:not(button):focus {
    outline: Highlight auto 3px;
    outline: -webkit-focus-ring-color auto 3px;
}

[custom-active]:not(button):active {
    background-color: rgb(239, 239, 239, .33);
    border-style: outset;
}
```

Add these attributes to our custom elements.

```html
<div custom-hover custom-focus custom-active ...>
<custom custom-hover custom-focus custom-active ...>
```

Now hover, focus, and active states are styled.

{{< rawhtml >}}
<div custom-hover custom-focus custom-active role="button" tabindex="0" custom-button onclick="alert('div says hello');">Click this div styled like a button!</div>
{{< /rawhtml >}}

{{< rawhtml >}}
<custom custom-hover custom-focus custom-active role="button" tabindex="0" custom-button onclick="alert('custom says hello');">Click this custom tag styled like a button!</custom>
{{< /rawhtml >}}

## Trigger behavior with `Space` and `Enter` keys

Our button element will respond to these keys and display the alert.

Our `div` and `custom` elements will not respond to these events.

- on {{< rawhtml >}}<kbd>Space</kbd>{{< /rawhtml >}} key presses, the screen will scroll down.
- on {{< rawhtml >}}<kbd>Enter</kbd>{{< /rawhtml >}} key presses, no action will occur.

## Add `keydown` handlers in JavaScript to detect `Space` and `Enter` key events

*For this demo only, we will use another attribute, `js-button`, to select for our custom buttons in the DOM. Normally I would re-use the `custom-button` attribute in the selector.*

```js
document.querySelectorAll("[js-button]")
.forEach(function(button) {
    button
    .addEventListener('keydown', function(event) {
        if (/^(Space)|(Enter)$/.test(event.code)) {
            button.click();
        }
    });
});
```

Update our HTML with that attribute.

```html
<div js-button ...>
<custom js-button ...>
```

## Add JavaScript to set `aria` state attributes

For example, if we want to toggle the 'pressed' state, we can add `keydown` and `keyup` handlers in JavaScript to set the `aria-pressed` attribute to `true` and `false`, respectively.

```js
document.querySelectorAll("[js-button]")
.forEach(function(button) {
    button
    .addEventListener('keydown', function(event) {
        if (/^(Space)|(Enter)$/.test(event.code)) {
            button.setAttribute('aria-pressed', true)
        }
    });

    button
    .addEventListener('keyup', function(event) {
        if (/^(Space)|(Enter)$/.test(event.code)) {
            button.setAttribute('aria-pressed', false)
        }
    });            
});
```

Ah, but now we'll have to add `click` event support to toggle the pressed state as well.

```js
// Our js-buttons.
document.querySelectorAll("[js-button]")
.forEach(function(button) {
    button
    .addEventListener('click', function(event) {
        var next = button.getAttribute('aria-pressed', true);

        // Toggle pressed true to false, false to true.
        button.setAttribute('aria-pressed', !Boolean(next));
    });
});

// Our native button element.
document.querySelectorAll("button")
.forEach(function(button) {
    button
    .addEventListener('keyup', function(event) {
        var next = button.getAttribute('aria-pressed', true);

        // Toggle pressed true to false, false to true.
        button.setAttribute('aria-pressed', !Boolean(next));
    });            
});
```

Add some CSS to indicate `aria-pressed` styles.

```css
[aria-pressed="true"] {
  color: red;
}
```

## Final result

{{< rawhtml >}}
<button onclick="alert('button says hello');">Click this button!</button>
{{< /rawhtml >}}

{{< rawhtml >}}
<div js-button custom-hover custom-focus custom-active role="button" tabindex="0" custom-button onclick="alert('div says hello');">Click this div styled like a button!</div>
{{< /rawhtml >}}

{{< rawhtml >}}
<custom js-button custom-hover custom-focus custom-active role="button" tabindex="0" custom-button onclick="alert('custom says hello');">Click this custom tag styled like a button!</custom>
{{< /rawhtml >}}

## Progressive enhancement

This technique, called "progressive enhancement," allows us to add custom style and behavior to non-semantic elements and make them more accessible to the keyboard and screen reader audience.

We were even able to create an *unknown* control, the `<custom>` element, which browsers do not recognize, and add CSS and JavaScript selectors to treat them. 

## Concluding thoughts

The question is, **Have we really improved anything?**

We had to add quite a bit of JavaScript to achieve parity with native button behavior. And that's JavaScript that you, or someone else, possible a future you, will have to maintain.

Things get more complicated when you have to support {{< rawhtml >}}<kbd>Arrow</kbd>{{< /rawhtml >}} key traversal to navigate among grouped elements.

Those cautions aside, you now have a walking example of layering in accessibility where it is lacking in the initial interface.

Here again are the steps we took, in order.

- [Write the HTML first](#write-the-html-first)
- [Add some CSS to manage basic layout](#add-some-css-to-manage-basic-layout)
- [Use keyboard navigation to verify that elements receive focus](#use-keyboard-navigation-to-verify-that-elements-receive-focus)
- [Add `tabindex="0"` to elements that we want to be focusable](#add-tabindex0-to-elements-that-we-want-to-be-focusable)
- [Use a screen reader to verify that element types or roles are announced properly](#use-a-screen-reader-to-verify-that-element-types-or-roles-are-announced-properly)
- [Add `role` attributes to let screen readers announce the desired role](#add-role-attributes-to-let-screen-readers-announce-the-desired-role)
- [Test hover, focus, and pressed (active) states](#test-hover-focus-and-pressed-active-states)
- [Trigger behavior with `Space` and `Enter` keys](#trigger-behavior-with-space-and-enter-keys)
- [Add keydown handlers in JavaScript to detect `Space` and `Enter` key events](#add-keydown-handlers-in-javascript-to-detect-space-and-enter-key-events)
- [Add JavaScript to set `aria` state attributes](#add-javascript-to-set-aria-state-attributes)

