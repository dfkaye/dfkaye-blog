---
title: "Home"
date: 2020-06-12T14:10:43-07:00
description: "dfkaye blog home"
tags:
- "blog"
- "topics"

---

<!--
This is my Home page.

At content/_index.md, using layouts/index.html.
-->

You have found David Kaye's blog, focused almost entirely on front-end web development topics.

+ [More about me](/about/)
+ [Blog posts](/posts/)
+ [Demos](/demos/)

## Work in progress

What you see is a [Hugo](https://gohugo.io) blog under construction.

I have blogged previously with [wordpress](https://dfkaye.wordpress.com/) and on [github](http://dfkaye.github.io/) using [hexo](https://github.com/hexojs/hexo).

Some of that content will be posted here eventually, along with updated takes.

## To-do set-up

+ better code snippet styles (not one element per line but well-framed and readable)
  - *Surprise!* To support this on Netlify, see https://wilks.co/articles/custom-hugo-version-with-netlify/
+ set up RSS feed
+ sitemap.xml
+ categories and tags layout and keywords
+ resize datetime and reading-time
+ improve the doc-summary style on list pages
+ pagination in list pages (by year, by count (100), or...?)
+ use Hugo templating (--instead-of-css-vars) in the CSS
  - see https://zwbetz.com/use-hugo-templating-in-your-external-css/
+ mermaid diagrams

## To-do posts

+ "we threw out the rule book"
+ "custom attributes are fast, good, and cheap"
  - traffic signal states
  - factoring BEM out
+ post about "Making the Switch to Hugo"
+ post about Hugo resources
+ post about post prev next and CSS content ISO values
  - https://stackoverflow.com/questions/44186778/link-to-next-post
  - https://brajeshwar.github.io/entities/
+ post about Content Security Policy setup
  - scratch-variables partial
  - csp partial
  - css partial
  - js partial
+ post about the footer company icons
  - especially https://github.com/simple-icons/simple-icons
+ post about mobile white space breaks
  - word-break for long link text
  - white-space: break-spaces (and using spaces) inside of code elements
+ post about body {position:relative } to set the body width to 100% across mobile devices (galaxy fold, iPhone 5, etc.).
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
+ post about **error-first design**
  - the tweet, https://twitter.com/dfkaye/status/999332316492120064
+ copy content from the wordpress site
  - add "archives" for the wordpress and hexo posts
+ future awesome post about Function() (safe-eval) with strict CSP and web workers.
+ future awesome post about the SAM pattern
  - see the HEX article at https://medium.com/@metapgmr/hex-a-no-framework-approach-to-building-modern-web-apps-e43f74190b9c
  - see JJ's original article "No More MVC Frameworks" at https://www.infoq.com/articles/no-more-mvc-frameworks/

## To-do pages

+ add **R&eacute;sum&eacute;** page with @page and @print stylesheets
+ a **Tools I Use** page (see https://benjamincongdon.me/tools example)
+ list of engineering books I've read and/or recommend
+ list of engineering sites I might recommend
+ monthly list of dev-links - see https://github.com/dfkaye/dev-links/, with followup to https://twitter.com/dfkaye/status/1288155766092738561

## To-do demos

+ CSS tabs demo and post - done
+ calculator demo with TDD
+ date-input demo
+ S|p|r|e|a|d|S|h|e|e|t with workers demo and TDD
+ sudoku demo with TDD
+ *interactive* tests using web workers for the server part
  - example: souders site CSS test page (class vs. attribute selector speeds)
