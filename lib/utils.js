/**
 * @flow
 */

import fs from 'mz/fs'

export async function fileExists(path: string): Promise<boolean> {
  try {
    const stats = await fs.stat(path)
    return true
  } catch (e) {
    if (e.code === 'ENOENT') return false
    else throw e
  }
}
