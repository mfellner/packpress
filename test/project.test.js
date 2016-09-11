import path from 'path'
import { expectAsyncToThrow } from './helpers'

describe('project', () => {
  jest.mock('mz/fs')
  jest.mock('../lib/file-utils')

  const futils = require('../lib/file-utils')
  const project = require('../lib/project')

  describe('#isProjectDir()', () => {
    it('should return true if a directory is a project directory', async () => {
      futils.__setMockReturnValues({
        fileExists: file => file === path.join('hello', 'packpress.json')
      })
      const result = await project.isProjectDir('hello')
      expect(result).toBe(true)
    })

    it('should return false if a directory is not a project directory', async () => {
      futils.__setMockReturnValues({
        fileExists: () => false
      })
      const result = await project.isProjectDir('hello')
      expect(result).toBe(false)
    })
  })

  describe('#findProjectDir()', () => {
    it('should find an existing project directory', async () => {
      futils.__setMockReturnValues({
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

      const result = await project.findProjectDir('/hello')
      expect(result.length).toBe(1)
      expect(result[0]).toBe('/hello/world')
    })

    it('should return an empty array if no project directory exists', async () => {
      futils.__setMockReturnValues({
        fileExists: file => !(/packpress\.json$/.test(file))
      })
      const result = await project.findProjectDir('/hello')
      expect(result.length).toBe(0)
    })
  })

  describe('#getProjectPath()', () => {
    it('throw if there is no project', async () => {
      await expectAsyncToThrow(project.getProjectPath('/root'))(/No project found/)
    })
  })
})
