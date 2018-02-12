import webpack from "webpack";
import babelOptions from "../babelrc";
import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import AssetsPlugin from "assets-webpack-plugin";
import UglifyJSPlugin from "uglifyjs-webpack-plugin";
import autoprefixer from "autoprefixer";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import cssNano from "cssnano";
import { PROD, cssChunkNaming, includePaths } from "../utilities";

const mainEntry = ["./src/client/index.js"]
	.concat(PROD ? [] : ["webpack-hot-middleware/client"]);

const entry = {
	vendor: ["react", "react-dom", "redux", "react-redux"],
	main: mainEntry
};

const plugins = [
	new AssetsPlugin({
		path: "build",
		filename: "manifest.json"
	}),
	new webpack.optimize.CommonsChunkPlugin({
		name: "vendor"
	})
]
	.concat(PROD ? [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new UglifyJSPlugin(),
		new ExtractTextPlugin({
			filename: "[hash].[name].css",
			allChunks: true,
		}),
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: cssNano,
			cssProcessorOptions: { discardComments: { removeAll: true } },
			canPrint: true,
		})
	] : [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	]);

const cssLoaders = [
	{
		loader: "css-loader",
		options: {
			modules: true,
			localIdentName: PROD
				? cssChunkNaming
				: "[path][name]__[local]"
		}
	}, {
		loader: "postcss-loader",
		options: {
			sourceMap: true,
			plugins: [autoprefixer],
		},
	}, {
		loader: "resolve-url-loader",
	}, {
		loader: "sass-loader",
		options: {
			includePaths,
		},
	}
];

export default {
	context: process.cwd(),
	entry,
	output: {
		path: path.resolve("build", "client"),
		filename: "[hash].[name].js",
		publicPath: "/"
	},
	resolve: {
		extensions: [".js", ".scss"]
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: babelOptions
				}
			},
			{
				test: /\.scss$/,
				use: PROD
					? ExtractTextPlugin.extract({
						fallback: "style-loader",
						use: cssLoaders,
					})
					: [{ loader: "style-loader" }].concat(cssLoaders),
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: "file-loader",
						options: {}
					}
				]
			}
		]
	},
	plugins
};
