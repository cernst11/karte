const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Uglify = require("uglifyjs-webpack-plugin");
const fs = require('fs');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OfflinePlugin = require('offline-plugin');



var PROD = (process.env.NODE_ENV === 'production')

module.exports = {
    entry: './js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'eval',
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }, {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }, 
            {
                test: /\.json$/,
                loader: 'file-loader'
            },
            {
                test: /manifest.json$/,
                loader: 'file-loader?name=manifest.json!web-app-manifest-loader'
            }

        ]
    },


    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: PROD ? [
        new Uglify({
            compress: {
                warnings: true
            }
        })
    ] : [
        new Uglify({
            compress: {
                warnings: true
            }
        }),
        new HtmlWebpackPlugin({
            title: 'Karte',
            inject: true,
            templateContent: fs.readFileSync('./index.html', 'utf8'),
            hash: true
        }),
        new OfflinePlugin({
            publicPath: '/',
            caches: {
                main: [

                    'main.*.js'
                ],
                additional: [
                    ':externals:'
                ],
                optional: [
                    ':rest:'
                ]
            },
            externals: [
                '/'
            ],
            ServiceWorker: {
                navigateFallbackURL: '/'
            },
            AppCache: {
                FALLBACK: {
                    '/': '/'
                }
            }
        }),

    ]
};