/**
 * @flow
 */

import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Loader from './Loader'
import * as utils from './utils'
import * as futils from './file-utils'

type PackpressConfig = {
  template: string,
  title?: string
}

export async function buildProject(projectPath: string): Promise<string> {
  const isProjectPath = await utils.isProjectDir(projectPath)

  if (!isProjectPath) throw new Error(`No project found in ${projectPath}`)

  const {template, ...props} = await parseConfig(projectPath)
  const html = await renderHTML(path.resolve(projectPath, template), props)
  const outFile = path.join(projectPath, 'dist', 'index.html')
  return await futils.writeFile(outFile, html)
}

export async function renderHTML(jsxFile: string, props: Object = {}): Promise<string> {
  const loader = await Loader.getInstance()
  const Index = await loader.loadModuleFromFile(jsxFile)
  return ReactDOMServer.renderToStaticMarkup(<Index {...props}/>)
}

export async function parseConfig(projectPath: string): Promise<PackpressConfig> {
  const object = await futils.readJSON(path.join(projectPath, 'packpress.json'))

  if (typeof object.template === 'string') {
    return object
  } else {
    throw new Error('Invalid config: ' + JSON.stringify(object))
  }
}
