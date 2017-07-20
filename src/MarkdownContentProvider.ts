/// <reference path="../typings/index.d.ts" />

import fs = require('mz/fs');
import path = require('path');
import remark = require('remark');
import remarkReact = require('remark-react');
import { ReactElement } from 'react';
import ContentProvider from './ContentProvider';

export default class MarkdownContentProvider implements ContentProvider<ReactElement<any>> {
  private readonly dir: string;

  constructor(args: { dir: string }) {
    this.dir = args.dir;
  }

  public async resolveRoutes(route: string | RegExp): Promise<string[]> {
    const files = await fs.readdir(this.dir);
    const paths = files.map(f => `/${path.basename(f, path.extname(f))}`);
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

  public async getContent(query: string): Promise<ReactElement<any>> {
    const b = await fs.readFile(path.join(this.dir, `${query}.md`));
    const result = await remark().use(remarkReact).process(b.toString());
    return result.contents;
  }
}
