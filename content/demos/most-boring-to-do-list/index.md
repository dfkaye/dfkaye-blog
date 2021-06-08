---
title: "Demo: Most boring To-do list"
description: "Very plain To-do list made from accessible HTML, modern vanilla JavaScript and minimally tolerable CSS."
date: 2020-09-23T14:52:41-07:00
lastmod: 2021-06-08T12:19:41-07:00
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

Orginally written in 2017, it has been modified to use a `<form>` (which created several {{< rawhtml >}}<kbd>Enter</kbd>{{< /rawhtml >}} key form submission problems), custom HTML attributes, CSS attribute selectors, and accessibility roles and attributes.

Design may change further as this is not fully tested with screen readers yet.

{{< rawhtml >}}

  <form todo aria-labelledby="populated-list">
    <!-- gratuitous comment -->
    <h2 id="populated-list">Populated list</h2>
    <dialog role="alert" aria-live="assertive" alert-message="You have another item open. Please close it before editing another one." alert-close="Close"></dialog>
    <dialog role="alert" aria-live="assertive" save-message="This to-do item is empty. Add text to Save it, or press Remove to delete it." alert-close="Close"></dialog>
    <ul todo-list>
      <li item>
        <input name maxlength="100" readonly value="first">
        <button type="button" handle="edit">Edit</button>
        <button type="button" handle="remove">Remove</button>
        <button type="button" handle="done">Complete</button>
      </li>
      <li item>
        <input name maxlength="100" readonly value="second" done="true">
        <button type="button" handle="edit">Edit</button>
        <button type="button" handle="remove">Remove</button>
        <button type="button" handle="done">Incomplete</button>
      </li>
    </ul>
    <p empty>List is currently empty. Add a new item below.</p>
    <button type="button" handle="add">Add item</button>
    <template item-template>
      <li>
        <label visually-hidden for="populated-list-input">Add a to-do item</label>
        <input id="populated-list-input" name maxlength="100" readonly placeholder="E.g., Add a to-do item">
        <button type="button" handle="edit">Edit</button>
        <button type="button" handle="remove">Remove</button>
        <button type="button" handle="done">Complete</button>
      </li>
    </template>
  </form>

  <form todo aria-labelledby="empty-list">
    <!-- gratuitous comment -->
    <h2 id="empty-list">Empty list</h2>
    <dialog alert-message="Hold it. You have another item open. Save it before editing a new one." alert-close="Close"></dialog>
    <dialog role="alert" aria-live="assertive" save-message="This to-do item is empty. Add text to Save it, or press Remove to delete it." alert-close="Close"></dialog>
    <ul todo-list></ul>
    <p empty>List is currently empty. Add a new item below.</p>
    <button type="button" handle="add">Add item</button>
    <template item-template>
      <li>
        <label visually-hidden for="empty-list-input">Add a to-do item</label>
        <input id="empty-list-input" name maxlength="100" readonly placeholder="E.g., Add a to-do item">
        <button type="button" handle="edit">Edit</button>
        <button type="button" handle="remove">Remove</button>
        <button type="button" handle="done">Complete</button>
      </li>
    </template>
  </form>

{{< /rawhtml >}}

## Sample markup

Here's the entire markup for the "Empty" list:

```html
<form todo aria-labelledby="empty-list">
  <!-- gratuitous comment -->
  <h2 id="empty-list">Empty list</h2>
  <dialog alert-message="Hold it. You have another item open. Save it before editing a new one." alert-close="Close"></dialog>
  <dialog role="alert" aria-live="assertive" save-message="This to-do item is empty. Add text to Save it, or press Remove to delete it." alert-close="Close"></dialog>
  <ul todo-list></ul>
  <p empty>List is currently empty. Add a new item below.</p>
  <button type="button" handle="add">Add item</button>
  <template item-template>
    <li>
      <label visually-hidden for="empty-list-input">Add a to-do item</label>
      <input id="empty-list-input" name maxlength="100" readonly placeholder="E.g., Add a to-do item">
      <button type="button" handle="edit">Edit</button>
      <button type="button" handle="remove">Remove</button>
      <button type="button" handle="done">Complete</button>
    </li>
  </template>
</form>
```

## CSS and JavaScript sources

+ View the [CSS](./to-do.css)
+ View the [JavaScript](./to-do.js)
