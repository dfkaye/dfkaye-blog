export { register }

// Enables multiple init() calls, even after document is ready.

function register(handler) {
  if (typeof handler != 'function' && typeof handler.handleEvent != "function") {
    return;
  }

  function onReadyStateChange() {
    if (document.readyState == "complete") {
      exec(handler);
      return true
    }
  }

  onReadyStateChange() || (
    document.addEventListener('readystatechange', onReadyStateChange, { once: true })
  )
}

function exec(handler) {
  typeof handler.handleEvent == "function"
    ? handler.handleEvent.call(handler)
    : typeof handler == "function"
      ? handler.call(document)
      : 0;
}
