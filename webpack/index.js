import _merge      from 'lodash/merge'
import vuejsConfig from './vuejs.config'

export const vuejs = function (config, options) {
  return _merge(config, vuejsConfig(options))
}
