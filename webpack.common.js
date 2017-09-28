const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
                test: /\.json$/,
                loader: 'file-loader'
            },
            {
                test: /manifest.json$/,
                loader: 'file-loader?name=manifest.json!web-app-manifest-loader'
            }

        ]
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),

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
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },

};