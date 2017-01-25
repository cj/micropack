export default (options) => {
  const { babelrc, srcDir, projectDir } = options

  const include = [
    srcDir,
    `${projectDir}/node_modules/quasar-framework`,
    `${projectDir}/node_modules/vuex-form`,
    `${projectDir}/node_modules/roboto-fontface`,
    `${projectDir}/node_modules/vue2-google-maps`,
    `${projectDir}/node_modules/material-design-icons`
  ]

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
            ]
          }
        }
      ]
    }
  }
}
