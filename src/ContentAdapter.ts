export interface ContentAdapter {
  listFiles(...paths: string[]): Promise<string[]>;
  readFile(...paths: string[]): Promise<string>;
}

export default ContentAdapter;
