import { useEffect, useRef, useState } from "react";
import { createMaze } from "./helpers";

const Maze = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [numRows, setNumRows] = useState(50);
  const [numCols, setNumCols] = useState(50);

  const [maze, setMaze] = useState<ReturnType<typeof createMaze> | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const newMaze = createMaze({
        canvas: canvasRef.current,
        rows: numRows,
        cols: numCols,
      });
      newMaze.setupMaze();
      setMaze(newMaze);
    }
  }, [numRows, numCols]);

  const drawMaze = () => {
    if (maze) {
      maze.drawMaze();
    }
  };

  const solveMaze = () => {
    if (maze) {
      maze.solveMaze();
    }
  };

  return (
    <>
      <div className="flex gap-6">
        <button
          onClick={drawMaze}
          className="mt-4 w-fit rounded bg-pink-300 px-4 py-2 font-bold text-[#2d3142] hover:bg-pink-300/80"
        >
          Generate Maze
        </button>
        <button
          onClick={solveMaze}
          className="mt-4 w-fit rounded bg-pink-300 px-4 py-2 font-bold text-[#2d3142] hover:bg-pink-300/80"
        >
          Solve Maze
        </button>
      </div>
      <div className="relative flex h-full w-full flex-1 items-center justify-center">
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};

export default Maze;
