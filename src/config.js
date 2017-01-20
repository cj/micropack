import { resolve }    from 'path'
import { existsSync } from 'fs'
import _merge         from 'lodash/merge'
import babelrc        from '../babelrc.json'

const projectDir           = resolve('./')
const microPackDir         = resolve(__dirname, '../')
const srcDir               = `${projectDir}/src`
const projectNodeModules   = `${projectDir}/node_modules`
const fakeDir              = `${projectDir}/fake`
const microPackNodeModules = `${microPackDir}/node_modules`
const tmpDir               = `${projectNodeModules}/.micropack`

const defaultOptions = {
  projectDir,
  srcDir,
  fakeDir,
  babelrc,
  microPackDir,
  projectNodeModules,
  microPackNodeModules,
  tmpDir,
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
