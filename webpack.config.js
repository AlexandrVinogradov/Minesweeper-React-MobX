var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
        {
            test: /\.jsx?$/,
            use: ['babel-loader'],
            include: path.join(__dirname, 'src')
        },
        {
            test: /\.css$/,
            use: [
                'style-loader',
                {
                    loader: "css-loader",
                    options: {
                        modules: true, // default is false
                        sourceMap: true,
                        importLoaders: 1,
                        localIdentName: "[name]--[local]--[hash:base64:8]"
                    }
                }
            ],
            //include: path.join(__dirname, 'node_modules'), // oops, this also includes flexboxgrid
            //exclude: /flexboxgrid/ // so we have to exclude it
        },
        {
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader",
                options: {
                    modules: true, // default is false
                    sourceMap: true,
                    importLoaders: 1,
                    localIdentName: "[name]--[local]--[hash:base64:8]"
                }
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }],
            //include: path.join(__dirname, 'node_modules'), // oops, this also includes flexboxgrid
            //exclude: /flexboxgrid/ // so we have to exclude it
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }
            ]
        },
        {
            test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            loader: 'file-loader'
        }
    ]
  }
};
