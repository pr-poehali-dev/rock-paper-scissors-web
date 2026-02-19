import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import Icon from "@/components/ui/icon";

export default function Home() {
  const { user } = useAuth();
  if (!user) return null;

  const totalGames =
    user.stats.rpsWins + user.stats.rpsLosses + user.stats.rpsDraws +
    user.stats.tttWins + user.stats.tttLosses + user.stats.tttDraws;

  const totalWins = user.stats.rpsWins + user.stats.tttWins;

  return (
    <div className="min-h-screen pb-24 md:pt-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-5xl">{user.avatar}</div>
            <div>
              <p className="text-muted-foreground text-sm">Добро пожаловать!</p>
              <h1 className="text-2xl font-bold">{user.nickname}</h1>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-card rounded-2xl p-4 border border-border text-center">
              <div className="text-2xl font-black text-primary">{totalGames}</div>
              <div className="text-xs text-muted-foreground mt-1">Игр</div>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border text-center">
              <div className="text-2xl font-black text-secondary">{totalWins}</div>
              <div className="text-xs text-muted-foreground mt-1">Побед</div>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border text-center">
              <div className="text-2xl font-black text-accent">
                {totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Винрейт</div>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>Выбери игру</h2>

        <div className="grid gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Link to="/rps" className="group">
            <div className="bg-card rounded-2xl p-6 border border-border hover:card-glow transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2 text-4xl">
                  <span>✊</span><span>✌️</span><span>🖐️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">Камень-Ножницы-Бумага</h3>
                  <p className="text-muted-foreground text-sm">Классическая битва против компьютера</p>
                </div>
                <Icon name="ChevronRight" size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>

          <Link to="/tictactoe" className="group">
            <div className="bg-card rounded-2xl p-6 border border-border hover:card-glow transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2 text-4xl">
                  <span>❌</span><span>⭕</span><span>🏆</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">Крестики-Нолики</h3>
                  <p className="text-muted-foreground text-sm">Стратегическая дуэль 3x3</p>
                </div>
                <Icon name="ChevronRight" size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Link to="/leaderboard" className="group">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-5 border border-primary/30 hover:border-primary/60 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                <div className="flex-1">
                  <h3 className="font-bold">Таблица лидеров</h3>
                  <p className="text-sm text-muted-foreground">Узнай свое место в рейтинге</p>
                </div>
                <Icon name="ChevronRight" size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
