import HelloComponent from './fixtures/hello-component.js'
import { expectAsyncToThrow } from './helpers'

describe('building', () => {
  jest.mock('../lib/utils')
  jest.mock('../lib/file-utils')
  jest.mock('../lib/Loader')

  const building = require('../lib/building')
  const HelloHTML = '<html><head><title>hello</title></head><body></body></html>'

  describe('#renderHTML()', () => {
    it('should render HTML', async () => {
      const loader = require('../lib/Loader').__setMockReturnValues({
        loadModuleFromFile: HelloComponent
      })

      const result = await building.renderHTML('hello.js', {title: 'hello'})
      expect(result).toBe(HelloHTML)
      expect(loader.__instance.loadModuleFromFile).toBeCalledWith('hello.js')
    })
  })

  describe('#buildProject()', () => {
    it('throw if there is no project', async () => {
      await expectAsyncToThrow(building.buildProject('/hello'))(/No project found/)
    })

    it('write the index.html file', async () => {
      require('../lib/utils').__setMockReturnValues({
        isProjectDir: true
      })
      const futils = require('../lib/file-utils').__setMockReturnValues({
        readJSON: {
          template: 'hello.js',
          title: 'hello'
        }
      })

      const result = await building.buildProject('/hello')
      expect(result).toBe('/hello/dist/index.html')
      expect(futils.writeFile).toBeCalledWith('/hello/dist/index.html', HelloHTML)
    })
  })
})
