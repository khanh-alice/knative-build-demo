import React from "react";
import "./App.css";
import requireContext from "require-context.macro";

const images = requireContext("./images");

function App() {
  const drink = "lemonade";

  return (
    <div className="App">
      <header className={`App-header ${drink}`}>
        <p>
          Hey, nice to meet you! Have some <i>{drink}!</i>
        </p>
        <img src={images(`./${drink}.jpg`)} alt="Refreshing drink" />
      </header>
    </div>
  );
}

export default App;
