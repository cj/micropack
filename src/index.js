import { send }             from 'micro'
import { resolve }          from 'path'
import { createReadStream } from 'fs'
// import qs                   from 'querystring'
import url                  from 'url'
import webpack              from 'webpack'
import config               from './config'
import webpackBase          from '../webpack/base.config'

const options        = config()
const webpackConfig  = options.webpack(webpackBase(options), options)
const compiler       = webpack(webpackConfig)
const webpackHotPath = '/__webpack_hmr'

const webpackDev = require('webpack-dev-middleware')(compiler, {
  noInfo: true, publicPath: webpackConfig.output.publicPath, quiet: true
})

const webpackHot = require('webpack-hot-middleware')(compiler, {
  log: () => {}, path: webpackHotPath, heartbeat: 10 * 1000
})

export default async function run (req, res) {
  const { path } = url.parse(req.url)
  const next     = () => { res.end() }

  switch (path) {
    case '/':
      res.setHeader('Content-Type', 'text/html')
      return send(res, 200, createReadStream(resolve('src/index.html')))
    case webpackHotPath:
      return webpackHot(req, res, next)
    default:
      return webpackDev(req, res, next)
  }
}
