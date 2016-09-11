export function expectAsyncToThrow<T>(promise: Promise<T>): (regex: ?RegExp) => Promise<any> {
  return (regex: ?RegExp) => promise
    .then(result => expect(() => result))
    .catch(error => expect(() => { throw error }))
    .then(expected => expected.toThrow(regex))
}
