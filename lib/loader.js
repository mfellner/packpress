/**
 * @flow
 */

import vm from 'vm'
import path from 'path'
import webpack from 'webpack'
import thenify from 'thenify'
import MemoryFS from 'memory-fs'
import { fileExists } from './utils'

export function loadModule(source: string): Object {
  const sandbox = {module: {}, exports: {}}
  sandbox.exports = sandbox.module
  const context = vm.createContext(sandbox)
  const script = new vm.Script(source, {
    displayErrors: true
  })
  const result = script.runInContext(context)
  return result.default || result
}

export async function loadFile(filePath: string): Promise<string> {
  const test = await fileExists(filePath)
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
          presets: ['react'],
          plugins: [
            "syntax-async-functions",
            "syntax-flow",
            "transform-async-to-generator",
            "transform-es2015-modules-commonjs",
            "transform-flow-strip-types"          ]
        }
      }]
    }
  })
  compiler.outputFileSystem = fs

  const run = thenify(compiler.run.bind(compiler))
  const stats = await run()
  return fs.readFileSync(path.join(outPath, outFile)).toString()
}

export async function loadModuleFromFile(filePath: string): Promise<Object> {
  const source = await loadFile(filePath)
  return loadModule(source)
}
