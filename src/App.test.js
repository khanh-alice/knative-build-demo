import React from "react";
import { shallow } from "enzyme";
import App from "./App";

it("renders without crashing", () => {
  shallow(<App />);
});

it("should show a lemonade image", () => {
  const app = shallow(<App />);
  expect(app.find("img").prop("src")).toEqual("lemonade.jpg");
});

xit("should show a cocktail image", () => {
  const app = shallow(<App />);
  expect(app.find("img").prop("src")).toEqual("cocktail.jpg");
});
