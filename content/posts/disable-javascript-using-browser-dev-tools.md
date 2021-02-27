---
title: "Disable Javascript Using Browser Dev Tools"
date: 2021-02-26T17:19:13-08:00
lastmod: 2021-02-26T17:19:13-08:00
description: "Steps on how to disable and re-enable JavaScript using browser dev tools."
tags:
- "Accessibility"
- "JavaScript"
- "Testing"

---

As of February 26, 2021 (and since November 2020 or so), [Heydon Pickering](https://twitter.com/heydonworks) displays on [his site](https://heydonworks.com/) the following message:

> Please disable JavaScript to view this site.

<!--more-->

## Accessibility 101

That's Heydon's way of dramatizing what happens when we developers do not prioritize accessibility across different devices and user agents. In this case, we get a user experience *harmed* by JavaScript rather than enhanced.

In order to read any of his content, we have to disable JavaScript in the browser.

## Modern browsers

Luckily we can do that pretty easily using modern browsers' Dev Tools to disable JavaScript in the current browser tab while keeping the Dev Tools open, without closing and restarting.

One nice thing about this technique is that once you close the Dev Tools, the JavaScript setting for the tab reverts to the browser's global JavaScript access setting.

Here is a couple of them:

### Chrome

+ Open dev tools (`Ctl+Shift+I`):
+ Open command menu (`Ctl+Shift+P`):
+ Type "debugger" (and a list appears):
+ Press `ArrowDown` key to the "enable|disable JavaScript" entry:
+ Press the `Enter` key (or click the checkbox).

### Edge

Same as Chrome.

### Firefox

+ Open dev tools (`Ctl+Shift+I`):
+ Press the `F1` key (and a menu appears):
+ Type "debugger" (and a list appears):
+ Press the `Tab` key to the "enable|disable JavaScript" entry:
+ Press the `Space` key (or click the checkbox).

## Other browsers

Unfortunately, not all browsers configure their dev tools to enable this one-off setting. In these you need to re-open the Tools or Preferences menus and re-enable JavaScript.

Here is a handful of them:

## Falkon

+ Open the hamburger (main) menu upper right:
+ Choose "Preferences":
+ Choose "Browsing":
+ Select|De-select the "Allow JavaScript" checkbox.

## Internet Explorer

+ Press `Alt+X` to open Tools menu:
+ Press `O` key to select "Internet Options":
+ Open the "Security" tab:
+ Open the "Custom Level" panel:
+ Scroll down to the "Scripting" section:
+ Choose "enable|disable" for "Active Scripting":
+ Click "Apply" and OK.

## Safari (Mac OS)

+ Open Safari and click Safari in the menu at the top of the screen.
+ Choose "Preferences".
+ Click the "Security" tab.
+ Select|de-select the "Enable JavaScript" checkbox.

## Safari (iOS iPhone and iPad)

+ Open "Settings" from the home screen.
+ Scroll down and tap Safari.
+ Tap "Advanced" at the bottom of the screen.
+ Tap the "JavaScript" toggle button to enable or disable.

## More information

**Note**: The Safari instructions are taken from Sitepoint's article by Craig Buckler, dated July 2017, wherein he writes:

> Without JavaScript, a magical web appears without bloat, advertising, pop-ups, cookie warnings, scroll-jacking and many of the other dark patterns we experience today.

Visit that page, [Should Users be Permitted to Disable JavaScript?](https://www.sitepoint.com/disable-javascript-option/), for instructions on other browsers such as Brave, Opera, and Vivaldi.
