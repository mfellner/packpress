import React = require('react');
import { Context } from '../../src';

export type Props = {
  content?: React.ReactElement<any>;
};

export default class Page extends React.Component<Props, any> {
  public static route = /\/[a-z-]+$/;

  public static async getInitialProps(ctx: Context) {
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

export function foo() {
  return (
    <div>
      {React.createElement(Page)}
    </div>
  );
}
