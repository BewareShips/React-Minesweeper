import React from "react";
import { CellState, CellValue } from "../../../types";
import "./button.scss";

interface ButtonProps {
  rowIndex: number;
  colIndex: number;
  state: CellState;
  value: CellValue;
}

const Button: React.FC<ButtonProps> = ({
  rowIndex,
  colIndex,
  state,
  value,
}) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.visible) {
      if (value === CellValue.bomb) {
        return (
          <span role="img" aria-label="face">
            💣
          </span>
        );
      }else if(value === CellValue.none){
        return null;
      }
      return value;
    } else if (state === CellState.flagged) {
      return (
        <span role="img" aria-label="face">
          🚩
        </span>
      );
    }
    return null;
  };
  return (
    <div
      className={`button-wrapper ${
        state === CellState.visible ? "visible" : ""
      } value-${value}`}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
