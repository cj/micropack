const babelrc = require('../babelrc.json')

require('babel-register')({
  presets: babelrc.presets,
  plugins: babelrc.plugins
})

const deepMerge   = require('n-deep-merge')
const webpackBase = require('./base.config')
const webpackNode = require('./node.config')
const webpackVue  = require('./vuejs.config')
const config      = require('../lib/config')
const options     = config()

let webpackConfig = webpackBase(options)

webpackConfig = deepMerge(webpackConfig, deepMerge(webpackNode(options), webpackVue(options)))

webpackConfig.module.loaders = webpackConfig.module.rules

module.exports = webpackConfig
