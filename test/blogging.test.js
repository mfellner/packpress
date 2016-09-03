import path from 'path'
import fs from 'mz/fs'
import rimraf from 'rimraf'
import * as utils from '../lib/utils'
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
      console.log(filePath)
      const postsDir = path.join(proDir, 'posts')

      const result = await utils.fileExists(postsDir)
      expect(result).toBe(true)

      const files = await fs.readdir(postsDir)
      expect(files.length).toBe(1)
      expect(files[0]).toMatch(/^\d{4}-\d{2}-\d{2}-hello-world\.md$/)
    })
  })
})
