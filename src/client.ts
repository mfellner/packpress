import MarkdownContentProvider from './MarkdownContentProvider';
import UniversalContext from './UniversalContext';

declare type RequireJs = {
  config: (options: object) => (modules: string[], callback: (...args: any[]) => void) => void;
};

interface ClientWindow extends Window {
  requirejs: RequireJs;
}

const context = new UniversalContext({
  pathname: window.location.pathname,
  provider: new MarkdownContentProvider({
    contentBase: window.location.origin
  })
});

(window as ClientWindow).requirejs.config({
  paths: {
    react: 'https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react',
    'react-dom': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react-dom'
  }
})(['react', 'react-dom', 'PageElement'], async (React, ReactDOM, PageElement) => {
  const Element = PageElement.__esModule && PageElement.default ? PageElement.default : PageElement;
  const props = Element.getInitialProps ? (await Element.getInitialProps(context)) || {} : {};
  const element = React.createElement(Element, props);
  ReactDOM.render(element, document.getElementById('root'));
});
