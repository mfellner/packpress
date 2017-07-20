declare type RequireJs = {
  config: (options: object) => (modules: string[], callback: (...args: any[]) => void) => void;
};

interface Window {
  requirejs: RequireJs;
}

const context = {
  pathname: window.location.pathname,
  getState: () => ({
    content: null
  })
};

window.requirejs.config({
  paths: {
    react: 'https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react',
    'react-dom': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react-dom'
  }
})(['react', 'react-dom', 'PageElement'], (React, ReactDOM, PageElement) => {
  const Element = PageElement.__esModule && PageElement.default ? PageElement.default : PageElement;
  const props = Element.getInitialProps ? Element.getInitialProps(context) || {} : {};
  const element = React.createElement(Element, props);
  ReactDOM.render(element, document.getElementById('root'));
});
