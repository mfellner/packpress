import React, { Component } from 'react'

export default class Test extends Component {
  props: {
    text: string;
    link: string;
  }

  render() {
    return <span>
      <a href={this.props.link}>{this.props.text}</a>
    </span>
  }
}
