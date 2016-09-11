const utils = jest.genMockFromModule('../utils')

utils.memoize = arg => arg

module.exports = utils
