const template = jest.genMockFromModule('../template')
const returnValues = {
  getFiles: [],
  getTemplateFiles: []
}

template.getFiles = () => Promise.resolve(returnValues.getFiles)
template.getTemplateFiles = () => Promise.resolve(returnValues.getTemplateFiles)
template.__setMockReturnValues = (values) => {
  Object.assign(returnValues, values)
  return template
}

module.exports = template
