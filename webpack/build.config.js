import WebpackMd5Hash    from 'webpack-md5-hash'
import UglifyJsPlugin    from 'webpack/lib/optimize/UglifyJsPlugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default (options) => {
  const { projectDir } = options

  return {
    devtool: 'cheap-module-source-map',
    output: {
      path: `${projectDir}/dist`,
      filename: '[name].[chunkhash].js',
      sourceMapFilename: '[name].[chunkhash].map',
      publicPath: '/'
    },
    plugins: [
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
      }),
      new WebpackMd5Hash(),
      new UglifyJsPlugin({
        mangle: true,
        compress: {
          dead_code: true, // eslint-disable-line camelcase
          screw_ie8: true, // eslint-disable-line camelcase
          unused: true,
          warnings: false
        }
      })
    ]
  }
}
