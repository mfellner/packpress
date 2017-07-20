import React = require('react');
import { ReactElement } from 'react';
import Context from '../../src/Context';

export type Props = {
  content?: ReactElement<any>;
};

export default class Page extends React.Component<Props, any> {
  public static route = /\/[a-z-]+$/;

  public static async getInitialProps(ctx: Context<ReactElement<any>>) {
    const content = await ctx.getState(ctx.pathname);
    return { content };
  }

  public render() {
    return (
      <div className="page">
        {this.props.content}
      </div>
    );
  }
}
