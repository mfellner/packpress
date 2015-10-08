import React from 'react'
import content from './content.jsx'
import loadJSON from '../js/util'

const Content = React.createFactory(content)

class Index extends React.Component {
  render() {
    const {title, scripts, ...other} = this.props
    return (
      <html>
        <head>
          <title>{title}</title>
        </head>
        <body>
          <main id="main" dangerouslySetInnerHTML={{
            __html: React.renderToString(Content(other))
          }}/>
          {scripts.map((script, i) => {
            return (<script key={i} src={script} defer={true}/>)
          })}
        </body>
      </html>
    )
  }
}

Index.propTypes = {
  title: React.PropTypes.string.isRequired,
  scripts: React.PropTypes.array
}

Index.defaultProps = {
  scripts: []
}

// If we're running in the browser, initialize the app.
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  loadJSON('/state.json').
  then(props => {
    React.render(Content(props), document.getElementById('main'))
  }).
  catch(err => {
    console.error(err.message, err.code)
  })
}

export default Index
