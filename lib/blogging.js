/**
 * @flow
 */

import path from 'path'
import * as utils from './utils'
import * as futils from './file-utils'
import * as template from './template'

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

    const fileExists = await futils.fileExists(filePath)

    // Delete existing file if the overwrite option was given
    if (fileExists) {
      if (options.overwrite) {
        try {
          await futils.rmFile(filePath)
          console.log(`deleted ${filePath}`)
        } catch (e) {
          throw e
        }
      } else {
        throw new Error(`Error: ${filePath} already exists.`)
      }
    }

    return await futils.writeFile(filePath, '\n')
}

export function getPostFileName(title: string): string {
  const date = new Date().toISOString().substring(0, '1970-01-01'.length)
  const name = title
    .toLowerCase()                // lowercase all characters
    .replace(/\s+/g, '-')         // replace consecutive whitespaces with '-'
    .replace(/[^a-z0-9-]+/g, '')  // remove non-alphanumeric characters
  return `${date}-${name}.md`
}