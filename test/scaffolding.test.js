import should from 'should'
import shouldPromised from 'should-promised'
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
    it('should not accept an empty path', done => {
      scaffolding.createNewProject().should.be.rejectedWith(/Path must be a string/).
      then(done.bind(this, null)).catch(done)
    })

    const paths = ['', '../', '/']

    paths.forEach(p => {
      it(`should require '${p}' to be a subdirectory`, done => {
        scaffolding.createNewProject(p).should.be.rejectedWith(/must be a subdirectory/).
        then(done.bind(this, null)).catch(done)
      })
    })

    it('should not overwrite an existing directory', done => {
      mkdirp(proDir).then(() => {
        scaffolding.createNewProject(proDir).should.be.rejectedWith(/already exists/).
        then(done.bind(this, null)).catch(done)
      }).
      catch(done)
    })

    it('should overwrite an existing directory if the option is given', done => {
      mkdirp(proDir).then(() => {
        const options = {overwrite: true}
        scaffolding.createNewProject(proDir, options).should.fulfilledWith(proDir).
        then(done.bind(this, null)).catch(done)
      }).
      catch(done)
    })
  })
})
