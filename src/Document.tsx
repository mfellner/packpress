import React = require('react');

export type Props = {
  title?: string;
  scripts: string[];
  styles: string[];
  html: string;
};

const initScript = `
require.config({
  paths: {
    'react': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react',
    'react-dom': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react-dom'
  }
});
require(['react', 'react-dom', 'PageElement'], function (React, ReactDOM, PageElement) {
  var element;
  if (PageElement.__esModule && PageElement.default) {
    element = React.createElement(PageElement.default);
  } else {
    element = React.createElement(PageElement);
  }
  ReactDOM.render(element, document.getElementById("root"));
});
`;

export default class Document extends React.Component<Props> {
  public render() {
    return (
      <html>
        <head>
          <title>
            {this.props.title}
          </title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.3/require.min.js"></script>
          {this.props.scripts.map((s, i) => <script key={i} src={s} defer />)}
          {this.props.styles.map((s, i) => <link key={i} type="text/css" href={s} />)}
          <script defer dangerouslySetInnerHTML={{ __html: initScript.trim() }} />
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: this.props.html.trim() }} />
        </body>
      </html>
    );
  }
}
