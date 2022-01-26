/**
 * @name listProcess
 * @version 1.0.1
 * @param {Object} param0 - options properties
 * @return {Object} Promise object with resolve and reject properties
 * @description a Promise wrapper to handle processing a `listObject` through an `itemProcessor` callback function as an array of Promises.  The `promiseMethod` defines the static Promise methods follows.
 * @example
 * `options.promiseMethod` {string} the Promise method by which the list will be handled.  The following methods are supported;
 *  -`all` wait for all promises to be resolved, or any one rejected.  Returns the resolved or rejected object.
 *  -`allSettled` wait until all promises have settled. Returns an array of objects detailing the fulfilled or rejected with reason, of each item processed
 *  -`any` wait until at least one promise resolves.  Returns the resolved object.
 *  -`race` returns the first promise resolve or reject
 * `options.listObject` {Array|Object} the list of items to be processed
 * `options.itemProcessor` {Function} the callback function by which each item in the list is processed.  The function itself should `return resolve` or `return reject` depending on the outcome of the process.
 * `options.debugNoTreeShake` {boolean} enable development debugging
 * @example
 * @example
 * // add `setTimeout` in the `itemProcessor` to set a limit on the Promise waiting time
 * setTimeout(() => {return reject(Error(`timed out: ${key}`))}, 2000)
 * @manual https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * @manual https://stackoverflow.com/questions/61732049/what-is-the-difference-between-promise-any-and-promise-race
 * @example
 * jsutils.listProcess({
 *   promiseMethod: 'any',
 *    // listObject: [{}, {}, {}],
 *    listObject: {a: {}, b: {}, c: {}},
 *    itemProcessor: (resolve, reject, key, item) => {
 *      // console.log(key, item)
 *      // return reject(new Error(`some error: ${key}`))
 *      // what you return resolve here gets passed to listProcess().then({key, message})
 *      // if `promiseMethod: 'all'` .then(resultArray) is an array of returned resolves from each of the above
 *      return resolve({key: key, message: ''})
 *    },
 *    debugNoTreeshake: true
 *  })
 *  .then(({key, message}) => {console.log(key, message)})
 *  .then((resultArray) => {console.log(resultArray)})
 *  .catch((reason) => {
 *    // when Promise.any() fails you get an AggregateError object of each item failure
 *    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError
 *    if (reason.errors) {console.log(`Promise.any: rejected with\n${reason.errors.map(({message}) => message).join('\n')}`)}
 *    else {console.error(reason)}
 *  })
 */
export function listProcess({promiseMethod = 'allSettled', listObject = null, itemProcessor = undefined, debugNoTreeshake = undefined} = {}) {
  if (typeof itemProcessor !== 'function') return Promise.reject(Error('itemProcessor should be a function'))
  if ((listObject == null) || (Array.isArray(listObject) && listObject.length === 0) || (Object.keys(listObject).length === 0)) {
    return Promise.reject(Error('listObject cannot be empty'))
  }
  if (['all', 'allSettled', 'any', 'race'].includes(promiseMethod)) {
    const promisesArray = []
    for (const [key, property] of Object.entries(listObject)) {
      promisesArray.push(new Promise((resolve, reject) => {
        return itemProcessor(resolve, reject, key, property, debugNoTreeshake)
      }))
    }
    return Promise[promiseMethod](promisesArray)
  }
  else {return Promise.reject(Error('unrecognised promiseMethod'))}
}

/**
 * HISTORY
 * 211213 renamed debug to debugNoTreeshake so that rollup doesn't remove it as it was causing a `debug not found` error when trying to pass debug when calling itemProcessor
 * This has side-effects on code you've written that passes a debug value to listProcess, but it won't error, it'll just not log any debug
 * You'll need to pass `debugNoTreeshake` instead
 */
