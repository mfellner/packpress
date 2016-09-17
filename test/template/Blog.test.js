import React from 'react'
import renderer from 'react-test-renderer'
import Blog from '../../template/components/Blog'

describe('Blog', () => {
  it('should render blog posts', () => {
    const props = {
      posts: [
        {name: 'hello', meta: {title: 'Hello', time: new Date()}, html: '<div>World!</div>'},
        {name: 'bonjour', meta: {title: 'Bonjour', time: new Date()}, html: '<div>Le monde!</div>'}
      ]
    }
    const component = renderer.create(
      <Blog {...props}/>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
