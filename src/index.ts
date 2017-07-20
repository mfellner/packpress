import fs = require('mz/fs');
import path = require('path');
import React = require('react');
import ReactDOMServer = require('react-dom/server');
import Document from './Document';
import MarkdownContentProvider from './MarkdownContentProvider';
import PageType from './PageType';
import ServerContext from './ServerContext';
import WebpackService from './WebpackService';

const root = path.resolve(__dirname, '../example');
const pageExtensions = ['.js', '.jsx', '.tsx'];

type EntrypPoints = {
  [key: string]: {
    chunks: number[];
    assets: string[];
    isOverSizeLimit?: boolean;
  };
};

function resolveRoute(file: string): string {
  const name = path.basename(file, path.extname(file));
  if (name === 'index') {
    return '/';
  } else {
    return `/${name}`;
  }
}

async function loadPages(dir: string): Promise<Array<{ file: string; page: PageType }>> {
  const names = await fs.readdir(dir);
  const files = names
    .filter(n => pageExtensions.includes(path.extname(n)))
    .map(n => path.resolve(dir, n));

  return Promise.all(
    files.map(async file => {
      const m = await import(file);
      const page = m.default as PageType;
      if (!page.route) {
        page.route = resolveRoute(file);
      }
      return { file, page };
    })
  );
}

async function main(): Promise<void> {
  const pageDir = path.join(root, 'pages');
  const pages = await loadPages(pageDir);

  const provider = new MarkdownContentProvider({ dir: path.join(root, 'content') });

  const entries = await Promise.all(
    pages
      .map(async ({ file, page }) => {
        const routes = await provider.resolveRoutes(page.route);

        return Promise.all(
          routes.map(async route => {
            const ctx = new ServerContext({ pathname: route, provider });
            const props = page.getInitialProps ? await page.getInitialProps(ctx) : null;
            return { file, route, element: React.createElement(page, props) };
          })
        );
      })
      .map(async promises => {
        const elements = await promises;

        return elements.map(({ file, route, element }) => ({
          name: path.basename(file, path.extname(file)),
          file,
          route,
          html: ReactDOMServer.renderToString(element)
        }));
      })
  ).then(xs => xs.reduce((ys, x) => ys.concat(x)));

  const outputPath = path.join(root, 'dist');

  const webpackService = new WebpackService({
    context: pageDir,
    entries,
    outputPath
  });

  const stats = await webpackService.run();
  const entrypoints: EntrypPoints = stats
    .toJson()
    .children.reduce((obj: EntrypPoints, stat: any) => Object.assign(obj, stat.entrypoints), {});
  console.log(stats.toString());

  await Promise.all(
    entries.map(async entry => {
      const entrypoint = Object.entries(entrypoints).find(
        ([name]) => name.indexOf(entry.name) !== -1
      );
      if (!entrypoint) return;
      const { assets } = entrypoint[1];

      const element = React.createElement(Document, {
        scripts: assets.filter(a => path.extname(a) === '.js'),
        styles: assets.filter(a => path.extname(a) === '.css'),
        html: entry.html
      });
      const html = ReactDOMServer.renderToStaticMarkup(element);

      const { route } = entry;
      const i = route.lastIndexOf('/');
      const dir = route.substring(0, i + 1);
      const file = (route.substring(i + 1, route.length) || 'index') + '.html';
      const filePath = path.join(outputPath, dir, file);

      console.log('write', filePath);
      await fs.writeFile(filePath, html);
    })
  );
}

main().catch(e => console.error(e));
