const path = require('path')
let devMode = (process.env.NODE_ENV === 'production')

module.exports = {
    mode: devMode ? 'production' : 'development',
    entry: {
        // preload: ['babel-polyfill', './src/index.js']
        preload: ['./src/index.js']
    },
    output: {
        library: '$jstools',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
        filename: 'jstools-common.js'
    },
    optimization: {
        runtimeChunk: false,
        minimize: true
    },
    node: {
        fs: 'empty',
        net: 'empty',
        request: 'empty',
        __dirname: false
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
