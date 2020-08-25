---
title: "Accessible CSS-driven Tabs (without JavaScript)"
date: 2020-08-23T16:55:43-07:00
description: "Making CSS-only tabs accessible to keyboard navigation and screen readers."
tags: 
  - "CSS"
  - "Accessibility"
  - "Responsive UI"
draft: false
---

*This post and the accompanying [demo](/demos/accessible-css-driven-tabs-demo/) is the motivating exercise that drove me to find a blogging platform that supported custom styles and scripts for working demos. For more on that, see [Why Hugo?](/posts/2019/11/11/first-post-why-hugo/).*

## Introduction

CSS-based tab solutions present certain accessibility challenges, whether at the keyboard, on the touchscreen, or in screen reader technologies. For example, I tried all 29 or 30 solutions at [uicookies](https://uicookies.com/css-tabs/), and every one had some kind of issue.

In this post I examine someone else's solution I found intriguing because of a responsive UI issue before I gradually revised it to support accessibility across multiple interface and assistive technology types.

## Acknowledgement

I would like to thank [Bradley Taunt](https://twitter.com/bradtaunt) whose original demo caught my eye in summer of 2019. See [Tabbed content without JavaScript](https://bradleytaunt.com/tabbed-content/#demo). (See the rest of [his articles](https://uglyduck.ca/articles/), too.) Brad has kindly said, "Always feel free to mention/tag/disagree with any posts I write-up in your own." 

## Starting point

Things start with HTML. Here's Brad's.

    <div class="tabs">

        <div class="tab-item">
            <input class="tab-input" type="radio" name="tabs" id="tab-1">
            <label class="tab-label" for="tab-1">Tab 1</label>
            <div class="tab-content">Content goes here</div>
        </div>

        <div class="tab-item">
            <input class="tab-input" type="radio" name="tabs" id="tab-2">
            <label class="tab-label" for="tab-2">Tab 2</label>
            <div class="tab-content">Content goes here</div>
        </div>

        <div class="tab-item">
            <input class="tab-input" type="radio" name="tabs" id="tab-3">
            <label class="tab-label" for="tab-3">Tab 3</label>
            <div class="tab-content">Content goes here</div>
        </div>

    </div>

Note that the three tab content panels are paired with their corresponding tabs inside individual "tab-items". We'll come back to this.

## Accessibility

### Hidden radio strategy

Brad uses hidden radio input elements (CSS: `visibility: hidden`, HTML: `<input type="radio"...>`) as tabs and uses the `:checked` pseudo-class plus the `next-sibling` combinator (`+`) to display the corresponding tab panel (CSS: `.tab:checked + .tabpanel`).

*Note: After encountering this example, I began seeing the hidden radio strategy in other examples and search results in recent months.*

While that works with mouse clicks and touchscreen taps, the keyboard accessibility is lost. A user can neither focus on any of the tabs (i.e., the `radio` elements), nor navigate them using the arrow keys, if they are hidden.

### Solution: Do not hide the radio elements, make them invisible.

We'll change `visibility: hidden` to `opacity: 0`. This restores keyboard accessibility to the radio element. 

### Missing `aria` and `role` attributes

No `aria` attributes or landmark `role` attributes are included in the markup. We'll need those to help screen readers understand the accessibility tree.

### Solution: Replace `class` attributes with `role` and `aria` attributes.

Removing `.class` rules and `class` attributes is not strictly necessary. Doing so lets our changes stand out in the code base.

In the HTML, we'll replace `class="tab-label"` with `role="tab"`, and replace `class="tab-content"` with `role="tabpanel"`.

In the CSS, we'll change `.tab-label` to `[role="tab"]`, and change `.tab-content` to `[role="tabpanel"]`.

At this point, screen readers will announce the label text, "radio button", "one of three", and "selected" or "non-selected." Good enough. We'll come back to this.

## Responsive UI

Brad remarks in a [caveat](https://uglyduck.ca/tabbed-content/#one-minor-caveat) at the end of his post,

> The `height` of the inner content doesn’t grow dynamically since it defaults as `absolute`, so a `min-height` or `height` value is required on the parent element.

Brad also uses a nice media query for narrow screens `(max-width: 38em)` to stack the tabs vertically and avoiding line wrapping.

When I minimize the screen width, however, the tabs and panels are interleaved, as in the screenshot below.

{{< rawhtml >}}
<img src="/img/btaunt-css-tabs-narrow.png" alt="Brad's CSS tabs in narrow screen" width="100%">
{{< /rawhtml >}}

For a tabbed interface, I would usually expect the tabs to stack together, and the selected panel to display beneath all of them. In this case, that design makes sense for an accordion interface (and a potential future blog post).

That's a minor quibble, but I will address it in the solution.

### Both problems have the same cause

The markup groups the tabs with their panels, requiring CSS to treat them as frames using absolute positioning, z-indexing, and scrollbars in case the content overflows the panel width or height.

### Solution, Part 1: Flatten the markup

We'll pull the input, label, and content elements out their respective `tab-item` div elements. Then we'll place the input-label pairs at the top, and the tabpanel elements at the bottom, so they share the same parent element.

      <input name="tabs" type="radio" id="tab-1" checked>
      <label role="tab" for="tab-1" id="tab-label-1>Tab 1</label>

      <input name="tabs" type="radio" id="tab-2">
      <label role="tab" for="tab-2" id="tab-label-2">Tab 2</label>

      <input name="tabs" type="radio" id="tab-3">
      <label role="tab" for="tab-3" id="tab-label-3">Tab 3</label>

      <div role="tabpanel">Content goes here</div>
      <div role="tabpanel">Content goes here</div>
      <div role="tabpanel">Content goes here</div>

That allows the *parent* element to adjust itself to the curently selected *panel's* content, rather than having to constrain the content to the parent.

### Solution, Part 2: Simplify the CSS

So now we can simplify the CSS, by removing the position, overflow, and z-index rules and add `display: none` to hide all panels by default.

    [role="tabpanel"] {
      display: none;

      /* Other rules omitted ... */
    }

Now comes a verbose state-machine-like part. We'll show a tabpanel by matching the selected tab (radio) by its nth-of-type to its corresponding tab panel. Since the panels are subsequent siblings of the tabs, we use the `subsequent-siblings` combinator (`~`) to tie them together.

    [name="tabs"]:nth-of-type(1):checked ~ [role="tabpanel"]:nth-of-type(1),
    [name="tabs"]:nth-of-type(2):checked ~ [role="tabpanel"]:nth-of-type(2),
    [name="tabs"]:nth-of-type(3):checked ~ [role="tabpanel"]:nth-of-type(3) {
      /* ADDED: show selected tabpanel */
      display: block;
    }

This is the only part of the CSS that is driven by the HTML &mdash; that is, we'll have to add or remove selectors should the number of tabs and panels changes in the future.

## The revised experience so far

We can now

+ focus on a tab by clicking with the mouse or using the {{< rawhtml >}}<kbd>Tab</kbd>{{< /rawhtml >}} key to navigate to the tab list,
+ navigate among the tabs by pressing the {{< rawhtml >}}<kbd>ArrowDown</kbd>{{< /rawhtml >}} and {{< rawhtml >}}<kbd>ArrowUp</kbd>{{< /rawhtml >}} keys.

The arrow key navigation over the tabs (the radio elements) means that {{< rawhtml >}}<kbd>ArrowDown</kbd>{{< /rawhtml >}} on the last radio will return to the first radio, and {{< rawhtml >}}<kbd>ArrowUp</kbd>{{< /rawhtml >}} on the first radio will return to the last radio. To navigate out of the radio tabs, we have to use the {{< rawhtml >}}<kbd>Tab</kbd>{{< /rawhtml >}} key.

And that's how we'll access the tabpanel content.

### Tabpanel accessibility

We need to make the panel content accessible from the selected tab by adding a new heading element and giving the `tabindex="0"` attribute, which makes it discoverable by the {{< rawhtml >}}<kbd>Tab</kbd>{{< /rawhtml >}} key, as in the following example.

    <div role="tabpanel" aria-labelledby="tab-label-1">
      <h3 tabindex="0">Tab panel 1</h3>
      <p>Content goes here.</p>
    </div>

Note the `aria-labelledby` attribute referring to the label element of the radio input that controls it. This lets the screen reader know *not* to read the text *inside* the panel when the radio receives focus.

Now we can

+ focus on panel content from the selected tab by pressing the {{< rawhtml >}}<kbd>Tab</kbd>{{< /rawhtml >}} key,
+ return focus from the panel back to the tab group by pressing {{< rawhtml >}}<kbd>Shift</kbd>{{< /rawhtml >}} + {{< rawhtml >}}<kbd>Tab</kbd>{{< /rawhtml >}}.

## Screen Reader experience

As I was testing our progress to this point, something seemed wrong with the keyboard navigation when the screen reader is on: Each tab traversal required *two* {{< rawhtml >}}<kbd>Arrow</kbd>{{< /rawhtml >}} key presses to move from radio to radio.

The solution I arrived at is to *hide the label element from the keyboard navigation with `aria-hidden="true"`, but reference its text from the radio element using `aria-labelledby`.*

Thus,

    <input name="tabs" type="radio" id="tab-1" aria-labelledby="tab-label-1" checked>
    <label role="tab" for="tab-1" id="tab-label-1" aria-hidden="true">Tab 1</label>

And that removed the double arrow press problem.

## Remaining issues

So. Pretty close!

There are some issues remaining with the current tab solution in screen readers:

1. Lack of coverage. I have only tried this with *Windows 10 Narrator* and only in Chrome, Firefox, and Edge. If you use another screen reader like VoiceOver, or browser like Safari, your experiences may differ. 
2. When the screen reader is on, we lose the restricted arrow key navigation on the tab (radio) elements. Pressing {{< rawhtml >}}<kbd>ArrowDown</kbd>{{< /rawhtml >}} on the last radio will move focus to the next accessible element. If tab 1 is open, for example, the {{< rawhtml >}}<kbd>ArrowDown</kbd>{{< /rawhtml >}} key press on tab 3 will move focus to tab panel 1. That *may* be unexpected behavior for experienced screen reader users.
3. When navigating with arrow keys, the screen reader will announce whether the radio tab is selected or non-selected. To select the radio, you have to press {{< rawhtml >}}<kbd>Space</kbd>{{< /rawhtml >}} or {{< rawhtml >}}<kbd>Enter</kbd>{{< /rawhtml >}}. (That was news to me, because when the screen reader is off, the arrow key traversal selects the radio when it receives focus.)
4. *Firefox only*: To focus on content of a **newly selected** tab, I found I needed to *double press* the {{< rawhtml >}}<kbd>Tab</kbd>{{< /rawhtml >}} key. (The Chrome and Edge browsers behaved as expected, requiring a single key press.)

## Surprise

Using the `aria-hidden="true"` attribute on the label elements which have the `role="tab"` attribute did not degrade the screen reader *experience* &mdash; I have no idea how that affects the Accessibility Object Model underneath.

Another thing, I omitted the `role="tablist"` attribute on the parent demo element. Adding it had no effect in Windows 10 Narrator, which I assume is due to the element not being a list (`<ul>` or `<ol>`).

## Caution

Before we celebrate too much, keep in mind this advice from Sara Soueidan:

{{< rawhtml >}}
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">CSS-only interactive widgets are, most of the times, inaccessible hacks. JavaScript is *required* to build certain components accessibly. Please don’t advocate CSS-only alternatives when JS is needed for accessible state/functionality. The Web has enough inaccessible UIs as is.</p>&mdash; Sara Soueidan (@SaraSoueidan) <a href="https://twitter.com/SaraSoueidan/status/1167079557402386435?ref_src=twsrc%5Etfw">August 29, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
{{< /rawhtml >}}

## Demo

You can [visit the demo](/demos/accessible-css-driven-tabs-demo/) and try out the solution, and even view the CSS.

If you find further issues or have questions about this (admittedly long) post, feel free to [contact me](/about/#getting-in-touch).

## In closing&hellip;

Finally, I'd like to thank [Brad](https:twitter.com/bradtaunt) again for his permission to link to his example. 
