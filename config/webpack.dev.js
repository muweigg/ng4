const helpers = require('./helpers');
const config = require('./webpack.common');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackMergeDll = webpackMerge.strategy({ plugins: 'replace' });
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;

const COMMON_STYLE = helpers.root('src/styles/common.scss');

module.exports = webpackMerge(config(), {
    
    devtool: "eval",

    module: {
        rules: [
            { test: /\.ts$/, use: ['@angularclass/hmr-loader', 'ng-router-loader', { loader: 'awesome-typescript-loader', options: { useCache: true } }, 'angular2-template-loader'] },
            {
                test: /\.(s[ac]|c)ss$/,
                use: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader', 'sass-loader'],
                include: [COMMON_STYLE]
            },
        ]
    },

    plugins: [
        new webpack.ContextReplacementPlugin(
            /\@angular(\\|\/)core(\\|\/)f?esm5/,
            helpers.root('src'),
            {}
        ),
    ]
});