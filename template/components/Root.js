import React, { Component } from 'react'
import Blog from './Blog'
import Footer from './Footer'
import Header from './Header'

export default class Root extends Component {
  props: {
    posts: Array<{name: string, html: string}>
  }

  render() {
    return <div>
      <Header/>
      <Blog posts={this.props.posts}/>
      <Footer/>
    </div>
  }
}
