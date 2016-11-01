var debug = process.env.NODE_ENV !== "production";
var webpack = require("webpack");

//switch (process.env.NODE_ENV) {} is usable if needed

module.exports = {
    context: __dirname,
    entry: {
        app: __dirname + "\\src\\main.ts"
    },
    output: {
        filename: __dirname + "\\dist\\package.js"
    },
    resolve: {
        extensions: ["", ".ts", ".js"]
    },
    module: {
        preloaders: debug ? [
            { test : /\.ts$/, loader : "tslint-loader" }
        ]:[],
        loaders: [
            { test: /\.css$/, loaders: ["style", "css"] },
            { test: /\.html$/, loader: "raw" },
            { test : /\.ts?$/, loader : "ts-loader"}
        ]
    },
    plugins: debug ? [] : [
       
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({compress:false, mangle:false, sourcemap:false})
    ],
    devServer: {
        inline: true,
        port: 8080
    }
}