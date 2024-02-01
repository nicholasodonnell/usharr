/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  devServer: {
    allowedHosts: 'all',
    client: {
      overlay: false,
    },
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    liveReload: true,
    port: 3000,
    watchFiles: ['./src/**/*'],
  },
  devtool: isProd ? 'hidden-source-map' : 'inline-source-map',
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              target: 'es2015',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              // postcss-loader
              importLoaders: 1,
              modules: {
                localIdentName: '[local]',
              },
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
        test: /\.(png|jpe?g|gif|svg|webmanifest)$/i,
      },
    ],
  },
  optimization: {
    chunkIds: 'named',
    emitOnErrors: false,
    minimize: isProd,
    splitChunks: {
      chunks: 'async',
    },
  },
  output: {
    clean: true,
    filename: 'app.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}
