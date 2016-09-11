import path from 'path'
import Loader from '../lib/Loader'

describe('loader', () => {
  const testFile = path.resolve(__dirname, 'fixtures', 'hello-module.js')

  describe('#loadModule()', () => {
    it('should load a JavaScript module', async () => {
      const loader = await Loader.getInstance()
      const js = `module.exports = 'hello'`
      const result = loader.loadModule(js)
      expect(result).toBe('hello')
    })
  })

  describe('#loadFile()', () => {
    it('should load a JavaScript file', async () => {
      const loader = await Loader.getInstance()
      const result = await loader.loadFile(testFile)
      expect(typeof result).toBeTruthy()
    })
  })

  describe('#loadModuleFromFile()', () => {
    it('should load a JavaScript module from a file', async () => {
      const loader = await Loader.getInstance()
      const result = await loader.loadModuleFromFile(testFile)
      expect(result).toBe('hello')
    })
  })
})
