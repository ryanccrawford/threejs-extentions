const path = require("path");
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        app: "./src/index.js"
            // print: "./src/print.js",
            // components: "./src/components.js",
            // ToolIcon: "./src/toolicon.js",
            // ToolBar: "./src/toolbar.js",
            // Materials: "./src/materials.js",
            // PartOptions: "./src/partbase.js",
            // PartBase: "./src/partbase.js",
            // RolloverPart: "./src/rolloverpart.js",
            // Mpn25g: "./src/mpn25g.js",
            // thebuilder: "./src/threedbuilder.js",
            // APIData: "./src/databaseinterface.js",
            // Mpn25ag5: "./src/mpn25ag5.js",
            // MpnSb25g5: "./src/mpnsb25g5.js",
            // FloorOptions: "./src/floor.js",
            // Floor: "./src/floor.js",
            // Tower25G: "./src/tower.js"
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./dist",
        hot: true,
        host: "localhost", // Defaults to `localhost`
        port: 8080, // Defaults to 8080

        proxy: {
            "/api": {
                target: "http://localhost:3000",
                athRewrite: { "^/api": "" },
                secure: false
            }
        }
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
            bodyHtmlSnippet: "<script>var offsetAmount = 0.00;</script><div id='threed'></div><div style='position: absolute;left:0;top:0;'><div id='debug'></div></div>",
            //baseHref: "https://tower-builder.herokuapp.com/",
            devServer: "http://localhost:8080",
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
                    apiHost: "http://localhost:3000/api"
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