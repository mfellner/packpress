import React, { Component } from 'react'
import Blog from './Blog'
import Footer from './Footer'
import Header from './Header'

export default class Root extends Component {
  render() {
    return <div>
      <Header/>
      <Blog/>
      <Footer/>
    </div>
  }
}
