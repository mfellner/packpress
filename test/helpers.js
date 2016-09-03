/**
 * @flow
 */

import path from 'path'
import fs from 'mz/fs'
import thenify from 'thenify'

const mkdirp = thenify(require('mkdirp'))

export async function expectAsync<T>(promise: Promise<T>): Promise<any> {
  try {
    const result = await promise
    return expect(result)
  } catch(e) {
    return expect(() => { throw e })
  }
}

export async function createMockProject(dirPath: string): Promise<string> {
  const mockJSON = `{}`
  const mockJS = `export default class Mock {}`
  await mkdirp(dirPath)
  await fs.writeFile(path.resolve(dirPath, 'packpress.json'), mockJSON)
  await fs.writeFile(path.resolve(dirPath, 'index.js'), mockJS)
  return dirPath
}
