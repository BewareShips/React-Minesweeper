import React, { useState } from "react";
import NumberDisplay from "./NumberDisplay";
import {generateCells} from "../../utils"
import "./App.scss";
import Button from "./Button";

const App: React.FC = () => {
  const [cells,setCells] = useState(generateCells());

  const renderCells = (): React.ReactNode => {
    return cells.map((row,rowIdx)=>row.map((cell,cellIdx)=> <Button key={`${rowIdx}__${cellIdx}`} />))
  }
  
  return (
    <div className="app-wrapper">
      <div className="header">
        <NumberDisplay value={0} />
        <div className="face"><span role="img" aria-label="face">🙂</span></div>
        <NumberDisplay value={23} />
      </div>
      <div className="body-side">{renderCells()}</div>
    </div>
  );
};


export default App;
