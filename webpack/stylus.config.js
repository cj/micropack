export default (options) => {
  const { include } = options

  return {
    module: {
      rules: [
        {
          include,
          test: /\.styl/,
          loader: 'style-loader!css-loader!stylus-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.styl']
    }
  }
}
