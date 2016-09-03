/**
 * @flow
 */

import path from 'path'
import thenify from 'thenify'

const glob = thenify(require('glob'))

const templateDir = path.resolve(__dirname, '../template')
const templatePat = '**/*.+(js|json)'

type File = {src: string, dst: string}

/**
 * Return a list of sources and destinations.
 */
export async function getFiles(dstDir: string, srcDir: string, pattern: string): Promise<Array<File>> {
  const files = await glob(path.join(srcDir, pattern))
  return files.map(file => ({
    src: file,
    dst: path.join(dstDir, path.relative(srcDir, file))
  }))
}

/**
 * Return a list of template files to copy.
 */
export function getTemplateFiles(targetDir: string): Promise<Array<File>> {
  return getFiles(targetDir, templateDir, templatePat)
}
