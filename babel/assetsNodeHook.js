import assetHook from "asset-require-hook";

const runHook = () => {
	assetHook({
		extensions: ["jpg", "jpeg", "png", "gif"],
		publicPath: "/",
	});
};

export default runHook();
