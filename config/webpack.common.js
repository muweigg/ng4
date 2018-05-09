const helpers = require('./helpers');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devServer = require('./devServer');
const spritesmithConfig = require('./spritesmithConfig');
const htmlLoaderConfig = require('./htmlLoaderConfig');
const INDEX_HTML = helpers.root('src/index.html');
const COMMON_STYLE = helpers.root('src/styles/common.scss');
const entryPoints = ["manifest", "polyfills", "vendor", "common", "main"];

const tsConfigPath = 'tsconfig.json';

module.exports = function(options) {

    const supportES2015 = helpers.supportES2015(tsConfigPath);

    return {

        devServer: devServer,

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
            modules: [helpers.root('node_modules')],
            
            /**
             * Add support for lettable operators.
             *
             * For existing codebase a refactor is required.
             * All rxjs operator imports (e.g. `import 'rxjs/add/operator/map'` or `import { map } from `rxjs/operator/map'`
             * must change to `import { map } from 'rxjs/operators'` (note that all operators are now under that import.
             * Additionally some operators have changed to to JS keyword constraints (do => tap, catch => catchError)
             *
             * Remember to use the `pipe()` method to chain operators, this functinoally makes lettable operators similar to
             * the old operators usage paradigm.
             *
             * For more details see:
             * https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md#build-and-treeshaking
             *
             * If you are not planning on refactoring your codebase (or not planning on using imports from `rxjs/operators`
             * comment out this line.
             *
             * BE AWARE that not using lettable operators will probably result in significant payload added to your bundle.
             */
            alias: helpers.rxjsAlias(supportES2015)
        },

        module: {
            rules: [
                { test: /\.html$/, use: ['ejs-tpl-loader'], include: [INDEX_HTML] },
                { test: /\.json$/, use: ['json-loader'] },
                { test: /\.css$/,  use: ['raw-loader', 'postcss-loader', 'sass-loader'], exclude: [COMMON_STYLE] },
                { test: /\.scss$/, use: ['raw-loader', 'postcss-loader', 'sass-loader'], exclude: [COMMON_STYLE] },
                {
                    test: /\.html$/,
                    use: [{
                        loader: 'html-loader',
                        options: htmlLoaderConfig
                    }], exclude: [INDEX_HTML]
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            name: '[path][name].[hash].[ext]',
                            outputPath: url => url.replace(/^src/i, '.')
                        }
                    }]
                },
                {
                    test: /\.(eot|woff2?|ttf)([\?]?.*)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[hash].[ext]',
                            outputPath: url => url.replace(/^src/i, '.')
                        }
                    }]
                },
            ]
        },

        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.DefinePlugin({
                'ENV': JSON.stringify(process.env.ENV),
                'process.env.ENV': JSON.stringify(process.env.ENV),
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),
            /* new CopyPlugin([{
                from: helpers.root('src/assets'),
                to: 'assets/[path][name].[hash].[ext]',
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
                template: helpers.root('src/index.html'),
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
            ...spritesmithConfig,
            /**
             * If you are interested to drill down to exact dependencies, try analyzing your bundle without ModuleConcatenationPlugin. See issue https://github.com/webpack-contrib/webpack-bundle-analyzer/issues/115 for more discussion.
             */
            // new BundleAnalyzerPlugin(),
        ]
    }
}