"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, RotateCcw } from "lucide-react";

const TARGET = "ROGI";
const KEYBOARD = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export default function WordleGame() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getStatus = (letter: string, idx: number, guess: string) => {
    if (guess[idx] === TARGET[idx]) return "bg-green-600";
    if (TARGET.includes(letter)) return "bg-yellow-600";
    return "bg-zinc-700";
  };

  const submit = useCallback(() => {
    if (current.length !== 4) return;
    const newGuesses = [...guesses, current];
    setGuesses(newGuesses);
    setCurrent("");
    if (current === TARGET) { setWon(true); setGameOver(true); setPlaying(false); }
    else if (newGuesses.length >= 3) { setGameOver(true); setPlaying(false); }
  }, [current, guesses]);

  const handleKey = useCallback((key: string) => {
    if (!playing || gameOver) return;
    if (key === "ENTER") submit();
    else if (key === "BACKSPACE") setCurrent(c => c.slice(0, -1));
    else if (/^[A-Z]$/i.test(key) && current.length < 4) setCurrent(c => c + key.toUpperCase());
  }, [playing, gameOver, current, submit]);

  // Desktop keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if typing in input (mobile) - let onChange handle it
      if (e.target === inputRef.current) return;
      handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  // Focus input on mobile when playing
  useEffect(() => {
    if (playing && !gameOver && inputRef.current) {
      inputRef.current.focus();
    }
  }, [playing, gameOver]);

  const reset = () => { 
    setGuesses([]); 
    setCurrent(""); 
    setGameOver(false); 
    setWon(false); 
    setPlaying(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const startGame = () => {
    setPlaying(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1 justify-center">
      {/* Hidden input for mobile keyboard */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute w-0 h-0"
        autoComplete="off"
        autoCapitalize="characters"
        value={current}
        onChange={(e) => {
          const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
          if (playing && !gameOver) setCurrent(val);
        }}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />

      {!playing && !gameOver ? (
        <div className="text-center">
          <p className="text-zinc-400 text-xs sm:text-sm mb-2">Guess my nickname</p>
          <button onClick={startGame} className="px-4 py-2 bg-green-600 hover:bg-green-500 active:bg-green-700 rounded text-sm sm:text-base flex items-center gap-2 mx-auto touch-manipulation">
            <Play size={16} /> Play
          </button>
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="flex flex-col gap-1" onClick={() => inputRef.current?.focus()}>
            {[...Array(3)].map((_, row) => (
              <div key={row} className="flex gap-1">
                {[...Array(4)].map((_, col) => {
                  const guess = guesses[row];
                  const letter = guess?.[col] || (row === guesses.length ? current[col] : "") || "";
                  return (
                    <div 
                      key={col} 
                      className={`w-10 h-10 sm:w-8 sm:h-8 border-2 border-zinc-600 flex items-center justify-center text-base sm:text-sm font-bold rounded ${guess ? getStatus(guess[col], col, guess) : ""}`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Result */}
          {gameOver && (
            <p className={`text-sm sm:text-xs font-bold ${won ? "text-green-400" : "text-red-400"}`}>
              {won ? "Rogi is the name!" : `It's ${TARGET}!`}
            </p>
          )}

          {/* Mobile Keyboard */}
          <div className="flex flex-col gap-1 sm:hidden mt-2">
            {KEYBOARD.map((row, i) => (
              <div key={i} className="flex gap-0.5 justify-center">
                {row.split("").map(k => (
                  <button 
                    key={k} 
                    onClick={() => handleKey(k)} 
                    className="w-7 h-9 text-xs bg-zinc-600 hover:bg-zinc-500 active:bg-zinc-400 rounded font-semibold touch-manipulation"
                  >
                    {k}
                  </button>
                ))}
              </div>
            ))}
            <div className="flex gap-1 justify-center mt-1">
              <button 
                onClick={() => handleKey("BACKSPACE")} 
                className="px-3 h-9 text-xs bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500 rounded touch-manipulation"
              >
                ⌫
              </button>
              <button 
                onClick={submit} 
                className="px-4 h-9 text-xs bg-green-600 hover:bg-green-500 active:bg-green-700 rounded font-semibold touch-manipulation"
              >
                Enter
              </button>
            </div>
          </div>

          {/* Desktop hint */}
          {!gameOver && <p className="text-[10px] text-zinc-500 hidden sm:block">Type & press Enter</p>}

          {/* Reset */}
          {gameOver && (
            <button onClick={reset} className="px-3 py-1.5 sm:px-2 sm:py-1 bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500 rounded text-xs sm:text-[10px] flex items-center gap-1 touch-manipulation">
              <RotateCcw size={12} /> Again
            </button>
          )}
        </>
      )}
    </div>
  );
}
