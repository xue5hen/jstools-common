const path = require('path')
const webpackMerge = require('webpack-merge')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
let devMode = (process.env.NODE_ENV === 'production')

let baseConfig = {
    mode: devMode ? 'production' : 'development',
    entry: {
        // preload: ['babel-polyfill', './src/index.js']
        jstools: ['./src/index.js']
    },
    output: {
        library: '$jstools',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    optimization: {
        runtimeChunk: false,
        minimize: true
    },
    node: {
        __dirname: false
    },
    externals: {
        fs: 'fs',
        path: 'path',
        net: 'net',
        request: 'request',
        os: 'os',
        crypto: 'crypto'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
}

let targets = ['web', 'node', 'electron-main', 'electron-renderer']
let configs = targets.map((target, index) => {
    let mergeConfig = {
        target: target,
        output: {
            library: '$jstools',
            libraryTarget: 'umd',
            path: path.resolve(__dirname, 'dist'),
            filename: `[name].${target}.js`
        }
    }
    if (index === (targets.length - 1)) {
        mergeConfig.plugins = [
            new CleanWebpackPlugin()
        ]
    }
    return webpackMerge(baseConfig, mergeConfig)
})

module.exports = configs
