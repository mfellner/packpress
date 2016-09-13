import React, { Component } from 'react'
import BlogPost from './BlogPost'

export default class Blog extends Component {
  props: {
    posts: Array<{name: string, html: string}>
  }

  render() {
    return <div>
      {this.props.posts.map((post, i) =>
        <BlogPost key={i} name={post.name} html={post.html}/>
      )}
    </div>
  }
}
