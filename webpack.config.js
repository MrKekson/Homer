var debug = process.env.NODE_ENV !== "production";
var webpack = require("webpack");
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

//switch (process.env.NODE_ENV) {} is usable if needed

var homer_core = {
    name : "Homer server code",
    externals: nodeModules,
    target : 'node',
    context: __dirname,
    node: {
        __filename: false,
        __dirname: false
    },
    entry: {
        app: __dirname + "\\src\\homer_core\\main.ts"
    },
    output: {
        filename: __dirname + "\\dist\\core.js"
    },
    resolve: {
        extensions: ["", ".ts", ".js", '.json']
    },
    module: {
        preloaders: debug ? [
            { test : /\.ts$/, loader : "tslint-loader" },       
        ]:[],
        loaders: [
            { test: /\.json$/, loader: "json-loader"},
            { test : /\.ts?$/, loader : "ts-loader"}
        ]
    },
    plugins: debug ? [
        new webpack.DefinePlugin({ $dirname: '__dirname' }),
    ] : [      
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({compress:false, mangle:false, sourcemap:false})
    ]
};

var homer_web = {
    name : "Homer client code",
    context: __dirname,
    entry: {
        app: __dirname + "\\src\\homer_web\\main.ts"
    },
    output: {
        filename: __dirname + "\\dist\\client\\package.js"
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
            { test: /\.json$/, loader: "json-loader"},
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

module.exports = [homer_web, homer_core];

