import React from "react";
import { CellState, CellValue } from "../../../types";
import "./button.scss";

interface ButtonProps {
  rowIndex: number;
  colIndex: number;
  state: CellState;
  value: CellValue;
  onClick(rowIndex: number, colIndex: number):(...args: any[]) => void;
  onContext(rowIndex: number, colIndex: number):(...args: any[]) => void;
}

const Button: React.FC<ButtonProps> = ({
  rowIndex,
  colIndex,
  onClick,
  onContext,
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
      onClick={onClick(rowIndex,colIndex)}
      onContextMenu={onContext(rowIndex,colIndex)}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
