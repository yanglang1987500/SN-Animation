
'use strict';

var ExtractTextPlugin = require("extract-text-webpack-plugin");  //css单独打包

module.exports = {
        //页面入口文件配置
    entry:{
      index : './src/index.js',
      snanimation : './src/Animate/snanimation.js'
    },
    output: {
        path: __dirname + '/dist', //打包后的文件存放的地方
        filename: '[name].js', //打包后输出文件的文件名
        publicPath: '/dist/'
    },

    module: {
        loaders: [
            { test: /\.js$/, loader: "jsx!babel", include: /src/},
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css!postcss")},
            { test: /\.scss$/, loader: ExtractTextPlugin.extract("style", "css!postcss!sass")},
            { test: /\.(png|jpg)$/, loader: 'url?limit=8192'}
        ]
    },

    postcss: [
        require('autoprefixer')    //调用autoprefixer插件,css3自动补全
    ],

    devServer: {
        // contentBase: './src/views'  //本地服务器所加载的页面所在的目录
        port: 8888,
        colors: true,  //终端中输出结果为彩色
        historyApiFallback: true,  //不跳转
        inline: true  //实时刷新
    },

    plugins: [
        new ExtractTextPlugin('main.css'),
    ]

}
