/* search module */

// Our search elements.
var form = document.querySelector("[search-form]");
var input = document.querySelector('#input-search');
var list = document.querySelector("[search-results]");

// Textarea for normalizing HTML
// See https://blog.jeremylikness.com/blog/dynamic-search-in-a-static-hugo-website/#preparing-the-index
var normalizer = document.querySelector("[text-normalize]")

// DOM builder
var parser = new DOMParser()
var mime = "text/html"

// Our search index is not a JSON file but a template attribute string.
// Variant on global variable approach described by Chris Ferdinandi.
// See https://gomakethings.com/how-to-create-a-vanilla-js-search-page-for-a-static-website/#creating-a-search-index
var template = document.querySelector("[search-index]")
var json = template.getAttribute("search-index")
var entries = JSON.parse(json)
// console.warn(json.length)

// Our handlers.
function clearResults() {
  [].slice.call(list.children).forEach(child => {
    child.remove()
  })
}

function render(results) {
  var count = results.length
  var plural = count != 1;
  var html = `
  <aside>
    <p result-count="${count}">${count} result${plural ? "s" : ""} found.</p>
    ${count
      ? `
        <!-- Results list -->
        <ul page-list></ul>
      `
      : `
        <!-- No results -->
        <p>Try a different search or browse the following page types:</p>
        <ul page-list>
          <li>
          <a href="/posts">Posts</a>
          </li>
          <li>
          <a href="/demos">Demos</a>
          </li>
          <li>
          <a href="/tags">Tags</a>
          </li>
        </ul>
      `}
  </aside>`;
  var aside = parser.parseFromString(html.trim(), mime).body.firstElementChild
  var ul = aside.querySelector("[page-list]")

  // This will populate page-list only if there are any results.

  results.forEach((result, i) => {
    var { datetime, date, url, title, description } = result;
    var html = `
    <li page-item="${i}">
      <aside>
        <time datetime="${datetime}">${date}</time>
      </aside>
      <h2 page-heading><a href="${url}">${title}</a></h2>
      <p page-description>${description}</p>
    </li>
    `;
    var li = parser.parseFromString(html.trim(), mime).body.firstElementChild

    ul.appendChild(li)
  })

  list.appendChild(aside)
}

function normalize(value) {
  normalizer.innerHTML = value;

  return normalizer.value;
}

function search(text) {
  var set = {};
  var titles = [];
  var contents = [];
  var results = [];

  normalize(text).trim().split(" ").forEach(term => {
    if (!term.length || /^\s+$/.test(term)) {
      // Ignore empty or whitespace terms.
      return
    }

    entries.forEach(entry => {
      if (set[entry.title]) {
        // Ignore entry if already processed.
        return
      }

      if (entry.title.match(RegExp(term, "gi"))) {
        return (
          set[entry.title] = titles.push(entry)
        )
      }

      if (entry.content.match(RegExp(term, "gi"))) {
        return (
          set[entry.title] = contents.push(entry)
        )
      }
    })

    results = titles.concat(contents)
  })

  render(results)
}

function onSubmit(e) {
  e.preventDefault()

  clearResults()
  search(input.value)
}

function unit() {
  // Normalize entry text.
  entries.forEach(entry => {
    var title = normalize(entry.title.trim())
    var content = normalize(entry.content.trim())

    entry.title = title
    entry.content = content
  })

  form.addEventListener("submit", onSubmit)
}

init();

