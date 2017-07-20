import React = require('react');

export type Props = {
  title?: string;
  scripts: string[];
  styles: string[];
  html: string;
};

export default class Document extends React.Component<Props> {
  public render() {
    return (
      <html>
        <head>
          <title>
            {this.props.title}
          </title>
          <script
            data-main="__client__"
            src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.3/require.min.js"
          />
          {this.props.scripts.map((s, i) => <script key={i} src={s} defer />)}
          {this.props.styles.map((s, i) => <link key={i} type="text/css" href={s} />)}
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: this.props.html.trim() }} />
        </body>
      </html>
    );
  }
}
