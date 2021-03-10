import { MAX_ROWS, MAX_COLS, NUMB_OF_BOMBS } from "../constans";
import { CellValue, CellState, Cell } from "../types";



const grabAllCellsFunction = (cells: Cell[][],
  rowIndex: number,
  colIndex: number): {
    topLeft: Cell | null;
    top: Cell | null;
    topRight: Cell | null;
    left: Cell | null;
    right: Cell | null;
    bottomLeft: Cell | null;
    bottom: Cell | null;
    bottomRight: Cell | null;
  } => {
  const topLeft = rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1 ? cells[rowIndex + 1][colIndex + 1] : null;
  const top = rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null;
  const topRight = rowIndex < MAX_ROWS - 1 && colIndex > 0 ? cells[rowIndex + 1][colIndex - 1] : null;
  const right = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;
  const bottomRight = rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
  const bottom = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null;
  const bottomLeft = rowIndex > 0 && colIndex < MAX_COLS - 1 ? cells[rowIndex - 1][colIndex + 1] : null;
  const left = colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1] : null;

  return {
    topLeft,
    top,
    topRight,
    left,
    right,
    bottomLeft,
    bottom,
    bottomRight
  };
};

export const generateCells = (): Cell[][] => {
  const cells: Cell[][] = [];
  //generating all cells
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open
      });
    }
  }

  //put bombs
  let bombsPlaced = 0;
  while (bombsPlaced < NUMB_OF_BOMBS) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);
    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.bomb) {
      const cellsCaptured = cells.map((row, rowIdx) => row.map((cell, colIdx) => {
        if (randomRow === rowIdx && randomCol === colIdx) {
          return {
            ...cell, value: CellValue.bomb
          };
        } else {
          return cell;
        }
      }));
      cells.splice(0, cells.length, ...cellsCaptured);
      bombsPlaced++;
    }

  }
  //calculate numbers
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.bomb) {
        continue;
      }
      let numberOfBombs = 0;
      const {
        topLeft,
        top,
        topRight,
        left,
        right,
        bottomLeft,
        bottom,
        bottomRight
      } = grabAllCellsFunction(cells, rowIndex, colIndex);


      if (topLeft?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (topRight?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (top?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (right?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomRight?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottom?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomLeft?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (left?.value === CellValue.bomb) {
        numberOfBombs++;
      }



      if (numberOfBombs > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell, value: numberOfBombs
        };
      }
    }
  }


  return cells;
};

export const openNonePiecesCells = (cells: Cell[][], rowIndex: number, colIndex: number): Cell[][] => {
  const currentCell = cells[rowIndex][colIndex];

  if (currentCell.state = CellState.visible || currentCell.state === CellState.flagged) {
    return cells;
  }
  let newCells = cells.slice();

  newCells[rowIndex][colIndex].state = CellState.visible;

  const {
    topLeft,
    top,
    topRight,
    left,
    right,
    bottomLeft,
    bottom,
    bottomRight
  } = grabAllCellsFunction(cells, rowIndex, colIndex);

  if (
    topLeft?.state === CellState.open &&
    topLeft.value !== CellValue.bomb
  ) {
    if (topLeft.value === CellValue.none) {
      newCells = openNonePiecesCells(newCells, rowIndex + 1, colIndex + 1);
    } else {
      newCells[rowIndex + 1][colIndex + 1].state = CellState.visible;
    }
  }

  if (top?.state === CellState.open && top.value !== CellValue.bomb) {
    if (top.value === CellValue.none) {
      newCells = openNonePiecesCells(newCells, rowIndex - 1, colIndex);
    } else {
      newCells[rowIndex + 1][colIndex].state = CellState.visible;
    }
  }

  if (
    topRight?.state === CellState.open &&
    topRight.value !== CellValue.bomb
  ) {
    if (topRight.value === CellValue.none) {
      newCells = openNonePiecesCells(newCells, rowIndex + 1, colIndex - 1);
    } else {
      newCells[rowIndex + 1][colIndex - 1].state = CellState.visible;
    }
  }

  if (left?.state === CellState.open && left.value !== CellValue.bomb) {
    if (left.value === CellValue.none) {
      newCells = openNonePiecesCells(newCells, rowIndex, colIndex - 1);
    } else {
      newCells[rowIndex][colIndex + 1].state = CellState.visible;
    }
  }

  if (
    right?.state === CellState.open &&
    right.value !== CellValue.bomb
  ) {
    if (right.value === CellValue.none) {
      newCells = openNonePiecesCells(newCells, rowIndex, colIndex + 1);
    } else {
      newCells[rowIndex][colIndex - 1].state = CellState.visible;
    }
  }

  if (
    bottomLeft?.state === CellState.open &&
    bottomLeft.value !== CellValue.bomb
  ) {
    if (bottomLeft.value === CellValue.none) {
      newCells = openNonePiecesCells(newCells, rowIndex + 1, colIndex - 1);
    } else {
      newCells[rowIndex - 1][colIndex + 1].state = CellState.visible;
    }
  }

  if (
    bottom?.state === CellState.open &&
    bottom.value !== CellValue.bomb
  ) {
    if (bottom.value === CellValue.none) {
      newCells = openNonePiecesCells(newCells, rowIndex + 1, colIndex);
    } else {
      newCells[rowIndex - 1][colIndex].state = CellState.visible;
    }
  }

  if (
    bottomRight?.state === CellState.open &&
    bottomRight.value !== CellValue.bomb
  ) {
    if (bottomRight.value === CellValue.none) {

      newCells = openNonePiecesCells(newCells, rowIndex - 1, colIndex - 1);
    } else {
      newCells[rowIndex - 1][colIndex - 1].state = CellState.visible;
    }
  }

  return newCells;
};

export const noneGrids = (cells: Cell[][], rowIdx: number, colIdx: number,): Cell[][] => {
  const currentCell = cells[rowIdx][colIdx];
  const cellsCopy = cells.slice();
  if (currentCell.value !== CellValue.bomb || currentCell.state !== CellState.flagged) {
    if (currentCell.value === CellValue.none && currentCell.state === CellState.open) {
      cellsCopy[rowIdx][colIdx].state = CellState.visible;
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {

          const roX = (rowIdx + x) >= 0 && (rowIdx + x) < MAX_COLS;
          const coY = (colIdx + y) >= 0 && (colIdx + y) < MAX_ROWS;

          if (roX && coY) {

            if (cellsCopy[rowIdx + x][colIdx + y]?.value === CellValue.none) {
              noneGrids(cellsCopy, (rowIdx + x), (colIdx + y));
            } else {

              cellsCopy[rowIdx + x][colIdx + y].state = CellState.visible;
            }
          }

        }
      }
    }
  }
  return cellsCopy;
};

