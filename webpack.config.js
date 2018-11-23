const HtmlWebPackPlugin = require('html-webpack-plugin') // 用于导入在内存中自动生成的index页面的插件
const webpack = require('webpack');

// 因为webpack是基于Node构建的，所以webpack支持所有Node API和语法；
// Node使用Chrome 的V8 JavaScript引擎来运行代码，所以Chrome浏览器支持哪些新的JS特性，则Node就支持哪些。

// 向外暴露一个打包的配置对象；
module.exports = {
    mode: 'development', // development | production

    // 在webpack 4.x中，有一个很大的特性，就是“约定大于配置”，默认的打包入口路径是src -> index.js
    entry: `${__dirname}/src/index.js`,
    output: {
        filename: 'bundle.js',
        path: `${__dirname}/dist/static/`
    },

    devServer: {
        contentBase: './dist',
        port: 8000,
        hotOnly: true
    },

    plugins: [
        // 创建插件的实例对象
        new HtmlWebPackPlugin({
            template: `${__dirname}/src/index.html`, // 源文件
            filename: 'index.html' // 生成的内存中首页的名称
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    // webpack默认只能打包处理.js后缀名类型的文件，像.png、.vue无法主动处理，所以要配置第三方的loader。
    module: {       // 所有第三方模块的配置规则
        rules: [    // 第三方匹配规则
            { test: /\.js|jsx$/, use: 'babel-loader', exclude: /node_modules/ },    // exclude，排除项

            // 可以在css-loader之后，通过?追加参数，
            // 其中，有个固定的参数modules，表示为普通的CSS样式表启用模块化。
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },    // 打包处理CSS样式表的第三方loader
            { test: /\.ttf|woff|woff2|eot|svg$/, use: 'url-loader' },   // 打包处理字体文件的loader
            { test: /\.scss$/, use: ['style-loader', 'css-loader?modules&localIdentName=[path][name]-[local]-[hash:5]', 'sass-loader'] }    // 打包处理scss文件的loader
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.vue'],   // 表示这几个文件的后缀名可以省略不写
        alias: {    // 表示别名
            '@': path.join(__dirname, './src')  // 这样@就表示项目根目录中src的这一层路径
        }
    }
}
