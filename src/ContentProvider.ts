export interface ContentProvider<T> {
  resolveRoutes(route: string | RegExp): Promise<string[]>;
  getContent(query: string): Promise<T>;
}

export default ContentProvider;
