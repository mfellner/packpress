const project = jest.genMockFromModule('../project')
const returnValues = {
  isProjectDir: false,
  findProjectDir: [],
  getProjectPath: null
}

project.isProjectDir = jest.fn(() => Promise.resolve(returnValues.isProjectDir))
project.findProjectDir = jest.fn(() => Promise.resolve(returnValues.findProjectDir))
project.getProjectPath = jest.fn(() => Promise.resolve(returnValues.getProjectPath))
project.__setMockReturnValues = (values) => {
  Object.assign(returnValues, values)
  return project
}

module.exports = project
