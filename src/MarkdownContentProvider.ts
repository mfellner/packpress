/// <reference path="../typings/index.d.ts" />

import fs = require('mz/fs');
import path = require('path');
import remark = require('remark');
import remarkReact = require('remark-react');
import ContentProvider from './ContentProvider';

export default class MarkdownContentProvider implements ContentProvider {
  private readonly dir: string;

  constructor(args: { dir: string }) {
    this.dir = args.dir;
  }

  public async getPaths(route: RegExp): Promise<string[]> {
    const files = await fs.readdir(this.dir);
    return files.map(f => `/${path.basename(f, '.md')}`).filter(f => route.test(f));
  }

  public async getContent(query: string): Promise<any> {
    const b = await fs.readFile(path.join(this.dir, `${query}.md`));
    const result = await remark().use(remarkReact).process(b.toString());
    return result.contents;
  }
}
