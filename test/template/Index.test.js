import React from 'react'
import renderer from 'react-test-renderer'
import Index from '../../lib/template/Index'
import Test from '../fixtures/Test'

describe('Index', () => {
  it('should render the Root property component', () => {
    const props = {
      Root: Test,
      language: 'en',
      title: 'Test',
      description: 'This is only a test.',
      text: 'Hello, world!',
      link: 'https://github.com/mfellner/packpress'
    }
    const component = renderer.create(
      <Index {...props}/>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
