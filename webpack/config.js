import webpackBase from './base.config'
import config      from '../lib/config'
import deepMerge   from 'n-deep-merge'

const options     = config()
let webpackConfig = webpackBase(options)

options.config.forEach(name => {
  let configFunc = require(`./${name}.config`)
  let newConfig  = configFunc(options)

  webpackConfig = deepMerge(webpackConfig, newConfig)
})

export default options.webpack(webpackConfig, options)
