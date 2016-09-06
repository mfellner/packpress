/**
 * @flow
 */

import vm from 'vm'
import path from 'path'
import webpack from 'webpack'
import thenify from 'thenify'
import MemoryFS from 'memory-fs'
import * as utils from './utils'
import * as futils from './file-utils'
import * as config from './config'

type LoaderOptions = {
  babelPresets: Array<string>;
  babelPlugins: Array<string>;
};

async function _getLoader(): Promise<Loader> {
  return new Loader({
    babelPresets: await config.getBabelPresets(),
    babelPlugins: await config.getBabelPlugins()
  })
}

const getLoader = utils.memoize(_getLoader)

export default class Loader {
  babelPresets: Array<string>;
  babelPlugins: Array<string>;

  constructor(options: LoaderOptions) {
    this.babelPresets = options.babelPresets
    this.babelPlugins = options.babelPlugins
  }

  static getInstance(): Promise<Loader> {
    return getLoader()
  }

  loadModule(source: string): Object {
    const sandbox = {module: {}, exports: {}}
    sandbox.exports = sandbox.module
    const context = vm.createContext(sandbox)
    const script = new vm.Script(source, {
      displayErrors: true
    })
    const result = script.runInContext(context)
    return result.default || result
  }

  async loadFile(filePath: string): Promise<string> {
    const test = await futils.fileExists(filePath)
    if (!test) throw new Error(`No such file ${filePath}`)
    if (!path.extname(filePath) === '.js') throw new Error(`Invalid file ${filePath}`)

    const fs = new MemoryFS()
    const outFile = 'index.js'
    const outPath = '/'

    const compiler = webpack({
      entry: filePath,
      output: {
        filename: outFile,
        path: outPath
      },
      module: {
        loaders: [{
          test: /\.js?$/, exclude: /node_modules/, loader: 'babel', query: {
            presets: this.babelPresets,
            plugins: this.babelPlugins
          }
        }]
      }
    })
    compiler.outputFileSystem = fs

    const run = thenify(compiler.run.bind(compiler))
    const stats = await run()
    return fs.readFileSync(path.join(outPath, outFile)).toString()
  }

  async loadModuleFromFile(filePath: string): Promise<Object> {
    if (!path.extname(filePath)) filePath += '.js'
    const source = await this.loadFile(filePath)
    return this.loadModule(source)
  }
}
