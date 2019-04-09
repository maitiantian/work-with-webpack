const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    entry: ['@babel/polyfill', './src/index.js'],
	mode: 'production',
    devtool: 'source-map',

    plugins: [
        new HtmlWebpackPlugin({
            title: 'HTML title',
            template: `${__dirname}/src/index.html`,
            filename: 'index.html'
        }),
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],

    // sideEffects: false,
    // sideEffects: [
    //     './src/some-side-effectful-file.js'
    //     '*.css',
    // ],
})