import path from 'path'
import * as utils from '../lib/utils'

describe('utils', () => {
  describe('#fileExists()', () => {
    it('should return true if a file exists', async () => {
      const result = await utils.fileExists(__filename)
      expect(result).toBe(true)
    })

    it('should return true if a directory exists', async () => {
      const result = await utils.fileExists(__dirname)
      expect(result).toBe(true)
    })

    it('should return false if a file does not exist', async () => {
      const result = await utils.fileExists('./doesnotexist.js')
      expect(result).toBe(false)
    })

    it('should return false if a directory does not exist', async () => {
      const result = await utils.fileExists('./doesnotexist/')
      expect(result).toBe(false)
    })

    it('should throw if the input is invalid', async () => {
      let result
      try {
        result = await utils.fileExists(null)
      } catch (e) {
        expect(e.message).toBeTruthy()
      }
      expect(result).toBeUndefined()
    })
  })

  describe('#memoize()', () => {
    it('should store the result of a synchronous function', () => {
      const _fn = (x: integer) => x + 1
      const fn = utils.memoize(_fn)

      expect(_fn(0)).toBe(1)
      expect(_fn(1)).toBe(2)
      expect(fn(0)).toBe(1)
      expect(fn(1)).toBe(1)
    })

    it('should store the result of an asynchronous function', async () => {
      const _fn = (x: integer) => Promise.resolve(x + 1)
      const fn = utils.memoize(_fn)

      expect(await _fn(0)).toBe(1)
      expect(await _fn(1)).toBe(2)
      expect(await fn(0)).toBe(1)
      expect(await fn(1)).toBe(1)
    })
  })
})
