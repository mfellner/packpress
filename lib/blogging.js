/**
 * @flow
 */

import path from 'path'
import * as project from './project'
import * as template from './template'
import * as utils from './utils'
import * as futils from './file-utils'

type BloggingOptions = {
  overwrite?: boolean;
  path?: string;
}

export async function createPost(title: string, options: BloggingOptions = {}): Promise<string> {
    const rootDir = options.path || process.cwd()
    const projectPath = await project.getProjectPath(rootDir)

    const dirPath = path.join(projectPath, 'posts')
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

    return await futils.writeFile(filePath, `# ${title}\n`)
}

export function getPostFileName(title: string): string {
  const date = new Date().toISOString().substring(0, '1970-01-01'.length)
  const name = title
    .trim()
    .toLowerCase()                // lowercase all characters
    .replace(/[^a-z0-9\s]+/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-')         // replace consecutive whitespaces with '-'
  return `${date}-${name}.md`
}
