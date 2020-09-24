/*
  JavaScript for plain To-do list.
  Created Feb 8, 2017.
  Updated for blog demo 23 Sept 2020.
  */

document.addEventListener('DOMContentLoaded', (function () {
  'use strict';

  var handleSave = (function (item) {
    var input = item.querySelector('input')
    input.setAttribute('readonly', true)

    // unselect/un-highlight text value
    input.selectionEnd = null

    var save = item.querySelector('[handle="save"]')
    save.setAttribute('handle', 'edit')
    save.textContent = 'Edit'
  })

  var handleEdit = (function (item) {
    var input = item.querySelector('input')
    input.removeAttribute('readonly')

    // select/highlight text value
    input.selectionStart = 0
    input.selectionEnd = input.value.length
    input.focus()

    var edit = item.querySelector('[handle="edit"]')
    edit.setAttribute('handle', 'save')
    edit.textContent = 'Save'
  })

  var handleRemove = (function (item) {
    item.parentNode.removeChild(item)
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

  var handleMessage = (function (item) {
    var message = item.querySelector('[alert-message]');

    if (message.hasAttribute('open')) {
      return;
    }

    var text = document.createElement('p')
    text.textContent = message.getAttribute("alert-message")
    text.setAttribute("tabindex", "0")
    text.setAttribute("text", "");

    var close = document.createElement('button')
    close.setAttribute('type', 'button')
    close.setAttribute("close", "")
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
    var list = e.currentTarget
    var target = e.target
    var handle = target.getAttribute('handle')
    var item = target.parentNode

    if (handle == 'edit' && list.querySelector("[name]:not([readonly]")) {
      return handleMessage(list.parentNode)
    }

    handle == 'save' && (handleSave(item))
    handle == 'edit' && (handleEdit(item))
    handle == 'remove' && (handleRemove(item))
    handle == 'done' && (handleComplete(item))
  })

  var handleAdd = (function (list) {
    if (list.querySelector("[name]:not([readonly]")) {
      return handleMessage(list.parentNode)
    }

    var template = list.querySelector('[data-template]')
    var item = template.cloneNode(true)

    item.removeAttribute('data-template')
    item.setAttribute('item', "")

    requestAnimationFrame(function () {
      list.appendChild(item)

      /*
       * Make it editable so user can change the boilerplate
       * name value.
       */
      handleEdit(item)
    })
  })

  var handleAddClick = (function (e) {
    var list = e.target.parentNode.querySelector('[todo-list]')

    list && (handleAdd(list))
  })

  // handle focus transitions between dialog and first open item in the list.
  function restoreLastActive(message) {
    var active = message.parentElement.querySelector("[name]:not([readonly]")

    active.focus()
  }

  // finally, initialize UI
  var todos = [].slice.call(document.querySelectorAll('todo')).map(function (todo) {
    todo.querySelector('[todo-list]').addEventListener('click', handleListClick)
    todo.querySelector('[handle="add"]').addEventListener('click', handleAddClick)
    todo.querySelector('[alert-message]').addEventListener('click', handleMessageClick)

    return todo
  })
}))
