const futils = jest.genMockFromModule('../file-utils')
const returnValues = {
  readJSON: null,
  copyFile: null,
  fileExists: () => false
}

futils.readJSON = jest.fn(() => Promise.resolve(returnValues.readJSON))
futils.writeFile = jest.fn(f => Promise.resolve(f))
futils.copyFile = jest.fn((a, b) => Promise.resolve(b))
futils.rmFile = jest.fn(() => Promise.resolve())
futils.fileExists = jest.fn((...args) => Promise.resolve(returnValues.fileExists.apply(null, args)))
futils.__setMockReturnValues = (values) => {
  Object.assign(returnValues, values)
  return futils
}

module.exports = futils
