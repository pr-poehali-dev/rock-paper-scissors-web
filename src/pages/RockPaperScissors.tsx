import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

type Choice = "rock" | "paper" | "scissors";
type Result = "win" | "loss" | "draw";

const choices: { id: Choice; emoji: string; label: string; beats: Choice }[] = [
  { id: "rock", emoji: "✊", label: "Камень", beats: "scissors" },
  { id: "scissors", emoji: "✌️", label: "Ножницы", beats: "paper" },
  { id: "paper", emoji: "🖐️", label: "Бумага", beats: "rock" },
];

function getResult(player: Choice, computer: Choice): Result {
  if (player === computer) return "draw";
  const playerChoice = choices.find((c) => c.id === player)!;
  return playerChoice.beats === computer ? "win" : "loss";
}

const resultConfig = {
  win: { text: "Победа!", emoji: "🎉", color: "text-green-400", bg: "card-glow-win" },
  loss: { text: "Поражение!", emoji: "💀", color: "text-red-400", bg: "card-glow-lose" },
  draw: { text: "Ничья!", emoji: "🤝", color: "text-yellow-400", bg: "card-glow" },
};

export default function RockPaperScissors() {
  const { updateStats } = useAuth();
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });
  const [round, setRound] = useState(0);

  const play = (choice: Choice) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPlayerChoice(choice);
    setComputerChoice(null);
    setResult(null);

    setTimeout(() => {
      const compChoice = choices[Math.floor(Math.random() * 3)].id;
      setComputerChoice(compChoice);
      const res = getResult(choice, compChoice);
      setResult(res);
      updateStats("rps", res);
      setRound((r) => r + 1);
      setScore((s) => ({
        wins: s.wins + (res === "win" ? 1 : 0),
        losses: s.losses + (res === "loss" ? 1 : 0),
        draws: s.draws + (res === "draw" ? 1 : 0),
      }));
      setIsAnimating(false);
    }, 800);
  };

  const reset = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 md:pb-8">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl font-black game-gradient-text">Камень-Ножницы-Бумага</h1>
          <p className="text-muted-foreground text-sm mt-1">Раунд {round + 1}</p>
        </div>

        <div className="flex justify-center gap-6 mb-8 animate-fade-in">
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

        <div className={`bg-card rounded-3xl p-6 border border-border mb-6 transition-all duration-300 ${result ? resultConfig[result].bg : ""}`}>
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="text-xs text-muted-foreground mb-2 font-medium">ТЫ</div>
              <div className={`text-6xl transition-all duration-300 ${playerChoice ? "animate-bounce-in" : ""}`}>
                {playerChoice ? choices.find((c) => c.id === playerChoice)?.emoji : "❓"}
              </div>
            </div>

            <div className="px-4">
              {result ? (
                <div className="animate-bounce-in text-center">
                  <div className="text-3xl mb-1">{resultConfig[result].emoji}</div>
                  <div className={`text-sm font-black ${resultConfig[result].color}`}>{resultConfig[result].text}</div>
                </div>
              ) : (
                <div className="text-2xl font-black text-muted-foreground">VS</div>
              )}
            </div>

            <div className="text-center flex-1">
              <div className="text-xs text-muted-foreground mb-2 font-medium">КОМП</div>
              <div className={`text-6xl transition-all duration-300 ${computerChoice ? "animate-bounce-in" : ""}`}>
                {isAnimating ? (
                  <span className="inline-block animate-spin-slow">🎲</span>
                ) : computerChoice ? (
                  choices.find((c) => c.id === computerChoice)?.emoji
                ) : (
                  "🤖"
                )}
              </div>
            </div>
          </div>
        </div>

        {result ? (
          <div className="animate-fade-in">
            <Button
              onClick={reset}
              className="w-full h-14 text-lg font-bold game-gradient border-0 text-white hover:opacity-90 rounded-2xl"
            >
              Играть ещё
            </Button>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <p className="text-center text-sm text-muted-foreground font-medium mb-2">Выбери свой ход:</p>
            <div className="grid grid-cols-3 gap-3">
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => play(choice.id)}
                  disabled={isAnimating}
                  className="bg-card border-2 border-border hover:border-primary rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <span className="text-5xl">{choice.emoji}</span>
                  <span className="text-sm font-semibold text-foreground">{choice.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
