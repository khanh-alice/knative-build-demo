import React from "react";
import { shallow } from "enzyme";

import App, { Message, Image } from "./App";

describe("App", () => {
  it("should render <Message /> and <Image /> components", () => {
    const wrapper = shallow(<App />);

    expect(wrapper.find(Message).length).toEqual(1);
    expect(wrapper.find(Image).length).toEqual(1);
  });
});

describe("Message", () => {
  it("should render the default message", () => {
    const wrapper = shallow(<Message />);
    expect(wrapper.text()).toEqual(`Hey, nice to meet you!`);
  });

  it("should render the message with drink", () => {
    const mockDrink = "lemonade";
    const wrapper = shallow(<Message drink={mockDrink} />);

    expect(wrapper.text()).toEqual(
      `Hey, nice to meet you! Here is some special lemonade for you!`
    );
  });
});

describe("Image", () => {
  it("by default, it shouldn't render any image", () => {
    const wrapper = shallow(<Image />);

    expect(wrapper.find("img").length).toEqual(0);
  });

  it("should render the correct drink image", () => {
    const mockDrink = "lemonade";
    const wrapper = shallow(<Image drink={mockDrink} />);

    expect(wrapper.find("img").prop("src")).toEqual(`${mockDrink}.jpg`);
  });
});
