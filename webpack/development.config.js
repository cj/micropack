import webpack                     from 'webpack'
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import HtmlWebpackPlugin           from 'html-webpack-plugin'
import { resolve }                 from 'path'

export default (options) => {
  return {
    // context: options.projectDir,
    // Webpack can target multiple environments such as `node`,
    // `browser`, and even `electron`. Since Backpack is focused on Node,
    // we set the default target accordingly.
    target: 'web',
    // The benefit of Webpack over just using babel-cli or babel-node
    // command is sourcemap support. Although it slows down compilation,
    // it makes debugging dramatically easier.
    devtool: 'eval-source-map',
    // As of Webpack 2 beta, Webpack provides performance hints.
    // Since we are not targeting a browser, bundle size is not relevant.
    // Additionally, the performance hints clutter up our nice error messages.
    entry: {
      main: ['webpack-hot-middleware/client', resolve(options.main)]
    },
    output: {
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      publicPath: '/'
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
      new webpack.NoEmitOnErrorsPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        hash: false,
        template: `${options.srcDir}/index.html`,
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
      })
    ]
  }
}
