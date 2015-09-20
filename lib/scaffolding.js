import fs from 'mz/fs'
import path from 'path'
import thenify from 'thenify'

const mkdirp = thenify(require('mkdirp'))
const rimraf = thenify(require('rimraf'))

export async function createNewProject(dirPath, options = {}) {
  const cwd = process.cwd()
  dirPath = path.resolve(cwd, path.normalize(dirPath))

  // Ensure project path is inside current working directory
  if (!dirPath.startsWith(cwd) || dirPath === cwd) {
    throw new Error(`Error: path must be a subdirectory of ${cwd}`)
  }

  // Check if the project path already exists
  try {
    let dirExists = true
    const stats = await fs.stat(dirPath)
  } catch (e) {
    if (e.code === 'ENOENT') dirExists = false
    else throw e
  }

  // Delete existing directory if the overwrite option was given
  if (dirExists) {
    if (options.overwrite) {
      try {
        await rimraf(dirPath)
      } catch (e) {
        throw e
      }
    } else {
      throw new Error(`Error: ${dirPath} already exists.`)
    }
  }

  // Create the project path
  try {
    return await mkdirp(dirPath)
  } catch (e) {
    console.error(`Error: cannot create path. (${e.message})`)
    throw e
  }
}
