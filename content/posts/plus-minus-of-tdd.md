---
title: "The Plus and Minus of TDD"
date: 2021-07-19T10:30:55-07:00
lastmod: 2021-07-19T10:30:55-07:00
description: "One commenter’s great response to Cedric Beust on the pro's and cons of test-driven development. I posted this previously on the Wordpress blog in 2015 (and in a gist in 2013)."
tags:
- "Testing"
- "TDD"

---

The test below is not my own; it is copied from a comment by [Talbott Crowell](https://talbottcrowell.wordpress.com) on Cedric Beust’s blog. (Cedric is the creator of [TestNG](https://testng.org/).)

Cedric's post, [Agile people still don’t get it](https://www.beust.com/weblog/agile-people-still-dont-get-it/), dates back to {{<rawhtml>}}<time datetime="2006-06-07">June 7, 2006</time>{{</rawhtml>}}, and contains hard words for Agilists pushing TDD without acknowledging any associated costs.

[Talbott's comment](https://www.beust.com/weblog/agile-people-still-dont-get-it/#comment-5569) dates to {{<rawhtml>}}<time datetime="2010-08-23">August 23, 2010</time>{{</rawhtml>}}, two days after the post was picked up on reddit.com. Talbott lists some advantages and disadvantages of TDD.

<!--more-->

**Begin quote**

## Here are some things I like about TDD.

> 1. **Interruptability**: if you write a test first, and you get pulled away to a dreaded meeting, you can get back to work faster because you simply rebuild and
run your tests to remind you of what is next and exactly what problem you were
trying to solve before you were pulled away, since you wrote the code that would
fail until you implemented the solution.

> 2. **Less fragility**: I’m less concerned about fixing and refactoring code when I
can rerun the tests before checking in. Sometimes in large complex enterprise
projects, a small change can break some distant dependency. We’ve all been there
where we are afraid to make a change to someone else’s code because the app is
so fragile. TDD reduces stress and makes programming more enjoyable.

> 3. **Refactoring**: a benefit from #2 is that you can keep a clean house. Nothing
worse than code that “smells” and is not fun to debug or navigate. TDD allows
developers to constantly refactor and delete dead code so you don’t have an
increasingly growing pile of dung. It is much more fun to maintain a codebase
that is 25% of the size and clean.

> 4. **Less time wasted**: when a test can pinpoint a bug in seconds that can take
hours without test coverage, you realize that TDD can often reduce the time to
develop software over the course of the project.

## Disadvantages/Risks:

> 1. **No buy in by developers or management**: this is the biggest risk to TDD. If
you don’t have people who realize the benefits, it will never work for your team.

> 2. **Dependencies**: TDD should be implemented in a way that has minimal dependencies. Depending on a database connection, network connection, web services, etc.. can lead to fragile tests. There has been a ton of work in this area, especially mocking frameworks, to get around this issue. Done right, your tests should test only your logic, not external components.

> 3. **Hard to add TDD later**: TDD is best to have in place before you start coding. It is very difficult to add TDD to an existing project. Often the application architecture will evolve in a “testable” way when you are using TDD. You will write your code and use application frameworks like ASP.NET MVC instead of
ASP.NET WebForms for example to make testing easier and more natural.

**End quote**
