import glob           from 'glob'
import chokidar       from 'chokidar'
import { existsSync } from 'fs'

export default (fakeDir, router) => {
  const files = glob.sync('**/*.js', { cwd: fakeDir })

  files.forEach(fileName => {
    let filePath = `${fakeDir}/${fileName}`
    let data     = require(filePath)
    let path     = data.path || `/${fileName.replace('.js', '')}`

    data.filePath = filePath

    router.add(path, data)
  })

  const updateFakeFile = filePath => {
    let path = filePath.replace(fakeDir, '').replace('.js', '')

    if (filePath.includes('.js') && existsSync(filePath)) {
      try {
        let oldData = require(filePath)
        // clean routes, so we don't end up with ones you don't want
        router.remove(oldData.path || path)
        // clear the require cache
        delete require.cache[filePath]
        // require new data
        let data = require(filePath)

        router.add(data.path || path, data)
      } catch (error) {
        console.log(error) // eslint-disable-line no-console
      }
    }
  }

  const watcher = chokidar.watch(fakeDir)

  watcher.on('ready', () => {
    watcher
      .on('add', updateFakeFile)
      .on('addDir', updateFakeFile)
      .on('change', updateFakeFile)
      .on('unlink', updateFakeFile)
      .on('unlinkDir', updateFakeFile)
  })
}

