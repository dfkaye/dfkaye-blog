---
title: "First post: Why Hugo?"
date: 2019-11-11T12:44:58-08:00
description: "My first blog post on Hugo, and why I chose Hugo"
draft: false
---

## Why Hugo?

The selling point of Hugo is its speed, and support for Markdown, plus the [Go programming language](https://golang.io) itself.  I have found it very easy to work with and customize.

{{< rawhtml >}}
<svg icon-defs aria-hidden="true">
  <!-- define icon logo paths -->
  <defs>
    <!-- paths borrowed from https://github.com/simple-icons/simple-icons -->
    <path id="icon-hugo" d="M11.754 0a3.998 3.998 0 00-2.049.596L3.33 4.532a4.252 4.252 0 00-2.017 3.615v8.03c0 1.473.79 2.838 2.067 3.574l6.486 3.733a3.88 3.88 0 003.835.018l7.043-3.966a3.817 3.817 0 001.943-3.323V7.752a3.57 3.57 0 00-1.774-3.084L13.817.541a3.998 3.998 0 00-2.063-.54zm.022 1.674c.413-.006.828.1 1.2.315l7.095 4.127c.584.34.941.96.94 1.635v8.462c0 .774-.414 1.484-1.089 1.864l-7.042 3.966a2.199 2.199 0 01-2.179-.01l-6.485-3.734a2.447 2.447 0 01-1.228-2.123v-8.03c0-.893.461-1.72 1.221-2.19l6.376-3.935a2.323 2.323 0 011.19-.347zm-4.7 3.844V18.37h2.69v-5.62h4.46v5.62h2.696V5.518h-2.696v4.681h-4.46V5.518Z"/>
  </defs>
</svg>
<a icon="hugo" href="https://gohugo.io/" title="Hugo link">
  Learn more about Hugo.
  <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <title>Hugo icon</title>
    <use xlink:href="#icon-hugo"></use>
  </svg>
</a>
{{< /rawhtml >}}

Hugo was not my first choice. Here's the back story that led me to it.

## I wanted to do more than write or rant about something

I really wanted to create a blog with working CSS and JavaScript demos and test suites.

However, my then-latest blog hosted on Wordpress at https://dfkaye.wordpress.com does not allow including JavaScript on the free plan.

I tried [Gatsby.JS](https://www.gatsbyjs.org/) in October of 2019, figuring that it would help me keep my [React.JS](https://reactjs.org/) skills somewhat fresh.

(I had also done a bit of work on [Next.JS](https://nextjs.org/) for a friend.)

## What happened?

It turns out that...

> Getting a static script to load into gatsby markdown files is hard.

## This shouldn't be hard

OK, but because "everything goes through React, it's a bit hard" - see [issue 883 on github](https://github.com/gatsbyjs/gatsby/issues/833).

1. Create a `static` folder at the top of your Gatsby project (i.e., parallel to `src`, `package.json`, *et al*.)
2. Create a `static/scripts/hello` folder, and add a `hello.js` file that contains the following:
```
console.log('Does it work?');
```
3. In one of your markdown posts (assume you've created one at `src/content/posts/hello/index.md` - and survived the tutorials for creating blog posts from markdown, etc.), include the following script tag:
```
<script src="/scripts/hello/hello.js"></script>
```
4. Now run `gatsby build`, then `gatsby serve`, and visit `localhost:9000/hello` - you should the message in the console.
5. NOTE: Do not use `gatsby develop` to verify static content is imported &mdash; it won't be.

## Does it work?

If you load the index page first, then use a `<Link>` to get to `/hello/`, the script will *not* be executed.

If you *then* refresh the `/hello/` page with {{< rawhtml >}}<kbd aria-label="the Control key">Ctrl</kbd> + <kbd aria-label="the R key">R</kbd>{{< /rawhtml >}}, *then* the script will load.

## Why does this happen?

This problems arises in single page web applications that rely on custom routers.

The Passport.JS "strategies" page demonstrates this same flaw but in reverse.

Go to http://www.passportjs.org/ and select Strategies in the left side menu. That will load the packages page at http://www.passportjs.org/packages/.

Now, refresh that page. Unless they have fixed the issue as you are reading this, you will see only the message, "Not Found."

## What does this all mean?

It means that Gatsby.JS is does not generate static sites, but single page web applications running on static sites.

> *We are not making progress when we break the most basic functions of the web.*

## Is there a fix?

This problem could be fixed with - yes, you guessed it - `dangerouslySetInnerHTML` somewhere or even using `Function()`.

Each of those is suboptimal in the age of [Content Security Policy](https://content-security-policy.com/).

## I Just Wanted to Create a Blog with CSS and JavaScript Demos

So, I turned to Hugo, made a test site, then started on this site.

More about Hugo-specific things to come in future posts.
