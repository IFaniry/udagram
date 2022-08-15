const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const {
  NODE_ENV = 'production',
} = process.env;

module.exports = {
  entry: './src/server.ts',
  mode: NODE_ENV,
  target: 'node',
  externals: [
    nodeExternals(),
  ],
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
  }
};
