import path = require('path');
import webpack = require('webpack');
import { Configuration, Stats } from 'webpack';

export type Entry = { name: string; file: string };
export type PageEntry = Entry & { route: string; html: string };

export type Options = {
  context: string;
  entries: Entry[];
  pages: PageEntry[];
  outputPath: string;
};

export default class WebpackService {
  private readonly confs: Configuration[];

  constructor(options: Options) {
    const defaultConf: Configuration = {
      entry: {
        __client__: path.resolve(__dirname, 'client.ts')
      },
      output: {
        filename: '[name].js',
        path: options.outputPath
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: path.resolve(__dirname, 'clientconfig.json'),
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
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
      },
      externals: { './FilesystemAdapter': 'undefined' },
      devtool: 'source-map'
    };

    const entries = options.pages.reduce(
      (obj, { name, file }) => Object.assign(obj, { [name]: file }),
      {}
    );

    const pageConf: Configuration = {
      entry: entries,
      context: options.context,
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
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
      },
      externals: ['react', 'react-dom'],
      devtool: 'source-map'
    };

    this.confs = [defaultConf, pageConf];
  }

  public run(): Promise<Stats> {
    return new Promise((resolve, reject) => {
      console.log(this.confs);
      webpack(this.confs, (err, stats) => {
        if (err) return reject(err);
        return resolve(stats);
      });
    });
  }
}
