/* eslint-disable no-console, class-methods-use-this */
import http from "http";
import express from "express";
import { argv } from "optimist";
import { PROD, serverRendererPath } from "../../../utilities";

const PORT = PROD ? 8080 : 3000;

export default new class Server {
	constructor() {
		this.app = express();
		if (argv.autostart) {
			this.start();
		}
	}

	start() {
		this.app.use(express.static("build/client"));
		this.app.renderTemplate = require(serverRendererPath).renderTemplate;
		this.app.get("*", (req, res) => {
			this.app.renderTemplate(req, res);
		});

		this.app.use((req, res, next) => {
			const err = new Error(`${req.url} not Found`);
			err.status = 404;
			next(err);
		});

		this.app.use((err, req, res) => {
			console.error("error : ", err.message);
			res.status(err.status || 500);
		});

		const server = http.createServer(this.app);

		server.listen(PORT, function() {
			console.log(`Listening on localhost${PORT}`);
		});
	}
}();
