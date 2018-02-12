import path from "path";
import cssHook from "css-modules-require-hook";
import { cssChunkNaming, includePaths } from "../utilities";
import sass from "node-sass";

const hook = () => {
	cssHook({
		extensions: [".scss"],
		// Share the same naming-convention of `css-loader`
		generateScopedName: cssChunkNaming,
		// Process files with same settings as `sass-loader` and return css.
		preprocessCss: (cssFileData, cssFilePath) => {
			return sass.renderSync({
				data: cssFileData,
				// Include any paths that are part of the config,
				// as well as the current path where css-file resides.
				includePaths: [].concat(includePaths).concat([path.dirname(cssFilePath)]),
			}).css;
		},
	});
};

export default hook();
