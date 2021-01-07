import {listProcess} from '../src/listProcess.js'
import {consoleMock} from './jestHelpers.js'

// ================================================================================
// TEST NOTES
// all the returns are to pass the Promise back up through the function calling chain
// so if you find the listProcess.then((response)=>{}) function isn't being called it's because listProcess wasn't returned to test
// and test didn't async await internally for listProcess, and so went ahead and terminated it's process before listProcess finished doing it's thing
// so returning the listProcess to test, test now has a reference to it's async Promise and will await for the process to resolve and finally return
// so add returns all the way through the flow to the end

// ================================================================================
// GLOBAL TEST VALUES
const listArray = [
  {delay: 100, message: '100ms'},
  {delay: 200, message: '200ms'},
  {delay: -1, message: 'rejected'},
  {delay: 300, message: '300ms'}
]
const listObject = {
  first: {delay: 100, message: '100ms'},
  second: {delay: 200, message: '200ms'},
  third: {delay: 300, message: '300ms'}
}

// this function is called for each item in the listArray or listObject
function itemProcessor(resolve, reject, key, item, debug) {
  debug && console.log(item)
  if (item.delay === -1) {
    return reject(new Error(`error: ${item.message}`))
  }
  setTimeout(() => {return resolve({key: key, message: item.message, debug: debug})}, item.delay)
  // what you return here gets passed to listProcess().then({key, debug, message})
  // if `promiseMethod: 'all'` .then(resultArray) is an array of returned resolves from each of the above
}

// ================================================================================
// TEST PARAMETER VALIDATION METHODS
describe('parameter validation', () => {
  describe('listProcess should reject', () => {
    test('when no parameters passed', () => {
      // this is the first of all the checks to fail when no parameters passed
      // we don't get a TypeError: Cannot read property 'promiseMethod' of undefined
      // because of the = {} in the destructure, it gives an empty object when none passed
      // which in turn allows our defaults to be created
      // and our default for itemProcessor is undefined to throw the Error "itemProcessor should be a function"
      return listProcess()
      .then((response) => {
        throw new Error('This test failed because there should have been no parameters passed and there were')
      })
      .catch((error) => {
        return expect(error).toEqual(Error('itemProcessor should be a function'))
      })
    })
  })
  describe('itemProcessor property should reject', () => {
    test('when undefined', () => {
      return listProcess({promiseMethod: 'all', listObject: listObject})
      .then((response) => {
        throw new Error('This test failed because itemProcessor should be undefined it`s not')
      })
      .catch((error) => {
        return expect(error).toEqual(Error('itemProcessor should be a function'))
      })
    })
    test('when not a function', () => {
      return listProcess({promiseMethod: 'all', listObject: listObject, itemProcessor: ''})
      .then((response) => {
        throw new Error('This test failed because itemProcessor should not be a function it is')
      })
      .catch((error) => {
        return expect(error).toEqual(Error('itemProcessor should be a function'))
      })
    })
  })
  describe('listObject property should reject', () => {
    test('when undefined and default null', () => {
      return listProcess({promiseMethod: 'all', itemProcessor: itemProcessor})
      .then((response) => {
        throw new Error('This test failed because listObject should be `undefined` and therefore default `null` and it`s not')
      })
      .catch((error) => {
        return expect(error).toEqual(Error('listObject cannot be empty'))
      })
    })
    test('an empty Array', () => {
      return listProcess({promiseMethod: 'all', listObject: [], itemProcessor: itemProcessor})
      .then((response) => {
        throw new Error('This test failed because listObject should have been an empty Array and it`s not')
      })
      .catch((error) => {
        return expect(error).toEqual(Error('listObject cannot be empty'))
      })
    })
    test('an empty Object', () => {
      return listProcess({promiseMethod: 'all', listObject: {}, itemProcessor: itemProcessor})
      .then((response) => {
        throw new Error('This test failed because listObject should have been an empty Object and it`s not')
      })
      .catch((error) => {
        return expect(error).toEqual(Error('listObject cannot be empty'))
      })
    })
  })
  describe('promiseMethod property should reject', () => {
    test('when empty string', () => {
      return listProcess({promiseMethod: '', listObject: listArray, itemProcessor: itemProcessor})
      .then((response) => {
        throw new Error('This test failed because the `promiseMethod` should be an empty string')
      })
      .catch((error) => {
        return expect(error).toEqual(Error('unrecognised promiseMethod'))
      })
    })
    test('when not `all, allSettled, any, race`', () => {
      return listProcess({promiseMethod: 'garbage', listObject: listArray, itemProcessor: itemProcessor})
      .catch((error) => {
        return expect(error).toEqual(Error('unrecognised promiseMethod'))
      })
    })
  })
  describe('debug property undefined default', () => {
    const logArray = consoleMock('log')
    test('should not console.log messages', () => {
      return listProcess({promiseMethod: 'any', listObject: listArray, itemProcessor: itemProcessor})
      .then((response) => {
        return expect(logArray.length === 0).toBe(true)
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
    test('should pass falsy debug property to final result', () => {
      return listProcess({promiseMethod: 'any', listObject: listArray, itemProcessor: itemProcessor})
      .then((response) => {
        return expect(response.debug).toBeFalsy()
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
  })
  describe('when the debug property defined falsy', () => {
    const logArray = consoleMock('log')
    test('should not console.log messages', () => {
      return listProcess({promiseMethod: 'any', listObject: listArray, itemProcessor: itemProcessor, debug: false})
      .then((response) => {
        return expect(logArray.length === 0).toBe(true)
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
    test('should pass falsy debug property to final result', () => {
      return listProcess({promiseMethod: 'any', listObject: listArray, itemProcessor: itemProcessor, debug: false})
      .then((response) => {
        return expect(response.debug).toBeFalsy()
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
  })
  describe('when the debug property defined truthy', () => {
    const logArray = consoleMock('log')
    test('should console.log a message for each time itemProcessor is called', () => {
      return listProcess({promiseMethod: 'any', listObject: listArray, itemProcessor: itemProcessor, debug: true})
      .then((response) => {
        // messages are popped off the end of logArray, so in reverse order to when they were logged
        // therefore we iterate from end to start of the listArray to be aligned for the expect comparison
        for (let index = logArray.length; index < logArray.length; index--) {
          return expect(logArray.pop()).toMatchObject(listArray[index])
        }
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
    test('should pass default debug = true through to final result', () => {
      return listProcess({promiseMethod: 'any', listObject: listArray, itemProcessor: itemProcessor, debug: true})
      .then((response) => {
        return expect(response.debug).toBeTruthy()
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
  })
})

// ================================================================================
// TESTS FOR 100% COVERAGE
describe('minimum for 100% coverage', () => {
  describe('Promise `all` method', () => {
    test('when listObject is an Array, first reject', () => {
      return listProcess({promiseMethod: 'all', listObject: listArray, itemProcessor: itemProcessor, debug: false})
      .then((response) => {
        throw new Error('This test failed because the `all` method in this case is expected return a rejected Promise first')
      })
      .catch((error) => {
        return expect(error.message).toBe('error: rejected')
      })
    })
    test('when listObject is an Object, all resolved', () => {
      const allResult = []
      for (const [key, item] of Object.entries(listObject)) {
        allResult.push({key: key, message: item.message, debug: false})
      }
      return listProcess({promiseMethod: 'all', listObject: listObject, itemProcessor: itemProcessor, debug: false})
      .then((response) => {
        return expect(response).toMatchObject(allResult)
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
  })
})

// ================================================================================
// REMAINING TYPICAL USE CASES
describe('remaining typical use case methods', () => {
  describe('Promise `allSettled` method', () => {
    test('when listObject is an Array', () => {
      const allSettledResult = []
      for (const [key, item] of Object.entries(listArray)) {
        if (item.delay === -1) {
          allSettledResult.push({
            status: 'rejected',
            reason: new Error(`error: ${item.message}`)
          })
        }
        else {
          allSettledResult.push({
            status: 'fulfilled',
            value: {key: key, message: item.message, debug: false}
          })
        }
      }
      return listProcess({promiseMethod: 'allSettled', listObject: listArray, itemProcessor: itemProcessor, debug: false})
      .then((response) => {
        return expect(response).toMatchObject(allSettledResult)
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
    test('when listObject is an Object', () => {
      const allSettledResult = []
      for (const [key, item] of Object.entries(listObject)) {
        allSettledResult.push({
          status: 'fulfilled',
          value: {key: key, message: item.message, debug: false}})
      }
      return listProcess({promiseMethod: 'allSettled', listObject: listObject, itemProcessor: itemProcessor, debug: false})
      .then((response) => {
        return expect(response).toMatchObject(allSettledResult)
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
  })
  describe('Promise `any` method', () => {
    test('when listObject is an Array', () => {
      return listProcess({promiseMethod: 'any', listObject: listArray, itemProcessor: itemProcessor, debug: false})
      .then((response) => {
        return expect(response).toMatchObject({key: '0', message: listArray[0].message, debug: false})
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
    test('when listObject is an Object', () => {
      return listProcess({promiseMethod: 'any', listObject: listObject, itemProcessor: itemProcessor, debug: false})
      .then((response) => {
        const firstPropertyName = Object.keys(listObject)[0]
        return expect(response).toMatchObject({key: firstPropertyName, message: listObject[firstPropertyName].message, debug: false})
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
  })
  describe('Promise `race` method', () => {
    test('when listObject is an Array', () => {
      return listProcess({promiseMethod: 'race', listObject: listArray, itemProcessor: itemProcessor, debug: false})
      .then((response) => {
        throw new Error('This test failed because the `race` method in this case, should return a rejected Promise first')
      })
      .catch((error) => {
        return expect(error).toEqual(Error('error: rejected'))
      })
    })
    test('when listObject is an Object', () => {
      return listProcess({promiseMethod: 'race', listObject: listObject, itemProcessor: itemProcessor, debug: false})
      .then((response) => {
        const firstPropertyName = Object.keys(listObject)[0]
        return expect(response).toMatchObject({key: firstPropertyName, message: listObject[firstPropertyName].message, debug: false})
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
  })
})
