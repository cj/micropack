import { send }                         from 'micro'
import { resolve }                      from 'path'
import { createReadStream }             from 'fs'
// import qs                   from 'querystring'
import url                              from 'url'
import webpack                          from 'webpack'
import config                           from './config'
import webpackBase                      from '../webpack/base.config'
import loadFakeDir                      from './loadFakeDir'

let fakePaths        = {}
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

// load the fake dir
loadFakeDir(options.fakeDir, fakePaths)

export default async (req, res) => {
  res.status = 200

  const { path } = url.parse(req.url)
  const next     = () => {
    res.setHeader('Content-Type', 'text/html')
    send(res, res.status, createReadStream(resolve('src/index.html')))
  }
  const data = fakePaths[path]

  if (data) {
    let { headers, status, response } = data

    if (!headers || (headers && !headers.contentType)) {
      res.setHeader('Content-Type', 'application/json')
    }

    response = typeof response === 'function' ? response.apply(data, [req, res, next]) : response
    status   = status || res.status

    if (response) {
      send(res, status, response)
    }
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
