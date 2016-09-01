import path from 'path'
import thenify from 'thenify'

const glob = thenify(require('glob'))

const templateDir = path.join(__dirname, '../template')
const templatePat = '**/*.+(js|jsx|json)'

const templateFiles = [{
  src: '**/*.+(js|json)',
  dst: '.'
}, {
  src: 'jsx/*.jsx',
  dst: './jsx'
}]

/**
 * Return a list of sources and destinations.
 *
 * @param  {string} dstDir  Destination path.
 * @param  {string} srcDir  Source path.
 * @param  {string} pattern Source files pattern.
 * @return {Array}          List of sources and destinations.
 */
export async function getFiles(dstDir, srcDir, pattern) {
  const files = await glob(path.join(srcDir, pattern))
  return files.map(file => ({
    src: file,
    dst: path.join(dstDir, path.relative(srcDir, file))
  }))
}

/**
 * Return a list of template files to copy.
 *
 * @param  {string} targetDir Project target directory.
 * @return {Array}            List of template sources and project destinations.
 */
export function getTemplateFiles(targetDir) {
  return getFiles(targetDir, templateDir, templatePat)
}
