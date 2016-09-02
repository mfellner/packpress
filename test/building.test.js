import path from 'path'
import * as building from '../lib/building'

describe('building', () => {
  const testFile = path.resolve(__dirname, 'fixtures', 'hello-component.js')

  describe('#renderHTML()', () => {
    it('should render HTML', async () => {
      const result = await building.renderHTML(testFile, {title: 'hello'})
      expect(result).toBe('<html><head><title>hello</title></head><body></body></html>')
    })
  })
})
