import React, { Component } from 'react'

export default class Index extends Component {
  props: {
    title: string
  }

  render() {
    return <html>
      <head>
        <title>{this.props.title}</title>
      </head>
      <body>
      </body>
    </html>
  }
}
