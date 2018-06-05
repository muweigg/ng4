const helpers = require('./helpers');
const config = require('./webpack.common');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const SuppressExtractedTextChunksWebpackPlugin = require('./plugins/SuppressExtractedTextChunksWebpackPlugin');
const PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const COMMON_STYLE = helpers.root('src/styles/common.scss');
const AOT = helpers.hasNpmFlag('aot');
const supportES2015 = helpers.supportES2015();

function getUglifyOptions(supportES2015) {
    const uglifyCompressOptions = {
        pure_getters: true,
        passes: 2,
        drop_console: true,
        warnings: false
    };

    return {
        ecma: supportES2015 ? 6 : 5,
        warnings: false,
        ie8: false,
        mangle: true,
        compress: uglifyCompressOptions,
        output: {
            ascii_only: true,
            comments: false
        }
    };
}

module.exports = webpackMerge(config(), {

    output: {
        filename: '[name].[chunkhash:12].bundle.js',
        chunkFilename: '[name].[chunkhash:12].chunk.js',
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: false,
                parallel: true,
                cache: helpers.root('.webpack-cache/uglify-cache'),
                uglifyOptions: getUglifyOptions(supportES2015),
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    zindex: false,
                    discardComments: { removeAll: true },
                }
            }),
        ]
    },

    module: {
        rules: [
            { test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, use: AOT ? ['@angular-devkit/build-optimizer/webpack-loader', '@ngtools/webpack'] : ['@ngtools/webpack'] },
            {
                test: /\.(s[ac]|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?importLoaders=1',
                    'postcss-loader',
                    'sass-loader',
                ],
                include: [COMMON_STYLE]
            },
        ]
    },

    plugins: [
        new CleanPlugin(['dist'], { root: helpers.root() }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:12].css',
            chunkFilename: '[name].[contenthash:12].css'
        }),
        new SuppressExtractedTextChunksWebpackPlugin(),
        new AngularCompilerPlugin({
            tsConfigPath: './tsconfig.json',
            mainPath: './src/main.ts',
            skipCodeGeneration: !AOT
        }),
        new PurifyPlugin(),
        new InlineManifestWebpackPlugin(),
    ]
});