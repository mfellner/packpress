/**
 * @flow
 */

import fs from 'mz/fs'
import path from 'path'
import thenify from 'thenify'

import * as template from './template'

const mkdirp = thenify(require('mkdirp'))
const rimraf = thenify(require('rimraf'))

/**
 * Create a new project at the given path.
 */
export async function createNewProject(projectPath: string, options: Object = {}): Promise<Array<string>> {
  const cwd = process.cwd()
  projectPath = path.resolve(cwd, path.normalize(projectPath))

  // Ensure project path is inside current working directory
  if (!projectPath.startsWith(cwd) || projectPath === cwd) {
    throw new Error(`Error: path must be a subdirectory of ${cwd}`)
  }

  // Check if the project path already exists
  let dirExists
  try {
    const stats = await fs.stat(projectPath)
    dirExists = true
  } catch (e) {
    if (e.code === 'ENOENT') dirExists = false
    else throw e
  }

  // Delete existing directory if the overwrite option was given
  if (dirExists) {
    if (options.overwrite) {
      try {
        await rimraf(projectPath)
        console.log(`deleted ${projectPath}`)
      } catch (e) {
        throw e
      }
    } else {
      throw new Error(`Error: ${projectPath} already exists.`)
    }
  }

  const files = await template.getTemplateFiles(projectPath)

  return Promise.all(files.map(async function(file) {
    await mkdirp(path.dirname(file.dst))
    return fs.createReadStream(file.src).pipe(fs.createWriteStream(file.dst)).path
  }))
}
