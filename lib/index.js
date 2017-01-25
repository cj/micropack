import { send }             from 'micro'
// import qs                   from 'querystring'
import url                  from 'url'
import config               from './config'
import loadFakeDir          from './loadFakeDir'
import Router               from './router'
import webpack              from 'webpack'

export default args => {
  let webpackConfig
  let compiler
  let webpackHotPath
  let webpackDev
  let webpackHot

  const router  = new Router()
  const options = config({ args })

  if (!args['fake-only']) {
    webpackConfig  = require('../webpack/config')
    compiler       = webpack(webpackConfig)
    webpackHotPath = '/__webpack_hmr'

    webpackDev = require('webpack-dev-middleware')(compiler, {
      noInfo: true, publicPath: webpackConfig.output.publicPath, quiet: true
    })

    webpackHot = require('webpack-hot-middleware')(compiler, {
      log: () => {}, path: webpackHotPath, heartbeat: 10 * 1000
    })
  }

  // load the fake dir
  loadFakeDir(options.fakeDir, router)

  return async (req, res) => {
    res.status = 200

    const { path } = url.parse(req.url)
    const method   = req.method
    const next     = () => {
      webpackDev(req, res, () => {
        // if the file doesn't exist in webpack, load index.html
        req.url = '/'
        webpackDev(req, res)
      })
    }
    const data = router.run(path)

    if (data) {
      let { headers, status, response } = data

      if (!headers || (headers && !headers.contentType)) {
        res.setHeader('Content-Type', 'application/json')
      }

      if (data[method]) { response = data[method] }

      response = typeof response === 'function' ? response.apply(data, [req, res, next]) : response
      status   = status || res.status

      if (response) {
        send(res, status, response)
      }
    } else if (!args['fake-only']) {
      switch (path) {
        case '/favicon.ico':
          return send(res, res.status)
        case webpackHotPath:
          return webpackHot(req, res, next)
        default:
          return next()
      }
    }
  }
}
