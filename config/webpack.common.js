const helpers = require('./helpers');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

const DEV_SERVER = require('./DEV_SERVER');
const SPRITESMITH_CONFIG = require('./SPRITESMITH_CONFIG');
const COMMON_STYLE = helpers.root('src/styles/common.scss');
const entryPoints = ["manifest", "polyfills", "vendor", "common", "main"];

module.exports = function(options) {

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
            filename: '[name].bundle.js',
            chunkFilename: '[id].chunk.js',
            sourceMapFilename: '[file].map',
        },

        resolve: {
            extensions: ['.ts', '.js'],
            modules: [helpers.root('node_modules')]
        },

        module: {
            rules: [
                { test: /\.html$/, use: ['html-loader'] },
                { test: /\.ejs$/, use: ['ejs-tpl-loader'] },
                { test: /\.json$/, use: ['json-loader'] },
                { test: /\.css$/, use: ['raw-loader', 'postcss-loader', 'sass-loader'], exclude: [COMMON_STYLE] },
                { test: /\.scss$/, use: ['raw-loader', 'postcss-loader', 'sass-loader'], exclude: [COMMON_STYLE] },
                { test: /\.(jpe?g|png|gif)$/, use: `url-loader?name=[${isProd ? 'hash' : 'name'}].[ext]&outputPath=assets/images/&limit=10240` },
                { test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/, use: `url-loader?name=[${isProd ? 'hash' : 'name'}].[ext]&outputPath=assets/fonts/` },
            ]
        },

        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.LoaderOptionsPlugin({
                debug: !isProd,
                minimize: isProd,
                options: {
                    context: '',
                    sassLoader: {
                        sourceMap: false,
                        includePaths: []
                    },
                    htmlLoader: {
                        minimize: false,
                        removeAttributeQuotes: false,
                        caseSensitive: true,
                        customAttrSurround: [
                            [/#/, /(?:)/],
                            [/\*/, /(?:)/],
                            [/\[?\(?/, /(?:)/]
                        ],
                        customAttrAssign: [/\)?\]?=/],
                        attrs: ['img:src', 'img:data-src'],
                        interpolate: 'require'
                    },
                    ejsTplLoader: {
                        minimize: false,
                        attrs: ['img:src', 'img:data-src'],
                        interpolate: 'require'
                    }
                }
            }),
            new webpack.DefinePlugin({
                'PROD_ENV': JSON.stringify(isProd)
            }),
            /* new CopyPlugin([{
                from: helpers.root('src/assets'),
                to: 'assets',
                ignore: ['favicon.ico']
            }]), */
            new CheckerPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'polyfills',
                chunks: ['polyfills'],
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                chunks: ['main'],
                minChunks: module => /node_modules/.test(module.resource)
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                minChunks: Infinity
            }),
            new HtmlPlugin({
                filename: 'index.html',
                template: helpers.root('src/index.ejs'),
                favicon: helpers.root('src/assets/favicon.ico'),
                chunksSortMode: function sort(left, right) {
                    let leftIndex = entryPoints.indexOf(left.names[0]);
                    let rightindex = entryPoints.indexOf(right.names[0]);
                    if (leftIndex > rightindex) {
                        return 1;
                    } else if (leftIndex < rightindex) {
                        return -1;
                    } else {
                        return 0;
                    }
                },
                inject: 'head'
            }),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'defer'
            }),
            new InlineManifestWebpackPlugin(),
            ...SPRITESMITH_CONFIG,
        ]
    }
}