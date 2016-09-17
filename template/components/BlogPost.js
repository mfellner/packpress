// @flow
import React, { Component } from 'react'

export default class BlogPost extends Component {
  props: {
    link?: string;
    meta: {
      title: string;
      time: Date;
    };
    html: string;
  };

  getMarkup() {
    return {__html: this.props.html}
  }

  renderTitleContent() {
    return <span>
      {this.props.meta.title}
      <small>
        {this.props.meta.time.toLocaleDateString()}
      </small>
    </span>
  }

  renderTitle() {
    if (this.props.link)
      return <h1><a href={this.props.link}>{this.renderTitleContent()}</a></h1>
    else
      return <h1>{this.renderTitleContent()}</h1>
  }

  render() {
    return <div>
      {this.renderTitle()}
      <div dangerouslySetInnerHTML={this.getMarkup()}/>
    </div>
  }
}
