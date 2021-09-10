---
title: "CSS Dangling Characters"
date: 2021-09-01T21:17:48-07:00
lastmod: 2021-09-09T20:35:48-07:00
description: "What happens when CSS rule sets contain dangling characters after the last rule."
tags:
- "CSS"
- "Troubleshooting"
---

This post follows up my previous post on [Pseudo-comments in CSS](/posts/2021/08/25/pseudo-comments-in-css/). That post goes into intolerably delicious detail about the ways the CSS parser lets you use non-standard characters to comment out CSS rules and rule sets.

The current post addresses what happens when such characters appear, or "dangle", after the last rule of a rule set. All the examples shown are mistakes that should be avoided.

<!--more-->

## Table of Contents

- [Grouping characters](#grouping-characters)
  - [Opening characters](#opening-characters)
  - [Closing brace](#closing-brace)
  - [Closing bracket or parenthesis](#closing-bracket-or-parenthesis)
- [Quoting characters and Alpha-numeric characters](#quoting-characters-and-alpha-numeric-characters)
  - [Semi-colon](#semi-colon)
  - [No semi-colon](#no-semi-colon)
- [Across multiple stylesheets](#across-multiple-stylesheets)
- [Closing thoughts](#closing-thoughts)

{{< jump-heading >}}Grouping characters{{< /jump-heading >}}

The grouping characters, `{}, [], ()` have surprising results and differences. The *opening* characters have the same disastrous effect, while the *closing* characters differ in their effects.

{{< jump-heading level="3">}}Opening characters{{< /jump-heading >}}

When an opening grouping character, (i.e., `{`, `[`, or `(`), is placed after the last rule, the rule is applied, but *all* subsequent selectors are ignored.

```css
  [data-namespace="field:hint"] {		
		color: green

    { /* A dangling opening grouping character invalidates the rest of the entire stylesheet. */
  }

  [data-namespace="field:error"] {
    color: red; /* This is ignored. */
  }

  [data-namespace]:focus {
    background: aqua; /* This is also ignored. */
  }
```

{{< jump-heading level="3">}}Closing brace{{< /jump-heading >}}

When a closing brace, `}`, is placed after the last rule, the rule is applied, but the next selector is *ignored*, and the selector after *that* is applied.

```css
  [data-namespace="field:hint"] {		
		color: green  /* This is applied... */
    
   } /* ...despite this dangling character. */
  }
  
  [data-namespace="field:error"] {
    /* Both rules below are ignored because of the previous dangling character. */

    background: white; /* This is ignored. */
    color: red; /* This is also ignored. */
  }
  
  [data-namespace]:focus {
    background: aqua; /* This is applied. */
  }
```

{{< jump-heading level="3">}}Closing bracket or parenthesis{{< /jump-heading >}}

When a closing bracket, `]`, or parenthesis, `)`, is placed after the last rule, the rule is applied, *and* the next selector is applied.

```css
  [data-namespace="field:hint"] {		
		color: green  /* This is applied. */
    
    ]
  }
  
  [data-namespace="field:error"] {
    color: red; /* This is also applied. */
  }
```

{{< jump-heading >}}Quoting characters and Alpha-numeric characters{{< /jump-heading >}}

The double and single quote characters as well as alpha-numeric characters affect rule processing only when the last rule does not terminate with a semi-colon.

{{< jump-heading level="3">}}Semi-colon{{< /jump-heading >}}

If a semi-colon appears before the quoting or alpha-numeric character, the rule applies.

```css
  [data-namespace="field:hint"] {		
		color: green; /* This is applied. */

		" /* Dangling quote. */
  }

  [data-namespace="field:error"] {
    color: red; /* This is applied. */
  }
```

{{< jump-heading level="3">}}No semi-colon{{< /jump-heading >}}

If no semi-colon appears on the last rule, and a quoting or alpha-numeric character appears after that, the rule is ignored, while the subsequent selector is applied.

```css
  [data-namespace="field:hint"] {		
		color: green /* No semi-colon. */

		" /* Dangling quote, terminates the rule which the parser discards as invalid. */
  }

  [data-namespace="field:error"] {
    color: red; /* This is applied. */
  }
```

**Short explanation:** Without the semi-colon, the parser includes the dangling quote or alpha-numeric character as part of the rule, and then discards it as invalid. This is explained at greater depth in the other post treating pseudo-comments as [targeted malformedness](/posts/2021/08/25/pseudo-comments-in-css/#pseudo-comments-as-targeted-malformedness).

{{< jump-heading >}}Across multiple stylesheets{{< /jump-heading >}}

*This section added on {{< rawhtml >}}<time datetime="2021-09-09">September 9, 2021</time>.{{< /rawhtml >}}*

CSS parsers in browsers process each stylesheet one at a time. As a result, a failure in one does not affect processing of any subsequent stylesheets, whether referenced by `<link>` elements or defined inline with `<style>` elements.

The following example uses three `<style>` elements. The second definition should fail due to the dangling open brace, `{`.

```html
<!-- The following three rules run in separate stylesheets. -->

<style>
  [data-namespace="field:hint"] {		
		color: green  /* This is applied. */
    
    } /* ...despite this dangling character. */
  }
</style>

<style>
  [data-namespace="field:hint"] {
    color: red  /* This is ignored... */
    
    { /* ...because of this dangling character. */
  }
</style>

<style>
  [data-namespace="field:hint"] {
    color: aqua; /* This is applied. */
  }
</style>
```

Since each separate rule set only defines color, the last one, `aqua`, will be applied.

That will not be the case if we join the second and third rule sets into the same stylesheet, in which case only the first color, `green`, is applied.

```html
<!-- The first rule runs in its own stylesheet. -->

<style>
  [data-namespace="field:hint"] {		
		color: green  /* This is applied. */
  }
</style>

<!-- The next two rules run in the same stylesheet. -->

<style>
  [data-namespace="field:hint"] {
    color: red  /* This is ignored... */
    
    { /* ...because of this dangling character. */
  }

  [data-namespace="field:hint"] {
    color: aqua; /* This is also ignored, because of the previous dangling character. */
  }
</style>
```

{{< jump-heading >}}Closing thoughts{{< /jump-heading >}}

Clearly, I like exploring strange behavior around the edges.

That said, this is not a post recommending how to turn rules off with dangling characters. That is unambiguously a mistake.
