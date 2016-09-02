import path from 'path'
import * as loader from '../lib/loader'

describe('loader', () => {
  const testFile = path.resolve(__dirname, 'fixtures', 'hello-module.js')

  describe('#loadModule()', () => {
    it('should load a JavaScript module', () => {
      const js = `module.exports = 'hello'`
      const result = loader.loadModule(js)
      expect(result).toBe('hello')
    })
  })

  describe('#loadFile()', () => {
    it('should load a JavaScript file', async () => {
      const result = await loader.loadFile(testFile)
      expect(typeof result).toBeTruthy()
    })
  })

  describe('#loadModuleFromFile()', () => {
    it('should load a JavaScript module from a file', async () => {
      const result = await loader.loadModuleFromFile(testFile)
      expect(result).toBe('hello')
    })
  })
})
