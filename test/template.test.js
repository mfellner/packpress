import path from 'path'
import * as template from '../lib/template'

describe('template', () => {
  describe('#getTemplateFiles()', () => {
    it('should return a list of sources and destinations', async () => {
      const targetDir = path.join(__dirname, 'test')
      const templateFiles = await template.getTemplateFiles(targetDir)

      expect(templateFiles.length).toBeGreaterThan(0)

      for (let file of templateFiles) {
        expect(file.src).toBeDefined()
        expect(file.src).toMatch(/^[\w\/\\]+\.(js|jsx|json)$/)
        expect(file.src).not.toMatch(new RegExp(`^${targetDir}`))
        expect(file.dst).toBeDefined()
        expect(file.dst).toMatch(new RegExp(`^${targetDir}`))
        expect(file.dst).toMatch(new RegExp(`${path.basename(file.src)}$`))
      }
    })
  })
})
