/// <reference path="../typings/index.d.ts" />

import remark = require('remark');
import remarkReact = require('remark-react');
import { ReactElement } from 'react';
import ContentAdapter from './ContentAdapter';
import ContentProvider from './ContentProvider';
import * as utils from './utils';

export default class MarkdownContentProvider implements ContentProvider<ReactElement<any>> {
  private readonly contentBase: string;
  private contentAdapter: ContentAdapter;

  constructor(args: { contentBase: string }) {
    this.contentBase = args.contentBase;
  }

  public async resolveRoutes(route: string | RegExp): Promise<string[]> {
    const files = await this.getContentFiles();
    const paths = files.map(f => `/${utils.basename(f, utils.extname(f))}`);
    let filtered;

    if (route === '/') {
      filtered = paths.filter(p => '/index' === p);
    } else if (typeof route === 'string') {
      filtered = paths.filter(p => route === p);
    } else {
      filtered = paths.filter(p => route.test(p));
    }

    if (filtered.length > 0) {
      return filtered;
    }
    if (typeof route === 'string') {
      return [route];
    }
    return [];
  }

  public async getContentFiles(): Promise<string[]> {
    const adapter = await this.getContentAdapter();
    return adapter.listFiles(this.contentBase, '**/*.md');
  }

  public async getContent(query: string): Promise<ReactElement<any>> {
    const adapter = this.getContentAdapter();
    const filename = utils.basename(query, utils.extname(query));
    const b = await adapter.readFile(this.contentBase, `${filename}.md`);
    const result = await remark().use(remarkReact).process(b.toString());
    return result.contents;
  }

  private getContentAdapter(): ContentAdapter {
    if (!this.contentAdapter) {
      let m;
      if (utils.isBrowser) {
        m = require('./StaticHttpAdapter');
      } else {
        m = require('./FilesystemAdapter');
      }
      this.contentAdapter = new m.default();
    }
    return this.contentAdapter;
  }
}
