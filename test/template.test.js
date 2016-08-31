import path from 'path'
import expect from './expect'
import * as template from '../lib/template'

describe('template', () => {
  describe('#getTemplateFiles()', () => {
    it('should return a list of sources and destinations', async () => {
      const targetDir = path.join(__dirname, 'test')
      const templateFiles = await template.getTemplateFiles(targetDir)

      expect(templateFiles).to.not.be.empty

      for (let file of templateFiles) {
        expect(file).to.have.property('src')
          .that.matches(/^[\w\/\\]+\.(js|jsx|json)$/).and
          .that.not.startsWith(targetDir)
        expect(file).to.have.property('dst')
          .that.startsWith(targetDir).and
          .that.endsWith(path.basename(file.src))
      }
    })
  })
})
