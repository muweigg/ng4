const helpers = require('./helpers');
const config = require('./webpack.common');
const webpackMerge = require('webpack-merge');
const { LoaderOptionsPlugin } = require('webpack');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';

module.exports = webpackMerge(config({env: ENV}), {

    devtool: "source-map",
    
    plugins: [
        
        new LoaderOptionsPlugin({
            debug: true,
            minimize: false
        })
        
    ]
});
