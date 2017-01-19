import webpackBase from './base.config'
import config      from '../src/config'

const options = config()

export default options.webpack(webpackBase(options), options)
