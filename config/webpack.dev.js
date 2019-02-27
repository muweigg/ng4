const helpers = require('./helpers');
const config = require('./webpack.common');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const COMMON_STYLE = helpers.root('src/styles/common.scss');

module.exports = webpackMerge(config(), {
    
    devtool: "cheap-module-eval-source-map",

    module: {
        rules: [
            { test: /\.ts$/, use: ['@angularclass/hmr-loader', 'ng-router-loader', { loader: 'awesome-typescript-loader', options: { useCache: true } }, 'angular2-template-loader'] },
            {
                test: /\.(s[ac]|c)ss$/,
                use: [
                    'style-loader',
                    {
                      loader: 'css-loader',
                      options: {
                        importLoaders: 2,
                      },
                    },
                    'postcss-loader',
                    'sass-loader'
                ],
                include: [COMMON_STYLE]
            },
            { test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/, parser: { system: true } },
        ]
    },

    plugins: [
        new webpack.ContextReplacementPlugin(
            /[\/\\]@angular[\/\\]core[\/\\]fesm5/,
            helpers.root('src'),
            {}
        ),
    ]
});