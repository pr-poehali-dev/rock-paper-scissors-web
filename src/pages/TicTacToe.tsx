import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

type Cell = "X" | "O" | null;
type Result = "win" | "loss" | "draw" | null;

const winLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: Cell[]): { winner: Cell; line: number[] | null } {
  for (const [a, b, c] of winLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function minimax(board: Cell[], isMaximizing: boolean): number {
  const { winner } = checkWinner(board);
  if (winner === "O") return 10;
  if (winner === "X") return -10;
  if (board.every((c) => c !== null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function getBestMove(board: Cell[]): number {
  if (Math.random() < 0.3) {
    const empty = board.map((c, i) => (c === null ? i : -1)).filter((i) => i !== -1);
    return empty[Math.floor(Math.random() * empty.length)];
  }

  let bestScore = -Infinity;
  let bestMove = 0;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      const score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

const resultConfig = {
  win: { text: "Победа!", emoji: "🎉", color: "text-green-400" },
  loss: { text: "Поражение!", emoji: "💀", color: "text-red-400" },
  draw: { text: "Ничья!", emoji: "🤝", color: "text-yellow-400" },
};

export default function TicTacToe() {
  const { updateStats } = useAuth();
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [result, setResult] = useState<Result>(null);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });

  const handleClick = useCallback(
    (index: number) => {
      if (board[index] || result || isThinking) return;

      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);

      const { winner, line } = checkWinner(newBoard);
      if (winner === "X") {
        setResult("win");
        setWinLine(line);
        updateStats("ttt", "win");
        setScore((s) => ({ ...s, wins: s.wins + 1 }));
        return;
      }

      if (newBoard.every((c) => c !== null)) {
        setResult("draw");
        updateStats("ttt", "draw");
        setScore((s) => ({ ...s, draws: s.draws + 1 }));
        return;
      }

      setIsThinking(true);
      setTimeout(() => {
        const compMove = getBestMove([...newBoard]);
        newBoard[compMove] = "O";
        setBoard([...newBoard]);

        const compResult = checkWinner(newBoard);
        if (compResult.winner === "O") {
          setResult("loss");
          setWinLine(compResult.line);
          updateStats("ttt", "loss");
          setScore((s) => ({ ...s, losses: s.losses + 1 }));
        } else if (newBoard.every((c) => c !== null)) {
          setResult("draw");
          updateStats("ttt", "draw");
          setScore((s) => ({ ...s, draws: s.draws + 1 }));
        }
        setIsThinking(false);
      }, 400);
    },
    [board, result, isThinking, updateStats]
  );

  const reset = () => {
    setBoard(Array(9).fill(null));
    setResult(null);
    setWinLine(null);
  };

  const getCellStyle = (index: number) => {
    const isWin = winLine?.includes(index);
    const value = board[index];
    let base = "aspect-square rounded-2xl border-2 text-4xl sm:text-5xl font-black flex items-center justify-center transition-all duration-200";

    if (isWin) {
      base += value === "X" ? " bg-green-500/20 border-green-500" : " bg-red-500/20 border-red-500";
    } else if (value) {
      base += " border-border bg-muted/50";
    } else {
      base += " border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer active:scale-95";
    }

    return base;
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 md:pb-8">
      <div className="max-w-sm mx-auto px-4 pt-6">
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl font-black game-gradient-text">Крестики-Нолики</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isThinking ? "Компьютер думает..." : result ? resultConfig[result].text : "Ты играешь за ❌"}
          </p>
        </div>

        <div className="flex justify-center gap-6 mb-6 animate-fade-in">
          <div className="text-center">
            <div className="text-2xl font-black text-green-400">{score.wins}</div>
            <div className="text-xs text-muted-foreground">Побед</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-yellow-400">{score.draws}</div>
            <div className="text-xs text-muted-foreground">Ничьих</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-red-400">{score.losses}</div>
            <div className="text-xs text-muted-foreground">Поражений</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 animate-scale-in">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!cell || !!result || isThinking}
              className={getCellStyle(i)}
            >
              {cell && (
                <span className={`animate-bounce-in ${cell === "X" ? "text-blue-400" : "text-red-400"}`}>
                  {cell === "X" ? "❌" : "⭕"}
                </span>
              )}
            </button>
          ))}
        </div>

        {result && (
          <div className="animate-fade-in space-y-3">
            <div className="text-center">
              <span className="text-5xl">{resultConfig[result].emoji}</span>
              <p className={`text-xl font-black mt-2 ${resultConfig[result].color}`}>{resultConfig[result].text}</p>
            </div>
            <Button
              onClick={reset}
              className="w-full h-14 text-lg font-bold game-gradient border-0 text-white hover:opacity-90 rounded-2xl"
            >
              Играть ещё
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
