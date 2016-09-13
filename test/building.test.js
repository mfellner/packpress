import HelloComponent from './fixtures/hello-component.js'
import { expectAsyncToThrow } from './helpers'

describe('building', () => {
  jest.mock('mz/fs')
  jest.mock('../lib/utils')
  jest.mock('../lib/file-utils')
  jest.mock('../lib/render')
  jest.mock('../lib/project')
  jest.mock('../lib/Loader')

  const fs = require('mz/fs')
  const futils = require('../lib/file-utils')
  const render = require('../lib/render')
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
      futils.__setMockReturnValues({
        readJSON: {
          template: 'world.js',
          title: 'world'
        },
        findFiles: (dir, exts ) => exts[0] === 'md' ? ['1970-01-01-hello.md'] : []
      })
      render.__setMockReturnValues({
        renderMarkdown: '<div>hello</div>'
      })
      fs.readFile = jest.fn(() => Promise.resolve(''))

      const result = await building.buildProject()
      expect(result).toBe('/hello/dist/index.html')
      expect(futils.writeFile).toBeCalledWith('/hello/dist/index.html', HelloHTML)
      expect(futils.writeFile).toBeCalledWith('/hello/dist/posts/1970-01-01-hello.html', '<div>hello</div>')
    })
  })

  describe('#parseConfig()', () => {
    it('should throw an error if the configuration is invalid', async () => {
      futils.__setMockReturnValues({
        readJSON: {}
      })
      await expectAsyncToThrow(building.parseConfig('packpress.json'))(/Invalid config/)
    })
  })
})
