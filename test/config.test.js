import * as config from '../lib/config'

describe('config', () => {
  describe('#getBabelPlugins()', () => {
    it('should return a list of strings', async () => {
      const result = await config.getBabelPlugins()
      expect(result.length).toBeGreaterThan(0)

      for (let name of result) {
        expect(name).toMatch(/^[a-z0-9-]+$/)
      }
    })
  })

  describe('#getBabelPresets()', () => {
    it('should return a list of strings', async () => {
      const result = await config.getBabelPresets()
      expect(result.length).toBeGreaterThan(0)

      for (let name of result) {
        expect(name).toMatch(/^[a-z0-9-]+$/)
      }
    })
  })
})
