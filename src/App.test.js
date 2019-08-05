import React from "react";
import { shallow } from "enzyme";

import App, { Message, Image, drinkTypes } from "./App";

describe("App", () => {
  it("should render <Message /> and <Image /> components", () => {
    const wrapper = shallow(<App />);

    expect(wrapper.find(Message).length).toEqual(1);
    expect(wrapper.find(Image).length).toEqual(1);
  });
});

describe("Message", () => {
  it("should render the default message by default", () => {
    const wrapper = shallow(<Message />);
    const expectedMessage = "Hey, nice to meet you!";

    expect(wrapper.text()).toEqual(expectedMessage);
  });

  it("should render the correct message if drink is valid", () => {
    const mockDrink = drinkTypes.LEMONADE;
    const expectedMessage = `Hey, nice to meet you! Here is some special ${mockDrink} for you!`;
    const wrapper = shallow(<Message drink={mockDrink} />);

    expect(wrapper.text()).toEqual(expectedMessage);
  });

  it("should render the default message if drink is invalid", () => {
    const mockDrink = "beer";
    const wrapper = shallow(<Message drink={mockDrink} />);
    const expectedMessage = "Hey, nice to meet you!";

    expect(wrapper.text()).toEqual(expectedMessage);
  });
});

describe("Image", () => {
  it("shouldn't render any image by default", () => {
    const wrapper = shallow(<Image />);

    expect(wrapper.find("img").length).toEqual(0);
  });

  it("should render correct image if drink is valid", () => {
    const mockDrink = drinkTypes.LEMONADE;
    const wrapper = shallow(<Image drink={mockDrink} />);
    const expectedImageSrc = `${mockDrink}.jpg`;

    expect(wrapper.find("img").prop("src")).toEqual(expectedImageSrc);
  });

  it("shouldn't render any image if drink is invalid", () => {
    const mockDrink = "beer";
    const wrapper = shallow(<Image drink={mockDrink} />);

    expect(wrapper.find("img").length).toEqual(0);
  });
});
