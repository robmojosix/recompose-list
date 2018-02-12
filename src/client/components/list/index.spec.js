import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { Hello } from "../";
import fetch from "universal-fetch";
import nock from "nock";

var url = 'https://api.postcodes.io';
var get = '/postcodes/br40qr';

var x = () => {
	return fetch(url+get).then((res) => res.json()).then((data) => data.result)
}

var payload = {a:1}
var promisePayload = new Promise((resolve, reject) => {
	resolve(payload);
});


describe("hello", () => {
	it("renders the title correctly", () => {
		const wrapper = shallow(<Hello
		/>);

		expect(wrapper.find("h1").text()).to.equal("Hello");
	});

	it("tests xhr", () => {
		var request = nock(url)
				.get(get)
		    .reply(200, promisePayload);

		x().then((data) => {
			expect(data).to.equal(payload);
		})
	});
});
