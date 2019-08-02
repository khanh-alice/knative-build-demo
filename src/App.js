import React from "react";
import "./App.css";
import requireContext from "require-context.macro";

const images = requireContext("./images");

function App() {
  const drink = process.env.REACT_APP_DRINK;

  return (
    <div className="App">
      <header className={`App-header ${drink}`}>
        <Message drink={drink} />
        <Image drink={drink} />
      </header>
    </div>
  );
}

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

function validDrink(drink) {
  return ["lemonade", "cocktail"].indexOf(drink) >= 0;
}

export default App;
