---
title: "Switching to Hugo - reasons, resources, and more"
date: 2020-05-22T11:55:43-07:00
lastmod: 2020-09-21T11:55:41-07:00
description: "Full story of why I switched from a Wordpress blog to a static site using Hugo, plus lists of resources I found helpful."
tags: 
- "Hugo"
---

[Previously](/posts/2019/11/11/first-post-why-hugo/), I wrote about my experience working with Gatsby and my ultimate decision to move to Hugo instead. What follows is a calmer version of the story, and a list of resources I have consulted while making the switch.

## Lists

I maintain a github repository which is nothing more than a list of [interesting links for web developers](https://github.com/dfkaye/dev-links). That one has been growing for over 5 years and I felt it was time to cut over to a an active list in a static site I could run a link checker on... *et cetera.*

## Demos

I also wanted to create a few working demos (CSS-only tabs, for example, or an aria-accessible modal with some JavaScript), and found that my *free* Wordpress instance (at https://dfkaye.wordpress.com) does not allow static JavaScript or inline JavaScript tags. A paid plan allows for that, but I wanted to see about alternatives.

## So what happened?

Due to the hype in 2019 and a recommendation from a colleague, I started migrating my blog to [Gatsby](https://www.gatsbyjs.org/). After generating the basic blog from a starter project (and hooking up Netlify with github), I was dismayed to find that importing specific JavaScript files into posts works in GatsbyJS only when you enter the page URL directly in the browser &mdash; without loading the whole blog first. When you load the blog and navigate by hyperlinks controlled by ReactJS routing, the external JavaScript files and inline JavaScript elements fail to load *because React scrubs them* - see more about that at https://github.com/gatsbyjs/gatsby/issues/833.

##  All of which tells us...

Gatsby is not a static site generator

Yes, Gatsby uses ReactJS on the server to create, not a static site, but a Single Page Application (SPA) using ReactJS *on the client.* Unless you are hosting a page that must handle multiple views of a single data source, SPAs have enormous accessibility and performance limitations, as witness Adam Silver's 2014 post, [The disadvantages of single page applications](https://adamsilver.io/articles/the-disadvantages-of-single-page-applications/).

## And so...

After further searching (and emailing [Chris Ferdinandi](https://twitter.com/cferdinandi) of the ["Go Make Things" blog](https://gomakethings.com/)), I decided on [Hugo](https://gohugo.io/), a static site generator written in the [go](https://golang.org/) programming language. Hugo supports HTML, CSS, JavaScript, markdown, and several others without a client-side framework getting in the way.

## Other articles on this topic

+ Gregory Schier (2016), **Why I Switched to Hugo** &#8594; https://schier.co/blog/2016/07/30/why-i-switched-to-hugo/
  - Greg changed his mind in December 2019, **Abandoning the Static Site** &#8594; https://schier.co/blog/abandoning-the-static-site
  > updating static sites is a pain. 🤕 Having to run a local server to preview content makes it difficult to publish updates quickly (especially from mobile devices) and even the slightest change requires re-deployment, resulting in wasted time.
+ Sara Soueidan (2017), **Migrating from Jekyll+Github Pages to Hugo+Netlify** &#8594; https://www.sarasoueidan.com/blog/jekyll-ghpages-to-hugo-netlify/
+ Benjamin Congdon (2018), **Switching from Jekyll to Hugo** &#8594; https://benjamincongdon.me/blog/2018/06/06/Switching-from-Jekyll-to-Hugo/
+ Chris Ferdinandi (2018), **Static Websites** &#8594; https://gomakethings.com/static-websites/
  > Things that are difficult in WordPress are so easy in Hugo
+ Christopher Kirk-Nielsen (2019), **Switching From WordPress To Hugo** &#8594; https://www.smashingmagazine.com/2019/05/switch-wordpress-hugo/
+ Kasun Vithanage (2019), **Moving to my own space** &#8594; https://kasvith.github.io/posts/moving-to-my-own-space/
+ Maëlle Salmon (2020), **What to know before switching to Hugo/blogdown** &#8594;  https://www.r-bloggers.com/what-to-know-before-you-adopt-hugo-blogdown/


## Big collection of resources

[Awesome Hugo](https://github.com/budparr/awesome-hugo) has a massive list of articles and resources for Hugo.

## Book recommendation

Brian Hogan (2020), [Build Websites with Hugo](https://bookshop.org/books/build-websites-with-hugo-fast-web-development-with-markdown/9781680507263) - via `bookshop.org`.

Highly recommend Brian's approach that introduces you to concepts as you need them rather than give you everything at once.

## Things I found helpful

I wanted to cover a lot of bases before beginning the whole migration. Here's a spread out list:

### Installing On Windows 10

+ Use chocolatey
  1. install chocolatey (run as admin)
    https://chocolatey.org/courses/installation/installing#cmd
  1. install hugo using chocolatey
    https://gohugo.io/getting-started/installing/#chocolatey-windows
  1. verify hugo with `hugo help`
  1. create/navigate to a directory that will serve as your hugo site
    (ex. C:\projects\MyBlog) and execute `hugo` from there to generate 
+ YouTube video (2017), **Install the Hugo binary** &#8594; https://www.youtube.com/watch?v=sB0HLHjgQ7E

### YouTube

Watch the whole Hugo Tutorial series on YouTube by [Mike Dane](https://twitter.com/mike_dane).
  + https://www.youtube.com/watch?v=qtIqKaDlqXo&list=PLLAZ4kZ9dFpOnyRlyS-liKL5ReHDcj4G3

This series of 23 videos - about 5&ndash;10 minutes each - covers the basics of installing Hugo, explaining content, themes, templates, shortcodes, etc.

### Starter projects

+ **HTML Skeleton** - Josh W Comeau (2020), **Starter HTML for every web page** &#8594; https://joshwcomeau.com/snippets/html/html-skeleton
+ *minimal* - Chris Ferdinandi's (2019) **Hugo Starter Project** &#8594; https://github.com/cferdinandi/hugo-starter#getting-started
  + Chris's blog post about it &#8594; https://gomakethings.com/the-hugo-starter-kit/
+ *comprehensive* - Ryan Watters' (2016) **Hugo Starter with Gulp Asset Pipeline, SVG Icons, partials for global components, metadata, and social** &#8594; https://github.com/rdwatters/hugo-starter
  - **bonus** &#8594; rdwatters repo includes a linkchecker written in @golang &#8594; https://github.com/rdwatters/hugo-starter/blob/master/linkcheck.go

### Documentation

Hugo documentation steps are everywhere.

+ When in doubt, start with the Hugo site &#8594; https://gohugo.io/
+ gohugohq.com is an older (2017) site with quick tips &#8594; https://gohugohq.com/

### Probably the best single post that covers almost everything

+ Zachary Wade Betz (2019), **Make a Hugo blog from scratch** &#8594; https://zwbetz.com/make-a-hugo-blog-from-scratch/

### Screen reader support

+ Ben Robertson (2018), **Designing Layouts for Screen Readers** &#8594; https://benrobertson.io/accessibility/designing-layouts-for-screen-readers
  - not Hugo-specific, but an early concern to keep in mind.

### Themes

Themes are not strictly necessary, but they are *shareable*. You do one of the following:

+ Go without a theme, meaning you will add things to the root-level folders
+ [Choose a theme to install in the themes folder](https://themes.gohugo.io/)
+ [Create your own theme](https://gohugobrasil.netlify.app/themes/creating/)

### Raw HTML

[Insert raw html into markdown with shortcode](https://anaulin.org/blog/hugo-raw-html-shortcode/).

### RSS feed

Hugo generates its own RSS XML, here's how to include it in the `<head>` tag &#8594; https://gohugo.io/templates/rss/#the-embedded-rss-xml
  
### Menus

Start with Menu templates on the Hugo site &#8594; https://gohugo.io/templates/menu-templates/

### Pagination

Different ways to tackle pagination links.

+ Hugo docs on pagination &#8594; https://gohugo.io/templates/pagination/
+ Glenn McComb (2018), **How to build custom Hugo pagination** &#8594; https://glennmccomb.com/articles/how-to-build-custom-hugo-pagination/)
+ James Kiefer (2018), **Customized Hugo Pagination** &#8594; https://jameskiefer.com/posts/hugo-pagination/
+ Justin Dunham (2016), **Implementing blog theme bells and whistles in Hugo: pagination, pages, related posts, and tag lists** &#8594; http://justindunham.net/blog-bells-and-whistles-in-hugo/

### Security headers on Netlify (excluding CSP)

+ https://dev.to/olegchursin/browser-security-headers-with-gatsby-and-netlify-4f5m

### Content Security Policy

Different ways to creates Content Security Policy (CSP) headers in Hugo.

First, check https://exploited.cz/xss/csp/strict.php for `script-src "strict-dynamic"` support in your browser.

Then

+ Roel Hogervorst (2019), **Setting up CSP on your hugo (and netlify) site** &#8594; https://blog.rmhogervorst.nl/blog/2019/03/13/setting-up-csp-on-your-hugo-site/
+ Troy Hunt (2015), **How to break your site with a content security policy: an illustrated example** &#8594; https://www.troyhunt.com/how-to-break-your-site-with-content/
  + `Report-uri` is a free (registration required) service for testing your CSP in production in report-only mode first &#8594; https://report-uri.com/
  + You can also test your site's CSP strength with https://securityheaders.com/ (sponsored by report-uri.com).
+ Jeremy Likness (2019), **Create a Content Security Policy (CSP) in Hugo** &#8594; https://blog.jeremylikness.com/blog/create-content-security-policy-csp-in-hugo/

### Comments

+ James Kiefer (2019), **Threaded comments for Hugo with Staticman v3** &#8594; https://jameskiefer.com/posts/threaded-comments-for-hugo-with-staticman-v3/

### SEO

+ James Kiefer (2018), **Huge, SEO, and minification** &#8594; https://jameskiefer.com/posts/hugo-seo-and-minification/

### Sitemap

Hugo documentation on the sitemap template &#8594; https://gohugo.io/templates/sitemap-template/

### URL management

Permalinks, aliases, canonical URLs &#8594; https://gohugo.io/content-management/urls/

### Handling Builds beyond the basic `hugo` commands

You can use `npm scripts` for building and deploying Hugo sites &#8594; https://www.aerobatic.com/blog/hugo-npm-buildtool-setup/

### Newsletters

+ **Use hugo archetypes to create a newsletter section** &#8594; https://gohugo.io/content-management/archetypes/#create-a-new-archetype-template

+ **Create a Newsletter with Mailchimp for free** (2013) &#8594; https://business.tutsplus.com/articles/how-to-create-an-email-newsletter-with-mailchimp-for-free--fsw-39066

### Social Sharing buttons

+ **`Add-This` social sharing icons in Hugo Sites** (2017) &#8594; https://gohugohq.com/partials/add-this-social-sharing/
+ Gregory Schier (2014), **Pure HTML Share Buttons** &#8594; https://schier.co/blog/2014/10/22/pure-html-share-buttons.html

### Syntax highlighting

> Hugo comes with really fast syntax highlighting from Chroma... &#8594; https://gohugo.io/content-management/syntax-highlighting/

+ Zachary Wade Betz (2019),**Syntax highlighting in Hugo with Chroma** &#8594; https://zwbetz.com/syntax-highlighting-in-hugo-with-chroma/
+ Maëlle Salmon (2020), **How to showcase CSS+JS+HTML snippets with Hugo?** &#8594; https://www.r-bloggers.com/how-to-showcase-cssjshtml-snippets-with-hugo/

### Search

See Chris Ferdinandi's site for, 
+ How roll your own site search &#8594; https://gomakethings.com/how-to-create-a-vanilla-js-search-page-for-a-static-website/
+ An implementation of search &#8594; https://gomakethings.com/search/?s=hello
+ A Hugo Search partial &#8594; https://github.com/cferdinandi/go-make-things/blob/master/themes/gmt/layouts/search/single.html,
+ The content markdown with a Search form &#8594; https://raw.githubusercontent.com/cferdinandi/go-make-things/master/content/search.md


## Visuals

### Mermaid diagrams

+ Peter LaValle (date not specified) [describes how to create a shortcode for `mermaid`](https://peterlavalle.github.io/post/gohugo-mermaid/).
+ See also John Wickerson (2019), **How to draw block diagrams** &#8594; https://johnwickerson.wordpress.com/2019/08/08/block-diagrams/.

### SVG icons

+ `simple-icons`, **Free SVG icons for popular brands** &#8594; https://simpleicons.org/


*More to come...*
