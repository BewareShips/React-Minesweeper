import React, { useEffect, useState } from "react";
import NumberDisplay from "./NumberDisplay";
import { generateCells,noneGrids } from "../../utils";
import Button from "./Button";
import { Face, Cell, CellState, CellValue } from "../../types/index";
import {MAX_ROWS, MAX_COLS,NUMB_OF_BOMBS} from "../../constans"
import "./App.scss";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombcounter, setBombCounter] = useState<number>(NUMB_OF_BOMBS);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

  const showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map(row =>
      row.map(cell => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.visible
          };
        }

        return cell;
      })
    );
  };

  const handleCellClick = (
    rowParams: number,
    colParams: number
  ) => (): void => {
    let newCells = cells.slice();
   if(hasLost){
     setFace(Face.smile3)
     return
   }
    if (!live) {
      let isBomb = newCells[rowParams][colParams].value === CellValue.bomb;
      while (isBomb) {
        newCells = generateCells();
        if (newCells[rowParams][colParams].value != CellValue.bomb) {
          isBomb = false;
          break;
        }
      }
      setLive(true);
    }
    const currentCell = newCells[rowParams][colParams];

    if (
      currentCell.state === CellState.flagged ||
      currentCell.state === CellState.visible
    ) {
      return;
    }

    if (currentCell.value === CellValue.bomb) {
      setHasLost(true)
      newCells[rowParams][colParams].red = true
      newCells = showAllBombs()
      setCells(newCells)
      return
    } else if (currentCell.value === CellValue.none) {
      //newCells = openNonePiecesCells(newCells, rowParams, colParams);
      newCells = noneGrids(newCells, rowParams, colParams)
    } else {
      newCells[rowParams][colParams].state = CellState.visible;
      
    }

    let safeOpenCellsExists = false;
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const currentCell = newCells[row][col];

        if (
          currentCell.value !== CellValue.bomb &&
          currentCell.state === CellState.open
        ) {
          safeOpenCellsExists = true;
          break;
        }
      }
    }

    if (!safeOpenCellsExists) {
      newCells = newCells.map(row =>
        row.map(cell => {
          if (cell.value === CellValue.bomb) {
            return {
              ...cell,
              state: CellState.flagged
            };
          }
          return cell;
        })
      );
      setHasWon(true);
    }

    setCells(newCells)
  };

  const handleCellContex = (rowParams: number, colParams: number) => (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    event.preventDefault();
    
    if(hasLost || !live){
      setFace(Face.smile3)
      return
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
    if(hasLost) {
      setFace(Face.smile3)
      setLive(false)
    }
    
  },[hasLost])

  useEffect(() => {
    if(hasWon){
      setLive(false)
      setFace(Face.smile4)
    }
  },[hasWon])

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
      window.removeEventListener("mouseup", handleMouseUp);
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
    
      setLive(false);
      setTime(0);
      setBombCounter(NUMB_OF_BOMBS)
      
      setHasLost(false);
      setHasWon(false)
      setCells(generateCells());
    
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
          red={cell.red}
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
        <div className="face"  onClick={onFaceClick}>
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
