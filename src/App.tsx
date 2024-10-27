import { Maze } from "./components/Maze";

function App() {
  return (
    <main className="flex h-screen w-screen flex-col items-center bg-[#2d3142] px-10 py-6 text-white">
      <h1 className="text-center text-3xl">MazeJS</h1>
      <p className="mt-2 text-center text-lg">
        A simple maze generator and solver using JavaScript
      </p>

      <Maze />
    </main>
  );
}

export default App;
