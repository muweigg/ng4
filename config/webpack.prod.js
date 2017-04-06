const helpers = require('./helpers');
const config = require('./webpack.common');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const { SuppressExtractedTextChunksWebpackPlugin } = require('@angular/cli/plugins/webpack');

const ENV = process.env.ENV = process.env.NODE_ENV = "production";

const prod = webpackMerge(config({env: ENV}), {

    devtool: false,

    plugins: [
        
		new CleanPlugin(['dist'], {
			root: helpers.root()
		}),
        
		new webpack.optimize.UglifyJsPlugin({
            mangle: {
                screw_ie8: true
            },
            compress: {
                screw_ie8: true,
                warnings: false
            },
            sourceMap: false
		}),

		new SuppressExtractedTextChunksWebpackPlugin()

    ]

});

module.exports = prod;
