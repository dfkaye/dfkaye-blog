---
title: "Using CSS files in React/JSX apps"
date: 2020-08-19T13:07:43-07:00
description: "Two approaches when you need CSS features that CSS-in-JS can't provide such as @media rules or CSS custom properties."
tags: 
  - "CSS"
  - "JSX"
draft: false
---

I tweeted about this in August 2019 at https://twitter.com/dfkaye/status/1159886173331812352.

<!--more-->

If you work with CSS-in-JS solutions and you need CSS features that CSS-in-JS can't provide &mdash; for example, `@media` rules and/or CSS custom properties (aka CSS variables) &mdash; here are 2 approaches to get them working in your React/JSX app.

## Credit

*Credit goes to https://stackoverflow.com/questions/27530462/react-jsx-style-tag-error-on-render#34200213 for these suggestions.*

## Inline `<style>` elements

1. Create a `css.js` file containing CSS defined and exported as a template literal:

        /* example: css/form.js */

        export const css = `
        [data-ys=form] {
          background-color: aqua;
        }
        `;

      
2. Import it:

        import { css } from '../../../css/form.js';


3. Use it in the `render()` method:

        return (
          <Fragment>

            <!-- Our style element. -->
            <style>{css}</style>

            <form onSubmit={this.handleSubmit} data-ys='form'>
            ...
          </Fragment>            
        );

Running your app, you should now see your form displayed with the background color "aqua".

Here's a screenshot from my app (August 2020):

{{< rawhtml >}}
<img screenshot width="100%" border="0" alt="Example of CSS in a React/JSX form" src="/img/css-in-react-jsx-example.png" />
{{< /rawhtml >}}

You could compose a single app css.js file from other css.js files, and export the css literal that way, too.

    import { layout } from '../../../css/layout.js';
    import { form } from '../../../css/form.js';
    import { button } from '../../../css/button.js';

    export const css = [layout, form, button].join('\n');

## Drawback

The drawback is that the inline style approach, especially the composed styles approach, is that it creates large string variables that have to be processed by the JavaScript thread,inside the application.

## Using `<link>` elements to CSS files

Instead of that, you can create a single CSS file to start with, move your rules there, then use a `<link>` element to include it in the application.

1. Create the CSS file and save it as a CSS file, somthing like "path/to/app.css".

2. Add a stylesheet `<link>` element pointing to the CSS file in the application's "index.js" file, assuming you normally mount an `<App>` component with ReactDOM:

        ReactDOM.render(
          <div>
            <!-- Our external CSS link. -->
            <link href="path/to/app.css" rel="stylesheet">

            <App />
          </div>,
          document.getElementById('root')
        )

## Conclusion

Either way, you'll have support for native browser features not available in CSS-in-JS solutions.

You can then use [Sass](https://sass-lang.com/) to manage your CSS files, if you wish, or process them with [PostCSS](https://postcss.org/), [cssnano](https://cssnano.co/), and similar tools.
