describe('render', () => {
  const render = require('../lib/render')

  const markdown = '# Hello\nThis is a test.'

  describe('#renderMarkdown()', () => {
    it('should render markdown to HTML', async () => {

      const html = render.renderMarkdown(markdown)
      expect(typeof html).toBe('string')
    })
  })
})
