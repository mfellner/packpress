/**
 * @flow
 */

import path from 'path'
import webpack from 'webpack'
import thenify from 'thenify'
import MemoryFS from 'memory-fs'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { fileExists } from './utils'
import { loadModuleFromFile } from './loader'

const entry = path.resolve(__dirname, 'main.js')

export async function buildProject(projectPath: string): Promise<string> {
  const indexFile = path.resolve(projectPath, 'index.js')
  const isProjectPath = await fileExists(indexFile)

  if (!isProjectPath) throw new Error(`No project found in ${projectPath}`)

  const compiler = webpack({
    entry,
    output: {
      filename: 'main.min.js',
      path: path.join(projectPath, 'dist')
    }
  })

  const run = thenify(compiler.run.bind(compiler))
  const stats = await run()

  return stats.toString({
    hash: false,
    version: false,
    chunks: false
  })
}

export async function renderHTML(jsxFile: string, props: Object = {}): Promise<string> {
  const Index = await loadModuleFromFile(jsxFile)
  return ReactDOMServer.renderToStaticMarkup(<Index {...props}/>)
}
