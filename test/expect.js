import chaiString from 'chai-string'
import chaiThings from 'chai-things'
import chaiAsPromised from 'chai-as-promised'
import chai from 'chai'

export default chai
  .use(chaiString)
  .use(chaiThings)
  .use(chaiAsPromised)
  .expect
