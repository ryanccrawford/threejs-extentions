const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        app: "./src/index.js",
        print: "./src/print.js",
        container: "./src/container.js",
        PartOptions: "./src/partbase.js",
        PartBase: "./src/partbase.js",
        RolloverPart: "./src/rolloverpart.js",
        TowerSection: "./src/towersection.js",
        thebuilder: "./src/threedbuilder.js"
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./dist"
    },
    plugins: [
        new CopyPlugin([{ from: "./src/assets", to: "./assets" }]),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            inject: false,
            template: require("html-webpack-template"),
            appMountId: "app",
            appMountHtmlSnippet: '<div class="app-spinner"><i class="fa fa-spinner fa-spin fa-5x" aria-hidden="true"></i></div>',
            headHtmlSnippet: "<style>div.app-spinner {position: fixed;top:50%;left:50%;}</style >",
            bodyHtmlSnippet: "<div id='threed'></div>",
            //baseHref: "https://tower-builder.herokuapp.com/",
            devServer: "https://3stb",
            meta: [{
                name: "description",
                content: "3 Star Inc. 3D Tower Builder"
            }],
            mobile: true,
            lang: "en-US",
            links: [
                "https://fonts.googleapis.com/css?family=Roboto"
                // {
                //   href: "/apple-touch-icon.png",
                //   rel: "apple-touch-icon",
                //   sizes: "180x180"
                // },
                // {
                //   href: "/favicon-32x32.png",
                //   rel: "icon",
                //   sizes: "32x32",
                //   type: "image/png"
                // }
            ],
            inlineManifestWebpackName: "webpackManifest",
            //   scripts: [
            //     "http://example.com/somescript.js",
            //     {
            //       src: "/myModule.js",
            //       type: "module"
            //     }
            //   ],
            title: "3 Star Inc. 3D Tower Builder",
            window: {
                env: {
                    apiHost: "https://tower-builder.herokuapp.com//api"
                }
            }
        })
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: ["file-loader"]
            }
        ]
    }
};