const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./client/index.js", 

    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
    },

    mode: "development", 
    module: {
        rules:[
            {
                test:/\.jsx?/, 
                exclude: /node-modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.css$/i,
                use: [
                // Creates `style` nodes from JS strings
                "style-loader",
                // Translates CSS into CommonJS
                "css-loader",
                // Compiles Sass to CSS
                "sass-loader"
                ],
            },
        ],
<<<<<<< HEAD
=======
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        type: 'asset/inline',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
    }),
  ],
  devServer: {
    publicPath: '/build',
    contentBase: './client',
    historyApiFallback: true,
    proxy: {
      '/mongo': 'http://localhost:3000',
>>>>>>> d3bc90e7dc504aa17129370f3944d19a8effde26
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: './client/index.html'
        })
      ],
    devServer: {
        publicPath: "/build",
        contentBase: "./client",
        proxy: {
            "/api": "http://localhost:3000",
        },
    },
    resolve: {
        extensions: ['.js', '.jsx'],
      },

};