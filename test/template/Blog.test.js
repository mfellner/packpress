import React from 'react'
import renderer from 'react-test-renderer'
import Blog from '../../template/components/Blog'

describe('Blog', () => {
  it('should render blog posts', () => {
    const props = {
      posts: [
        {name: 'Hello', html: '<div>World!</div>'},
        {name: 'Bonjour', html: '<div>Le monde!</div>'}
      ]
    }
    const component = renderer.create(
      <Blog {...props}/>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
