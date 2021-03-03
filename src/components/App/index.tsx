import React from "react";
import NumberDisplay from "./NumberDisplay";
import "./App.scss";

const App: React.FC = () => {
  return (
    <div className="app-wrapper">
      <div className="header">
        <NumberDisplay value={0} />
        <div className="face"><span role="img" aria-label="face">🙂</span></div>
        <NumberDisplay value={23} />
      </div>
      <div className="body-side">body</div>
    </div>
  );
};

export default App;
