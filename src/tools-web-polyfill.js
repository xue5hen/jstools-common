/**
 * CustomEvent constructor polyfill for IE
 */
const polyfillCustomEvent = () => {
  // 如果不是IE
  if (typeof window.CustomEvent === 'function') return false
  let CustomEvent = function (event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    }
    let evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }
  CustomEvent.prototype = window.Event.prototype
  window.CustomEvent = CustomEvent
}

/**
 * RequestAnimationFrame constructor polyfill
 */
const polyfillRequestAnimationFrame = () => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000/60)
      }
    )
  }
}

module.exports = {
  polyfillCustomEvent,
  polyfillRequestAnimationFrame
}
