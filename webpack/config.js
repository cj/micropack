import webpackBase    from './base.config'
import config         from '../lib/config'
import deepMerge      from 'n-deep-merge'
import { resolve }    from 'path'
import { existsSync } from 'fs'

const options     = config()
let webpackConfig = webpackBase(options)

options.config.forEach(name => {
  let configFile = resolve(__dirname, `./${name}.config.js`)

  if (existsSync(configFile)) {
    let configFunc = require(configFile)
    let newConfig  = configFunc(options)

    webpackConfig = deepMerge(webpackConfig, newConfig)
  }
})

export default options.webpack(webpackConfig, options)
