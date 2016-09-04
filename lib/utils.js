/**
 * @flow
 */

import path from 'path'
import fs from 'mz/fs'
import { fileExists } from './file-utils.js'

export async function isProjectDir(dir: string): Promise<boolean> {
  const packpressJSON = await fileExists(path.join(dir, 'packpress.json'))
  const indexJS = await fileExists(path.join(dir, 'index.js'))
  return packpressJSON && indexJS
}

export async function findProjectDir(root: string): Promise<Array<string>> {
  console.log('findProjectDir ', root)
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

export function memoize<A, B>(fn: (a: ?A) => B): (a: ?A) => B {
  let result
  return (a: ?A) => {
    if (result === undefined) result = fn(a)
    return result
  }
}
