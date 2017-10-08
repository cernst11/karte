const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const ReloadPlugin = require('reload-html-webpack-plugin');



module.exports = merge(common, {
    devtool: 'source-map',
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        }),
        new ReloadPlugin()
    ]
});