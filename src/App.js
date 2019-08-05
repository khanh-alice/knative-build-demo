import React from "react";
import requireContext from "require-context.macro";

import "./App.css";

const images = requireContext("./images");

const App = () => {
  const drink = process.env.REACT_APP_DRINK;

  return (
    <div className="App">
      <header className={`App-header ${drink}`}>
        <Message drink={drink} />
        <Image drink={drink} />
      </header>
    </div>
  );
};

export const Message = ({ drink }) => (
  <p>
    <i>
      Hey, nice to meet you!
      {validDrink(drink) ? ` Here is some special ${drink} for you!` : ""}
    </i>
  </p>
);

export const Image = ({ drink }) => {
  if (validDrink(drink)) {
    return <img src={images(`./${drink}.jpg`)} alt="Refreshing drink" />;
  }

  return null;
};

export const drinkTypes = {
  LEMONADE: "lemonade",
  COCKTAIL: "cocktail"
}

const validDrink = drink => Object.values(drinkTypes).indexOf(drink) >= 0;

export default App;
