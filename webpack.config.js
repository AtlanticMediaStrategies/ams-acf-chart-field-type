const path = require('path');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const merge = require('webpack-merge');

const development = require('./assets/webpack/dev.config.js');
const production = require('./assets/webpack/prod.config.js');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
  app: path.resolve('./assets/src'),
  frontend: path.resolve('./assets/src/frontend.js'),
  build: path.join(__dirname, '/assets/dist'),
};

process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    bundle: PATHS.app,
    frontend: PATHS.frontend,
  },

  output: {
    path: PATHS.build,
    filename: '[name].js',
  },

  resolve: {
    extensions: ['', '.jsx', '.js', '.json', '.scss'],
    modulesDirectories: ['node_modules', PATHS.app],
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/,
    }],
  },

  postcss: (webpack) => {
    return [
      autoprefixer({
        browsers: ['last 2 versions'],
      }),
      postcssImport({
        addDependencyTo: webpack,
      }),
    ];
  },
};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(development, common);
}

if (TARGET === 'build' || !TARGET) {
  module.exports = merge(production, common);
}
