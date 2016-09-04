/**
 * @flow
 */

import path from 'path'
import * as futils from './file-utils'
import * as template from './template'

type ScaffoldingOptions = { overwrite?: boolean }

/**
 * Create a new project at the given path.
 */
export async function createNewProject(projectPath: string, options: ScaffoldingOptions = {}): Promise<Array<string>> {
  const cwd = process.cwd()
  projectPath = path.resolve(cwd, path.normalize(projectPath))

  // Ensure project path is inside current working directory
  if (!projectPath.startsWith(cwd) || projectPath === cwd) {
    throw new Error(`Error: path must be a subdirectory of ${cwd}`)
  }

  // Check if the project path already exists
  const dirExists = await futils.fileExists(projectPath)

  // Delete existing directory if the overwrite option was given
  if (dirExists) {
    if (options.overwrite) {
      try {
        await futils.rmFile(projectPath)
        console.log(`deleted ${projectPath}`)
      } catch (e) {
        throw e
      }
    } else {
      throw new Error(`Error: ${projectPath} already exists.`)
    }
  }

  const files = await template.getTemplateFiles(projectPath)

  return await Promise.all(files.map(file => futils.copyFile(file.src, file.dst)))
}
