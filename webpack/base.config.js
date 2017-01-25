import webpack     from 'webpack'
import { resolve } from 'path'

// This is the Webpack configuration.
// It is focused on developer experience and fast rebuilds.
export default function (options) {
  const { babelrc, srcDir, projectDir } = options

  const include = [
    srcDir,
    `${projectDir}/node_modules/quasar-framework`,
    `${projectDir}/node_modules/vuex-form`,
    `${projectDir}/node_modules/roboto-fontface`,
    `${projectDir}/node_modules/material-design-icons`
  ]

  return {
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
        // This is the development configuration.
        // It is focused on developer experience and fast rebuilds.
        {
          include,
          test: /\.json$/,
          loader: 'json-loader'
        },
        // Process JS with Babel (transpiles ES6 code into ES5 code).
        {
          include,
          test: /\.(js|jsx)$/,
          loader: 'babel-loader'
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
    plugins: [
      // We define some sensible Webpack flags. One for the Node environment,
      // and one for dev / production. These become global variables. Note if
      // you use something like eslint or standard in your editor, you will
      // want to configure __DEV__ as a global variable accordingly.
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ]
  }
}
