const path = require('path');

module.exports = {
  entry: [
    'babel-polyfill', './index.js'
  ],
  output: {
    filename: `build.js`,
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
};

