import path from 'path'
import fs from 'mz/fs'
import rimraf from 'rimraf'
import { fileExists } from '../lib/file-utils'
import * as blogging from '../lib/blogging'
import * as helpers from './helpers'

describe('blogging', () => {
  const tmpDir = path.join(process.cwd(), './_tmp')
  const proDir = path.join(tmpDir, 'myproject')

  afterEach(done => rimraf(tmpDir, done))

  describe('#getPostFileName()', () => {
    it('should return the correct file name', () => {
      const result = blogging.getPostFileName('Hello, World!')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}-hello-world\.md$/)
    })
  })

  describe('#createPost()', () => {
    it('should create a markdown file in the posts subdirectory', async () => {
      await helpers.createMockProject(proDir)
      const filePath = await blogging.createPost('Hello, World!', {path: tmpDir})
      const postsDir = path.join(proDir, 'posts')

      const result = await fileExists(postsDir)
      expect(result).toBe(true)

      const files = await fs.readdir(postsDir)
      expect(files.length).toBe(1)
      expect(files[0]).toMatch(/^\d{4}-\d{2}-\d{2}-hello-world\.md$/)
    })

    it('should overwrite an existing file only if the option is set', async () => {
      await helpers.createMockProject(proDir)
      await blogging.createPost('Hello, World!', {path: tmpDir})

      const expected = await helpers.expectAsync(blogging.createPost('Hello, World!', {path: tmpDir}))
      expected.toThrow(/already exists/)

      const filePath = await blogging.createPost('Hello, World!', {path: tmpDir, overwrite: true})
      const postsDir = path.join(proDir, 'posts')

      const result = await fileExists(postsDir)
      expect(result).toBe(true)
    })
  })
})
