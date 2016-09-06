import React, { Component } from 'react'

export default class Index extends Component {
  props: {
    Root: React$Component;
    language: string;
    title: string;
    description: string;
  }

  render() {
    const {Root, language, title, description, ...other} = this.props
    return <html lang={language}>
      <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
        <title>{title}</title>
        <meta name="description" content={description}/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <body>
        <main id="main">
          <Root {...other}/>
        </main>
      </body>
    </html>
  }
}
