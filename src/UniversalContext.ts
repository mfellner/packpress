import ContentProvider from './ContentProvider';
import Context from './Context';

export default class UniversalContext<T> implements Context<T> {
  public readonly pathname: string;
  private readonly provider: ContentProvider<T>;

  constructor(args: { pathname: string; provider: ContentProvider<T> }) {
    this.pathname = args.pathname;
    this.provider = args.provider;
  }

  public async getState(query: string): Promise<T> {
    return this.provider.getContent(query);
  }
}
