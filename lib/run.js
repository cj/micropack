import { json, send } from 'micro'
import qs             from 'querystring'
import url            from 'url'
import loadFakeDir    from './loadFakeDir'
import Router         from './router'
import webpack        from 'webpack'

export default options => {
  let webpackConfig
  let compiler
  let webpackHotPath
  let webpackDev
  let webpackHot

  const router  = new Router()

  if (!options.args['fake-only']) {
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

    let data = router.run(path)

    if (data) {
      if (typeof data === 'function') {
        data = data(options)
      }

      let { headers, status, response } = data

      response = data[method] || data[method.toLowerCase()] || response

      if (!response) {
        return next()
      }

      if (!headers || (headers && !headers.contentType)) {
        res.setHeader('Content-Type', 'application/json')
      }

      try {
        req.data = await json(req)
      } catch (e) {
        req.data = {}
      }
      req.query  = qs.parse(url.parse(req.url).query)
      req.params = data.params

      response = typeof response === 'function' ? response.apply(data, [req, res, next]) : response
      status   = status || res.status

      if (response) {
        send(res, status, response)
      }
    } else if (!options.args['fake-only']) {
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
