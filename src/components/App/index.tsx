import React, { useEffect, useState } from "react";
import NumberDisplay from "./NumberDisplay";
import { generateCells } from "../../utils";
import Button from "./Button";
import { Face, Cell, CellState } from "../../types/index";
import "./App.scss";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombcounter, setBombCounter] = useState<number>(10);

  const handleCellClick = (
    rowParams: number,
    colParams: number
  ) => (): void => {
    if (!live) {
      setLive(true);
    }
  };

  const handleCellContex = (rowParams: number, colParams: number) => (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    event.preventDefault();
    if (!live) {
      return;
    }
    const currentCellCopy = cells.slice();
    const currentCell = cells[rowParams][colParams];
    if (currentCell.state === CellState.visible) {
      return;
    } else if (currentCell.state === CellState.open && bombcounter > 0) {
      currentCellCopy[rowParams][colParams].state = CellState.flagged;
      setCells(currentCellCopy);
      setBombCounter(bombcounter - 1);
    } else if (currentCell.state === CellState.flagged) {
      currentCellCopy[rowParams][colParams].state = CellState.open;
      setCells(currentCellCopy);
      setBombCounter(bombcounter + 1);
    }
  };

  useEffect(() => {
    const handleMouseDownClick = (): void => {
      setFace(Face.smile2);
    };
    const handleMouseUp = (): void => {
      setFace(Face.smile);
    };
    window.addEventListener("mousedown", handleMouseDownClick);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDownClick);
      window.removeEventListener("ontouchstart", handleMouseDownClick);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("ontouchend", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (live && time < 999) {
      const timing = setInterval(() => {
        setTime(time + 1);
      }, 1000);
      return () => {
        return clearInterval(timing);
      };
    }
  }, [time, live]);

  const onFaceClick = (): void => {
    if (live) {
      setLive(false);
      setTime(0);
      setCells(generateCells());
    }
  };
  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIdx) =>
      row.map((cell, cellIdx) => (
        <Button
          key={`${rowIdx}__${cellIdx}`}
          state={cell.state}
          onClick={handleCellClick}
          onContext={handleCellContex}
          value={cell.value}
          rowIndex={rowIdx}
          colIndex={cellIdx}
        />
      ))
    );
  };

  return (
    <div className="app-wrapper">
      <div className="header">
        <NumberDisplay value={bombcounter} />
        <div className="face" onClick={onFaceClick}>
          <span role="img" aria-label="face">
            {face}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className="body-side">{renderCells()}</div>
    </div>
  );
};

export default App;
