
const path = require('path');
const cnf = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const plugins = cnf.plugins || [];

plugins.push(new HtmlWebpackPlugin({}));

const devConf = {
    mode: 'development',
    devtool: 'inline-source-map',
    optimization: {
        minimize: false,
    },
    entry: {
        index: './test/index.ts',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: plugins,
}

Object.assign(cnf, devConf);

module.exports = cnf;