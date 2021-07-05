/*
  JavaScript for plain To-do list.
  Created Feb 8, 2017.
  Updated for blog demo 23 Sept 2020.
  Updated for blog (form, save-message, et al) 7 June 2021.
  */

document.addEventListener('DOMContentLoaded', (function () {
  'use strict';

  var handleSave = (function (item) {
    var input = item.querySelector('input')

    // Done: Trim input value on save.
    input.value = input.value.normalize().trim()

    input.setAttribute('readonly', true)

    // unselect/un-highlight text to prevent persistent selection in mobile.
    input.selectionEnd = null

    // If this is a newly added item, remove the id from the input...
    input.hasAttribute("id") && (input.removeAttribute("id"))

    // ...and remove the label element...
    var label = item.querySelector('label')
    label && (item.removeChild(label))

    // TODO: Show status on save: "blah blah" added

    var save = item.querySelector('[handle="save"]')
    save.setAttribute('handle', 'edit')
    save.textContent = 'Edit'
  })

  var handleEdit = (function (item) {
    var input = item.querySelector('input')
    input.removeAttribute('readonly')

    // select/highlight text value
    // input.selectionStart = 0
    // input.selectionEnd = input.value.length
    input.focus()

    var edit = item.querySelector('[handle="edit"]')
    edit.setAttribute('handle', 'save')
    edit.textContent = 'Save'
  })

  var handleRemove = (function (item) {
    var parentElement = item.parentElement;

    parentElement.removeChild(item)

    normalize(parentElement)
  })

  var handleComplete = (function (item) {
    var input = item.querySelector('input')
    var done = input.getAttribute('done');
    var btn = item.querySelector('[handle="done"]')

    if (done) {
      input.removeAttribute('done')
      btn.textContent = 'Complete'
    } else {
      input.setAttribute('done', true)
      btn.textContent = 'Incomplete'
    }
  })

  var handleMessage = (function (item, selector) {
    var message = item.querySelector(selector);

    if (message.hasAttribute('open')) {
      return;
    }

    var text = document.createElement('p')
    text.textContent = message.getAttribute(selector.substring(1, selector.length - 1))
    text.setAttribute("tabindex", "0")
    text.setAttribute("text", "");

    var close = document.createElement('button')
    close.setAttribute('type', 'button')
    close.setAttribute("handle", "close")
    close.textContent = message.getAttribute("alert-close")

    var fragment = document.createDocumentFragment()
    fragment.appendChild(text)
    fragment.appendChild(close)

    message.appendChild(fragment)
    message.setAttribute("open", "true")

    close.focus()

    requestAnimationFrame(function () {
      message.scrollIntoView();
    })
  })

  var handleMessageClick = (function (e) {
    var message = e.currentTarget

    while (message.firstChild) {
      /*
       * Do this first before removing it from the DOM;
       * else iOS Safari won't remove child elements.
       */
      message.removeChild(message.firstChild)
    }

    message.removeAttribute("open")

    restoreLastActive(message);
  })

  var handleListClick = (function (e) {
    var handle = e.target.getAttribute('handle')

    if (!handle) {
      return
    }

    var item = e.target.parentElement
    var list = e.currentTarget

    handleAction(handle, item, list)
  })

  var handleKeydown = (function (e) {
    // 7-8 June, 2021.

    // Use keydown and type="button" to prevent form submission on "Enter"
    // keydown on the Add Todo input, which curiously fires a mouse event
    // on the first button in the form (if the form isn't empty).

    // Decision tree shows that certain HTML element and DOM event combinations
    // lead to curious "default" behavior.

    if (e.key != "Enter" || e.target.type != "text") {
      // Return early to allow "Tab" traversal, button presses, and other
      // normal, accessible behavior.
      return
    }

    if (e.target.hasAttribute("readonly")) {
      // Prevent form submissions on "readonly" input *and* return to allow
      // normal, accessible behavior.
      e.preventDefault()

      return
    }

    if (e.key == "Enter" && e.target.type == "text") {
      // Prevent "Enter" form submission on interactive text input, *and* allow
      // further processing.
      e.preventDefault()
    }

    var handle = "save"
    var item = e.target.parentElement
    var list = e.currentTarget

    handleAction(handle, item, list)
  })

  var handleAction = (function (handle, item, list) {
    if (handle == 'edit' && list.querySelector("[name]:not([readonly]")) {
      return handleMessage(list.parentElement, "[alert-message]")
    }

    if (handle == 'save' && !item.querySelector('input').value) {
      return handleMessage(list.parentElement, "[save-message]")
    }

    handle == 'save' && (handleSave(item))
    handle == 'edit' && (handleEdit(item))
    handle == 'remove' && (handleRemove(item))
    handle == 'done' && (handleComplete(item))
  })

  var handleAdd = (function (list) {
    if (list.querySelector("[name]:not([readonly]")) {
      return handleMessage(list.parentElement, "[alert-message]")
    }

    var template = list.parentElement.querySelector('[item-template]')
    var item = template.content.cloneNode(true).firstElementChild

    item.removeAttribute('item-template')
    item.setAttribute('item', "")

    requestAnimationFrame(function () {
      list.appendChild(item)

      // Make it editable so user can change the boilerplate name value.
      handleEdit(item)
    })
  })

  var handleAddClick = (function (e) {
    var list = e.target.parentElement.querySelector('[todo-list]')

    list && (handleAdd(list))
  })

  // Remove text and comment nodes from Todo block.
  var normalize = (function (element) {
    Array.from(element.childNodes).forEach(node => {
      /3|8/.test(node.nodeType) && (element.removeChild(node))
    })
  })

  // Handle focus transitions between dialog and first open item in the list.
  var restoreLastActive = (function (message) {
    var active = message.parentElement.querySelector("[name]:not([readonly]")

    active && (active.focus())
  })

  // finally, initialize UI
  var todos = Array.from(document.querySelectorAll('[todo]')).map(function (todo) {
    todo.querySelector('[todo-list]').addEventListener('keydown', handleKeydown)
    todo.querySelector('[todo-list]').addEventListener('click', handleListClick)
    todo.querySelector('[handle="add"]').addEventListener('click', handleAddClick)
    todo.querySelectorAll('[role="alert"]').forEach(dialog => {
      dialog.addEventListener('click', handleMessageClick)
    })

    normalize(todo)

    return todo
  })
}))
