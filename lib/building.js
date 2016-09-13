/**
 * @flow
 */

import path from 'path'
import fs from 'mz/fs'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Loader from './Loader'
import * as project from './project'
import * as render from './render'
import * as utils from './utils'
import * as futils from './file-utils'

type PackpressConfig = {
  template: string;
  dynamic?: boolean;
  title?: string;
};

type BuildingOptions = {
  path?: string;
};

type BlogPost = {
  name: string;
  html: string;
};

const DIST_DIR = 'dist'
const POSTS_SRC_DIR = 'posts'
const POSTS_DST_DIR = path.join(DIST_DIR, POSTS_SRC_DIR)

const indexPath = path.resolve(__dirname, './template/Index')

export async function buildProject(options: BuildingOptions = {}): Promise<string> {
  const rootDir = options.path || process.cwd()
  const projectPath = await project.getProjectPath(rootDir)

  const {template, dynamic, ...props} = await parseConfig(projectPath)
  console.log('Found project in', projectPath)

  const templatePath = path.resolve(projectPath, template)
  const loader = await Loader.getInstance()
  const Root = await loader.loadModuleFromFile(templatePath)

  // Write blog posts HTML
  const posts = await loadPosts()
  const postFiles = await Promise.all(posts.map(post =>
    futils.writeFile(path.join(projectPath, POSTS_DST_DIR, post.name) + '.html', post.html)
  ))

  // Write index.html
  const indexHTML = await renderHTML(indexPath, {...props, posts, Root}, dynamic)
  const indexHTMLFile = path.join(projectPath, DIST_DIR, 'index.html')
  return await futils.writeFile(indexHTMLFile, indexHTML)
}

export async function renderHTML(jsxFile: string, props: Object = {}, dynamic: boolean = false): Promise<string> {
  const loader = await Loader.getInstance()
  const ReactClass = await loader.loadModuleFromFile(jsxFile)
  if (dynamic)
    return ReactDOMServer.renderToString(<ReactClass {...props}/>)
  else
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

export async function loadPosts(): Promise<Array<BlogPost>> {
  const projectPath = await project.getProjectPath()
  const postsSrcPath = path.join(projectPath, POSTS_SRC_DIR)
  const postFiles = await futils.findFiles(postsSrcPath, ['md'])

  return await Promise.all(postFiles.map(async (file) => {
    const buffer = await fs.readFile(file)
    const html = render.renderMarkdown(buffer.toString())
    const name = path.basename(file, '.md')
    return {name, html}
  }))
}
