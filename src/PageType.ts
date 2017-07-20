import { ComponentClass } from 'react';
import Context from './Context';

export type PageType<C = any, P = any> = ComponentClass<P> & {
  route: string | RegExp;
  getInitialProps?: (ctx: Context<C>) => Promise<P>;
};

export default PageType;
