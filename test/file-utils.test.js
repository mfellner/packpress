import path from 'path'
import { expectAsyncToThrow } from './helpers'

describe('file-utils', () => {
  jest.mock('mz/fs')
  jest.mock('mkdirp')
  jest.mock('rimraf')
  jest.mock('thenify')
  require('thenify').mockImplementation(arg => arg)

  const fs = require('mz/fs')
  const mkdirp = require('mkdirp')
  const rimraf = require('rimraf')
  const futils = require('../lib/file-utils')

  describe('#fileExists()', () => {
    it('should return true if a file exists', async () => {
      fs.stat = jest.fn(file => Promise.resolve(file === 'hello.js'))

      const test = await futils.fileExists('hello.js')
      expect(test).toBe(true)
    })

    it('should return false if a file does not exist', async () => {
      const e = new Error()
      e.code = 'ENOENT'
      fs.stat = jest.fn(() => { throw e })

      const test = await futils.fileExists('hello.js')
      expect(test).toBe(false)
    })

    it('should throw if the input is invalid', async () => {
      fs.stat = jest.fn(file => { if (file === null) throw new Error('Nooo!')})

      await expectAsyncToThrow(futils.fileExists(null))(/Nooo!/)
    })
  })

  describe('#readJSON()', () => {
    it('should read a JSON file', async () => {
      fs.readFile = jest.fn(() => Promise.resolve(`{"hello": "world"}`))

      const object = await futils.readJSON('hello.json')
      expect(object.hello).toBe('world')
    })
  })

  describe('#writeFile()', () => {
    it('should write a file', async () => {
      fs.writeFile = jest.fn(file => file)

      const file = await futils.writeFile('/hello/world.js', 'yay!')
      expect(file).toBe('/hello/world.js')
      expect(mkdirp).toBeCalledWith('/hello')
      expect(fs.writeFile).toBeCalledWith('/hello/world.js', 'yay!')
    })
  })

  describe('#copyFile()', () => {
    it('should copy a file', async () => {
      fs.createReadStream = jest.fn(() => ({pipe: (arg) => ({path: arg})}))
      fs.createWriteStream = jest.fn(arg => arg)

      const copy = await futils.copyFile('hello.js', 'hello.copy')
      expect(copy).toBe('hello.copy')
      expect(fs.createReadStream).toBeCalledWith('hello.js')
      expect(fs.createWriteStream).toBeCalledWith('hello.copy')
    })
  })

  describe('#rmFile()', () => {
    it('should delete a file', async () => {
      await futils.rmFile('hello.js')
      expect(rimraf).toBeCalledWith('hello.js')
    })
  })
})
