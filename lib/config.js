/**
 * @flow
 */

import fs from 'mz/fs'
import path from 'path'
import { memoize } from './utils'

type PackageJSON = {
  name: string,
  version: string,
  dependencies: { [key: string]: string }
};

async function _loadPackageJSON(): Promise<PackageJSON> {
  const json = await fs.readFile(path.resolve(__dirname, '../package.json'))
  return JSON.parse(json)
}

const loadPackageJSON = memoize(_loadPackageJSON)

async function getDependencies(prefix: string): Promise<Array<string>> {
  const packagejson = await loadPackageJSON()
  return Object.keys(packagejson.dependencies)
    .filter(name => name.startsWith(prefix))
    .map(name => name.substring(prefix.length))
}

export function getBabelPresets(): Promise<Array<string>> {
  return getDependencies('babel-preset-')
}

export function getBabelPlugins(): Promise<Array<string>> {
  return getDependencies('babel-plugin-')
}
