const helpers      = require('./helpers');
const AssetsPlugin = require('assets-webpack-plugin');
const CopyPlugin   = require('copy-webpack-plugin');
const HtmlPlugin   = require('html-webpack-plugin');
const {
    DefinePlugin,
    NoEmitOnErrorsPlugin,
    LoaderOptionsPlugin,
    HotModuleReplacementPlugin,
    NamedModulesPlugin
} = require('webpack');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const DEV_SERVER         = require('./DEV_SERVER');
const SPRITESMITH_CONFIG = require('./SPRITESMITH_CONFIG');
const AOT_PLUGIN         = require('./AOT_PLUGIN');
const NODE_MODULES       = helpers.root('node_modules');

module.exports = function(options){

    const isProd = options.env === 'production';

    return {
        
        entry: {
            'polyfills': helpers.root('src/polyfills.ts'),
            'main': helpers.root('src/main.ts')
        },

        output: {
            path: helpers.root('dist'),
            filename: '[name].js',
            chunkFilename: '[id].chunk.js',
            sourceMapFilename: '[name].map',
        },

        resolve: {
            extensions: ['.ts', '.js'],
            modules: [helpers.root('src'), helpers.root('node_modules')]
        },

        resolveLoader: {
            modules: [
                './node_modules'
            ]
        },

        devServer: DEV_SERVER,
        
        module: {

            rules: [
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: 'source-map-loader',
                    exclude: [
                        /\/node_modules\//
                    ]
                },

                {
                    test: /\.ts$/,
                    loader: '@ngtools/webpack'
                },

                {
                    test: /\.scss$/,
                    use: [
                        'to-string-loader',
                        'raw-loader',
                        'sass-loader',
                        'postcss-loader'
                    ]
                },

                {
                    test: /\.json$/,
                    use: ['json-loader']
                },

                {
                    test: /\.html$/,
                    use: ['raw-loader'],
                    exclude: helpers.root('src/index.html')
                },

                {
                    test: /\.(eot|svg|ttf|woff2?)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 1000,
                            name: '[path][name].[ext]'
                        }
                    }]
                },

                {
                    test: /\.(png|gif|jpe?g)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 1000,
                            name: '[path][name].[ext]'
                        }
                    }]
                }
            ]
        },

        plugins: [
            new NoEmitOnErrorsPlugin(),
            new DefinePlugin({
                'PROD_ENV': JSON.stringify(isProd)
            }),
            new AssetsPlugin({
                path: helpers.root('dist'),
                filename: 'webpack-assets.json',
                prettyPrint: true
            }),
            new CopyPlugin([{
                from: helpers.root('src/assets'),
                to: 'assets',
                ignore: ['favicon.ico']
            }]),
            new CommonsChunkPlugin({
                name: 'polyfills',
                chunks: ['polyfills'],
            }),
            new CommonsChunkPlugin({
                name: 'vendor',
                chunks: ['main'],
                minChunks: (module) => module.resource && module.resource.startsWith(NODE_MODULES),
            }),
            new CommonsChunkPlugin({
                name: ['polyfills', 'vendor'].reverse()
            }),
            new CommonsChunkPlugin({
                name: 'inline',
                minChunks: Infinity
            }),
            new HtmlPlugin({
                template: helpers.root('src/index.html'),
                favicon: helpers.root('src/assets/favicon.ico'),
                hash: true,
                inject: true,
            }),
            new LoaderOptionsPlugin({
                sourceMap: false,
                options: {
                    context: '',
                    sassLoader: {
                        sourceMap: false,
                        includePaths: []
                    }
                }
            }),
            ...SPRITESMITH_CONFIG,
            AOT_PLUGIN
        ]
    }
}