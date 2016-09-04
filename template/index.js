import React, { Component } from 'react'
import Root from './components/Root'

export default class Index extends Component {
  props: {
    language: string;
    title: string;
    description: string;
  }

  render() {
    return <html lang={this.props.language}>
      <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
        <title>{this.props.title}</title>
        <meta name="description" content={this.props.description}/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <body>
        <main id="main">
          <Root/>
        </main>
      </body>
    </html>
  }
}
