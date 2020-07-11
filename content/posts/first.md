---
title: "First"
date: 2019-11-11T12:44:58-08:00
description: "My first blog post in Hugo"
draft: false

# script: 'first.js'
---

### Why Hugo?

I wanted to do more than write or rant about something. I wanted to push working code demos and test suites.

However, my then-latest blog hosted on Wordpress (on the free plan) does not allow including JavaScript.

I tried Gatsby.JS in October of 2019, figuring that it would help me keep my React.JS skills somewhat fresh.

(I had also done a bit of work with Next.JS for a friend.)

### What happened?

#### Getting a static script to load into gatsby markdown files is hard

OK, This shouldn't be hard, but because "everything goes through React, it's a bit hard" - see https://github.com/gatsbyjs/gatsby/issues/833.

1. Create a `static` folder at the top of your Gatsby project (i.e., parallel to `src`, `package.json`, *et al*.)
2. Create a `static/scripts/hello` folder, and add a `hello.js` file that contains the following:

```js static
    console.log('DID IT WORK?');
```
3. In one of your markdown posts (assume you've created one at `src/content/posts/hello/index.md` - and survived the tutorials for creating blog posts from markdown, etc.), include the following script tag:
```
<script src="/scripts/hello/hello.js"></script>
```
4. Now run `gatsby build`, then `gatsby serve`, and visit `localhost:9000/hello` - you should the message in the console.
5. NOTE: Do not use `gatsby develop` to verify static content is imported &mdash; it won't be.

#### Does it work?

If you load the index page first, then use a `<Link>` to get to `/hello/`, the script will *not* be executed.

If you *then* refresh the /hello/ page with <kbd>Ctrl<kbd> + <kbd>R</kbd>, *then* the script will load.

### Why does this happen?

This problems arises in single page web applications that rely on custom routers.

The Passport.JS "strategies" page demonstrates this same flaw but in reverse.

Go to http://www.passportjs.org/ and select Strategies in the left side menu. That will load the packages page at http://www.passportjs.org/packages/.

Now, refresh that page. Unless they have fixed the issue as you are reading this, you will see only the message, "Not Found."

#### What does this all mean?

It means that Gatsby.JS is does not generate static sites, but single page web applications running on static sites.

#### Is there a fix?

This problem could be fixed with - yes, you guessed it - "dangerously setting inner HTML" somewhere or using `Function()` but that seems suboptimal in the age of Content Security Policy.

> Note to the React community: You are not making progress when you are BREAKING THE MOST BASIC WEB FUNCTIONS.

### I Just Wanted to Create a Blog with CSS and JavaScript Demos

So, I turned to Hugo, made a test site, then started on this site.

More on Hugo specific things in a future post.

### Thanks for reading.