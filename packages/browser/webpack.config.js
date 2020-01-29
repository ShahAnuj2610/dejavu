const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
require('favicons-webpack-plugin');
require('copy-webpack-plugin');
const WriteWebPackPlugin = require('write-file-webpack-plugin');

const plugins = [
	// Ignore all locale files of moment.js
	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	new CleanWebpackPlugin([path.resolve(__dirname, 'lib')]),
	new WriteWebPackPlugin(),
];

module.exports = {
	entry: [path.resolve(__dirname, 'src/index.js')],
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: 'index.js',
		libraryTarget: 'commonjs2',
	},
	optimization: {
		splitChunks: {
			chunks: 'initial',
		},
	},
	plugins,
	module: {
		rules: [
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader', // translates CSS into CommonJS
					},
					{
						loader: 'less-loader', // compiles Less to CSS
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: ['file-loader'],
			},
		],
	},
};
