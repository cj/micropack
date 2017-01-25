export default (options) => {
  const { babelrc, include } = options

  return {
    module: {
      rules: [
        {
          include,
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            postcss: [
              require('autoprefixer')({
                browsers: ['last 3 versions']
              })
            ],
            loaders: {
              js:  `babel-loader?presets[]=${babelrc.presets.join('&presets[]=')}&plugins[]=${babelrc.plugins.join('&plugins[]=')}`
            }
          }
        }
      ]
    }
  }
}
