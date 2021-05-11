---
title: "Custom Attributes Are Fast Good and Cheap"
date: 2021-05-07T13:02:51-07:00
lastmod: 2021-05-11T10:36:51-07:00
description: "On using HTML element attributes, and CSS attribute selectors when deriving styles based on state."
tags:
- "CSS"
- "HTML"
- "Minimalism"
- "Semantics"
---

*This post, first begun August 28, 2016, originally appeared on my slowly deteriorating wordpress blog August 16, 2019. I also [tweeted](https://twitter.com/dfkaye/status/957373096104665088) about this approach in 2018.*

After years working with HTML and CSS, we have come to a surprising conclusion.

<!--more-->

> Avoid CSS classes when deriving styles based on state. Prefer HTML element attributes, and CSS attribute selectors.


## CSS Class Selectors

Classes (and tags) are categorical selectors (the “whatness” of something). But thanks to inheritance, and the specificity of the class selector, if you stick with classes, you end up with *overwhelming whatness*.

## Lessons of the Past

Some things we thought we learned along the way:

+ Do not use tables to structure page layout.
+ Do not use ID selectors in CSS (too specific, not generic enough).
+ Do not use tagName selectors (too general, definitions have to be overridden).
+ Use class selectors and avoid the cascade.
+ Use selectors in combination to override the cascade.
+ Use descendant selectors to name-space rules.
+ Do not over-use descendant selectors.

These lessons are meant to shield us from hard-to-maintain, hard-to-correct mistakes.

But, they reduce our thinking, along with the pre-processing tools like [SASS](https://sass-lang.com/) and patterns like [BEM (Block, Element, Modifier)](http://getbem.com/), into producing classes for everything&hellip; *including states*.

## States are not classes.

A stop light is red, not because it is a stop light, but because when the *state* is *stop*, the *view* or *display* is red.

## Stop relying on them.

Although I’m speaking strictly of CSS classes (and `tagNames`), classes (as a class) attempt to define some experience based on the *category* a thing is or belongs to – *rather than what the thing does*. Classes are both **too general** (because they are categorical) and **too specific** (because elements can belong to more than one category – i.e., *inherit* from multiple ancestors).

## Communicating State.

Classes in combination can work – that is the basis for [utility-first CSS frameworks](https://tailwindcss.com/docs/utility-first/) – for example:

```html
<div class="max-w-sm mx-auto flex p-6 bg-white rounded-lg shadow-xl">...</div>
```

But utility-first CSS has nothing to do with communicating state, and everything to do with re-usable composition of rules.

Of course, the industry habit has been to create three classes for re-use, them combine them, e.g., as a `.signin.main.button` selector, to specify one-off styles when all three are present in a unique situation – to override inherited specificity.

## Classes are the wrong “abstraction”.

You can still use a class for an element, but should *avoid multi-classing anything*.

Classes are not singular attributes, they represent **groups** of attributes. Combining more than one class into an element creates more dependencies for that element.

When you modify any of the shared classes, expect the unexpected results.

## Prefer *attributes* in combination instead.

It makes more sense and easier reading to differentiate things based on their individual attributes, especially in combinations.

Like classes, attributes are not "inherited" from ancestor elements, so they are *always* specific enough.

Start with an attribute that defines a general, default behavior: `[base] {color: orange;}`.

Qualify it with another attribute to define a one-off behavior: `[base][modified] {color: aqua;}`.

Because attributes are in sets, they can be written in any order: `[active][stop][light] {}`, which is the same as `[light][stop][active] {}`.

## Think of attributes as *scopes*, their values as *state-based specifiers*.

An attribute selector has the same specificity as a class. You can use an attribute selector to find any element with an `href` attribute, for example, using `[href] {}`.

An attribute selector with a value increases the specificity. You can find any element with an *empty* href attribute using `[href=""] {}`.

You can increase the specificity and/or fine-tune selection by states using any of the partial combinators, matching by:

+ presence: `[attr]`
+ exact value: `[attr="yes"]`
+ value starting with: `[attr^="y"]`
+ value ending with: `[attr$="s"]`
+ value containing: `[attr*="yes"]`
+ value contained in space-separated list: `[attr~="yes"]`
+ value contained in hyphen-separated list: `[attr|="yes"]`
+ case-insensitive matching: `[attr|="Yes"  i]`

See more at
[\[attribute\]](https://css-tricks.com/almanac/selectors/a/attribute/) by Sara Cope (2011) and [Splicing HTML’s DNA With CSS Attribute Selectors](https://www.smashingmagazine.com/2018/10/attribute-selectors-splicing-html-dna-css/) by John Rhea (2018).

## Use Custom Attributes to Model State

*Note: The following example really works - custom attributes in HTML are supported in all browsers, and will be located by the corresponding CSS attribute selectors. The point is to focus on the attribute as a state indicator.*

We define a traffic signal as a list of lamps using custom attributes for the "signal" and "lamp" elements. Each lamp element activates for a specific state. We also add a button indicating a next state should be calculated.

```html
<ul signal>
  <li lamp="stop"></li>
  <li lamp="slow"></li>
  <li lamp="go"></li>
</ul>
<button next>
```

Style it with very base CSS (shaping rules omitted for brevity):

```css
[signal] {
  background: grey;
}

[lamp] {
  background: #adadad;
}
```

Add state-specific styles with attribute-value combinations:

```css
[signal="stop"] [lamp="stop"] { background: red; }
[signal="slow"] [lamp="slow"] { background: yellow; }
[signal="go"]   [lamp="go"]   { background: green; }
```

To make it interactive, we use JavaScript to listen to the button click events to add or set the attribute for the `signal` based on its current vs. its next state:

```js
!(function() {
  var signal = document.querySelector('[signal]');
  var btn = document.querySelector('[next]');
  var lamp; // store state here, no need to call signal.getAttribute

  function next() {
    lamp = lamp == 'stop'
      ? 'go'
      : lamp == 'go'
        ? 'slow'
        : 'stop';

    signal.setAttribute('signal', lamp);
  }

  next(); // initialize...

  btn.addEventListener('click', next);
}());
```

*You can view the working demo on [CodePen](https://codepen.io/dfkaye/pen/eYJzQbX), and view the "data-attribute" refactoring that appears at the end of this post.*

## Use Custom Attributes to Replace BEM.

To deal with ["class-itis"](https://www.steveworkman.com/html5-2/standards/2009/classitis-the-new-css-disease/), [BEM (or "Block, Element, Modifier")](https:getbem.com) architecture was developed in the early 2010's (following [SMACSS (or "Scalable and Modular Architecture for CSS")](http://smacss.com/) and [OOCSS](https://www.smashingmagazine.com/2011/12/an-introduction-to-object-oriented-css-oocss/)).

It is not a bad approach, but BEM is a symptom, not a solution.

Here's an example [I tweeted about](https://twitter.com/dfkaye/status/957373096104665088
), focusing on an element in a social networking site that specifies the `class` attribute using the BEM namespace strategy:

```html
<span class="presence-indicator presence-entity__indicator presence-entity__indicator--size-8 presence-indicator--is-reachable presence-indicator--size-8 ember-view">...</span>
```

I completely understand and sympathize, but at the end of the day, you’re all fired. I don’t want to maintain that kind of repetition, nor do I want to promote sending all that bloat over the wire repeatedly.

BEM is still trying to handle both *categorical* styling as well as **stateful** styling in a single selector, by solely relying on `.className` selectors.

### Fixing That Example a bit

Let's break some conventions to get our heads around this, because this is fundamental. We can fix all this later with something more semantic or conventional. The thing to keep in mind: *class-categorical* styling and **stateful** styling are two different things.

First, let's cut down the repetition between `presence-indicator` and `presence-entity__indicator`. These both seem to mean that another user is online, so let's call it `online`.

Second, there are two other modifiers, `size-8` and `is-reachable`. Let's use `reachable` for the second one, where its presence means `true`, its absence means `false`.

The `size-8` modifier, on the other hand, hints that a utility rule for sizing is needed. We'll defer that decision for later in this post.

Here's the revised HTML:

```html
<span online size-8 reachable>...</span>
```

Add CSS for that with the corresponding attribute selectors, :

```css
[online] { outline: 2px aqua }
[size-8] { padding: 8px }
[reachable] { background: green }
```

Yes, this actually works in browsers later than IE6. True, the markup isn’t "valid HTML." The point is that we can use any attribute other than class to control the style, and we use that attribute’s presence and/or content to control styling by element state.

## Use *Only* Attributes for Styles.

This year (2019), we created a third-party component using `[company-component]` attribute selectors to restrict our styles to our container within a page hosted by our clients, and prevent them affecting any styles in the host page.

We used JavaScript to walk the elements and their descendant elements in the component and add `[company-component]` attributes to all of them.

An element with special meaning, like "start" or "date-picker" or "progress", would be assigned that value to the attribute. For example, a `start` element would be created as `<section company-component="start">`, and the CSS selector ruleset for it would be `[company-component="start"] {}`.

All other elements received their tagNames in lowercase as the attribute value. For example, an `h2` element would be created as `<h2 company-component="h2">`, and the CSS selector ruleset for it would be `[company-component="h2"] {}`.

By using attribute selectors entirely, we controlled all styles on the container, the form elements, the summary, any lists, etc., without affecting styles in the host page.

## Conclusion&hellip;?

**Custom attributes are fast, good, and cheap.**

They are supported in all browsers after IE6. They are easy to add, modify, and remove. They are easy to compose for more interesting behavior given interesting states.

{{< rawhtml >}}
<p lang="fr-FR">
<em>Voil&agrave;.</em>
</p>
{{< /rawhtml >}}

## Wait a minute, Wait a minute&hellip;!!

Shouldn't we use `*data*-attributes` rather than "custom" attributes?

OK, OK, yes. For "valid" HTML, *custom* attributes should be prefixed with `data-`. When you use the `data-` prefix style, you automatically get the `element.dataset` API in JavaScript (in 2015's modern browsers).

So, return to our example refactoring. Since we're dealing with an "entity", we can add a `data-entity` attribute and incorporate the previous attributes (online, size-8, reachable) as attribute values instead:

```html
<span data-entity="online size-8 reachable">...</span>
```

And the CSS for that with partial-match-attribute selectors (in this case, matching a value contained in space-separated list):

```css
[data-entity~="online"] { outline: 2px aqua }
[data-entity~="size-8"] { padding: 8px }
[data-entity~="reachable"] { background: green }
```

Now we can see that the `size-8` rule isn't "state" specific, and can be pulled into the default ruleset for data-entity, leaving us with this HTML:

```html
<span data-entity="online reachable">...</span>
```

And the corresponding CSS:

```css
[data-entity] { padding: 8px }
[data-entity~="online"] { outline: 2px aqua }
[data-entity~="reachable"] { background: green }
```

{{< rawhtml >}}
<p lang="fr-FR">
<strong><em>Voil&agrave;!</em></strong>
</p>
{{< /rawhtml >}}
