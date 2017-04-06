const helpers = require('./helpers');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const DEV_SERVER = require('./DEV_SERVER');
const SPRITESMITH_CONFIG = require('./SPRITESMITH_CONFIG');
const AOT_PLUGIN = require('./AOT_PLUGIN');
const NODE_MODULES = helpers.root('node_modules');
const COMMON_STYLE = helpers.root('src/styles/common.scss');

module.exports = function(options) {

    const isProd = options.env === 'production';

    return {

        devServer: DEV_SERVER,

        entry: {
            polyfills: [ helpers.root('src/polyfills.ts') ],
            main:      [ helpers.root('src/main.ts') ],
            common:    [ COMMON_STYLE ]
        },

        output: {
            path: helpers.root('dist'),
            filename: '[name].js',
            chunkFilename: '[id].chunk.js',
            sourceMapFilename: '[name].map',
        },

        resolve: {
            extensions: ['.ts', '.js'],
            modules: [ helpers.root('node_modules') ]
        },

        resolveLoader: {
            modules: [ helpers.root('node_modules') ]
        },

        module: {
            rules: [
                {
                    "enforce": "pre",
                    "test": /\.js$/,
                    "loader": "source-map-loader",
                    "exclude": [
                        /\/node_modules\//
                    ]
                },
                { test: /\.json$/, "loader": "json-loader" },
                { test: /\.html$/, use: ['raw-loader'] },
                { test: /\.css$/, use: ['raw-loader', 'postcss-loader'] },
                {
                    "exclude": [ COMMON_STYLE ],
                    "test": /\.scss$|\.sass$/,
                    "loaders": [
                        "exports-loader?module.exports.toString()",
                        "raw-loader",
                        "postcss-loader",
                        "sass-loader"
                    ]
                },
                {
                    "include": [ COMMON_STYLE ],
                    "test": /\.scss$|\.sass$/,
                    "loaders": ExtractTextPlugin.extract({
                        "use": [
                            "raw-loader",
                            "postcss-loader",
                            "sass-loader"
                        ],
                        "fallback": "style-loader",
                        "publicPath": ""
                    })
                },
                { test: /\.ts$/, use: ['@ngtools/webpack'] }
            ]
        },

        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
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
                minChunks: null
            }),
            new HtmlPlugin({
                template: helpers.root('src/index.html'),
                favicon: helpers.root('src/assets/favicon.ico'),
                hash: true,
                inject: true
            }),
            new webpack.LoaderOptionsPlugin({
                debug: !isProd,
                minimize: isProd,
                sourceMap: false,
                "options": {
                    "sassLoader": {
                        "sourceMap": false,
                        "includePaths": []
                    },
                    "context": ""
                }
            }),
            new ExtractTextPlugin({
                filename: '[name].css',
                disable: !isProd
            }),
            ...SPRITESMITH_CONFIG,
            AOT_PLUGIN
        ]
    }
}