export interface ContentProvider {
  getPaths(route: RegExp): Promise<string[]>;
  getContent(query: string): Promise<any>;
}

export default ContentProvider;
