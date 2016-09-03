/**
 * @flow
 */

export async function expectAsync<T>(promise: Promise<T>): Promise<any> {
  try {
    const result = await promise
    return expect(result)
  } catch(e) {
    return expect(() => { throw e })
  }
}
