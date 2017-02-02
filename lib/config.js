import { resolve }    from 'path'
import { existsSync } from 'fs'
import deepMerge      from 'n-deep-merge'
import babelrc        from '../babelrc.json'

const projectDir           = resolve('./')
const microPackDir         = resolve(__dirname, '../')
const srcDir               = `${projectDir}/src`
const packageJson          = `${projectDir}/package.json`
const projectNodeModules   = `${projectDir}/node_modules`
const fakeDir              = `${projectDir}/fake`
const microPackNodeModules = `${microPackDir}/node_modules`
const tmpDir               = `${projectNodeModules}/.micropack`

const defaultOptions = {
  projectDir,
  srcDir,
  packageJson,
  fakeDir,
  babelrc,
  microPackDir,
  projectNodeModules,
  microPackNodeModules,
  tmpDir,
  include: [srcDir],
  env: ['NODE_ENV'],
  config: [process.env.NODE_ENV],
  vendor: [],
  main: 'src/entry.js',
  webpack: (config) => { return config }
}

export default (overrideOptions = {}) => {
  let options       = deepMerge(defaultOptions, overrideOptions)
  const optionsPath = resolve('micropack.config.js')
  const packageJson = require(options.packageJson)

  if (existsSync(optionsPath)) {
    options = deepMerge(options, require(optionsPath))
  }

  if (packageJson.micropack) {
    options = deepMerge(options, packageJson.micropack)
  }

  options.include = options.include.map(folder => {
    if (folder !== srcDir) {
      return `${projectDir}/${folder}`
    } else {
      return folder
    }
  })

  return deepMerge(options, options)
}
