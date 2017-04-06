const helpers = require('./helpers');
const config = require('./webpack.common');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';

module.exports = webpackMerge(config({env: ENV}), {

    devtool: "source-map",
    
});
