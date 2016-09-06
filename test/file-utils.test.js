import path from 'path'
import rimraf from 'rimraf'
import * as futils from '../lib/file-utils'
import * as helpers from './helpers'

describe('file-utils', () => {
  const tmpDir = path.join(process.cwd(), './_tmp')
  const tmpFile = path.join(tmpDir, 'test.js')

  afterEach(done => rimraf(tmpDir, done))

  describe('#fileExists()', () => {
    it('should return true if a file exists', async () => {
      const test = await futils.fileExists(__filename)
      expect(test).toBe(true)
    })

    it('should return true if a directory exists', async () => {
      const test = await futils.fileExists(__dirname)
      expect(test).toBe(true)
    })

    it('should return false if a file does not exist', async () => {
      const test = await futils.fileExists('./doesnotexist.js')
      expect(test).toBe(false)
    })

    it('should return false if a directory does not exist', async () => {
      const test = await futils.fileExists('./doesnotexist/')
      expect(test).toBe(false)
    })

    it('should throw if the input is invalid', async () => {
      let test
      try {
        test = await futils.fileExists(null)
      } catch (e) {
        expect(e.message).toBeTruthy()
      }
      expect(test).toBeUndefined()
    })
  })

  describe('#readJSON()', () => {
    it('should read a JSON file', async () => {
      const object = await futils.readJSON(path.resolve(__dirname, '../package.json'))
      expect(object.name).toBeDefined()
      expect(object.version).toBeDefined()
    })
  })

  describe('#writeFile()', () => {
    it('should write a file', async () => {
      const file = await futils.writeFile(tmpFile, '\n')
      const test = await futils.fileExists(file)
      expect(test).toBe(true)
      expect(file).toBe(tmpFile)
    })
  })

  describe('#copyFile()', () => {
    it('should copy a file', async () => {
      const original = await futils.writeFile(tmpFile, '\n')
      const copy = await futils.copyFile(original, `${original}.copy`)
      const test = await futils.fileExists(copy)
      expect(test).toBe(true)
      expect(copy).toBe(`${original}.copy`)
    })
  })

  describe('#rmFile()', () => {
    it('should delete a file', async () => {
      const file = await futils.writeFile(tmpFile, '\n')
      await futils.rmFile(file)
      const test = await futils.fileExists(file)
      expect(test).toBe(false)
    })

    it('should delete a directory', async () => {
      const file = await futils.writeFile(tmpFile, '\n')
      await futils.rmFile(tmpDir)
      const test = await futils.fileExists(tmpDir)
      expect(test).toBe(false)
    })
  })
})
