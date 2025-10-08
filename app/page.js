'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

const numRows = 40;
const numCols = 60;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

export default function Home() {
  const [grid, setGrid] = useState(() => generateEmptyGrid());
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [generation, setGeneration] = useState(0);

  const runningRef = useRef(running);
  runningRef.current = running;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      const newGrid = g.map((row, i) =>
        row.map((cell, j) => {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
              neighbors += g[newI][newJ];
            }
          });

          if (neighbors < 2 || neighbors > 3) {
            return 0;
          } else if (cell === 0 && neighbors === 3) {
            return 1;
          } else {
            return cell;
          }
        })
      );
      return newGrid;
    });

    setGeneration(gen => gen + 1);

    setTimeout(runSimulation, speedRef.current);
  }, []);

  const handleCellClick = (i, j) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (rowIndex === i && colIndex === j) {
          return cell ? 0 : 1;
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const handleStartStop = () => {
    setRunning(!running);
    if (!running) {
      runningRef.current = true;
      runSimulation();
    }
  };

  const handleClear = () => {
    setGrid(generateEmptyGrid());
    setGeneration(0);
    setRunning(false);
  };

  const handleRandom = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
    }
    setGrid(rows);
    setGeneration(0);
  };

  const handleGlider = () => {
    const newGrid = generateEmptyGrid();
    newGrid[1][2] = 1;
    newGrid[2][3] = 1;
    newGrid[3][1] = 1;
    newGrid[3][2] = 1;
    newGrid[3][3] = 1;
    setGrid(newGrid);
    setGeneration(0);
  };

  const handlePulsar = () => {
    const newGrid = generateEmptyGrid();
    const centerRow = Math.floor(numRows / 2);
    const centerCol = Math.floor(numCols / 2);

    const pattern = [
      [-6, -4], [-6, -3], [-6, -2], [-6, 2], [-6, 3], [-6, 4],
      [-4, -6], [-4, -1], [-4, 1], [-4, 6],
      [-3, -6], [-3, -1], [-3, 1], [-3, 6],
      [-2, -6], [-2, -1], [-2, 1], [-2, 6],
      [-1, -4], [-1, -3], [-1, -2], [-1, 2], [-1, 3], [-1, 4],
      [1, -4], [1, -3], [1, -2], [1, 2], [1, 3], [1, 4],
      [2, -6], [2, -1], [2, 1], [2, 6],
      [3, -6], [3, -1], [3, 1], [3, 6],
      [4, -6], [4, -1], [4, 1], [4, 6],
      [6, -4], [6, -3], [6, -2], [6, 2], [6, 3], [6, 4]
    ];

    pattern.forEach(([x, y]) => {
      const row = centerRow + x;
      const col = centerCol + y;
      if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
        newGrid[row][col] = 1;
      }
    });

    setGrid(newGrid);
    setGeneration(0);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      color: '#fff'
    }}>
      <h1 style={{ marginBottom: '20px' }}>Conway's Game of Life</h1>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <strong>Generation: {generation}</strong>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleStartStop}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: running ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            {running ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={handleClear}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Clear
          </button>
          <button
            onClick={handleRandom}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Random
          </button>
          <button
            onClick={handleGlider}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#ffc107',
              color: '#000',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Glider
          </button>
          <button
            onClick={handlePulsar}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Pulsar
          </button>
        </div>
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="speed">Speed (ms):</label>
          <input
            id="speed"
            type="range"
            min="50"
            max="1000"
            step="50"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ width: '200px' }}
          />
          <span>{speed}ms</span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 12px)`,
          backgroundColor: '#333',
          border: '2px solid #555',
          borderRadius: '5px',
          padding: '5px'
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => handleCellClick(i, j)}
              style={{
                width: 12,
                height: 12,
                backgroundColor: grid[i][j] ? '#00ff00' : '#222',
                border: '1px solid #444',
                cursor: 'pointer'
              }}
            />
          ))
        )}
      </div>

      <div style={{ marginTop: '20px', maxWidth: '600px', textAlign: 'center' }}>
        <h3>Rules:</h3>
        <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <li>Any live cell with 2 or 3 live neighbors survives</li>
          <li>Any dead cell with exactly 3 live neighbors becomes alive</li>
          <li>All other live cells die, and all other dead cells stay dead</li>
        </ul>
        <p style={{ marginTop: '15px' }}>Click cells to toggle them, or use the preset patterns!</p>
      </div>
    </div>
  );
}
