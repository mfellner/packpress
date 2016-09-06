import thenify from 'thenify'
import rimraf from 'rimraf'
import path from 'path'
import * as scaffolding from '../lib/scaffolding'

const mkdirp = thenify(require('mkdirp'))

describe('scaffolding', () => {
  const tmpDir = path.join(process.cwd(), './_tmp')
  const proDir = path.join(tmpDir, 'myproject')

  afterEach(done => rimraf(tmpDir, done))

  describe('#createNewProject()', () => {
    it('should not accept an empty path', async () => {
      try {
        await scaffolding.createNewProject()
      } catch(e) {
        expect(e.message).toMatch(/Path must be a string/)
      }
    })

    const paths = ['', '../', '/']

    paths.forEach(p => {
      it(`should require '${p}' to be a subdirectory`, async () => {
        try {
          await scaffolding.createNewProject(p)
        } catch(e) {
          expect(e.message).toMatch(/must be a subdirectory/)
        }
      })
    })

    it('should create a new directory', async () => {
      const result = await scaffolding.createNewProject(proDir)
      expect(result.filter(f => /packpress.json$/.test(f))[0]).toBeDefined()
      expect(result.filter(f => /Blog.js/.test(f))[0]).toBeDefined()
      expect(result.filter(f => /BlogPost.js/.test(f))[0]).toBeDefined()
      expect(result.filter(f => /Footer.js/.test(f))[0]).toBeDefined()
      expect(result.filter(f => /Header.js/.test(f))[0]).toBeDefined()
    })

    it('should not overwrite an existing directory', async () => {
      await mkdirp(proDir)
      try {
        await scaffolding.createNewProject(proDir)
      } catch(e) {
        expect(e.message).toMatch(/already exists/)
      }
    })

    it('should overwrite an existing directory if the option is given', async () => {
      await mkdirp(proDir)
      const options = {overwrite: true}
      const result = await scaffolding.createNewProject(proDir, options)
      expect(result.filter(f => /packpress.json$/.test(f))[0]).toBeDefined()
      expect(result.filter(f => /Blog.js/.test(f))[0]).toBeDefined()
      expect(result.filter(f => /BlogPost.js/.test(f))[0]).toBeDefined()
      expect(result.filter(f => /Footer.js/.test(f))[0]).toBeDefined()
      expect(result.filter(f => /Header.js/.test(f))[0]).toBeDefined()
    })
  })
})
