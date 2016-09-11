import path from 'path'

describe('utils', () => {
  jest.mock('mz/fs')
  jest.mock('../lib/file-utils')

  const utils = require('../lib/utils')

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
      require('../lib/file-utils').__setMockReturnValues({
        fileExists: file => file === path.join('hello', 'packpress.json')
      })
      const result = await utils.isProjectDir('hello')
      expect(result).toBe(true)
    })

    it('should return false if a directory is not a project directory', async () => {
      require('../lib/file-utils').__setMockReturnValues({
        fileExists: () => false
      })
      const result = await utils.isProjectDir('hello')
      expect(result).toBe(false)
    })
  })

  describe('#findProjectDir()', () => {
    it('should find an existing project directory', async () => {
      require('../lib/file-utils').__setMockReturnValues({
        fileExists: file => file === '/hello/world/packpress.json'
      })
      const fs = require('mz/fs')
      fs.readdir = jest.fn(dir => { switch(dir) {
        case '/hello': return Promise.resolve(['world'])
        case '/hello/world': return Promise.resolve(['packpress.json'])
        default: return Promise.resolve([])
      }})
      fs.stat = jest.fn(dir => { switch(dir) {
        case '/hello':
        case '/hello/world': return Promise.resolve({isDirectory: () => true})
        default: return Promise.resolve({isDirectory: () => false})
      }})

      const result = await utils.findProjectDir('/hello')
      expect(result.length).toBe(1)
      expect(result[0]).toBe('/hello/world')
    })

    it('should return an empty array if no project directory exists', async () => {
      require('../lib/file-utils').__setMockReturnValues({
        fileExists: file => !(/packpress\.json$/.test(file))
      })
      const result = await utils.findProjectDir('/hello')
      expect(result.length).toBe(0)
    })
  })
})
