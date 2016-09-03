/**
 * @flow
 */

import fs from 'mz/fs'
import path from 'path'
import thenify from 'thenify'
import * as utils from './utils'
import * as template from './template'

const mkdirp = thenify(require('mkdirp'))
const rimraf = thenify(require('rimraf'))

type BloggingOptions = {
  overwrite?: boolean,
  path?: string
}

export async function createPost(title: string, options: BloggingOptions = {}): Promise<string> {
    const rootDir = options.path || process.cwd()
    const result = await utils.findProjectDir(path.resolve(rootDir))

    if (!result[0]) throw new Error('No project found!')

    const dirPath = path.join(result[0], 'posts')
    const fileName = getPostFileName(title)
    const filePath = path.resolve(dirPath, fileName)

    const fileExists = await utils.fileExists(filePath)

    // Delete existing file if the overwrite option was given
    if (fileExists) {
      if (options.overwrite) {
        try {
          await rimraf(filePath)
          console.log(`deleted ${filePath}`)
        } catch (e) {
          throw e
        }
      } else {
        throw new Error(`Error: ${filePath} already exists.`)
      }
    }

    await mkdirp(dirPath)
    await fs.writeFile(filePath, '\n')

    return filePath
}

export function getPostFileName(title: string): string {
  const date = new Date().toISOString().substring(0, '1970-01-01'.length)
  const name = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]+/g, '')
  return `${date}-${name}.md`
}
