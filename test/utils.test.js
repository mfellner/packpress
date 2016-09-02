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
})
