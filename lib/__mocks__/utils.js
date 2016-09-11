const utils = jest.genMockFromModule('../utils')
const returnValues = {
  isProjectDir: false,
  findProjectDir: []
}

utils.isProjectDir = jest.fn(() => Promise.resolve(returnValues.isProjectDir))
utils.findProjectDir = jest.fn(() => Promise.resolve(returnValues.findProjectDir))
utils.__setMockReturnValues = (values) => {
  Object.assign(returnValues, values)
  return utils
}

module.exports = utils
