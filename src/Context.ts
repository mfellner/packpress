export interface Context<T> {
  readonly pathname: string;
  getState(query: string): Promise<T>;
}

export default Context;
