import React from "react";
import { string, object } from "prop-types";
import { PROD } from "../../../../utilities";

class Template extends React.Component {
	render() {
		const { title, assets, children } = this.props;
		return (
			<html>
				<head>
					<meta charSet="utf-8"/>
					<title>{title}</title>
					<If condition={ PROD }>
						<link rel="stylesheet" type="text/css" href={assets.main.css} />
					</If>
				</head>
				<body>
					<div id="App">
						{children}
					</div>
					<script src={assets.vendor.js}></script>
					<script src={assets.main.js}></script>
				</body>
			</html>
		);
	}
}

Template.propTypes = {
	title: string.isRequired,
	assets: object.isRequired,
};

export default Template;
