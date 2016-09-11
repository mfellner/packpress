/**
 * @flow
 */

import path from 'path'
import fs from 'mz/fs'
import * as utils from './utils'
import * as futils from './file-utils.js'

export async function isProjectDir(dir: string): Promise<boolean> {
  return await futils.fileExists(path.join(dir, 'packpress.json'))
}

export async function findProjectDir(root: string): Promise<Array<string>> {
  const result = await isProjectDir(root)
  if (result) return [root]

  let files = []
  try {
    files = await fs.readdir(root)
    if (files.length === 0) return []
  } catch (e) {
    if (e.code === 'ENOENT') return []
    else throw e
  }

  const fileInfos = await Promise.all(files
    .map(file => path.resolve(root, file))
    .map(async (file) => {
      const stat = await fs.stat(file)
      const isDirectory = stat.isDirectory()
      return {file, isDirectory}
    }))

  const subDirs = fileInfos
    .filter(info => info.isDirectory)
    .map(info => info.file)

  const moreDirs = await Promise.all(subDirs.map(async (dir) => await findProjectDir(dir)))

  return moreDirs.reduce((dirs, dir) => dirs.concat(dir), [])
}

async function _getProjectPath(rootDir: ?string): Promise<string> {
  if (!rootDir) throw new Error('No project found!')
  const projectDirs = await findProjectDir(path.resolve(rootDir))
  if (!projectDirs[0]) throw new Error('No project found!')
  return projectDirs[0]
}

export const getProjectPath = utils.memoize(_getProjectPath)
