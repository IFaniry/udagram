const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/server.ts',
  target: 'node',
  plugins: [
    // https://www.npmjs.com/package/jimp#webpack
    new webpack.DefinePlugin({
      'process.browser': 'true'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'www'),
  },
};
