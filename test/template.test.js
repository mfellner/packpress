import should from 'should'
import shouldPromised from 'should-promised'
import path from 'path'

import * as template from '../lib/template'

describe('template', () => {
  describe('#getTemplateFiles()', () => {
    it('should return a list of sources and destinations', done => {
      const targetDir = path.join(__dirname, 'test')
      template.getTemplateFiles(targetDir).should.finally.be.a.Array().
      and.not.empty().
      and.matchEach(function(obj) {
        obj.src.should.match(/^\S+\w+\.(js|jsx|json)$/)
        obj.dst.should.startWith(targetDir).
        and.endWith(path.basename(obj.src))
      }).
      then(done.bind(this, null)).catch(done)
    })
  })
})
