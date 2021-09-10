---
title: "Home page"
date: 2020-06-12T14:10:43-07:00
lastmod: 2020-09-08T16:17:43-07:00
description: "You have found the blog home of David Kaye."
tags:
- "dfkaye"

---

<!--
This is my Home page.

At content/_index.md, using layouts/index.html.
-->

{{< latest type="post">}}

{{< latest type="demo">}}

## What's here

I focus almost entirely on front-end web development topics on this blog which I have built with [Hugo](https://gohugo.io).

I have blogged previously with [wordpress](https://dfkaye.wordpress.com/) and on [github](http://dfkaye.github.io/) using [hexo](https://github.com/hexojs/hexo).

Some of that content will be posted here eventually, along with updated takes.

+ [More about me](/about/)
+ [Blog posts](/posts/)
+ [Demos](/demos/)

## RSS

Site now has two content feeds, listing up to seven of the latest seven items:

- posts at [/posts/index.xml](/posts/index.xml)
- demos at [/demos/index.xml](/demos/index.xml).

The default feed lists everything but only with descriptions, at [/index.xml](/index.xml).

## To do: A lot

This site is still a work in progress as you can tell from the rest of the headings.

## To do: Setup

+ ~~better code snippet styles (not one element per line but well-framed and readable)~~ - *done*
  - *Surprise!* To support this on Netlify, see https://wilks.co/articles/custom-hugo-version-with-netlify/
+ ~~set up RSS feed~~ -- *done*
+ ~~sitemap.xml~~ -- *done*
+ ~~categories and tags layout and keywords~~ -- *done* for tags and keywords
+ ~~resize datetime and reading-time~~ -- *done*
+ ~~improve the doc-summary style on list pages~~ -- *done*
+ ~~pagination in list pages (by year, by count (100), or...?)~~ -- *done*
+ ~~use Hugo templating (--instead-of-css-vars) in the CSS~~ - *done*
  - see https://zwbetz.com/use-hugo-templating-in-your-external-css/
  - *All lies. Every post on how to do this is wrong.*
  - *Do not put your theme into config.toml, put it all in a css template in assets/css as hugo variables, and minify the result.*
+ mermaid diagrams
+ replace the custom attributes with data-prefixed attributes.

## To do: Posts

+ ~~"we threw out the rule book"~~ -- *done*
+ ~~"custom attributes are fast, good, and cheap"~~ - *done*
  - ~~traffic signal states~~
  - ~~factoring BEM out~~
+ ~~post about "Making the Switch to Hugo"~~ -- *done*
+ ~~post about Hugo resources~~ -- *done*
+ post about post prev next and CSS content ISO values
  - https://stackoverflow.com/questions/44186778/link-to-next-post
  - https://brajeshwar.github.io/entities/
+ post about `Content Security Policy` setup
  - scratch-variables partial
  - csp partial
  - css partial
  - js partial
  - rss partial
+ post about the footer company icons
  - especially https://github.com/simple-icons/simple-icons
+ post about mobile white space breaks
  - `word-break` for long link text
  - `white-space: break-spaces` (and using spaces) inside of code elements
  - Mocha.css pre overrides: `white-space: pre-line;`
+ post about `body {position:relative }` to set the body width to 100% across mobile devices (galaxy fold, iPhone 5, etc.).
+ post about dot file all the things png
+ post about minimalism
  - sans serif font is the only font, and all others are "art" or belong in `@print` styles
  - use built-in components
    - avoid shared components, web components, framework components
  - avoid color, date, and other sketchy HTML5 inputs
    - accessibility issues
  - avoid extending anything
  - avoid npm (left-pad, is-promise, core-js)
  - package-lock makes everything worse
+ post about **form states are sudoku states are UI states**
+ post about **error-first design**
  - the tweet, https://twitter.com/dfkaye/status/999332316492120064
+ copy content from the wordpress site
  - add "archives" for the wordpress and hexo posts
+ future awesome post about `Function() (safe-eval)` with strict CSP and web workers.
+ future awesome post about the [SAM pattern](https://sam.js.org)
  - see the HEX article at https://medium.com/@metapgmr/hex-a-no-framework-approach-to-building-modern-web-apps-e43f74190b9c
  - see JJ's original article "No More MVC Frameworks" at https://www.infoq.com/articles/no-more-mvc-frameworks/
+ escaping hugo shortcodes, https://liatas.com/posts/escaping-hugo-shortcodes/
+ post on [Behavioral programming](https://lmatteis.github.io/react-behavioral/)


## To do: Pages

+ add **R&eacute;sum&eacute;** page with @page and @print stylesheets
+ a **Tools I Use** page (see https://benjamincongdon.me/tools example)
+ list of engineering books I've read and/or recommend
+ list of engineering sites I might recommend
+ monthly list of dev-links - see https://github.com/dfkaye/dev-links/, with followup to https://twitter.com/dfkaye/status/1288155766092738561

## To do: demos

+ ~~CSS tabs demo and post~~ - *done*
+ resize attribute polyfill (textarea, div, overflow: hidden)
  - https://developer.mozilla.org/en-US/docs/Web/CSS/resize
  - textarea gist - https://gist.github.com/dfkaye/bdaa6bb621154a1366de85c139bf7b23
+ ~~Calculator demo with TDD~~ - *done*
+ Accessible date-input demo
+ SpreadSheet, with web workers, SAM pattern, local storage or indexeddb: demo and TDD
+ Sudoku demo with TDD
+ *interactive* tests using web workers for the server part
  - example: souders site CSS test page (class vs. attribute selector speeds)
+ Accessible Table Row Expansions
+ ~~the most boring To-do list~~ -- *done*
+ traffic light CSS states demo
  + using custom attributes (vevo interview) at https://codepen.io/dfkaye/pen/eYJzQbX
  + using :target pseudo class and conditionally displayed links inside button at https://codepen.io/dfkaye/pen/KKzEbdY
+ ~~refactor [where.js](https://github.com/dfkaye/where.js) to handle ES6 imports and arrow functions~~ - *done*
  + ~~should deprecate and start a new one as `wheredoc` (because heredoc...)~~ - *done*
  + using chai-http: https://pjcalvo.github.io/testing,/mocha,/javascript/2019/12/09/webdriverio-and-ddt.html
  + jest already has `it.each` and `describe.each`: https://dev.to/flyingdot/data-driven-unit-tests-with-jest-26bh
  + original inspiration, spock expect+where tables: http://spockframework.org/spock/docs/1.0/data_driven_testing.html


## To do: Screenreader support for MathML

I've used Narrator on Windows 10, and have been trying out [JAWS](https://support.freedomscientific.com/Downloads/JAWS) instead for better browser-based support. So far I have not been successful reading the following MathML fragments as math with either screen reader.

{{< rawhtml >}} 
<math xmlns="http://www.w3.org/1998/Math/MathML">
    <apply>
        <plus/>
        <apply>
            <times/>
            <ci>a</ci>
            <apply>
                <power/>
                <ci>x</ci>
                <cn>2</cn>
            </apply>
        </apply>
        <apply>
            <times/>
            <ci>b</ci>
            <ci>x</ci>
        </apply>
        <ci>c</ci>
    </apply>
</math>
{{< /rawhtml >}} 

{{< rawhtml >}} 
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <msup>
    <mi>a</mi>
    <mn>2</mn>
  </msup>
</math>
{{< /rawhtml >}}
