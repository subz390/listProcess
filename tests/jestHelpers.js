/**
 * @name consoleMock
 * @version 190924-141203
 * @param {string} type of console to mock `log (default) | warn | error | info`
 * @return {array} logged results
 * @description Returns a reference to `messagesArray`.  Each time `test()` is run in your test script, console output from your function is captured and pushed onto `messagesArray`. Then call `messagesArray.pop()` to read and remove the last message off the end of the Array for testing.
 * @example
 * // set up the mock
 * const messagesArray = consoleMock('warn')
 * console.warn('something')
 * // then pop() the last message off the array for testing
 * expect(messagesArray.pop()).toMatch('something')
 *
 * const consoleLog = consoleMock()
 * const consoleError = consoleMock('error')
 * const consoleInfo = consoleMock('info')
 */
export function consoleMock(type = 'log') {
  const consoleSave = console[type]
  const messagesArray = []
  beforeEach(() => {
    // with implementation
    // https://jest-bot.github.io/jest/docs/mock-function-api.html#mockfnmockimplementationfn
    // Note: jest.fn(implementation) is a shorthand for mockImplementation
    // this is the only way to get access to the mutated result array during tests
    // there is no access to mockFn.mock.calls outside this function during tests
    // you can access that from within this function in afterEach if you need to though
    // but that's no use in this case, so we need to mutate our own array and you do that
    // with an implementation
    console[type] = jest.fn(inputs => messagesArray.push(inputs))
  })
  afterEach(() => {
    console[type].mockReset()
    console[type] = consoleSave
  })
  // initially, pass a reference to the messagesArray
  return messagesArray
}
