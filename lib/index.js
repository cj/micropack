import config from './config'

export default args => {
  const options = config({ args })

  return {
    run () {
      const serve          = require('micro')
      const run            = require('../lib/run')
      const { port, host } = args

      serve(run(options)).listen(port, host, err => {
        if (err) {
          console.error('micro:', err.stack) // eslint-disable-line no-console
          process.exit(1)
        }
        console.log(`> Ready! Listening on http://${host}:${port}`) // eslint-disable-line no-console
      })
    },

    build () {
      const deepMerge     = require('n-deep-merge')
      const webpack       = require('webpack')
      const webpackConfig = require('../webpack/config')
      const buildConfig   = require('../webpack/build.config')
      const compiler      = webpack(
        deepMerge(webpackConfig, buildConfig(options))
      )

      compiler.run(() => undefined)
    },

    karma () {
      delete process.argv.splice(2, 1)
      const cli            = require('karma/lib/cli')

      if (process.argv.includes('start') && !args.help) {
        const _template                         = require('lodash/template')
        const { tmpDir, srcDir,  microPackDir } = require('../lib/config')()
        const entryFile                         = `${tmpDir}/karma.entry.js`

        // make sure we use the micropack karma config
        process.argv.splice(3, 0, `${microPackDir}/karma/config.js`)

        const { existsSync, mkdirSync, writeFileSync, readFileSync } = require('fs')

        if (!existsSync(tmpDir)) {
          mkdirSync(tmpDir)
        }

        const entryTemplate     = readFileSync(`${microPackDir}/karma/entry.template.js`, 'utf8')
        const entryFileCompiled = _template(entryTemplate, { interpolate: /{{([\s\S]+?)}}/g })({
          srcDir
        })

        writeFileSync(entryFile, entryFileCompiled, 'utf8')
      }

      if (args.micro) { run() }
      cli.run()
    }
  }
}
