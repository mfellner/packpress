import { expectAsyncToThrow } from './helpers'

describe('scaffolding', () => {
  jest.mock('../lib/file-utils')
  jest.mock('../lib/template')

  const targetDir = 'hello'
  const srcFile = '/template/packpress.json'
  const dstFile = `/${targetDir}/packpress.json`
  require('../lib/template').__setMockReturnValues({
    getTemplateFiles: [{
      src: srcFile,
      dst: dstFile
    }]
  })

  const futils = require('../lib/file-utils')
  const scaffolding = require('../lib/scaffolding')

  describe('#createNewProject()', () => {
    it('should not accept an empty path', async () => {
      await expectAsyncToThrow(scaffolding.createNewProject())(/Path must be a string/)
    })

    const paths = ['', '../', '/']

    paths.forEach(p => {
      it(`should require '${p}' to be a subdirectory`, async () => {
        await expectAsyncToThrow(scaffolding.createNewProject(p))(/must be a subdirectory/)
      })
    })

    it('should create a new directory', async () => {
      const result = await scaffolding.createNewProject(targetDir)
      expect(result[0]).toBe('/hello/packpress.json')
      expect(futils.copyFile).toBeCalledWith(srcFile, dstFile)
    })

    it('should not overwrite an existing directory', async () => {
      futils.__setMockReturnValues({
        fileExists: f => f.endsWith(`/${targetDir}`)
      })
      await expectAsyncToThrow(scaffolding.createNewProject(targetDir))(/already exists/)
    })

    it('should overwrite an existing directory if the option is given', async () => {
      const result = await scaffolding.createNewProject(targetDir, {overwrite: true})
      expect(result[0]).toBe(dstFile)
      expect(futils.copyFile).toBeCalledWith(srcFile, dstFile)
    })
  })
})
