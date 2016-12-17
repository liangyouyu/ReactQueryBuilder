'use strict';

const path = require('path');
const webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlPlugin = require('html-webpack-plugin');
let DefinePlugin = require('webpack').DefinePlugin;

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
                'css!sass'
            )
        }, {
            test: /\.(png|gif|jpg)$/,
            loader: 'file?name=[path][name].[ext]'
        }, {
            test: /\.(eot|svg|ttf|woff)$/,
            loader: 'file?name=[path][name].[ext]'
        }]
    },
    resolve: {
        modulesDirectories: ['node_modules']
    },
    entry: {
        // 'vendor': ['react', 'react-dom'],
        'home':  './demo/index.jsx',
        // 'index': './lib/index.jsx'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist/demo')
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin('vendor', 'common.js'),
        // new webpack.optimize.DedupePlugin(),
        new ExtractTextPlugin("[name].css"),
        new HtmlPlugin({
            title: 'react-querybuilder (DEMO)',
            template: './demo/index.html'
        })
    ]

};