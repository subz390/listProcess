/**
 * @name listProcess
 * @version 1.0.1
 * @param {Object} param0 - object option properties
 * @return {Object} Promise object with resolve and reject properties
 * @description a Promise wrapper to handle processing a `listObject` through an `itemProcessor` callback function as an array of Promises.  The `promiseMethod` defines the static Promise methods follows.
 * @example
 * `promiseMethod` {string} the Promise method by which the list will be handled.  The following methods are supported;
 *  -`all` wait for all promises to be resolved, or any one rejected.  Returns the resolved or rejected object.
 *  -`allSettled` wait until all promises have settled. Returns an array of objects detailing the fulfilled or rejected with reason, of each item processed
 *  -`any` wait until at least one promise resolves.  Returns the resolved object.
 *  -`race` returns the first promise resolve or reject
 * `listObject` {Array|Object} the list of items to be processed
 * `itemProcessor` {Function} the callback function by which each item in the list is processed.  The function itself should `return resolve` or `return reject` depending on the outcome of the process.
 * `debug` {boolean} enable development debugging
 * @example
 * @example
 * // add `setTimeout` in the `itemProcessor` to set a limit on the Promise waiting time
 * setTimeout(() => {return reject(Error(`timed out: ${key}`))}, 2000)
 * @manual https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * @manual https://stackoverflow.com/questions/61732049/what-is-the-difference-between-promise-any-and-promise-race
 * @example
  * listProcess({
  *   promiseMethod: 'any',
  *   debug: true,
  *   // listObject: [{}, {}, {}],
  *   listObject: {a: {}, b: {}, c: {}},
  *   itemProcessor: (resolve, reject, key, item, debug) => {
  *     debug && console.log(key, item)
  *     // return reject(new Error(`some error: ${key}`))
  *     // what you return resolve here gets passed to listProcess().then({key, debug, message})
  *     // if `promiseMethod: 'all'` .then(resultArray) is an array of returned resolves from each of the above
  *     return resolve({key: key, debug: debug, message: ''})
  *   }
  * })
  * .then(({key, debug, message}) => {debug && console.log(`key ${key}`)})
  * .catch((reason) => {
  *   // when all Promise items fail to match you get an errors object
  *   if (reason.errors) {console.log(`Promise.any: rejected with\n${reason.errors.map(({message}) => message).join('\n')}`)}
  *   else {console.error(reason)}
  * })
 */
export function listProcess({promiseMethod = 'allSettled', listObject = null, itemProcessor = undefined, debug = false} = {}) {
  if (typeof itemProcessor !== 'function') return Promise.reject(Error('itemProcessor should be a function'))
  if ((listObject == null) || (Array.isArray(listObject) && listObject.length === 0) || (Object.keys(listObject).length === 0)) {return Promise.reject(Error('listObject cannot be empty'))}
  if (['all', 'allSettled', 'any', 'race'].includes(promiseMethod)) {
    const promisesArray = []
    for (const [key, property] of Object.entries(listObject)) {
      const task = new Promise((resolve, reject) => {
        return itemProcessor(resolve, reject, key, property, debug)
      })
      promisesArray.push(task)
    }
    return Promise[promiseMethod](promisesArray)
  }
  else {return Promise.reject(Error('unrecognised promiseMethod'))}
}
