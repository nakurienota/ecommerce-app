import path from 'path';
import url from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import DotenvWebpackPlugin from 'dotenv-webpack';
import ESLintPlugin from 'eslint-webpack-plugin';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default {
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: 'ts-loader',
        include: [path.resolve(__dirname, './src')],
      },
      {
        test: /\.(scss|css)$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@core': path.resolve(__dirname, 'src/core'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new DotenvWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: 'global.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, 'dist/assets'),
        },
      ],
    }),
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      extensions: 'ts',
    }),
  ],
};
