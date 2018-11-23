const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');     
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    // entry: {
    //     app: './src/index.js',
    //     app2: './src/index2.js'
    // }

    output: {
        filename: '[name].bundle.js',
        path: `${__dirname}/dist/`
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'HTML title',
            template: `${__dirname}/src/index.html`,
            filename: 'index.html'
        }),
        new CleanWebpackPlugin(['dist'])
    ],

    module: {
        rules: [
            { test: /\.js|jsx$/, use: 'babel-loader', exclude: /node_modules/ },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.scss$/, use: ['style-loader', 'css-loader?modules&localIdentName=[path][name]-[local]-[hash:5]', 'sass-loader'] },
            { test: /\.(png|svg|jpg|gif)$/, use: 'file-loader' },
            { test: /\.(ttf|woff|woff2|eot|svg)$/, use: 'url-loader' },
            { test: /\.(csv|tsv)$/, use: 'csv-loader' },
            { test: /\.xml$/, use: 'xml-loader' },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.vue'],
        alias: {
            '@': `${__dirname}/src`
        }
    }
}
