const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
  entry: path.resolve(__dirname, '../src/browser/main.ts'),
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist/browser'),
    filename: '[name].js',
  },
};
