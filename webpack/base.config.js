import webpack                     from 'webpack'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import { resolve }                 from 'path'

// This is the Webpack configuration.
// It is focused on developer experience and fast rebuilds.
export default function (options) {
  const { babelrc } = options

  let entryMain = [resolve(options.main)]

  if (process.env.NODE_ENV === 'development') {
    entryMain = [...entryMain, 'webpack-hot-middleware/client']
  }

  return {
    // Webpack can target multiple environments such as `node`,
    // `browser`, and even `electron`. Since Backpack is focused on Node,
    // we set the default target accordingly.
    target: 'web',
    // The benefit of Webpack over just using babel-cli or babel-node
    // command is sourcemap support. Although it slows down compilation,
    // it makes debugging dramatically easier.
    devtool: 'source-map',
    // As of Webpack 2 beta, Webpack provides performance hints.
    // Since we are not targeting a browser, bundle size is not relevant.
    // Additionally, the performance hints clutter up our nice error messages.
    performance: {
      hints: false
    },
    // Since we are wrapping our own webpack config, we need to properly resolve
    // Backpack's and the given user's node_modules without conflict.
    resolve: {
      extensions: ['.js', '.json'],
      modules: [options.projectNodeModules, options.microPackNodeModules]
    },
    resolveLoader: {
      modules: [options.projectNodeModules, options.microPackNodeModules]
    },
    entry: {
      main: entryMain
    },
    // This sets the default output file path, name, and compile target
    // module type. Since we are focused on Node.js, the libraryTarget
    // is set to CommonJS2
    output: {
      path: resolve('dist'),
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      publicPath: '/'
    },
    // Define a few default Webpack loaders. Notice the use of the new
    // Webpack 2 configuration: module.rules instead of module.loaders
    module: {
      rules: [
        // This is the development configuration.
        // It is focused on developer experience and fast rebuilds.
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        // Process JS with Babel (transpiles ES6 code into ES5 code).
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: [
            /node_modules/
          ],
          query: {
            presets: babelrc.presets,
            plugins: babelrc.plugins
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
      }),
      // The FriendlyErrorsWebpackPlugin (when combined with source-maps)
      // gives Backpack its human-readable error messages.
      new FriendlyErrorsWebpackPlugin(),
      // This plugin is awkwardly named. Use to be called NoErrorsPlugin.
      // It does not actually swallow errors. Instead, it just prevents
      // Webpack from printing out compile time stats to the console.
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]
  }
}
