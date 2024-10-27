interface Cell {
  rowIdx: number;
  colIdx: number;
  visited: boolean;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  isStart: boolean;
  isEnd: boolean;
  checkCellNeighbors: () => Cell | undefined;
  drawCellWalls: () => void;
  removeCellWalls: (next: Cell) => void;
  traceCurrentCellPath: () => void;
  traceVisitedCellPath: () => void;
}

interface Maze {
  setupMaze: () => void;
  drawMaze: () => void;
}

const setupCanvas = (canvas: HTMLCanvasElement, size: number) => {
  canvas.width = size;
  canvas.height = size;
  canvas.style.backgroundColor = "#bfc0c0";

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not found");
  }

  ctx.strokeStyle = "#2d3142";
  ctx.fillStyle = "#bfc0c0";
  ctx.lineWidth = 2;

  return { canvas, ctx };
};

export const createMaze = ({
  canvas,
  rows,
  cols,
  size = 400,
  start = {
    x: 0,
    y: 0,
  },
  end = {
    x: cols - 1,
    y: rows - 1,
  },
}: {
  canvas: HTMLCanvasElement;
  rows: number;
  cols: number;
  size?: number;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}): Maze => {
  const grid: Array<Array<Cell>> = [];
  const stack: Array<Cell> = [];
  let current: Cell;

  const xCellSize = size / cols;
  const yCellSize = size / rows;

  const { ctx } = setupCanvas(canvas, size);

  if (start?.x >= rows || start?.y >= cols || start?.x < 0 || start?.y < 0) {
    throw new Error("Invalid start position");
  }

  if (end?.x >= rows || end?.y >= cols || end?.x < 0 || end?.y < 0) {
    throw new Error("Invalid end position");
  }

  const createCell = (rowIdx: number, colIdx: number): Cell => {
    const walls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
    const isStart = rowIdx === start.x && colIdx === start.y;
    const isEnd = rowIdx === end.x && colIdx === end.y;
    const visited = false;

    const checkCellNeighbors = () => {
      const neighbors: Array<Cell> = [];

      const top = rowIdx !== 0 ? grid[rowIdx - 1][colIdx] : undefined;
      const right = colIdx !== cols - 1 ? grid[rowIdx][colIdx + 1] : undefined;
      const bottom = rowIdx !== rows - 1 ? grid[rowIdx + 1][colIdx] : undefined;
      const left = colIdx !== 0 ? grid[rowIdx][colIdx - 1] : undefined;

      if (top && !top.visited) {
        neighbors.push(top);
      }

      if (right && !right.visited) {
        neighbors.push(right);
      }

      if (bottom && !bottom.visited) {
        neighbors.push(bottom);
      }

      if (left && !left.visited) {
        neighbors.push(left);
      }

      if (neighbors.length > 0) {
        const randomIdx = Math.floor(Math.random() * neighbors.length);
        return neighbors[randomIdx];
      }

      return undefined;
    };

    const drawCellWalls = () => {
      const xDrawingStart = colIdx * xCellSize;
      const yDrawingStart = rowIdx * yCellSize;

      if (walls.top) {
        ctx.beginPath();
        ctx.moveTo(xDrawingStart, yDrawingStart);
        ctx.lineTo(xDrawingStart + xCellSize, yDrawingStart);
        ctx.stroke();
      }

      if (walls.right) {
        ctx.beginPath();
        ctx.moveTo(xDrawingStart + xCellSize, yDrawingStart);
        ctx.lineTo(xDrawingStart + xCellSize, yDrawingStart + yCellSize);
        ctx.stroke();
      }

      if (walls.bottom) {
        ctx.beginPath();
        ctx.moveTo(xDrawingStart + xCellSize, yDrawingStart + yCellSize);
        ctx.lineTo(xDrawingStart, yDrawingStart + yCellSize);
        ctx.stroke();
      }

      if (walls.left) {
        ctx.beginPath();
        ctx.moveTo(xDrawingStart, yDrawingStart + yCellSize);
        ctx.lineTo(xDrawingStart, yDrawingStart);
        ctx.stroke();
      }
    };

    const removeCellWalls = (next: Cell) => {
      const x = colIdx - next.colIdx;
      const y = rowIdx - next.rowIdx;

      if (x === 1) {
        walls.left = false;
        next.walls.right = false;
      } else if (x === -1) {
        walls.right = false;
        next.walls.left = false;
      }

      if (y === 1) {
        walls.top = false;
        next.walls.bottom = false;
      } else if (y === -1) {
        walls.bottom = false;
        next.walls.top = false;
      }
    };

    const traceCurrentCellPath = () => {
      ctx.fillStyle = "#f9a8d4";
      ctx.fillRect(
        colIdx * xCellSize,
        rowIdx * yCellSize,
        xCellSize,
        yCellSize,
      );
    };

    const traceVisitedCellPath = () => {
      ctx.fillStyle = "#9ceaef";
      ctx.fillRect(
        colIdx * xCellSize,
        rowIdx * yCellSize,
        xCellSize,
        yCellSize,
      );
    };

    return {
      rowIdx,
      colIdx,
      visited,
      walls,
      isStart,
      isEnd,
      checkCellNeighbors,
      drawCellWalls,
      removeCellWalls,
      traceCurrentCellPath,
      traceVisitedCellPath,
    };
  };

  const setupMaze = () => {
    for (let i = 0; i < rows; i++) {
      const row: Array<Cell> = [];
      for (let j = 0; j < cols; j++) {
        row.push(createCell(i, j));
      }
      grid.push(row);
    }

    current = grid[start.x][start.y];
    drawMazeWalls();
  };

  const drawMazeWalls = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j].drawCellWalls();
      }
    }
  };

  const drawMazePath = () => {
    current.visited = true;
    current.traceCurrentCellPath();
    const next = current.checkCellNeighbors();
    current.traceVisitedCellPath();
    if (next) {
      stack.push(current);
      current.removeCellWalls(next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop()!;
    }
    current.traceCurrentCellPath();
  };

  const drawMaze = () => {
    drawMazePath();
    drawMazeWalls();

    if (stack.length > 0 || current.checkCellNeighbors()) {
      requestAnimationFrame(drawMaze);
    }
  };

  return {
    setupMaze,
    drawMaze,
  };
};
