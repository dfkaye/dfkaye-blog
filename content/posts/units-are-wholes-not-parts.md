---
title: "Units Are Wholes, Not Parts"
date: 2021-07-19T11:15:30-07:00
lastmod: 2021-07-19T11:15:30-07:00
description: "Unit testing is not about making parts to be fitted together, but making wholes that work together. Re-post of my August 19, 2015 Wordpress blog."
tags:
- "Testing"
- "TDD"

scripts:
- "https://platform.twitter.com/widgets.js"

---

*First published on wordpress, {{<rawhtml>}}<time datetime="2015-08-19">August 19, 2015</time>{{</rawhtml>}}.*

<!--more-->

## "Unit testers be like&hellip;"

The following joke pokes fun at developers who de-couple things arbitrarily or incoherently.

{{< rawhtml >}}
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Still love this one. Unit testers be like: &quot;Looks like it&#39;s working&quot; <a href="http://t.co/KiNT4wXP4a">pic.twitter.com/KiNT4wXP4a</a></p>&mdash; Kent C. Dodds (@kentcdodds) <a href="https://twitter.com/kentcdodds/status/628658648001048577?ref_src=twsrc%5Etfw"><time datetime="2015-08-04">August 4, 2015</time></a></blockquote>
<!--script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script -->
{{< /rawhtml >}}

One of the follow-up jokes points to QA’s saving role in the process, i.e., *we need integration tests*.

If we take the joke’s underlying metaphor literally, we’ll see that it also confuses the practice of “unit testing” with testing only “parts” in isolation rather than their interaction.

Instead of thinking about units as parts to be fitted together, think about them as wholes that should work together. That encourages you to think from the start about how these will communicate with each other.

The following JavaScript function “works” but modifies nothing and returns nothing:

```js
function A(a, b) {
    "secret inner workings";
}
```

That is an apt metaphor of the severed head in the joke animation. It can take input and hold a thought, but from just this design you cannot tell how it would work with anything else.

Once we start feeding the head some real input, what do we expect as a result? A spoken word may elicit a spoken response, in which case we need a communication strategy (vocalization, facial features, etc.). An input of food requires a different strategy (is this poison? does it taste good? what do I do with it now?).

Once it’s clear we need to support the head with other behavior, we can also see the need for the torso. However, it does not follow that we would then develop the torso independently of the head, since the torso would now depend on the head for information.

*Update, {{<rawhtml>}}<time datetime="2021-07-19">July 19, 2021</time>{{<rawhtml>}}: I no longer agree with the tenor of this next paragraph.*

Things that necessarily depend on each other cannot be tested in isolation without mocking those dependencies. The dependencies in this case are not the separated body parts, but several other undefined systems (the circulatory, respiratory, digestive, and nervous systems, for starters). An integration test of the head, torso and legs together is actually meaningless if those dependent systems have not been identified.

When testing our programs, we are not testing the parts of the program such as variables, keywords, expressions, statements or functions independently, we are testing that they work together.

Unit testing is not about making parts to be fitted together, but making wholes that work together.
