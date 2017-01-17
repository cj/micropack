import _merge      from 'lodash/merge'
import config      from '../src/config'
import baseConfig  from './base.config'
import vuejsConfig from './vuejs.config'

export const base = baseConfig(config())

export const vuejs = function (config, options) {
  return _merge(config, vuejsConfig(options))
}

export default base
