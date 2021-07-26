---
title: "Using Hugo for TDD With Javascript"
date: 2020-12-10T12:23:42-08:00
lastmod: 2020-12-10T12:37:42-08:00
description: "How I use Hugo server for test-driving JavaScript development, with hugo server, github, npm, and unpkg."
tags:
- "JavaScript"
- "Testing"
- "TDD"
- "Hugo"
- "Node.js"
- "Unpkg.com"
- "Github.com"
- "NPM"
---

As a fan of test-driven development (TDD), I have been delighted to discover a way to do it directly in web pages served by [Hugo](https://gohugo.io/), while running `hugo server` locally. It's the main reason [why I switched to Hugo](/posts/2019/11/11/first-post-why-hugo/).

Because Hugo rebuilds and reloads things so quickly, it took me minutes to build the initial proof of concept [using mocha, chai, and fast-check](/demos/mocha+chai+fast-check/). The reloading experience has been very much like running a test page with [live-server](https://github.com/tapio/live-server).

With Hugo, I can even [view test suites running locally](/posts/2020/05/23/switching-to-hugo-steps-sequence-troubleshooting/#viewing-hugo-localhost-on-your-mobile-device).

## Links to things we'll depend on

- [Mocha.js](https://mochajs.org), an easy to use JavaScript test runner.
- [Chai.js](https://www.chaijs.com), an assertion library used with Mocha.
- [Node.js](https://nodejs.org), a server-side JavaScript environment.
- [Github.com](https://github.com), site for hosting projects built on `git`, a distributed version control system. 
- [NPM](https://www.npmjs.com), a Node.js package management system.
- [Unpkg.com](https://unpkg.com), a distribution network service for downloading npm packages.

<!--more-->

## Overview of steps

Create a page that will include script tags for mocha, chai, et al.

Use Mocha, Chai, module-type scripts, and ES import/export syntax. Using `<script type="module">` even for remote scripts from another domain *works right now.* This makes it a snap to create an ES module locally.

Once we're "done", we create a github repo and add the library and test suite to it, refactor the test approach as necessary (node vs browser) using `await import(`) syntax, then publish to npm.

For ES modules on node.js,
- create a browser suite that will be requested from unpkg. This is the suite created in Hugo.
- create a separate node suite that imports Chai and assigns it to the global scope, then imports the browser suite.

Now we refactor the blog test page to import the browser test from `unpkg.com/username/package-name@version/browser-suite.js`. We need the `@version` part to pull the desired npm version; otherwise, you'll get a cached ES module in your browser.

## First pass - script loading

I use a `/demos` directory for my test suites, so I use `hugo new demos/my-lib-test-suite.md` which cretes the new demo post from the demos [archetype](https://gohugo.io/content-management/archetypes/). Then I use the [front matter](https://gohugo.io/content-management/front-matter#readout) in that file to declare which scripts to import into the page. Each script is picked up by a JavaScript [partial](https://gohugo.io/templates/partials/#readout) that adds a script element of `type="module"`. For dependencies such as mocha and chai, I specify the unpkg.com URL.

```
scripts: 
- https://unpkg.com/mocha/mocha.js
- https://unpkg.com/chai/chai.js
...
```

Then I create the script to be tested as `/js/lib/my-lib.js` with a simple function.

```js
export function method(value) {
  return value
}
```

Then I create the suite that will test the script, such as `/js/demos/my-lib/suite.js`. That suite imports the script to be tested.

```js
import { method } from "/js/lib/my-lib.js";

describe("my-lib", function () {
  var expect = chai.expect;

  describe("method", function () {
    it("returns input value", () => {
      var actual = method(1);

      expect(actual).to.equal(1);
    });
  });

  // suite body
})
```

Note that inside the suite, the `chai` namespace is loaded as a global - we'll need to handle that when the time comes to move things to github.

Now we specify the suite in the front matter, including the before and after scripts for setting up mocha then running it once the suite is loaded.

```
scripts: 
...
- /js/demos/mocha-setup.js
- /js/demos/my-lib/suite.js
- /js/demos/mocha-run.js
```

Here is mocha-setup.

```js
mocha.setup("bdd");
```

And here is mocha-run.

```js
mocha.checkLeaks();
mocha.run();
```

That seems like boilerplate with all those snippets in separate scripts, but I've found that strict ordering of scripts matters with Mocha and I'll leave it at that.

## Second pass - CSS loading

Once the suite runs in the browser I'll add the CSS files to the front-matter. Mocha comes with its own CSS so I can load that from unpkg.com. However, there are some styles that I needed to overwrite in order for things to lay out properly within the blog, so I've created an override.css for that purpose.

```
styles: 
- https://unpkg.com/mocha/mocha.css
- /css/demos/mocha-css-override.css
```

A CSS partial picks those up and creates `link` elements for each. 

## Moving to github

Eventually as the suite and script are built out and ambition grows, we'll want to publish them to github and npm so we can verify they are available from unpkg.com.

For that I'll create the repo on github.com with bare bones .gitignore, License, and ReadMe files, then `git clone` it to my local github directory.

Next, it's time to create a Node.js or npm package using `npm init` in that directory, which creates the package.json file. These days I've started using namespaced package names, prefixed with my npm username, `@dfkaye`. Once that's done, I add `"publishConfig"` so I can push changes to my namespace. Then I add a `"type": "module"` entry in the package.json file to tell Node.js that we are working with an ES module using `import/export` syntax. Finally, I'll set the version to `0.0.1`.

```js
{
  "name": "@dfkaye/my-lib",
  "type": "module",
  "publishConfig": {
    "access": "public"
  },
  "version": "0.0.1",
  ...
}
```

Next, declare the dev dependencies for mocha and chai.

```js
  ...
  "devDependencies": {
    "chai": "^4.2.0",
    "mocha": "^8.1.3"
  }
  ...
```

Now I can run `npm install --save-dev` to install them locally.

Finally, add the scripts test command pointing to the `mocha` command in the `/node_modules` directory where our dependencies live.

```js
  ...
  "scripts": {
    "test": "node node_modules/mocha/bin/mocha test/node-suite.js"
  },
  ...
```

## The `/test` directory

At this point I create the `/test` directory in the github repo, containing two files, `node-suite.js` and `browser-suite.js`.

The ultimate goal is to run the node suite from the command line using `npm test`, and enable the browser suite to run on my Hugo site (eventually).

The browser-suite is a copy-paste of the blog's `/js/demos/my-suite.js` file.

The node suite is 3 lines. The `chai` library is appended to the global scope as the browser suite expects it to be globally loaded (along with mocha). Because I have to do that before loading the browser suite, I use the `await import()` syntax to load the browser suite dynamically (or lazily, so I don't have to declare it at the top).

```js
import chai from "chai"

global.chai = chai;

await import("./browser-suite.js")
```

At this point I can run `npm test` to verify that everything is imported and executed correctly, or spend time fixing them if there are issues.

## Publish changes to github and npm

I'll push the working changes up to github to verify that process works.

Once it does, I'll run `npm publish` to push the package up to npm, as version 0.0.1.

## Update Hugo to find my-lib browser suite on unpkg.com

Now is the time to update the front matter in the Hugo suite to point to my-lib hosted on unpkg.com. I'll replace the `/js/demos/my-lib/suite.js` entry to point to the browser suite. 

```
scripts: 
...
- /js/demos/mocha-setup.js
- https://unpkg.com/@dfkaye/my-lib@0.0.1/test/browser-suite.js
- /js/demos/mocha-run.js
```

Now I can reload the Hugo page locally (assuming we have hugo server running), and verify that the suite is loaded from unpkg.com.

Once I'm happy, I'll push the Hugo blog changes to github which kicks off the Netlify build. Eventually (usually one minute) I can open the Hugo blog on Netlify and navigate to the demos and (hopefully) see the new demo suite working with all the unpkg.com content.

## Tips

Best to keep things local to Hugo for as long as possible. Only after building the complete library and test suite as completely as I can do I create the github repo and npm packages.

Once you have to make changes, adding or deleting things, etc., you have to bump the package.json version number before you publish to npm. You also have to update the Hugo script URL to the new version. Otherwise you'll get cached versions of JavaScript in the browser.
