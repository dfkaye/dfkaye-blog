---
title: "Switching to Hugo - steps, sequence, troubleshooting"
date: 2020-05-23T12:44:58-08:00
lastmod: 2020-09-21T12:20:41-07:00
description: "Sequence of steps I followed to get my Hugo site working locally, and to publish content to github and Netlify."
tags: 
- "Hugo"
---

<!--more-->

[Previously](/posts/2020/05/22/switching-to-hugo-reasons-resources-and-more/), I wrote about switching to Hugo and listed (far too many) links to resources that gave me inspiration and guidance.

This post covers the steps you can take to get Hugo running locally, pushing to github, connecting with Netlify, and so on. I procrastinated thinking this part would be tedious. It's not, but there's a sequence. Here's what I did.

## Use an installer

I use Windows 10 on a Dell laptop, so I use `chocolatey`. On a macOS I would use `homebrew`.

1. [Install chocolatey (run as admin)](https://chocolatey.org/courses/installation/installing#cmd)
1. [Install hugo using chocolatey](https://gohugo.io/getting-started/installing/#chocolatey-windows)
1. Verify on the command line that `hugo` is installed by typing `hugo version`.

## Create the project

1. Create/navigate to the directory that will serve as the parent for your hugo site. For example, if you plan to work from `C:\projects\hugo-blog`, go to `C:\projects`.
1. Execute `hugo new site hugo-blog` from there to generate the `hugo-blog` directory with the hugo static site scaffolding.

## Connect to github

Don't wait. Get this under git immediately.

Create the repository on [github](https://github.com).

Then navigate to your local blog directory and type `git init`.

## Connect the repo to your host provider

Do this next. Don't wait. I use [netlify](netlify.com).

Stick with the default URL they give you at first.

Buy a domain name when you're comfortable with the build cycle.

## Create a home page template

Create an HTML file at `layouts/index.html`. See [Zach Betz's post for a nice example](https://zwbetz.com/make-a-hugo-blog-from-scratch/#homepage-layout).

## Push a change to git master

1. Add all the files to git: `git add . `
1. Commit your changes: `git commit -m "first commit"`
1. Add your remote to your local repo: `git remote add origin https://github.com/dfkaye/dfkaye-blog.git`
1. Push your changes up: `git push -u origin master`
1. Verify the push made it to the repo on github.com. 
1. Verify the build on the host provider.

## If the build fails on the host provider...

*That's good news.* The host is running the build command (`hugo`) and finding problems. Now you can trouble-shoot.

In my case, the `content` path was not resolved because we didn't add anything to the `content` folder yet.

## Add a something to `/content`

Create a markdown file like `first.md` with content like so:

```
title: "First"
date: 2019-11-11T12:44:58-08:00
description: 'first page'
# script: 'first.js'
---

# first

first blog post in hugo with javascript files eventually.

```

Then `git add .`, `git commit -m "add content for netlify build to work", `git push -u origin master`.

Visit the host deployment panel to verify the build, which should resolve this time.

## Add a stylesheet

Create a `static/css` folder.

Then create a `main.css` file with `p { color: aqua; }` or something equally unmistakable and put it in the `static` folder. 

Add this to layouts/index.html:

		{{ $css := "css/main.css" | absURL }}
		<link rel="stylesheet" href="{{ $css }}">
    
Localhost should reload with an aqua paragraph for "Home".

## If Hugo throws an error about resolving the content path...

Stop and restart the hugo server.

Creating the folder with the hugo server is running can throw it out of sync with the file system.

## Add a JavaScript file

Create a `static/js` folder.

Then create a `hello.js` file with `console.log("hello");` and put it in the `static/js` folder.

Add this to layouts/index.html:

		{{ $js := "js/hello.js" | absURL }}
		<script src="{{ $js }}"></script>
    
Open the console and verify that "hello" appears.

## Viewing Hugo localhost on your mobile device

Find your system's IP address, then use the `bind` and `baseURL` flags with `hugo server`.

Example:  `$ hugo server --bind=123.456.0.789 --baseURL=http://123.456.0.789:1313`

Open `http://123.456.0.789:1313` on your device.

## From here...

Now that you have verified the publish process works and you can test local changes on multiple devices, you can delete things and get started for real.

Follow the steps in [Zach Betz's post, "Make a Hugo blog from scratch"](https://zwbetz.com/make-a-hugo-blog-from-scratch/). Zach has several [other posts on doing things in hugo](https://zwbetz.com/tags/hugo/).

If you'd rather follow a book, I recommend Brian Hogan's, [Build Websites with Hugo](https://bookshop.org/books/build-websites-with-hugo-fast-web-development-with-markdown/9781680507263), obtainable from `bookshop.org`.

## Some blog layouts worth considering

+ Greg Schier's blog - https://schier.co/blog/
+ Garrick Aden-Buie's blog - https://www.garrickadenbuie.com/
+ Chris Ferdinandi's daily tips - https://gomakethings.com/articles/
+ Zachary Wade Betz's blog - https://zwbetz.com/blog/
+ Isaac Levin's blog - https://www.isaaclevin.com/
+ Simon Hearne's blog - https://simonhearne.com/
+ Gergely Orosz's blog (links page 2) - https://blog.pragmaticengineer.com/page/2/

## Troubleshooting Hugo 

+ Alison Hill (2019), **A Spoonful of Hugo: Troubleshooting Your Build** &#8594; https://alison.rbind.io/post/2019-03-04-hugo-troubleshooting/

## And finally

Visit Chris Ferdinandi's [hugo starter kit](https://gomakethings.com/the-hugo-starter-kit/) for other ideas.

[Visit my github repo (if you want to)](https://github.com/dfkaye/dfkaye-blog/).
