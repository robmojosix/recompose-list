import sinon from "sinon";

const sandbox = sinon.sandbox.create();

beforeEach(() => {
	sandbox.create();
});
afterEach(() => {
	sandbox.restore();
});

export default sandbox;
