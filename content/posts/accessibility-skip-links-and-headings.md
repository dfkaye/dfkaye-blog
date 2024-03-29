---
title: "Skip Links, Jump Links, and Accessible Headings"
date: 2020-09-30T13:06:40-07:00
lastmod: 2020-09-30T17:23:40-07:00
description: "Making heading elements accessible to skip link and table of contents links navigation for keyboard and screen readers."
tags:
- "Accessibility"
- "Progressive enhancement"
- "HTML"
scripts:
- "https://platform.twitter.com/widgets.js"

---

## Acknowledgements

First off, I'd like to thank [Jason Karns](https://twitter.com/jasonkarns), [Timothy Leverett](https://twitter.com/zzzzBov), and [Leonie Watson](https://twitter.com/LeonieWatson) for their suggestions in a conversation I started on [twitter](https://twitter.com/dfkaye/status/1311001235495858176).

<!--more-->

{{< rawhtml >}}
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The h2 also needs `tabindex=&quot;-1&quot;` to move tab focus. Otherwise, your next arrow or tab press returns to the previously &quot;next&quot; item.<br><br>You could also use `tabindex=&quot;0&quot;` to make your headings discoverable via the tab key.<br><br>2/2</p>&mdash; david Kaye (--The &quot;K&quot; stands for Quality) (@dfkaye) <a href="https://twitter.com/dfkaye/status/1311001814104305664?ref_src=twsrc%5Etfw"><time datetime="2020-09-29">September 29, 2020</time></a></blockquote>
{{< /rawhtml >}}

## The Problem

I wrote those tweets after discovering a problem, on my own post about [teaching yourself accessibility](/posts/2020/08/27/teach-yourself-accessibility/).

When I would engage Windows 10 Narrator and use the skip link to go to the main content, my next keypress {{< rawhtml>}}on either <kbd>Arrow</kbd> or <kbd>Tab</kbd> keys{{< /rawhtml>}} would *not* continue into the content as expected. Rather, focus returned to the navigation links at the top of page.

I will present a working solution to that problem, after a brief discussion about different use cases.

## Skip-link navigation

A skip-link is meant to be accessible to screen reader users such that they can opt *not* to repeat any landmarks between the skip link and the main content of the page. Landmarks customarily include site navigation links, front matter and other details about the page.

Here is the HTML for the skip link on this blog which links to the `#main` element.

```html
<a href="#main" visually-hidden="">Skip to main content</a>
```

Here is the `#main` element that link skips to.

```html
<h1 id="main" page-title="">Skip Links, Jump Links, and Accessible Headings</h1>
```

## Tab key navigation

Now, as a sighted user, I can normally opt for mouse navigation, scrolling around or clicking on links. But I like to verify that {{< rawhtml>}}both <kbd>Arrow</kbd> and <kbd>Tab</kbd> keys{{< /rawhtml>}} navigate within controls (such as radio groups) or jump from one landmark to the next (such as buttons, inputs, or other links).

As stated earlier, those keypresses did not behave as expected when I engaged with the screen reader. 

## Jump links from a Table of Contents

I also discovered the same behavior in the table of contents with jump links to each section heading. When engaged with the screen reader, I could jump from each link to each heading {{< rawhtml >}}using <kbd>Space</kbd> and <kbd>Enter</kbd> keys{{< /rawhtml >}}, but the next keypress {{< rawhtml>}}on either <kbd>Arrow</kbd> or <kbd>Tab</kbd> keys{{< /rawhtml>}} would *not* continue into the content as expected.

Instead, the focus would return to the table of contents.

## Screen reader navigation

Screen readers offer their own methods for navigating page content by heading levels. In Windows 10 Narrator, use the number keys to jump to headings that match the numeric level. For example, press `1` to jump to the next `<h1>` element, `2` to jump to the next `<h2>` element within the current `<h1>` element, and so on.

When I navigated the headings in this way, the next keypress {{< rawhtml>}}on either <kbd>Arrow</kbd> or <kbd>Tab</kbd> keys{{< /rawhtml>}} *would* continue into the content as expected.

## The Problem Revised: Screen Reader Announcements

Although screen reader navigation "worked," the screen reader would not announce the text of the heading elements, announcing instead the site title and page title, followed by "zero percent scrolled."

## Fixing Skip-to-Main Announcements 

I found that adding `tabindex="0"` to each heading resulted in the screen reader announcing the heading text on the skip link and jump link navigation.

I also found that using `-1` instead of `0` achieved the same effect. I went with `-1` for the tabindex so as not to confuse users of screen readers who rely on their preferred method of heading navigation &ndash; in my case, using the number keys when engaged with Windows 10 Narrator. 

My `#main` heading now reads as follows.

```html
<h1 id="main" page-title="" tabindex="-1">Skip Links, Jump Links, and Accessible Headings</h1>
```

## Fixing Jump Heading Announcements

I also chose to make headings tab-indexable only where they are linked from a table of contents. That allows the screen reader to announce the heading text without announcing "zero percent scrolled."

To do that in markdown on Hugo, I created a "jump-heading" [shortcode](https://gohugo.io/content-management/shortcodes/).

That shortcode mimics Hugo's built-in algorithm that creates an `id` attribute for each heading element based on its text content.

```hugo
{{</* jump-heading */>}}What we'll do next{{</* /jump-heading */>}}
```

That produces an `h2` level element by default with the following markup.

```html
<h2 tabindex="-1" id="what-well-do-next">What we'll do next</h2>
```

Levels are supported with the named `level` param.

```hugo
{{</* jump-heading level="3" */>}}This is level 3{{</* /jump-heading */>}}
```

That produces an `h3` element instead.

```html
<h3 tabindex="-1" id="this-is-level-3">This is level 3</h3>
```

## Conclusion

While the solution may not be optimal, it did not take long to write.

What took by far the most time was investigating the different variations in the user experience between browsers, keyboard navigation, and screen reader navigation.
