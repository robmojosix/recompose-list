/* eslint-disable no-console, no-useless-escape */
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import clearModule from "clear-module";
import config from "./webpack.config";
import { serverRendererPath, clientFolder } from "../utilities";

const compiler = webpack(config);

// Use our own server
const server = require("../src/server/src/server").default;

const webpackDevMiddlewareInstance = webpackDevMiddleware(
	compiler,
	{ noInfo: true, publicPath: "/" }
);

const webpackHotMiddlewareInstance = webpackHotMiddleware(compiler);

const reloadMiddleware = (server) => ((req, res, next) => {
	// Remove Client App from cache (cheap server-side Hot-Reload)
	// NOTE: We need to explicitly clear all the modules in the client directory.
	// It's a nice to have. Not guaranteed to always work, take it with a grain of salt.
	clearModule.match(new RegExp(`^${clientFolder}`, "i"));

	// eslint-disable-next-line import/no-dynamic-require, global-require
	server.renderTemplate = require(serverRendererPath).renderTemplate;
	next();
});

webpackDevMiddlewareInstance.waitUntilValid(() => {
	server.app.use(webpackDevMiddlewareInstance);
	server.app.use(webpackHotMiddlewareInstance);
	server.app.use((req, res, next) => {
		reloadMiddleware(server.app)(req, res, next);
	});

	server.start();
});
