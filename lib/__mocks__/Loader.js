const loader = jest.genMockFromModule('../Loader')
const returnValues = {
  loadModule: null,
  loadFile: null,
  loadModuleFromFile: null
}

class MockLoader extends loader.default {
  constructor() {
    super({})
  }
}

MockLoader.prototype.loadModule = jest.fn(() => returnValues.loadModule)
MockLoader.prototype.loadFile = jest.fn(() => Promise.resolve(returnValues.loadFile))
MockLoader.prototype.loadModuleFromFile = jest.fn(() => Promise.resolve(returnValues.loadModuleFromFile))

const instance = new MockLoader()

MockLoader.getInstance = jest.fn(() => Promise.resolve(instance))

loader.default = MockLoader
loader.__instance = instance
loader.__setMockReturnValues = (values) => {
  Object.assign(returnValues, values)
  return loader
}

module.exports = loader
