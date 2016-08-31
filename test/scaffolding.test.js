import thenify from 'thenify'
import rimraf from 'rimraf'
import path from 'path'
import expect from './expect'
import * as scaffolding from '../lib/scaffolding'

const mkdirp = thenify(require('mkdirp'))

describe('scaffolding', () => {
  const tmpDir = path.join(process.cwd(), './_tmp')
  const proDir = path.join(tmpDir, 'myproject')

  afterEach(done => rimraf(tmpDir, done))

  describe('#createNewProject()', () => {
    it('should not accept an empty path', () => {
      return expect(scaffolding.createNewProject()).to.be.rejectedWith(/Path must be a string/)
    })

    const paths = ['', '../', '/']

    paths.forEach(p => {
      it(`should require '${p}' to be a subdirectory`, () => {
        return expect(scaffolding.createNewProject(p)).to.be.rejectedWith(/must be a subdirectory/)
      })
    })

    it('should not overwrite an existing directory', async () => {
      await mkdirp(proDir)
      await expect(scaffolding.createNewProject(proDir)).to.be.rejectedWith(/already exists/)
    })

    it('should overwrite an existing directory if the option is given', async () => {
      await mkdirp(proDir)
      const options = {overwrite: true}
      await expect(scaffolding.createNewProject(proDir, options)).to.eventually
        .be.instanceOf(Array).and
        .not.be.empty
    })
  })
})
