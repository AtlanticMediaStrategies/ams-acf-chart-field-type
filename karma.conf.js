module.exports = (config) => {
  config.set({
    basePath: 'assets/src',
    singleRun: true,
    frameworks: ['mocha'],
    reporters: ['dots'],
    browsers: ['PhantomJS'],
    files: [
      'test/**/*.spec.js',
    ],
    preprocessors: {
      'test/**/*.spec.js': ['webpack'],
    },
    webpack: {
      resolve: {
        extensions: ['', '.js', '.ts'],
        modulesDirectories: ['node_modules', 'src'],
      },
      module: {
        loaders: [{
          test: /\.js$/,
          loader: 'babel-loader',
        }],
      },
    },
    plugins: [
      'karma-mocha',
      'karma-webpack',
      'karma-phantomjs-launcher'
    ],
    webpackMiddleware: {
      stats: {
        color: true,
        chunkModules: false,
        modules: false,
      },
    },
  });
};
