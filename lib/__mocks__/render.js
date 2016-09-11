const render = jest.genMockFromModule('../render')
const returnValues = {
  renderMarkdown: null
}

render.renderMarkdown = jest.fn(() => returnValues.renderMarkdown)
render.__setMockReturnValues = (values) => {
  Object.assign(returnValues, values)
  return render
}

module.exports = render
