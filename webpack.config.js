const path = require('path');

module.exports = {
  mode: "production",
  entry: path.join(__dirname, 'src/index.tsx'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  }
};
