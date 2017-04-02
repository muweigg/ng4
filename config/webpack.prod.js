const helpers = require('./helpers');
const config = require('./webpack.common');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const { LoaderOptionsPlugin } = require('webpack');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = "production";

module.exports = webpackMerge(config({env: ENV}), {

    plugins: [
        
		new CleanPlugin(['dist'], {
			root: helpers.root('')
		}),
        
		new UglifyJsPlugin({
			sourceMap: false,
			beautify: false,
			output: {
				comments: false
			},
			mangle: {
				screw_ie8: true
			},
			compress: {
				screw_ie8: true,
				warnings: false,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				if_return: true,
				join_vars: true,
				negate_iife: false
			},
		}),
        
        new LoaderOptionsPlugin({
            debug: false,
            minimize: true
        })

    ]

});
