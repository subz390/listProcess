// why is this a .cjs file?
// so you can run asynchronous Promise tests
// https://stackoverflow.com/questions/61146112/error-while-loading-config-you-appear-to-be-using-a-native-ecmascript-module-c
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          esmodules: true, // https://babeljs.io/docs/en/babel-preset-env#targetsesmodules
        },
      },
    ],
  ],
}
