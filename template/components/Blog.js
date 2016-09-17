// @flow
import React, { Component } from 'react'
import BlogPost from './BlogPost'

export default class Blog extends Component {
  props: {
    posts: Array<{name: string; meta: Object; html: string;}>;
  };

  render() {
    return <div>
      {this.props.posts.map((post, i) =>
        <BlogPost
          key={i}
          link={`posts/${post.name}.html`}
          meta={post.meta}
          html={post.html}/>
      )}
    </div>
  }
}
