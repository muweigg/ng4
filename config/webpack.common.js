const helpers = require('./helpers');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

const DEV_SERVER = require('./DEV_SERVER');
const SPRITESMITH_CONFIG = require('./SPRITESMITH_CONFIG');
const AOT_PLUGIN = require('./AOT_PLUGIN');
const NODE_MODULES = helpers.root('node_modules');
const COMMON_STYLE = helpers.root('src/styles/common.scss');

module.exports = function (options) {

	const isProd = options.env === 'production';

	return {

		devServer: DEV_SERVER,

		entry: {
			polyfills: [helpers.root('src/polyfills.ts')],
			main: [helpers.root('src/main.ts')],
			common: [COMMON_STYLE]
		},

		output: {
			path: helpers.root('dist'),
			filename: '[name].js',
			chunkFilename: '[id].chunk.js',
			sourceMapFilename: '[name].map',
		},

		resolve: {
			extensions: ['.ts', '.js'],
			modules: [helpers.root('node_modules')]
		},

		module: {
			rules: [
				{ test: /\.ts$/, use: ['@ngtools/webpack'] },
				{ test: /\.html$/, use: ['raw-loader'] },
				{ test: /\.json$/, use: ['json-loader'] },
				{ test: /\.css$/, use: ['raw-loader', 'postcss-loader', 'sass-loader'] },
				{ test: /\.scss$/, use: ['raw-loader', 'postcss-loader', 'sass-loader'], exclude: [COMMON_STYLE] }
			]
		},

		plugins: [
			new webpack.NoEmitOnErrorsPlugin(),
			new webpack.LoaderOptionsPlugin({
				debug: !isProd,
				minimize: isProd,
				options: {
					context: '',
					"sassLoader": {
						"sourceMap": false,
						"includePaths": []
					}
				}
			}),
			new webpack.DefinePlugin({
				'PROD_ENV': JSON.stringify(isProd)
			}),
			new CopyPlugin([{
				from: helpers.root('src/assets'),
				to: 'assets',
				ignore: ['favicon.ico']
			}]),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'polyfills',
				chunks: ['polyfills'],
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				chunks: ['main'],
				minChunks: (module) => module.resource && module.resource.startsWith(NODE_MODULES),
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: ['polyfills', 'vendor'].reverse()
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'inline',
				minChunks: Infinity
			}),
			new HtmlPlugin({
				template: helpers.root('src/index.html'),
				favicon: helpers.root('src/assets/favicon.ico'),
				hash: true
			}),
			...SPRITESMITH_CONFIG,
			AOT_PLUGIN
		]
	}
}