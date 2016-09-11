/**
 * @flow
 */

import path from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Loader from './Loader'
import * as project from './project'
import * as utils from './utils'
import * as futils from './file-utils'

type PackpressConfig = {
  template: string;
  title?: string;
};

type BuildingOptions = {
  path?: string;
};

type BlogPost = {
  name: string;
  content: string;
};

const indexPath = path.resolve(__dirname, './template/Index')

export async function buildProject(options: BuildingOptions = {}): Promise<string> {
  const rootDir = options.path || process.cwd()
  const projectPath = await project.getProjectPath(rootDir)

  const {template, ...props} = await parseConfig(projectPath)
  console.log('Found project in', projectPath)

  const templatePath = path.resolve(projectPath, template)
  const loader = await Loader.getInstance()
  const Root = await loader.loadModuleFromFile(templatePath)

  const html = await renderHTML(indexPath, {...props, Root})
  const outFile = path.join(projectPath, 'dist', 'index.html')
  return await futils.writeFile(outFile, html)
}

export async function renderHTML(jsxFile: string, props: Object = {}): Promise<string> {
  const loader = await Loader.getInstance()
  const ReactClass = await loader.loadModuleFromFile(jsxFile)
  return ReactDOMServer.renderToStaticMarkup(<ReactClass {...props}/>)
}

export async function parseConfig(projectPath: string): Promise<PackpressConfig> {
  const object = await futils.readJSON(path.join(projectPath, 'packpress.json'))

  if (typeof object.template === 'string') {
    return object
  } else {
    throw new Error('Invalid config: ' + JSON.stringify(object))
  }
}

export async function getPosts(): Promise<Array<BlogPost>> {
  const projectPath = await project.getProjectPath()
  return []
}
