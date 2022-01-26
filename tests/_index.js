/**
 * COMMON EXPORTS
 * - this is so you can hardlink listProcess.test.js into a mono-repo tests folder
 * - where the `./tests/_index.js` in the mono-repo exports are relative to the mono-repo file locations
 * - you can also use this to easily switch to test a minified release bundle without having to edit all the test files imports
 */

export {consoleMock} from './consoleMock.js'
export {listProcess} from '../src/library/listProcess.js'