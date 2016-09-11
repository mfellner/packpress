import path from 'path'

describe('utils', () => {
  const utils = require('../lib/utils')

  describe('#memoize()', () => {
    it('should store the result of a synchronous function', () => {
      const _fn = (x: integer) => x + 1
      const fn = utils.memoize(_fn)

      expect(_fn(0)).toBe(1)
      expect(_fn(1)).toBe(2)
      expect(fn(0)).toBe(1)
      expect(fn(1)).toBe(1)
    })

    it('should store the result of an asynchronous function', async () => {
      const _fn = (x: integer) => Promise.resolve(x + 1)
      const fn = utils.memoize(_fn)

      expect(await _fn(0)).toBe(1)
      expect(await _fn(1)).toBe(2)
      expect(await fn(0)).toBe(1)
      expect(await fn(1)).toBe(1)
    })
  })
})
