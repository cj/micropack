import { resolve }    from 'path'
import { existsSync } from 'fs'
import lodashMerge    from 'lodash/merge'

import babelrc     from '../../src/babelrc.json'
import baseConfig  from './base.config'
import vuejsConfig from './vuejs.config'

let userOptions = {}

const projectDir = resolve('./')

const defaultOptions = {
  projectDir,
  babelrc,
  webpack: (config) => { return config }
}

const optionsPath = resolve('micropack.config.js')

if (existsSync(optionsPath)) {
  userOptions = require(optionsPath)
}

export const options = lodashMerge(defaultOptions, userOptions)

export const base = baseConfig(options)

export const vuejs = function (config, options) {
  return lodashMerge(config, vuejsConfig(options))
}

export default base
