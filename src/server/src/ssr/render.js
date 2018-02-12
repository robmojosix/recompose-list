/* eslint-disable no-console */
import React from "react";
import path from "path";
import { renderToString } from "react-dom/server";

const assetsFile = path.resolve("build", "manifest.json");

const renderTemplateHtml = () => {
	const Template = require("./template.js").default;
	const manifest = require(assetsFile);
	const Content = require("../../../client/RootComponent.js").default;

	return renderToString(
		<Template title='title' assets={manifest} >
			<Content />
		</Template>
	);
};

export const renderTemplate = (req, res) => {
	res.send("<!DOCTYPE html>"+renderTemplateHtml());
};
