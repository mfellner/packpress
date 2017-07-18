import fs = require('mz/fs');
import path = require('path');
import React = require('react');
import { ComponentClass } from 'react';
import ReactDOMServer = require('react-dom/server');
import ContentProvider from './ContentProvider';
import MarkdownContentProvider from './MarkdownContentProvider';

const root = path.resolve(__dirname, '../example');
const pageExtensions = ['.js', '.jsx', '.tsx'];

export interface Context {
  readonly pathname: string;
  getState(query: string): Promise<any>;
}

class ServerContext implements Context {
  public readonly pathname: string;
  private readonly provider: ContentProvider;

  constructor(args: { pathname: string; provider: ContentProvider }) {
    this.pathname = args.pathname;
    this.provider = args.provider;
  }

  public async getState(query: string): Promise<any> {
    return this.provider.getContent(query);
  }
}

export type PageType = ComponentClass<any> & {
  route: RegExp;
  getInitialProps: (ctx: Context) => Promise<any>;
};

async function loadPages(dir: string): Promise<PageType[]> {
  const names = await fs.readdir(dir);
  const files = names
    .filter(n => pageExtensions.includes(path.extname(n)))
    .map(n => path.resolve(dir, n));

  return Promise.all(files.map(f => import(f).then(m => m.default)));
}

async function main(): Promise<void> {
  // const page = await import('../example/pages/page');
  // const html = ReactDOMServer.renderToString(React.createElement(page.default));
  // console.log(html);
  const provider = new MarkdownContentProvider({ dir: path.join(root, 'content') });

  const pages = await loadPages(path.join(root, 'pages'));
  const htmls = pages
    .map(async page => {
      const pathnames = await provider.getPaths(page.route);

      return Promise.all(
        pathnames.map(async pathname => {
          const ctx = new ServerContext({ pathname, provider });
          const props = await page.getInitialProps(ctx);
          return React.createElement(page, props);
        })
      );
    })
    .map(async promises => {
      const elements = await promises;
      return elements.map(e => ReactDOMServer.renderToString(e));
    });

  const html = await Promise.all(htmls).then(xs => xs.reduce((ys, x) => ys.concat(x), []));

  for (const h of html) {
    console.log(h);
  }
}

main().catch(e => console.error(e));
