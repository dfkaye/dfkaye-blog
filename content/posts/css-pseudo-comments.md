---
title: "Pseudo-Comments in CSS"
date: 2021-08-25T11:38:21-07:00
lastmod: 2021-09-01T20:22:21-07:00
description: "How browsers parse CSS styles, and how to work against convention to turn off rules and rule sets when debugging CSS. Re-post of my October 2015 Sitepoint.com article."
tags:
- "CSS"
- "Troubleshooting"
- "Against Convention"
---

*Thanks to [Louis Lazaris](https://twitter.com/impressivewebs) and [Web Tools Weekly](http://webtoolsweekly.com/), this post was originally published on Sitepoint.com, {{< rawhtml >}}<time datetime="2015-10-21">October 21, 2015</time>{{< /rawhtml >}}, at [Pseudo-comments in CSS (Or, How Browsers Parse Styles)](http://www.sitepoint.com/pseudo-comments-in-css-or-how-browsers-parse-styles/). It is actually a follow-up (slightly modified) to my earlier post on CSS line rule comments.*

## Preamble

The CSS spec does not mention it, but you can mimic C-style and/or Unix-style line comments in CSS files (with some caveats). Others have written about them before (see in particular, SitePoint's Web Foundations post covering [CSS Comments](https://www.sitepoint.com/web-foundations/css-comments/)). The present post examines them in further detail.

*I have a follow-up post to this one that covers [dangling characters](/posts/2021/09/01/css-dangling-characters/).*

<!--more-->

## Table of Contents

- [CSS comments](#css-comments)
- [Pseudo-comments](#pseudo-comments)
- [Semi-colons](#semi-colons)
- [Inline vs. Next-line placement](#inline-vs-next-line-placement)
- [Selectors](#selectors)
- [Pseudo-comments as targeted malformedness](#pseudo-comments-as-targeted-malformedness)
  - [Unknown values](#unknown-values)
  - [Illegal values](#illegal-values)
  - [Malformed declarations and statements](#malformed-declarations-and-statements)
  - [Quoting characters](#quoting-characters)
  - [Grouping characters](#grouping-characters)
- [At-rules](#at-rules)
  - [Pseudo-comments applied to at-rules with body blocks](#pseudo-comments-applied-to-at-rules-with-body-blocks)
  - [Pseudo-comments applied to at-rules *without* body blocks](#pseudo-comments-applied-to-at-rules-without-body-blocks)
  - [At-rules and Unknown at-keywords](#at-rules-and-unknown-at-keywords)
- [Pre-processors](#pre-processors)
  - [Sass](#sass)
  - [Less](#less)
  - [Stylus](#stylus)
- [Best practice](#best-practice)
  - [When to use pseudo-comments](#when-to-use-pseudo-comments)
  - [When to avoid pseudo-comments](#when-to-avoid-pseudo-comments)

{{< jump-heading >}}CSS comments{{< /jump-heading >}}

CSS parsers, [per the spec](https://www.w3.org/TR/CSS2/syndata.html), officially bless one style for comments, the multi-line comment from C-style languages, which uses a start token, `/*`, and an end token, `*/`, as follows:

```css
/*
  Characters between, and including, the start and end tokens are ignored by the parser.
*/
```

And so a rule declaration in comments will be ignored:

```css
body {
  background: red;
  /*
  background: white;
  */
}
```

A block declaration in comments will be ignored:

```css
/*
body {
  background: red;
}
*/
```

In each of those examples, we are using the comment syntax intentionally to instruct the parser to ignore the content.

However, we can do that by accident, as with malformed declarations, such as

```css
body {
  background: red  /* missing semi-colon */
  background: blue;      
}
```

In this example, *neither* background declaration is applied because of the missing semi-colon. The parser scans for the *next* semi-colon, determines the entire two-line statement is malformed, and so ignores the entire lexed content. The same thing happens if we leave out the property value altogether:

```css
body {
  background:
  background: blue; /* this declaration is not applied */
}
```

And *that* shows that we can use malformed declarations as…

{{< jump-heading >}}Pseudo-comments{{< /jump-heading >}}

We'll refer to these as "pseudo-comments" because, properly speaking, these are not comments that terminate at an end-of-line character. Instead they work by malforming the input that follows them, even on subsequent lines. And this is due to the error handling process for [Rule sets, declaration blocks, and selectors](https://www.w3.org/TR/CSS2/syndata.html#rule-sets):

> the whole statement should be ignored if there is an error anywhere in the selector, even though the rest of the selector may look reasonable in CSS 2.1.

In the following example, taken from the spec, the second rule set is ignored due to the presence of the invalid `&` character in the selector:

```css
h1, h2 {color: green }
h3, h4 & h5 {color: red } /* <= ignored */
h6 {color: black }
```

Again, in the following, the second and third declarations are ignored due to the presence of extra characters in the background property name:

```css
body {
  background: red;
  xbackground: white; /* property name is not recognized */
  y background: blue; /* property name is not well-formed */
}
```

A quick tour around the English language keyboard shows the following special characters will act as single-line declaration comments:

```css
selector {
  ~ property-name: ignored;
  ` property-name: ignored;
  ! property-name: ignored;
  @ property-name: ignored;
  # property-name: ignored;
  $ property-name: ignored;
  % property-name: ignored;
  ^ property-name: ignored;
  & property-name: ignored;
  * property-name: ignored;
  _ property-name: ignored;
  - property-name: ignored;
  + property-name: ignored;
  = property-name: ignored;
  | property-name: ignored;
  \ property-name: ignored;
  : property-name: ignored;
  < property-name: ignored;
  . property-name: ignored;
  > property-name: ignored;
  , property-name: ignored;
  ? property-name: ignored;
  / property-name: ignored;
}
```

Rather than use just any character, though, stick with C and Unix convention, and use either `#` or `//`:

```css
// background: ignored;
# background: ignored;
```

{{< jump-heading >}}Semi-colons{{< /jump-heading >}}

Semi-colons are the end tokens of rule declarations. Thus, they cannot "comment" text that follows them. In spec-speak, the parser treats a dangling semi-colon as a *malformed declaration* (a declaration missing a name, colon, or value).

As shown earlier, when regular multi-line comments are malformed, that is, when start and end tokens are not balanced around a rule set or declaration, the subsequent declaration or rule set is ignored by the parser. The following will in effect "comment" out both background declarations because the parser will search for the next end-of-declaration token (the semi-colon) for the affected declaration:

```css
body {
  background:
  background: blue; /* both lines ignored */
}
```

That's fixed by adding a semi-colon after the comment, before the next declaration (thus the background blue declaration will be applied):

```css
body {
background: ;     /* ignored */
background: blue; /* processed */
}
```

The effect is the same with a pseudo-comment on a line missing its semi-colon:

```css
body {
  background: # red /* ignored */
  background: blue; /* also ignored */
}
```

and corrected by restoring the semi-colon:

```css
body {
  background: # red;  /* ignored */
  background: blue;   /* processed */
}
```

One interesting thing about semi-colons is that they are optional for the last rule in a rule set. If the rule set contains only one rule, the semi-colon is optional. 

{{< jump-heading >}}Inline vs. Next-line placement{{< /jump-heading >}}

This is where the "pseudo" enters into the term "pseudo-comment." It may be reason enough not to call these "comments" at all as they break from the end-of-line convention of C or Unix-style line comments.

A pseudo-comment placed on its own line will suppress a declaration on the next line. In the following, the background will be blue:

```css
body { 
  //
  background: white !important; /* ignored */
  background: blue; /* processed */
}
```

A pseudo-comment placed after a valid declaration on the same line will suppress a declaration on the next line. In the following, the background will be white rather than blue:

```css
body {
  background: white; // next line is ignored... 
  background: blue !important;
}
```

Even a "minified" version of a CSS selector with an inline pseudo-comment will behave as a single-declaration comment. In the following, the first background declaration is ignored due to the presence of the comment token, `#`, recognized by the parser as terminating at the next semi-colon, and the second background declaration is recognized as well-formed and therefore applied (in this case, blue will be applied to the body background): 

```css
body { // background: red !important; background: blue; }
```

{{< jump-heading >}}Selectors{{< /jump-heading >}}

The same rule-based behavior applies to selectors.

An entire selector rule set is ignored when the selector is preceded by a pseudo-comment, whether inline,

```css
/* body is ignored */
// body {
  background: white !important;
}
```

or next-line:

```css
/* body is ignored */
//
body {
  background: white !important;
}
```

{{< jump-heading >}}Pseudo-comments as targeted malformedness{{< /jump-heading >}}

Pseudo-comments work by taking advantage of the spec's [Rules for handling parsing errors](https://www.w3.org/TR/CSS2/syndata.html#parsing-errors). In effect, they work by exploiting their malformedness.

{{< jump-heading level="3">}}Unknown values{{< /jump-heading >}}

> User agents must ignore a declaration with an unknown property.

A declaration containing an unrecognized property name will not be evaluated, as, for example, the `comment` property in the following `body` rule set:

```css
body {
  comment: 'could be text or a value';  /* ignored */
}
```

{{< jump-heading level="3">}}Illegal values{{< /jump-heading >}}

> User agents must ignore a declaration with an illegal value.

The second `color` property defined below is ignored because the value is a *string* rather than a value or color keyword, so the color applied will be gold, not red:

```css
body {
  color: gold;
  color: "red"; /* ignored */
}
```

{{< jump-heading level="3">}}Malformed declarations and statements{{< /jump-heading >}}

> User agents must handle unexpected tokens encountered while parsing a declaration [or statement] by reading until the end of the declaration [or statement], while observing the rules for matching pairs of (), [], {}, "", and '', and correctly handling escapes.

The second `color` rule that follows is malformed by the leading hyphen, `-`, in the property name, "color", and so the rule is ignored, and the applied color will be green, not red: 

```css
body {
  color: green;
  -color: red;  /* ignored */
}
```

Declarations malformed by unmatched pairs of `()`, `[]`, `{}`, `""`, and `''` are more comprehensively ignored (and therefore more dangerous) than others. And the quoting characters `""`, and `''` are processed differently than the grouping characters `()`, `[]`, `{}`.

{{< jump-heading level="3">}}Quoting characters{{< /jump-heading >}}

The *unpaired* apostrophe in the second declaration below will prevent the *subsequent* declaration in the rule set from being processed (thus, the background will be red):

```css
body {
  background: red;
  'background: white; /* ignored */
  background: blue;   /* also ignored */
}
```

However, a third declaration after the apostrophe *will* be processed (thus the background will be gold):

```css
body {
  background: red;
  'background: white; /* ignored */
  background: blue;   /* also ignored */
  background: gold;   /* processed */
}
```

In sum, you can't terminate a single quoting character on its own line.

{{< jump-heading level="3">}}Grouping characters{{< /jump-heading >}}

In general, grouping characters `()`, `[]`, `{}` should be *avoided* as pseudo-comments because they have more drastic effects in that they interfere more extensively with the parser's block recognition rules, and so will "comment" out more than single declarations. For the sake of completeness, we'll examine a few of these.

For example, the appearance of *unmatched* starting group characters suppresses *all* subsequent declarations to the end of the *stylesheet* (not just the rule set). This is true of commas, brackets, and braces.

In the following, only the `background: red;` declaration is processed; all declarations and selectors after that *in the entire stylesheet* will be ignored:

```css
body {
  background: red;

  /*
    Every declaration that follows will be ignored,
    including all subsequent selectors,
    to the end of the stylesheet.
   */

  {

  background: white;
  color: aqua;
  margin: 5px;
}
```

When grouping characters are *matched*, the grouped and subsequent ungrouped declarations in the *rule set* will be suppressed. In the following, the background will be red, not gold:

```css
body {
  background: red;

  /*
    Every declaration that follows will be ignored
    to the end of the rule set.
   */

  (
  background: white;
  background: blue;
  background: fuchsia;
  )

  background: gold;
}
```

A closing comma or bracket will suppress only the next declaration that appears. In the following, the background will be {{< rawhtml >}}<del>gold</del> <ins>blue</ins>{{< /rawhtml >}}:

```css
body {
  background: red;

  ]
  background: white;  /* ignored */
  background: blue;   /* processed */
}
```

A closing *brace*, `}`, however, will suppress all declarations to the end of the *rule set*. In the following, the background will be red:

```css
body {
  background: red;

  }
  background: white;  /* ignored */
  background: blue;   /* also ignored */
}
```

{{< jump-heading >}}At-rules{{< /jump-heading >}}

At-rules (denoted by `@<rulename>`) have two forms:

+ a body declaration denoted by braces, `{ ... }` (such as `@media`),
+ a rule declaration closed with a semi-colon, `;` (such as `@charset`).

Pseudo-comments on body-block at-rules behave the same as for selectors (i.e., the entire at-rule is ignored).

{{< jump-heading level="3">}}Pseudo-comments applied to at-rules with body blocks{{< /jump-heading >}}

For at-rules containing body blocks, such as `@keyframes`, `@media`, `@page`, and `@font-face`, the entire at-rule rule set is ignored when the at-rule is preceded by a pseudo-comment, whether inline,

```css
/* @media is ignored */
// @media (min-width: 0) {
  body {
    background: white !important;
  }
}
```

or next-line:

```css
/* @media is ignored */
//
@media (min-width: 0) {
  body {
    background: white !important;
  }
}
```

{{< jump-heading level="3">}}Pseudo-comments applied to at-rules _without_ body blocks{{< /jump-heading >}}

At-rules without blocks, such as `@charset` and `@import`, provide a fascinating exception to inline pseudo-comment behavior.

An at-rule with a pseudo-comment *after* the keyword will be ignored:

```css
/* The pseudo-comment before url() suppresses the entire @import statement. */
@import // url('libs/normalize.css');
```

But a pseudo-comment that *precedes* an at-rule suppresses both the import *and* the first rule or selector after the import. This is because the parser treats a pseudo-commented `@import` as a malformed statement, and looks for the next matching braces in order to complete the next rule set. 

Thus, a pseudo-comment before one `@import` in a series of `@import` rules will suppress *all* subsequent `@import` rules *and* the first declaration or selector after the last import:

```css
/*
  None of these loads because the first import is processed as a malformed statement,
  and the parser looks for the next matching pair of braces, {...}.
 */

// @import url('libs/normalize.css');
@import url('libs/normalize.css');
@import url('libs/example.css');
@import url('libs/other.css');
@import url('libs/more.css');
@import url('libs/another.css');
@import url('libs/yetmore.css');
```

The fix for this is surprisingly simple: {{< rawhtml >}}<del>just</del>{{< /rawhtml >}} add an empty body block after the commented `@import`

```css
/* Suppress loading of normalize. */
// @import url('libs/normalize.css');

/* Un-suppress any remaining imports by adding a pari of braces. */
{}

/* Now, the next import will load. */
@import url('libs/normalize.css');
```

This is fun for debugging, but that behavior is peculiar enough that you should avoid the pseudo-comments approach to at-rules without body blocks, and use the multi-line syntax instead.

{{< jump-heading level="3">}}At-rules and Unknown at-keywords{{< /jump-heading >}}

> User agents must ignore an invalid at-keyword together with everything following it, up to the end of the block that contains the invalid at-keyword, or up to and including the next semicolon (`;`), or up to and including the next block (`{…}`), whichever comes first.

We can illustrate all that by using an unknown at-keyword, `@comment`, as a custom at-rule alternative to the multi-line syntax. For example, the following at-rule is parsed to the closing brace, `}`, determined to be malformed, and then ignored:

```css
@comment { 
  I'm not processed in any way.
}
```

That looks harmless and readable at first, but due to the presence of the apostrophe in `I'm`, we've reintroduced the quoting character problem (i.e., you can't terminate the single quoting character on its own line). That means, a subsequent at-rule or selector will also be ignored if our custom `@comment`'s body is closed on its own line, because the rule's *declaration* is malformed by the presence of the apostrophe in `I'm`:

```css
@comment { 
  I'm not processed in any way. }

/* This whole block will not be processed either! */
body { background: blue; }
```

That can be rescued with outer quotes, either inside the braces,

```css
@comment { 
  "I'm not processed in any way."  }  /* Fixed. */

body { background: blue; }   /* This block will work. */
```

or by leaving off the braces and instead terminating the pseudo-comment with a semi-colon, either inline,

```css
@comment "I'm not processed in any way.";

body { background: blue; }   /* This works. */
```

or next-line:

```css
@comment 
"I'm not processed in any way.";

body { background: blue; }   /* This workss */
```

{{< jump-heading >}}Pre-processors{{< /jump-heading >}}

The various CSS pre-processors support similar multiline and single-line comments.

{{< jump-heading level="3">}}Sass{{< /jump-heading >}}

{{< rawhtml >}}
<blockquote>
<p>Sass supports standard multiline CSS comments with `/* */`, as well as single-line comments with `//`. The multiline comments are preserved in the CSS output where possible, while the single-line comments are removed.</p>
<cite>
&mdash; <a href="https://sass-lang.com/documentation/file.SASS_REFERENCE.html#comments">Sass-lang reference</a>.
</cite>
</blockquote>
{{< /rawhtml >}}

Compressed mode will normally strip out all comments, unless the comment is preceded by `/*!`.

However, you can use a single-character pseudo-comment, such as `#` and the output will contain the commented line.

```css
body {
   # background: red; 
}
```

{{< jump-heading level="3">}}Less{{< /jump-heading >}}

{{< rawhtml >}}
<blockquote>
<p>Both block-style and inline comments may be used.</p>
<cite>
&mdash; <a href="https://lesscss.org/#comments">Less.js CSS features overview</a>.
</cite>
</blockquote>
{{< /rawhtml >}}

It is not clear (to me, at least) whether Less will suppress these comments or print them to the output. From StackOverflow posts, it appears Less will aggregate line-comments at block level.

{{< jump-heading level="3">}}Stylus{{< /jump-heading >}}

Stylus also supports multiline `/* */` and single-line comments `//`, but suppresses these from the output if the `compress` directive is enabled. If you always want multiline comments to print to the output, use Multi-line buffered comments.

{{< rawhtml >}}
<blockquote>
<p>Multi-line comments which are not suppressed start with `/*!`. This tells Stylus to output the comment regardless of compression.</p>
<cite>
&mdash; <a href="https://stylus-lang.com/docs/comments.html">Stylus CSS documentation</a>.
</cite>
</blockquote>
{{< /rawhtml >}}

Hence,

```css
/*!
 * This will appear in the output.
 */
```

{{< jump-heading >}}Best practice{{< /jump-heading >}}

{{< rawhtml >}}
<blockquote>
<p>Readability counts.</p>
<cite>
&mdash; <a href="https://www.python.org/dev/peps/pep-0020/#id2">The Zen of Python</a>.
</cite>
</blockquote>
{{< /rawhtml >}}

Comments can make obscure code more readable, but readability depends on more than one convention. Pseudo-comments in CSS are less about readability than about playing against convention (aka, the parser). 

If you find you need to use pseudo-comments,

+ Stick to the C and Unix convention and use either `//` or `#` for the pseudo-comment delimiter.
+ Place pseudo-comments on the same line before the item to be ignored.
+ Use whitespace to separate the pseudo-comment delimiter from the intended rule, e.g., `# background: ignored;`.

{{< jump-heading level="3">}}When to use pseudo-comments{{< /jump-heading >}}

+ Use pseudo-comments for **debugging**, notably when using an interactive CSS edit panel, such as Chris Pederick's [Web Developer extension](https://chrispederick.com/work/web-developer/) (Chrome, Firefox, Opera).
+ Use pseudo-comments to prevent **individual** declarations, selectors, or at-rules with bodies from being processed.

{{< jump-heading level="3">}}When to avoid pseudo-comments{{< /jump-heading >}}

+ Avoid pseudo-comments for use with textual descriptions and at-rules without bodies (e.g., `@import`), and use multi-line `/* ... */` comments instead.
+ Avoid the quoting characters `''`, `""` as they are hard for human eyes to scan and cannot be terminated on their own line.
+ Avoid the grouping characters `()`, `[]`, `{}` as they introduce more complicated scanning (and cannot be terminated on their own line).
+ Avoid pseudo-comments in production code. Although not "harmful", they are merely extra bytes at that point.
