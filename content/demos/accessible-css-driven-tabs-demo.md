---
title: "Demo: Accessible CSS-driven Tabs"
date: 2020-08-23T15:30:43-07:00
lastmod: 2020-09-08T10:52:41-07:00
description: "Working demo of tabbed content using CSS, no JavaScript, responsive to screen widths, and accessible to
keyboard navigation and screen
readers."
tags:
- "CSS"
- "Accessibility"
- "Responsive UI"

styles:
- /css/lib/accessible-tabs.css

---

## Navigating the tabs and panels

{{< rawhtml >}}
<ul aria-hidden="true">
  <li>Focus on a tab by clicking with the mouse or using the <kbd>Tab</kbd> key to navigate to the tab list.</li>
  <li>You can navigate among the tabs by pressing the <kbd>ArrowDown</kbd> and <kbd>ArrowUp</kbd> keys.</li>
  <li>To focus on content of the selected tab, press the <kbd>Tab</kbd> key.</li>
  <li>To return focus from the content to the tab group, press <kbd>Shift</kbd> + <kbd>Tab</kbd>.</li>
</ul>

<ul visually-hidden>
  <li><em>Screen readers:</em> Only tested with Windows Narrator.</li>
  <li>Navigate tabs by the <kbd>ArrowDown</kbd> and<kbd>ArrowUp</kbd> keys.
    <del>each requires 2 presses to hop from radio to radio.</del></li>
  <li>{{<rawhtml>}}<em><time datetime="2020-08-22">August 22, 2020, 4 PM PDT</time></em>{{</rawhtml>}}: Arrow navigation between tabs is fixed by setting labels as
    aria-hidden, and aria-labelledby on each radio instead.</li>
  <li>To select a tab, press <kbd>Enter</kbd> or <kbd>Space</kbd>.</li>
  <li>To focus on content of a <strong>selected</strong> tab, press the <kbd>Tab</kbd> key once.</li>
  <li><em>Firefox only:</em> To focus on content of a <strong>newly selected</strong> tab, <em>double press the
      <kbd>Tab</kbd> key</em>.</li>
  <li>You can also navigate through the tabs with the <kbd>ArrowDown</kbd> key to get to the currently opened
    tab-panel content.</li>
  <li>To return focus from the content to the tab group, press <kbd>Shift</kbd> + <kbd>Tab</kbd>.</li>
</ul>

<div demo="tabs" role="tablist" aria-labelledby="tabs-demo-heading">
  <h2 id="tabs-demo-heading" tabs-demo-heading>Demo</h2>

  <input name="tabs" type="radio" id="tab-1" aria-labelledby="tab-label-1" aria-roledescription="tab" checked>
  <label role="tab" for="tab-1" id="tab-label-1" aria-hidden="true">Tab 1</label>

  <input name="tabs" type="radio" id="tab-2" aria-labelledby="tab-label-2" aria-roledescription="tab">
  <label role="tab" for="tab-2" id="tab-label-2" aria-hidden="true">Tab 2</label>

  <input name="tabs" type="radio" id="tab-3" aria-labelledby="tab-label-3" aria-roledescription="tab">
  <label role="tab" for="tab-3" id="tab-label-3" aria-hidden="true">Tab 3</label>

  <input name="tabs" type="radio" id="tab-4" aria-labelledby="tab-label-4" aria-roledescription="tab">
  <label role="tab" for="tab-4" id="tab-label-4" aria-hidden="true">Tab 4</label>

  <input name="tabs" type="radio" id="tab-5" aria-labelledby="tab-label-5" aria-roledescription="tab">
  <label role="tab" for="tab-5" id="tab-label-5" aria-hidden="true">Tab 5</label>

  <input name="tabs" type="radio" id="tab-6" aria-labelledby="tab-label-6" aria-roledescription="tab">
  <label role="tab" for="tab-6" id="tab-label-6" aria-hidden="true">Tab 6</label>

  <div role="tabpanel" aria-labelledby="tab-label-1">
    <h3 tabindex="0">Tab panel 1</h3>
    <p>Very little content.</p>
  </div>

  <div role="tabpanel" aria-labelledby="tab-label-2">
    <h3 tabindex="0">Tab panel 2</h3>

    <h4>A list of items.</h4>
    <ul>
      <li>first</li>
      <li>second</li>
      <li>third</li>
    </ul>
  </div>

  <div role="tabpanel" aria-labelledby="tab-label-3">
    <h3 tabindex="0">Tab panel 3</h3>

    <!-- from https://lipsum.com/ -->
    <h4>Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h4>

    <blockquote lang="la">
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
      aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
      enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui
      ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
      adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
      voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
      aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
      molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
    </blockquote>
  </div>

  <div role="tabpanel" aria-labelledby="tab-label-4">
    <h3 tabindex="0">Tab panel 4</h3>
    <h4>A code sample</h4>
    <pre><code>// 16 October 2019
// Modified version from tweet by @etoxin
// "I like to call this unloading a website."
// https://twitter.com/etoxin/status/1179644600522162176

Array.from(
  document.querySelectorAll('*')
)
.reverse()
.forEach(async (n, t) => {
  await setTimeout(() => {
    n.remove();
  }, t * 10);
});</code>
  </pre>
  </div>

  <div role="tabpanel" aria-labelledby="tab-label-5">
    <h3 tabindex="0">Tab panel 5</h3>
    <label for="text-area">A text area</label>
    <br>
    <textarea id="text-area"></textarea>
  </div>

  <div role="tabpanel" aria-labelledby="tab-label-6">
    <h3 tabindex="0">Tab panel 6</h3>
    <table>
      <caption>An unstyled table, with a caption</caption>
      <thead>
        <th scope="col">Name</th>
        <th scope="col">Rank</th>
        <th scope="col">Serial number</th>
      </thead>
      <tfoot>
        <tr>
          <td>&copy; 2020</td>
        </tr>
      </tfoot>
      <tbody>
        <tr>
          <td scope="row">Kim Jorgenson</td>
          <td>Manager</td>
          <td>[redacted]</td>
        </tr>
        <tr>
          <td scope="row">david kaye</td>
          <td>lowercase lieutenant</td>
          <td>8925604623920945230</td>
        </tr>        
      </tbody>            
    </table>
  </div>      
</div>
{{< /rawhtml >}}

## Details

You can read the accompanying blog post explaining the solution at [{{< baseurl >}}/posts/2020/08/23/accessible-css-driven-tabs-without-javascript/]({{< baseurl >}}/posts/2020/08/23/accessible-css-driven-tabs-without-javascript/).

## CSS

```css
/* Container holding all contents. */
[role="tablist"] {
  /* 1 Sept 2020: ADDED flex to remove media query */
  display: flex;
  flex-wrap: wrap;    
}

[tabs-demo-heading] {
  /* 1 Sept 2020: Added due to flexbox solution; need 100% width. */
  flex-basis: 100%;    
}

[name="tabs"] {
  /* Do not hide the radio elements, make them invisible. */
  opacity: 0;
  position: absolute;    
}

/* The main tab headings */
[role="tab"] {
  background: white;

  /* base border style here; set color in :checked, style in :focus */
  border-color: transparent;
  border-style: solid;
  border-width: 1px 1px 0;

  box-shadow: inset 0 -0.5em 0.5em rgba(0, 0, 0, 0.02);
  color: lightgrey;
  cursor: pointer;
  display: inline-block;
  font-weight: 600;

  /* hides the bottom border */
  margin-bottom: -1px;

  /* 1 Sept 2020: removed to let flex apply gaps. */
  /* margin-right: 5px; */

  padding: 10px 20px;
  text-align: center;
  transition: all 0.2s ease;

  /* 1 Sept 2020: ADDED flex attributes to remove media query */
  flex-basis: 5em;
  flex-shrink: 1;
  flex-grow: 1;
}

/* Style the currently selected tab label */
[name="tabs"]:checked + [role="tab"] {
  /* ADDED */
  border-color: #eee;

  box-shadow: 0 -6px 8px rgba(0, 0, 0, 0.02);
  color: #268bd2;

  /* 1 Sept 2020: ADDED here with flexbox solution, removing the media query. */
  margin-bottom: 0;
}

/*
  ADDED: give tab a focus style.
  This selector has the same specificity as the :checked selector, so it
  should appear later in the source order to insure it takes effect.
  */
[name="tabs"]:focus + [role="tab"],
[name="tabs"]:hover + [role="tab"] {
  text-decoration: underline;
}

[name="tabs"]:focus + [role="tab"] {
  border-color: #268bd2;
  border-style: dotted;
}

/* The inner tab content */
[role="tabpanel"] {
  background: white;

  /* pulled up from the :checked state sibling ruleset below */
  border: 1px solid #eee;

  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.02);

  /* ADDED: Hide panels by default */
  display: none;

  padding: 20px;
  transition: all 0.2s ease;

  /* 1 Sept 2020: ADDED flex attr to stretch panel 100% width. */
  flex-basis: 100%;
}

/*
  Verbose state-machine-like part:
  - z-index, position, and overflow no longer needed,
  - allows document content to flow in source order.
*/

/* Show the currently selected tab content */
[name="tabs"]:nth-of-type(1):checked ~ [role="tabpanel"]:nth-of-type(1),
[name="tabs"]:nth-of-type(2):checked ~ [role="tabpanel"]:nth-of-type(2),
[name="tabs"]:nth-of-type(3):checked ~ [role="tabpanel"]:nth-of-type(3),
[name="tabs"]:nth-of-type(4):checked ~ [role="tabpanel"]:nth-of-type(4),
[name="tabs"]:nth-of-type(5):checked ~ [role="tabpanel"]:nth-of-type(5),
[name="tabs"]:nth-of-type(6):checked ~ [role="tabpanel"]:nth-of-type(6) {
  /* ADDED: show selected tabpanel */
  display: block;
}

/* 1 Sept 2020: media query no longer used. */
@media(max-width:38em) {
  [role="tab"] {
    /* display: block; */

    /* ADDED - tabs no longer need right margin */
    /* margin-right: 0; */

    /* ADDED - "unhide" the bottom margin */
    /* MOVED TO checked + tab rule *?
    /* margin-bottom: 0; */
  }

  /* ADDED: for visual emphasis. */
  [name="tabs"]:checked + [role="tab"] {
    /* 1 Sept 2020: REMOVED due to flexbox solution */
    /* border-bottom: 1px solid #eee; */
  }
}

```
