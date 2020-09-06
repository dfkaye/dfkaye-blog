---
title: "Attributes and Entities"
date: 2020-09-05T21:40:28-07:00
description: "Browsers support attributes in HTML without explicit values, and support alphanumeric entities. XML does not, making the RSS feed setup a nightmare of revision and testing."
tags:
- "Attributes"
- "Entities"
- "HTML"
- "XML"

---

I came across something unexpected (which is to say I had forgotten all about it) tonight while working on setting up the RSS feed for this site.

<!--more-->

I like using custom attributes for styling purposes in the browser, rather than classes. I'll explain why in another post, but here's an example.

```html
<b attribute>not set</b>
<b attribute="">explicitly set</b>
```

Browsers will interpret the first as though it were the second, which means we can use the following CSS selector to match both.

```css
[attribute=""] {
  outline: 1px dotted gray;
}
```

## What went wrong

When trying to generate a feed for the *entire content* of a page, *rather than its summary*, I was reminded that the XML processor in browsers is still strict, and requires "well-formedness," which means:

1. Every attribute must be quoted as `attribute=""`, even it is empty.
2. Every void element such as `<input>` or `<br>` must include its own self-closing slash character as `<input />` or `<br />`. (For more on void elements see https://riptutorial.com/html/example/4736/void-elements.)

Any XML that did not validate according to those rules aborted processing at the first error.

## Not only that

I also found that the blogging server I use, [Hugo](https://gohugio.io), translates certain characters in markdown into HTML entities that XML does not recognize.

```markdown
## Here's an example

&copy; not translated.
```

Here's the result:

```HTML
<h2>Here&rsquo; an example</h2>

&copy; not translated.
```

But XML expects Unicode entities instead.

```HTML
<h2>Here&#8217; an example</h2>

&#169; ...
```

## Stay Tuned

We'll see if I can get a top-level RSS XML output going.

If I have to re-think my cavalier approach to attributes, maybe devise a site-side namespace attribute that takes a value specifiying the element's type or behavior&hellip;

Yes.

As for the alhpanumeric vs. unicode entity problem, I may open an issue on the Hugo github repository&hellip; Some day.
