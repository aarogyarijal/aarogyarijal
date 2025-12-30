"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Trophy } from "lucide-react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_SIZE = 12;
const CELL_SIZE = 14;
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 6, y: 6 }]);
  const [food, setFood] = useState<Position>({ x: 3, y: 3 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [highScoreIp, setHighScoreIp] = useState<string>("");
  const [currentIp, setCurrentIp] = useState<string>("");
  const gameRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(direction);

  // Fetch current user's IP
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setCurrentIp(data.ip))
      .catch(() => setCurrentIp("unknown"));
  }, []);

  // Load high score and IP from localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem("snakeHighScore");
    const savedIp = localStorage.getItem("snakeHighScoreIp");
    if (savedScore) setHighScore(parseInt(savedScore));
    if (savedIp) setHighScoreIp(savedIp);
  }, []);

  // Save high score with IP
  useEffect(() => {
    if (score > highScore && score > 0) {
      setHighScore(score);
      setHighScoreIp(currentIp);
      localStorage.setItem("snakeHighScore", score.toString());
      localStorage.setItem("snakeHighScoreIp", currentIp);
    }
  }, [score, highScore, currentIp]);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 6, y: 6 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
  }, [generateFood]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying && !gameOver && e.key === " ") {
        e.preventDefault();
        setIsPlaying(true);
        return;
      }

      const newDirection: Direction | null = 
        e.key === "ArrowUp" || e.key === "w" ? "UP" :
        e.key === "ArrowDown" || e.key === "s" ? "DOWN" :
        e.key === "ArrowLeft" || e.key === "a" ? "LEFT" :
        e.key === "ArrowRight" || e.key === "d" ? "RIGHT" : null;

      if (newDirection) {
        e.preventDefault();
        const opposites: Record<Direction, Direction> = {
          UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT"
        };
        if (opposites[newDirection] !== directionRef.current) {
          setDirection(newDirection);
          directionRef.current = newDirection;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        switch (directionRef.current) {
          case "UP": head.y -= 1; break;
          case "DOWN": head.y += 1; break;
          case "LEFT": head.x -= 1; break;
          case "RIGHT": head.x += 1; break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(80, INITIAL_SPEED - score * 2);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, food, generateFood, score]);

  return (
    <div className="flex flex-col items-center h-full" ref={gameRef}>
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-700 dark:text-zinc-400">Score:</span>
          <span className="text-sm font-bold text-green-400">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <Trophy size={10} className="text-yellow-400" />
            <span className="text-xs font-medium text-yellow-400">{highScore}</span>
          </div>
          {highScoreIp && (
            <span className="text-[9px] text-zinc-600 dark:text-zinc-500 font-mono">{highScoreIp.split('.').slice(0, 2).join('.')}.**</span>
          )}
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative border border-gray-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950"
        style={{ 
          width: GRID_SIZE * CELL_SIZE + 2, 
          height: GRID_SIZE * CELL_SIZE + 2 
        }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute rounded-sm transition-all duration-75 ${
              index === 0 ? "bg-green-400" : "bg-green-500/70"
            }`}
            style={{
              left: segment.x * CELL_SIZE + 1,
              top: segment.y * CELL_SIZE + 1,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full animate-pulse"
          style={{
            left: food.x * CELL_SIZE + 2,
            top: food.y * CELL_SIZE + 2,
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4,
          }}
        />

        {/* Overlay Messages */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-black/60 rounded-lg">
            <p className="text-xs text-zinc-900 dark:text-zinc-300 mb-2">Press Space or Play</p>
            <p className="text-[10px] text-zinc-600 dark:text-zinc-500">Use WASD or Arrows</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 rounded-lg">
            <p className="text-sm font-bold text-red-400 mb-1">Game Over!</p>
            <p className="text-xs text-zinc-700 dark:text-zinc-400">Score: {score}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => {
            if (gameOver) resetGame();
            setIsPlaying(!isPlaying);
            if (!isPlaying) gameRef.current?.focus();
          }}
          className={`p-2 rounded-lg border transition-all ${
            isPlaying
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
              : "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
          }`}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={resetGame}
          className="p-2 rounded-lg border bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:dark:bg-zinc-700 hover:text-black dark:hover:text-white transition-all"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-1 mt-3 md:hidden">
        <div />
        <button
          onClick={() => { if (directionRef.current !== "DOWN") { setDirection("UP"); directionRef.current = "UP"; }}}
          className="p-2 bg-gray-50 dark:bg-zinc-800 rounded text-zinc-900 dark:text-zinc-400 text-xs"
        >▲</button>
        <div />
        <button
          onClick={() => { if (directionRef.current !== "RIGHT") { setDirection("LEFT"); directionRef.current = "LEFT"; }}}
          className="p-2 bg-gray-50 dark:bg-zinc-800 rounded text-zinc-900 dark:text-zinc-400 text-xs"
        >◀</button>
        <button
          onClick={() => { if (directionRef.current !== "UP") { setDirection("DOWN"); directionRef.current = "DOWN"; }}}
          className="p-2 bg-gray-50 dark:bg-zinc-800 rounded text-zinc-900 dark:text-zinc-400 text-xs"
        >▼</button>
        <button
          onClick={() => { if (directionRef.current !== "LEFT") { setDirection("RIGHT"); directionRef.current = "RIGHT"; }}}
          className="p-2 bg-gray-50 dark:bg-zinc-800 rounded text-zinc-900 dark:text-zinc-400 text-xs"
        >▶</button>
      </div>
    </div>
  );
}
