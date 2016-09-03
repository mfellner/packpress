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

export function memoize<A, B>(fn: (a: ?A) => B): (a: ?A) => B {
  let result
  return (a: ?A) => {
    if (result === undefined) result = fn(a)
    return result
  }
}
