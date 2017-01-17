import { send }                         from 'micro'
import { resolve }                      from 'path'
import { createReadStream, existsSync } from 'fs'
import requireDir                       from 'require-dir'
// import qs                   from 'querystring'
import url                              from 'url'
import webpack                          from 'webpack'
import config                           from './config'
import webpackBase                      from '../webpack/base.config'

let paths            = {}
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

if (existsSync(options.dataDir)) {
  const dataDir = requireDir(options.dataDir)

  for (let [name, data] of Object.entries(dataDir)) {
    paths[data.path || `/${name}`] = data
  }
}

export default async (req, res) => {
  res.status = 200

  const { path } = url.parse(req.url)
  const next     = () => {
    res.setHeader('Content-Type', 'text/html')
    send(res, res.status, createReadStream(resolve('src/index.html')))
  }
  const data = paths[path]

  if (data) {
    let { headers, status, response } = data

    if (!headers || (headers && !headers.contentType)) {
      res.setHeader('Content-Type', 'application/json')
    }

    response = typeof response === 'function' ? response(req, res, data) : response
    status   = status || res.status

    return send(res, status, response)
  } else {
    switch (path) {
      case '/':
        return next()
      case '/favicon.ico':
        return send(res, res.status)
      case webpackHotPath:
        return webpackHot(req, res, next)
      default:
        return webpackDev(req, res, next)
    }
  }
}
