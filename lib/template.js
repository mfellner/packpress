import path from 'path'
import thenify from 'thenify'

const glob = thenify(require('glob'))

const templateDir = path.join(__dirname, '../template')
const templateFiles = [{
  src: '*.+(js|json)',
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
 * Get template file sources and destinations.
 *
 * @param  {string} targetDir Project target directory.
 * @return {Array}            List of file sources and destinations.
 */
export async function getFiles(targetDir) {
  const files = await Promise.all(templateFiles.map(async function(file) {
    return {
      src: await glob(path.join(templateDir, file.src)),
      dst: path.join(targetDir, file.dst)
    }
  }))

  return files.flatMap((src, file) => ({
    src: src,
    dst: path.join(file.dst, path.basename(src))
  }), 'src')
}
