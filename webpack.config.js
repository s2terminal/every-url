const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'example/index.tsx'),
  output: {
    path: path.join(__dirname, 'example/dist'),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(tsx)/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'example/index.html'),
      filename: './index.html'
    })
  ]
};
