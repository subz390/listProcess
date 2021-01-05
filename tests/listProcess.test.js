import {listProcess} from '../src/listProcess.js'
// import {consoleMock} from './jestHelpers'


// ================================================================================
// GLOBAL TEST VALUES
// const randomString = getChar(6, 'abcdefghijklmnopqrstuvwxyz')
// const randomHex = getChar(1, 'abcdef') + getChar(5, 'abcdef0123456789')
// const randomId = `#${randomHex}`
const listArray = [
  {delay: 100, message: '100ms'},
  {delay: 200, message: '200ms'},
  {delay: 300, message: '300ms'}
]
const listObject = {
  first: {delay: 100, message: '100ms'},
  second: {delay: 200, message: '200ms'},
  third: {delay: 300, message: '300ms'}
}
function itemProcessor(resolve, reject, key, item, debug) {
  debug && console.log(key, item)
  // return reject(new Error(`some error: ${key}`))
  // what you return resolve here gets passed to listProcess().then({key, debug, message})
  // if `promiseMethod: 'all'` .then(resultArray) is an array of returned resolves from each of the above
  setTimeout(() => {return resolve({key: key, message: item.message, debug: debug})}, item.delay)
}

// ================================================================================
// TEST PARAMETER VALIDATION METHODS
describe('parameter validation', () => {
  describe('listProcess should reject', () => {
    test('when no parameters passed', () => {
      return listProcess() .catch((error) => {
        // this is the first of all the checks to fail when no parameters passed
        // we don't get a TypeError: Cannot read property 'promiseMethod' of undefined
        // because of the = {} in the destructure, it gives an empty object when none passed
        // which in turn allows our defaults to be created
        // and our default for itemProcessor is undefined to throw the following Error
        expect(error).toEqual(Error('itemProcessor should be a function'))
      })
    })
  })
  describe('itemProcessor should reject', () => {
    test('when undefined', () => {
      return listProcess({promiseMethod: 'all', listObject: listObject})
      .catch((error) => {
        expect(error).toEqual(Error('itemProcessor should be a function'))
      })
    })
    test('when not a function', () => {
      return listProcess({promiseMethod: 'all', listObject: listObject, itemProcessor: ''})
      .catch((error) => {
        expect(error).toEqual(Error('itemProcessor should be a function'))
      })
    })
  })
  describe('listObject should reject', () => {
    test('when undefined and default null', () => {
      return listProcess({promiseMethod: 'all', itemProcessor: itemProcessor})
      .catch((error) => {
        expect(error).toEqual(Error('listObject cannot be empty'))
      })
    })
    test('an empty Array', () => {
      return listProcess({promiseMethod: 'all', listObject: [], itemProcessor: itemProcessor})
      .catch((error) => {
        expect(error).toEqual(Error('listObject cannot be empty'))
      })
    })
    test('an empty Object', () => {
      return listProcess({promiseMethod: 'all', listObject: {}, itemProcessor: itemProcessor})
      .catch((error) => {
        expect(error).toEqual(Error('listObject cannot be empty'))
      })
    })
  })
  describe('promiseMethod should reject', () => {
    test('when empty string', () => {
      return listProcess({promiseMethod: '', listObject: listArray, itemProcessor: itemProcessor})
      .catch((error) => {
        expect(error).toEqual(Error('unrecognised promiseMethod'))
      })
    })
    test('when not `all, allSettled, any, race`', () => {
      return listProcess({promiseMethod: 'garbage', listObject: listArray, itemProcessor: itemProcessor})
      .catch((error) => {
        expect(error).toEqual(Error('unrecognised promiseMethod'))
      })
    })
  })
})

// ================================================================================
// TESTS FOR 100% COVERAGE
// npm jest --coverage
// then open /coverage/lcov-report/index.html with Live server in VScode

// Test either side of if statements, even when typical use invokes the one side
// Test calling debug statements
describe('minimum for 100% coverage', () => {
  describe('Promise all method', () => {
    test('when listObject is an Array', () => {
      return listProcess({promiseMethod: 'all', listObject: listArray, itemProcessor: itemProcessor, debug: false})
      .then((response) => {
        return expect(response).toMatchObject([{debug: false, key: '0', message: '100ms'}, {debug: false, key: '1', message: '200ms'}, {debug: false, key: '2', message: '300ms'}])
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
    test('when listObject is an Object', () => {
      return listProcess({promiseMethod: 'all', listObject: listObject, itemProcessor: itemProcessor, debug: false})
      .then((response) => {
        expect(response).toEqual([{debug: false, key: 'first', message: '100ms'}, {debug: false, key: 'second', message: '200ms'}, {debug: false, key: 'third', message: '300ms'}])
      })
      .catch((error) => {return expect(error).toBe(undefined)})
    })
  })
})


// ================================================================================
// TYPICAL USE CASE TESTS
// describe('debug options object', () => {
//   test('boolean true', () => {
//     expect(listProcess({debug: true})).toEqual({debug: true})
//   })
//   test('boolean false', () => {
//     expect(listProcess({debug: false})).toEqual({debug: false})
//   })
//   test('string', () => {
//     expect(listProcess({debug: 'jest >'})).toEqual({debug: 'jest > styleGuide:'})
//   })
// })
