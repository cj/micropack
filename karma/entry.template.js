var exclude = [
  './entry.js'
]

var context = require.context('{{ srcDir }}', true, /\.js$/)

context.keys().forEach(function (key) {
  if (exclude.indexOf(key) === -1) context(key)
})
