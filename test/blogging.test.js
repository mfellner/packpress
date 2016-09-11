import { expectAsyncToThrow } from './helpers'

describe('blogging', () => {
  jest.mock('../lib/utils')
  jest.mock('../lib/file-utils')
  jest.mock('../lib/project')
  jest.mock('../lib/template')

  const project = require('../lib/project')
  const blogging = require('../lib/blogging')

  describe('#getPostFileName()', () => {
    it('should return the correct file name', () => {
      const result = blogging.getPostFileName('Hello, World!')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}-hello-world\.md$/)
    })
  })

  describe('#createPost()', () => {
    it('should create a markdown file in the posts subdirectory', async () => {
      project.__setMockReturnValues({
        getProjectPath: '/hello'
      })
      const futils = require('../lib/file-utils')

      const filePath = await blogging.createPost('Hello, World!')
      expect(filePath).toMatch(/\/hello\/posts\/\d{4}-\d{2}-\d{2}-hello-world\.md$/)
      expect(futils.writeFile).toBeCalledWith(filePath, '# Hello, World!\n')
    })

    it('should overwrite an existing file only if the option is set', async () => {
      project.__setMockReturnValues({
        getProjectPath: '/hello'
      })
      const futils = require('../lib/file-utils').__setMockReturnValues({
        fileExists: file => /\/hello\/posts\/\d{4}-\d{2}-\d{2}-hello-world\.md$/.test(file)
      })

      await expectAsyncToThrow(blogging.createPost('Hello, World!'))(/already exists/)

      const filePath = await blogging.createPost('Hello, World!', {overwrite: true})
      expect(futils.rmFile).toBeCalledWith(filePath)
      expect(futils.writeFile).toBeCalledWith(filePath, '# Hello, World!\n')
    })
  })
})
