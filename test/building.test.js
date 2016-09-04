import path from 'path'
import rimraf from 'rimraf'
import { fileExists } from '../lib/file-utils'
import { expectAsync } from './helpers'
import * as scaffolding from '../lib/scaffolding'
import * as building from '../lib/building'

describe('building', () => {
  const testFile = path.resolve(__dirname, 'fixtures', 'hello-component.js')
  const tmpDir = path.join(process.cwd(), './_tmp')
  const proDir = path.join(tmpDir, 'myproject')

  afterEach(done => rimraf(tmpDir, done))

  describe('#renderHTML()', () => {
    it('should render HTML', async () => {
      const result = await building.renderHTML(testFile, {title: 'hello'})
      expect(result).toBe('<html><head><title>hello</title></head><body></body></html>')
    })
  })

  describe('#buildProject()', () => {
    it('throw if there is no project', async () => {
      (await expectAsync(building.buildProject(proDir))).toThrow(/No project found/)
    })

    it('write the index.html file', async () => {
      await scaffolding.createNewProject(proDir)
      await building.buildProject(proDir)
      const exists = await fileExists(path.join(proDir, 'dist', 'index.html'))
      expect(exists).toBe(true)
    })
  })
})
