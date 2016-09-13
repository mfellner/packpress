import React, { Component } from 'react'

export default class BlogPost extends Component {
  props: {
    name: string,
    html: string
  }

  getMarkup() {
    return {__html: this.props.html}
  }

  render() {
    return <div dangerouslySetInnerHTML={this.getMarkup()}/>
  }
}
