export default {
  input: './src/index.js',
  output: [{
      file: './dist/bundle/index.js',
      format: 'cjs'
  }, {
      file: './dist/bundle/index.mjs',
      format: 'es'
  }, {
      file: './dist/bundle/module.js',
      format: 'es'
  }, {
      file: './dist/bundle/parser.js',
      format: 'iife',
      name: 'ForAwait'
  }]
};