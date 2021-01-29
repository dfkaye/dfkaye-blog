---
title: "Demo: Most boring To-do list"
description: "Very plain To-do list demo made from accessible HTML, modern-vanilla.js and minimally-tolerable.css."
date: 2020-09-23T14:52:41-07:00
lastmod: 2020-09-27T21:34:41-07:00
tags:
- "CSS"
- "vanilla JavaScript"
- "Accessibility"
- "Minimalism"

styles:
- ./to-do.css

scripts:
- ./to-do.js
---

<!-- more -->

This is a plain implementation of the "to-do" list applications once used to illustrate how to use [backbone.js](https://backbonejs.org/#examples-todos) before hiring committees started using it as a code challenge to test a candidate's knowledge of front-end frameworks.

Orginally written in 2017, it has been modified to use a single custom tagname (but not a custom element), custom HTML attributes, CSS attribute selectors, and accessibility roles and attributes.

{{< rawhtml >}}

  <todo>
    <h2>Partly completed</h2>
    <dialog role="alert" aria-live="assertive" alert-message="You have another item open. Please close it before editing another one." alert-close="Close"></dialog>
    <button handle="add">Add item</button>
    <ul todo-list>
      <li data-template>
				<input name maxlength="100" readonly value="[ new item ]">
				<button handle="edit">Edit</button>
				<button handle="remove">Remove</button>
				<button handle="done">Complete</button>
			</li>
      <li item>
				<input name maxlength="100" readonly value="first">
				<button handle="edit">Edit</button>
				<button handle="remove">Remove</button>
				<button handle="done">Complete</button>				
			</li>
      <li item>
				<input name maxlength="100" readonly value="second" done="true">
				<button handle="edit">Edit</button>
				<button handle="remove">Remove</button>
				<button handle="done">Incomplete</button>				
			</li>
    </ul>
  </todo>

  <todo>
    <h2>Empty</h2>
    <dialog alert-message="Hold it. You have another item open. Save it before editing a new one." alert-close="Close"></dialog>
    <button handle="add">Add item</button>
    <ul todo-list>
      <li data-template>
        <input name maxlength="100" readonly value="[ new item ]">
        <button handle="edit">Edit</button>
        <button handle="remove">Remove</button>
				<button handle="done">Complete</button>				
      </li>
    </ul>
  </todo>

{{< /rawhtml >}}

## Sample markup

Here's the entire "Empty" list markup.

```html
  <todo>
    <h2>Empty</h2>
    <dialog alert-message="Hold it. You have another item open. Save it before editing a new one." alert-close="Close"></dialog>
    <button handle="add">Add item</button>
    <ul todo-list>
      <li data-template>
        <input name maxlength="100" readonly value="[ new item ]">
        <button handle="edit">Edit</button>
        <button handle="remove">Remove</button>
				<button handle="done">Complete</button>				
      </li>
    </ul>
  </todo>
```

## CSS and JavaScript sources

+ View the [CSS](./to-do.css)
+ View the [JavaScript](./to-do.js)
