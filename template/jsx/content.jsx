import React from 'react'

class Content extends React.Component {
  render() {
    return (
      <div>
        {this.props.posts.map((post, i) => {
          return (<div key={i}>Post {i}</div>)
        })}
      </div>
    )
  }
}

export default Content
