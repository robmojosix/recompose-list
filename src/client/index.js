import React from "react";
import ReactDOM from "react-dom";

const hotReRender = () => {
	// Dynamically require module inline for hot-reloading
	const App = require("./RootComponent").default;
	ReactDOM.render(
		<App />,
		document.getElementById("App")
	);
};

// Start the app by rendering it for the first time
hotReRender();

// Support hot-reloading of components by rerendering using webpack's included HMR (Hot-Module-Replacement)
if (module.hot) {
	// After accepting the new module from webpack, we rerender on the next tick
	module.hot.accept("./RootComponent", () => setTimeout(hotReRender));
}
