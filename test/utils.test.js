import path from 'path'
import rimraf from 'rimraf'
import * as utils from '../lib/utils'
import * as helpers from './helpers'

describe('utils', () => {
  const tmpDir = path.join(process.cwd(), './_tmp')
  const proDir = path.join(tmpDir, 'myproject')

  afterEach(done => rimraf(tmpDir, done))

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

  describe('#isProjectDir()', () => {
    it('should return true if a directory is a project directory', async () => {
      await helpers.createMockProject(proDir)
      const result = await utils.isProjectDir(proDir)
      expect(result).toBe(true)
    })

    it('should return false if a directory is not a project directory', async () => {
      const result = await utils.isProjectDir(proDir)
      expect(result).toBe(false)
    })
  })

  describe('#findProjectDir()', () => {
    it('should find an existing project directory', async () => {
      await helpers.createMockProject(proDir)
      const result = await utils.findProjectDir(tmpDir)
      expect(result.length).toBe(1)
      expect(result[0]).toMatch(new RegExp(`${proDir}$`))
    })

    it('should return an empty array if no project directory exists', async () => {
      const result = await utils.findProjectDir(tmpDir)
      expect(result.length).toBe(0)
    })
  })
})
