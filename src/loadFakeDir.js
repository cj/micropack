import glob     from 'glob'
import chokidar from 'chokidar'

export default (fakeDir, fakePaths) => {
  const files = glob.sync('**/*.js', {
    cwd: fakeDir
  })

  files.forEach(fileName => {
    let filePath  = `${fakeDir}/${fileName}`
    let data      = require(filePath)
    let path      = data.path || `/${fileName.replace('.js', '')}`
    data.filePath = filePath

    fakePaths[path] = data
  })

  const updateFakeFile = filePath => {
    let path = filePath.replace(fakeDir, '').replace('.js', '')
    // clear the cache
    delete require.cache[filePath]
    // load new data
    fakePaths[path] = require(filePath)
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

