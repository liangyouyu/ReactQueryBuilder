'use strict';

const path = require('path');
const webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports =  {
    module: {
        loaders: [{
            test: /\.(jsx|js)$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react', 'stage-0']
            }
        },  {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
                'style!css'
            )
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract(
                'css!sass-loader'
            )
        }]
    },
    resolve: {
        modulesDirectories: ['node_modules']
    },
    entry: {
        // 'vendor': ['react', 'react-dom'],
        'index': './lib/index.jsx'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin('vendor', 'common.js'),
        // new webpack.optimize.DedupePlugin(),
        new ExtractTextPlugin('[name].css')
    ]

};