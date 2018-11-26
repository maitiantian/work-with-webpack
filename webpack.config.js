const HtmlWebpackPlugin = require('html-webpack-plugin');       // 用于导入在内存中自动生成的index页面的插件
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

// 因为webpack是基于Node构建的，所以webpack支持所有Node API和语法；
// Node使用Chrome的V8 JavaScript引擎来运行代码，所以Chrome浏览器支持哪些新的JS特性，则Node就支持哪些。

// 向外暴露一个打包的配置对象；
module.exports = {
    mode: 'development', // development | production
    devtool: 'inline-source-map',
    // 在生产环境中避免使用inline-***和eval-***，因为它们会增加bundle大小，降低性能
    // 生产环境中使用source-map
    // devtool: 'source-map',

    // 在webpack 4.x中，有一个很大的特性，就是“约定大于配置”，默认的打包入口路径是src -> index.js
    entry: './src/index.js',
    // entry: {
    //     app: './src/index.js',
    //     app2: './src/index2.js'
    // }

    output: {
        filename: '[name].bundle.js',
        path: `${__dirname}/dist/`
    },

    optimization: {
        runtimeChunk: 'single',
        // 使用SplitChunks可以将多个入口文件中重复的依赖模块分离到单独的chunk中
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },

    devServer: {
        contentBase: './dist',
        port: 8000,
        hot: true,
        // hotOnly: true,
        // 在某些模块不支持热更新的情况下，hot会自动刷新页面，hotOnly不会刷新页面，而是在控制台输出热更新失败。
    },

    plugins: [
        // 创建插件的实例对象
        new HtmlWebpackPlugin({
            title: 'HTML title',
            template: `${__dirname}/src/index.html`, // 源文件
            filename: 'index.html' // 生成的内存中首页的名称
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(['dist']),

        // 生产环境中启用source map
        // new UglifyJSPlugin({
        //     sourceMap: true
        // }),

        // 许多library将通过与process.env.NODE_ENV环境变量关联，以决定library中应该引用哪些内容，
        // 生产环境中，一些library为了使调试更容易，会添加额外的日志记录(log)和测试(test)，
        // 开发环境中，一些library可能针对具体用户的环境进行代码优化，从而删除或添加一些重要代码，减小bundle体积。
        // 另外，任何位于/src的本地代码都可以访问到process.env.NODE_ENV。
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
        // 命令行使用以下参数也可实现同样效果，--define process.env.NODE_ENV="'development'"。
    ],
    
    // webpack默认只能打包处理.js后缀名类型的文件，像.png、.vue无法主动处理，所以要配置第三方的loader。
    module: {       // 所有第三方模块的配置规则
        rules: [    // loader匹配规则
            { test: /\.js|jsx$/, use: 'babel-loader', exclude: /node_modules/ },    // exclude，排除项

            // 可以在css-loader之后，通过?追加参数，
            // 其中，有个固定的参数modules，表示为普通的CSS样式表启用模块化。
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },    // 打包处理CSS样式表的loader
            { test: /\.scss$/, use: ['style-loader', 'css-loader?modules&localIdentName=[path][name]-[local]-[hash:5]', 'sass-loader'] },    // 打包处理scss文件的loader

            // file-loader 和 url-loader 可以接收并加载任何文件，然后将其输出到构建目录
            { test: /\.(png|svg|jpg|gif)$/, use: 'file-loader' },
            { test: /\.(ttf|woff|woff2|eot|svg)$/, use: 'url-loader' },

            // 类似于NodeJS，webpack是支持JSON的，import Data from './data.json'
            // 要导入CSV、TSV和XML，可以使用csv-loader和xml-loader
            { test: /\.(csv|tsv)$/, use: 'csv-loader' },
            { test: /\.xml$/, use: 'xml-loader' },
        ],

        // tree shaking：移除JavaScript上下文中的“未引用代码(dead code)”
        // 如果所有代码都不包含副作用，可以将sideEffects标记为false
        // 「副作用」指在导入时会执行特殊行为的代码，而不仅是暴露export
        // sideEffects: false,
        // 如果一些代码有副作用，可以提供一个数组
        // sideEffects: [
        //     './src/some-side-effectful-file.js'
        // 任何导入的文件都会受到tree shaking的影响，
        // 如果在项目中使用类似css-loader并导入CSS文件，
        // 需要将其添加到sideEffects列表中，以免在生产模式中无意中将它删除
        //     '*.css',
        // ],
        // 从webpack 4开始，设置"mode"为"production"即可启用UglifyJSPlugin压缩输出
        // 命令行接口使用--optimize-minimize参数启用UglifyJSPlugin
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.vue'],   // 表示这几个文件的后缀名可以省略不写
        alias: {    // 表示别名
            '@': `${__dirname}/src`  // 这样@就表示项目根目录中src的这一层路径
        }
    }
}
