const helpers = require('./helpers');
const config = require('./webpack.common');
const webpackMerge = require('webpack-merge');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const COMMON_STYLE = helpers.root('src/styles/common.scss');

module.exports = webpackMerge(config({ env: ENV }), {
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.(s[ac]|c)ss$/,
            use: ['style-loader', 'css-loader?importLoaders=1&url=false', 'postcss-loader', 'sass-loader'],
            include: [COMMON_STYLE]
        }]
    },
});
