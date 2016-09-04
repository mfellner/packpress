/**
 * @flow
 */

import path from 'path'
import fs from 'mz/fs'
import thenify from 'thenify'

const mkdirp = thenify(require('mkdirp'))
const rimraf = thenify(require('rimraf'))

export async function writeFile(file: string, data: string | Buffer): Promise<string> {
  await mkdirp(path.dirname(file))
  await fs.writeFile(file, data)
  return file
}

export async function copyFile(inFile: string, outFile: string): Promise<string> {
  await mkdirp(path.dirname(outFile))
  return fs.createReadStream(inFile).pipe(fs.createWriteStream(outFile)).path
}

export function rmFile(file: string): Promise<void> {
  return rimraf(file)
}

export async function fileExists(file: string): Promise<boolean> {
  try {
    const stats = await fs.stat(file)
    return true
  } catch (e) {
    if (e.code === 'ENOENT') return false
    else throw e
  }
}
