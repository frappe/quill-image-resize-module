var path = require('path');

module.exports = {
    entry: "./src/ImageResize.js",
    output: {
        path: __dirname,
        library: 'ImageResize',
        libraryTarget: 'umd',
        filename: "image-resize.min.js"
    },
    externals: {
        quill: {
            root: 'Quill',
            commonjs: 'quill',
            commonjs2: 'quill',
            amd: 'quill'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        "presets": [["es2015", { "modules": false }]],
                        "plugins": ["babel-plugin-transform-class-properties"]
                    }
                }]
            },
            {
                test: /\.svg$/,
                use: [{
                    loader: 'raw-loader'
                }]
            }
        ]
    }
};
