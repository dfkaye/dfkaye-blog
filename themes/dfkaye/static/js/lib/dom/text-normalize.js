export { normalize }

function normalize(text) {
  // Textarea for normalizing HTML
  // See https://blog.jeremylikness.com/blog/dynamic-search-in-a-static-hugo-website/#preparing-the-index
  var normalizer = document.createElement('textarea')

  normalizer.innerHTML = text;

  return normalizer.value.trim();
}
