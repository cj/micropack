import _merge      from 'lodash/merge'
import vuejsConfig from './vuejs.config'
import developmentConfig from './development.config'

export const vuejs = function (config, options) {
  return _merge(config, vuejsConfig(options))
}

export const development = function (config, options) {
  return _merge(config, developmentConfig(options))
}
