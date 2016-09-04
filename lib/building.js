/**
 * @flow
 */

import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Loader from './Loader'
import * as futils from './file-utils'

export async function buildProject(projectPath: string): Promise<string> {
  const indexFile = path.resolve(projectPath, 'index.js')
  const isProjectPath = await futils.fileExists(indexFile)

  if (!isProjectPath) throw new Error(`No project found in ${projectPath}`)

  const html = await renderHTML(indexFile)
  const outFile = path.join(projectPath, 'dist', 'index.html')
  return await futils.writeFile(outFile, html)
}

export async function renderHTML(jsxFile: string, props: Object = {}): Promise<string> {
  const loader = await Loader.getInstance()
  const Index = await loader.loadModuleFromFile(jsxFile)
  return ReactDOMServer.renderToStaticMarkup(<Index {...props}/>)
}
