export function assert(statement, errorMessage) {
  if (!statement) {
    const error = new Error(`[Assertion error]: ${errorMessage}`)
    error.assert = true
  }
}

export function warn(...args) {
  // eslint-disable-next-line no-console
  console.warn(...args)
}
