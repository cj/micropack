import { resolve }    from 'path'
import { existsSync } from 'fs'
import _merge         from 'lodash/merge'
import babelrc        from '../.babelrc.json'

const projectDir           = resolve('./')
const srcDir               = `${projectDir}/src`
const projectNodeModules   = `${projectDir}/node_modules`
const microPackNodeModules = resolve(__dirname, '../node_modules')
const dataDir              = `${projectDir}/data`

const defaultOptions = {
  projectDir,
  srcDir,
  dataDir,
  babelrc,
  projectNodeModules,
  microPackNodeModules,
  main: 'src/entry.js',
  webpack: (config) => { return config }
}

export default (overrideOptions = {}) => {
  let userOptions

  const options     = _merge(defaultOptions, overrideOptions)
  const optionsPath = resolve('micropack.config.js')

  if (existsSync(optionsPath)) {
    userOptions = require(optionsPath)
  }

  return _merge(options, userOptions)
}
