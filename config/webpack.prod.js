const helpers = require('./helpers');
const config = require('./webpack.common');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SuppressExtractedTextChunksWebpackPlugin = require('./plugins/SuppressExtractedTextChunksWebpackPlugin');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const tsConfigPath = 'tsconfig.json';
const ENV = process.env.ENV = process.env.NODE_ENV = "production";
const AOT = helpers.hasNpmFlag('aot');
const COMMON_STYLE = helpers.root('src/styles/common.scss');
const supportES2015 = helpers.supportES2015(tsConfigPath);

function getUglifyOptions(supportES2015) {
    const uglifyCompressOptions = {
        pure_getters: true,
        // PURE comments work best with 3 passes.
        // See https://github.com/webpack/webpack/issues/2899#issuecomment-317425926.
        passes: 3
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

module.exports = webpackMerge(config({ env: ENV }), {
    output: {
        filename: '[name].[chunkhash].bundle.js',
        chunkFilename: '[id].[chunkhash].chunk.js',
    },
    module: {
        rules: [
            { test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, use: AOT ? ['@angular-devkit/build-optimizer/webpack-loader', '@ngtools/webpack'] : ['@ngtools/webpack'] },
            {
                test: /\.(s[ac]|c)ss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?importLoaders=1&minimize=true', 'postcss-loader', 'sass-loader']
                }),
                include: [COMMON_STYLE]
            },
        ]
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CleanPlugin(['dist'], { root: helpers.root() }),
        new ExtractTextPlugin('[name].[contenthash].css'),
        new SuppressExtractedTextChunksWebpackPlugin(),
        new AngularCompilerPlugin({
            tsConfigPath: './tsconfig.json',
            mainPath: './src/main.ts',
            skipCodeGeneration: !AOT
        }),
        new PurifyPlugin(),
        new UglifyJsPlugin({
            sourceMap: false,
            parallel: true,
            uglifyOptions: getUglifyOptions(supportES2015),
        }),
    ]
});