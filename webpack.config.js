const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const PORT = parseInt(process.env.PORT, 10) || 8090;
const HOST = process.env.HOST || '0.0.0.0';

module.exports = (env, argv) => {
    // console.log(argv.mode);
    const mode = argv.mode || "development";
    return {
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"],
                            plugins: ["@babel/plugin-proposal-class-properties"]
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[name]__[local]__[hash:base64:5]'
                            }
                        }
                    ]
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: "html-loader",
                            options: {minimize: true}
                        }
                    ]
                },
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'static/media/[name].[hash:8].[ext]',
                    },
                },
            ]
        },
        devtool: "source-map",
        devServer: {
            hot: true,
            compress: true,
            host: HOST,
            port: PORT,
            historyApiFallback: {
                disableDotRule: true,
            },
        },
        plugins: [
            new webpack.DefinePlugin({
                MODE: JSON.stringify(mode)
            }),
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebPackPlugin({
                template: "./public/index.html",
                filename: "./index.html"
            })
        ]
    }
};
