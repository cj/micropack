const babelrc = require('../babelrc.json')

require('babel-register')({
  presets: babelrc.presets,
  plugins: babelrc.plugins
})

const _merge      = require('lodash/merge')
const webpackBase = require('./base.config')
const webpackNode = require('./node.config')
const webpackVue = require('./vuejs.config')
const config      = require('../src/config')
const options     = config()

let webpackConfig = webpackBase(options)

webpackConfig = _merge(webpackConfig, _merge(webpackNode(options), webpackVue(options)))

webpackConfig.module.loaders = webpackConfig.module.rules
console.log(webpackConfig)

module.exports = webpackConfig
