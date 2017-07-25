import ContentAdapter from './ContentAdapter';
import * as utils from './utils';

export default class StaticHttpAdapter implements ContentAdapter {
  public listFiles(..._: string[]): Promise<string[]> {
    throw new Error('Not implemented');
  }

  public async readFile(...paths: string[]): Promise<string> {
    const r = await fetch(utils.joinPaths(...paths));
    return r.text();
  }
}
