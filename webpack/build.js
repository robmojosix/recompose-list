/* eslint-disable no-console */
import { emptyDir } from "fs-extra";
import path from "path";
import webpack from "webpack";
import config from "./webpack.config";

// delete previous build folder & compile all files necessary for serving
emptyDir(path.resolve(process.cwd(), "build"), (error) => {
	if (error) {
		console.log(error);
	}

	const compiler = webpack(config);
	compiler.run((compilerErr) => {
		if (compilerErr) {
			console.log(compilerErr);
		}

		console.log(" ⭐️  Your build is ready ⭐️");
		process.exit();
	});
});
