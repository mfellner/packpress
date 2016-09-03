/**
 * @flow
 */

import fs from 'mz/fs'
import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import thenify from 'thenify'
import Loader from './Loader'
import * as utils from './utils'
import * as config from './config'

const mkdirp = thenify(require('mkdirp'))

export async function buildProject(projectPath: string): Promise<string> {
  const indexFile = path.resolve(projectPath, 'index.js')
  const isProjectPath = await utils.fileExists(indexFile)

  if (!isProjectPath) throw new Error(`No project found in ${projectPath}`)

  const html = await renderHTML(indexFile)
  const outFile = path.join(projectPath, 'dist', 'index.html')
  await mkdirp(path.dirname(outFile))
  return await fs.writeFile(outFile, html)
}

export async function renderHTML(jsxFile: string, props: Object = {}): Promise<string> {
  const loader = await Loader.getInstance()
  const Index = await loader.loadModuleFromFile(jsxFile)
  return ReactDOMServer.renderToStaticMarkup(<Index {...props}/>)
}
