import webpack            from 'webpack'
import { resolve }        from 'path'
import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin'

// This is the Webpack configuration.
// It is focused on developer experience and fast rebuilds.
export default function (options) {
  const { babelrc, include } = options

  let config = {
    performance: {
      hints: false
    },
    // Since we are wrapping our own webpack config, we need to properly resolve
    // Backpack's and the given user's node_modules without conflict.
    resolve: {
      extensions: ['.js', '.json', '.html'],
      alias: {
        '~': options.srcDir
      },
      modules: [
        options.projectNodeModules,
        options.microPackNodeModules,
        options.srcDir
      ]
    },
    resolveLoader: {
      modules: [
        options.projectNodeModules,
        options.microPackNodeModules
      ]
    },
    entry: {
      main: [resolve(options.main)]
    },
    // Define a few default Webpack loaders. Notice the use of the new
    // Webpack 2 configuration: module.rules instead of module.loaders
    module: {
      rules: [
        // Process JS with Babel (transpiles ES6 code into ES5 code).
        {
          include,
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          query: {
            presets: babelrc.presets,
            plugins: babelrc.plugins,
            env: babelrc.env
          }
        },
        // This is the development configuration.
        // It is focused on developer experience and fast rebuilds.
        {
          include,
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          include,
          test: /.*\.(gif|png|jpe?g|svg)$/i,
          loaders: [
            'file-loader?name=assets/[name].[ext]',
            {
              loader: 'image-webpack-loader',
              query: {
                progressive: true,
                optimizationLevel: 7,
                interlaced: false,
                mozjpeg: {
                  quality: 65
                },
                pngquant:{
                  quality: '65-90',
                  speed: 4
                },
                svgo:{
                  plugins: [
                    {
                      removeViewBox: false
                    },
                    {
                      removeEmptyAttrs: false
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          include,
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name].[ext]'
          }
        }
      ]
    },
    plugins: []
  }

  let envs = {}

  if (options.env) {
    options.env.forEach(name => {
      envs[`process.env.${name}`] = JSON.stringify(process.env[name])
    })
  }

  config.plugins.push(new webpack.DefinePlugin(envs))

  if (options.vendor.length) {
    config.entry.vendor = options.vendor

    if (process.env.NODE_ENV !== 'test') {
      config.plugins.push(new CommonsChunkPlugin({ name: 'vendor' }))
    }
  }

  return config
}
