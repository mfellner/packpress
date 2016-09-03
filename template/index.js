import React, { Component } from 'react'
import Root from './components/Root'

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
        <main id="main">
          <Root/>
        </main>
      </body>
    </html>
  }
}
