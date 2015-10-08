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
 * Iterate over a list of values and flatten their elements into one list.
 * The values can be either arrays or objects that contain an array.
 * In the second case the given key specifies the property of each
 * object that is the array.
 *
 * @example <caption>List of arrays</caption>
 * [[1, 2], [3, 4]].flatMap(n => n * n)
 *
 * // [ 1, 4, 9, 16 ]
 *
 * @example <caption>List of objects</caption>
 * [{i: 0, a: [1, 2]},
 *  {i: 1, a: [3, 4]}].
 * flatMap((n, val) => ({i: val.i, n: n * n}), 'a')
 *
 * // [ { i: 0, n: 1 }, { i: 0, n: 4 },
 * //   { i: 1, n: 9 }, { i: 1, n: 16 } ]
 *
 * @param  {function} callback Function to transform each element.
 * @param  {string}   [key]    Key of each object's array property.
 * @return {Array}             Flattened list of elements.
 */
Array.prototype.flatMap = function(callback, key) {
  return this.reduce((accumulator, value) => {
    const array = key ? value[key] : value;
    return accumulator.concat(array.map(element => callback(element, value)))
  }, [])
}

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
