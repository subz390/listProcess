// why is this a .cjs file?  because there's no "type"="module" in package.json
// https://stackoverflow.com/questions/61146112/error-while-loading-config-you-appear-to-be-using-a-native-ecmascript-module-c
module.exports = {
  presets: [[
    '@babel/preset-env', {
      targets: {
        node: 'current',
        esmodules: true, // https://babeljs.io/docs/en/babel-preset-env#targetsesmodules
      },
      corejs: {
        version: 3.8,
        proposals: true
      },
      useBuiltIns: 'entry' // https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#usebuiltins-entry-with-corejs-3
    }
  ]]
}
