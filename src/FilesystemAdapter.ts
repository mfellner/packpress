import fs = require('mz/fs');
import path = require('path');
import globby = require('globby');
import ContentAdapter from './ContentAdapter';

export default class FilesystemAdapter implements ContentAdapter {
  public listFiles(...paths: string[]): Promise<string[]> {
    return globby(path.join(...paths));
  }

  public async readFile(...paths: string[]): Promise<string> {
    const b = await fs.readFile(path.join(...paths));
    return b.toString();
  }
}
