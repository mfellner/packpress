import path = require('path');
import webpack = require('webpack');
import { Configuration, Stats } from 'webpack';

export type Entry = { name: string; file: string; route: string; html: string };

export type Options = {
  context: string;
  entries: Entry[];
  outputPath: string;
};

export default class WebpackService {
  private readonly conf: Configuration;

  constructor(options: Options) {
    const entries = options.entries.reduce(
      (obj, { name, file }) => Object.assign(obj, { [name]: file }),
      {}
    );
    this.conf = {
      entry: entries,
      context: options.context,
      target: 'web',
      output: {
        filename: '[name].js',
        path: options.outputPath,
        library: 'PageElement',
        libraryTarget: 'amd'
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: path.join(options.context, 'tsconfig.json'),
              outDir: './dist/',
              sourceMap: true,
              strict: true,
              module: 'commonjs',
              target: 'es5',
              jsx: 'react',
              removeComments: true,
              lib: ['dom', 'es2015']
            }
          },
          { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
        ]
      },
      externals: ['react', 'react-dom'],
      devtool: 'source-map'
    };
  }

  public run(): Promise<Stats> {
    return new Promise((resolve, reject) => {
      console.log(this.conf);
      webpack(this.conf, (err, stats) => {
        if (err) return reject(err);
        return resolve(stats);
      });
    });
  }
}
