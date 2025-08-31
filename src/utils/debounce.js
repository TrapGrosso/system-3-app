/**
 * Returns a function that, when invoked, will only be triggered at most once
 * during a given window of time.
 *
 * @param {function} func The function to debounce.
 * @param {number} delay The number of milliseconds to delay.
 * @returns {function} A new, debounced function.
 */
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
