import HelloComponent from './fixtures/hello-component.js'
import { expectAsyncToThrow } from './helpers'

describe('building', () => {
  jest.mock('../lib/utils')
  jest.mock('../lib/file-utils')
  jest.mock('../lib/project')
  jest.mock('../lib/Loader')

  const project = require('../lib/project')
  const building = require('../lib/building')
  const HelloHTML = '<html><head><title>world</title></head><body></body></html>'

  describe('#renderHTML()', () => {
    it('should render HTML', async () => {
      const loader = require('../lib/Loader').__setMockReturnValues({
        loadModuleFromFile: HelloComponent
      })

      const result = await building.renderHTML('world.js', {title: 'world'})
      expect(result).toBe(HelloHTML)
      expect(loader.__instance.loadModuleFromFile).toBeCalledWith('world.js')
    })
  })

  describe('#buildProject()', () => {
    it('write the index.html file', async () => {
      project.__setMockReturnValues({
        getProjectPath: '/hello'
      })
      const futils = require('../lib/file-utils').__setMockReturnValues({
        readJSON: {
          template: 'world.js',
          title: 'world'
        }
      })

      const result = await building.buildProject()
      expect(result).toBe('/hello/dist/index.html')
      expect(futils.writeFile).toBeCalledWith('/hello/dist/index.html', HelloHTML)
    })
  })
})
