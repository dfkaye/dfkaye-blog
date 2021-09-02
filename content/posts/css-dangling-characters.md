---
title: "CSS Dangling Characters"
date: 2021-09-01T21:17:48-07:00
lastmod: 2021-09-01T22:30:48-07:00
description: "What happens when CSS rule sets contain dangling characters after the last rule."
tags:
- "CSS"
- "Troubleshooting"
---

This is short a follow-up post to [Pseudo-comments in CSS](/posts/2021/08/25/pseudo-comments-in-css/). That post goes into intolerably delicious detail about the ways the CSS parser lets you use non-standard characters to comment out CSS rules and rule sets.

The current post addresses what happens when such characters appear, or "dangle", after the last rule of a rule set. All the examples are mistakes and should not be copied.

<!--more-->

## Table of Contents

- [Grouping characters](#grouping-characters)
  - [Opening characters](#opening-characters)
  - [Closing brace](#closing-brace)
  - [Closing bracket or parenthesis](#closing-bracket-or-parenthesis)
- [Quoting characters and Alpha-numeric characters](#quoting-characters-and-alpha-numeric-characters)
  - [Semi-colon](#semi-colon)
  - [No semi-colon](#no-semi-colon)
- [Closing thoughts](closing-thoughts)

{{< jump-heading >}}Grouping characters{{< /jump-heading >}}

The grouping characters, `{}, [], ()` have surprising results and differences. The opening characters have the same disastrous effect, while the closing characters differ in their effects.

{{< jump-heading level="3">}}Opening characters{{< /jump-heading >}}

When an opening grouping character, (i.e., `{`, `[`, or `(`), is placed after the last rule, the rule is applied, but *all* subsequent selectors are ignored.

```css
  [data-namespace="field:hint"] {		
		color: green

    { /* This character invalidates the rest of the stylesheet. */
  }

  [data-namespace="field:error"] {
    color: red; /* This is ignored. */
  }

  [data-namespace]:focus {
    background: aqua; /* This is also ignored. */
  }
```

{{< jump-heading level="3">}}Closing brace{{< /jump-heading >}}

When a closing brace, `}`, is placed after the last rule, the rule is applied, but the next selector is *ignored*, while the selector after that is applied.

```css
  [data-namespace="field:hint"] {		
		color: green  /* This is applied. */
    
    }
  }
  
  [data-namespace="field:error"] {
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

If no semi-colon appears on the last rule, and a quoting  or alpha-numeric character appears after that, the rule is ignored, but the subsequent selector is applied.

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

{{< jump-heading >}}Closing thoughts{{< /jump-heading >}}

While I like to explore strange behavior around the edges, this is not a post recommending how to turn rules off with dangling characters. That is unambiguously a mistake.
