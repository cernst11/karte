const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');


module.exports = {
    entry: {
        app: './js/index.js'
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
                test: /\.(json|geojson)$/,
                loader: 'file-loader'
            },
            {
                test: /manifest.json$/,
                loader: 'file-loader?name=manifest.json!web-app-manifest-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader'}
                
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|worker\.js)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": [
                            ["env", {
                                "targets": {
                                    "browsers": ["last 2 versions", "safari >= 10"]
                                }
                            }]
                        ]
                    }
                }
            }

        ]
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),

        new HtmlWebpackPlugin({
            title: 'Karte',
            inject: true,
            template: './index.html',
            hash: true
        }),
        new OfflinePlugin({
            safeToUseOptionalCaches: true,
            publicPath: '/',
            caches: {
                main: [
                    'bundle.js'
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
        })
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },

};