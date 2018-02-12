/* eslint-disable import/no-dynamic-require, global-require */
const path = require("path");

// Teach Node how to use babel compilation, using babelrc config defined in root
require("babel-register")(require("../babelrc"));

// Teach Node import other filetypes, such as .scss, .svg, .png etc
require("./scssNodeHook");
require("./assetsNodeHook");

// Run a specified file when optional argument `--run` is given
const options = process.argv.slice(2);
if (options[0] === "--run") {
	require(path.resolve(process.cwd(), options[1]));
}
