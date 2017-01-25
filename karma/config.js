const webpackConfig          = require('../webpack/config')
const { tmpDir, projectDir } = require('../src/config')()

module.exports = karma => {
  let config = {
    frameworks: ['mocha', 'chai', 'sinon'],

    files: [
      `${tmpDir}/karma.entry.js`
    ],

    plugins: [
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-mocha-reporter',
      'karma-chrome-launcher',
      'karma-coverage'
    ],

    preprocessors: {},

    webpack: webpackConfig,

    webpackServer: {
      noInfo: true,
      stats: { chunks: false }
    },

    reporters: [
      (karma.singleRun ? 'mocha' : 'dots'), 'coverage'
    ],

    coverageReporter: {
      dir: `${projectDir}/coverage`,
      subdir: '.',
      reporters: [
        {type: 'lcov'},
        {type: 'text-summary'}
      ]
    },

    logLevel: karma.LOG_INFO,

    autoWatch: true,

    singleRun: false,

    browsers: ['Chrome'],

    nightmareOptions: {
      width: 1920,
      height: 1080,
      show: false
    },

    // Concurrency level
    // how many browser should be started simultaneous
    // concurrency: Infinity
  }

  config.preprocessors[`${tmpDir}/karma.entry.js`] = ['webpack', 'sourcemap']

  karma.set(config)
}
