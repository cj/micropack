import nodeExternals from 'webpack-node-externals'

export default (options) => {
  return {
    // context: options.projectDir,
    // Webpack can target multiple environments such as `node`,
    // `browser`, and even `electron`. Since Backpack is focused on Node,
    // we set the default target accordingly.
    target: 'node',
    // The benefit of Webpack over just using babel-cli or babel-node
    // command is sourcemap support. Although it slows down compilation,
    // it makes debugging dramatically easier.
    devtool: 'eval-source-map',
    // Webpack allows you to define externals - modules that should not be
    // bundled. When bundling with Webpack for the backend - you usually
    // don't want to bundle its node_modules dependencies. This creates an externals
    // function that ignores node_modules when bundling in Webpack.
    // @see https://github.com/liady/webpack-node-externals
    externals: nodeExternals(),
    node: {
      __filename: false,
      __dirname: false
    },
    output: {
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      publicPath: '/',
      libraryTarget: 'commonjs2'
    }
  }
}
