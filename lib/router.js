// TODO: turn this into it's own npm lib

const pathToRegexp = function (path, keys, sensitive, strict) {
  if (path instanceof RegExp) return path
  if (path instanceof Array) path = '(' + path.join('|') + ')'
  path = path
    .concat(strict ? '' : '/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/\+/g, '__plus__')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function (_, slash, format, key, capture, optional) {
      keys.push({ name: key, optional: !!optional })
      slash = slash || ''
      return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '')
    })
    .replace(/([/.])/g, '\\$1')
    .replace(/__plus__/g, '(.+)')
    .replace(/\*/g, '(.*)')
  return new RegExp('^' + path + '$', sensitive ? '' : 'i')
}

class RouterRoute {
  constructor (path) {
    this.path = path
    this.keys = []
    // this.fns  = []
    this.params = {}
    this.regex = pathToRegexp(this.path, this.keys, false, false)
  }

  match (path, params) {
    let m = this.regex.exec(path)

    if (!m) return false

    for (let i = 1, len = m.length; i < len; ++i) {
      let key = this.keys[i - 1]

      let val = (typeof m[i] === 'string') ? decodeURIComponent(m[i]) : m[i]

      if (key) {
        this.params[key.name] = val
      }
      params.push(val)
    }

    return true
  }

  run (params) {
    // let data
    //
    // this.fns.some(fn => {
    //   if (typeof params === 'function') {
    //     fn.apply(this, params)
    //   } else {
    //     fn.params = params
    //     return data = fn
    //   }
    // })
    //
    // return data
    if (typeof this.func === 'function') {
      this.func.apply(this, params)
    } else {
      return {...this.func, params}
    }
  }
}

export default class Router {
  constructor () {
    this.routes = {}
  }

  add (path, func) {
    let route = this.routes[path] || (this.routes[path] = new RouterRoute(path))
    route.func = func
  }

  remove (path) {
    delete this.routes[path]
  }

  run (path) {
    let routes = Object.entries(this.routes)

    for (let [, route] of routes) {
      let params = []

      if (route.match(path, params)) {
        return route.run(params)
      }
    }
  }
}
