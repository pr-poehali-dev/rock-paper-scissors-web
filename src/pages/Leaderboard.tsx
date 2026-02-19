import { useAuth } from "@/lib/auth-context";
import Icon from "@/components/ui/icon";

export default function Leaderboard() {
  const { getAllUsers, user } = useAuth();
  const users = getAllUsers();

  const leaderboard = users
    .map((u) => ({
      ...u,
      totalWins: u.stats.rpsWins + u.stats.tttWins,
      totalGames:
        u.stats.rpsWins + u.stats.rpsLosses + u.stats.rpsDraws +
        u.stats.tttWins + u.stats.tttLosses + u.stats.tttDraws,
    }))
    .sort((a, b) => b.totalWins - a.totalWins);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="min-h-screen pb-24 md:pt-20 md:pb-8">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-5xl mb-2">🏆</div>
          <h1 className="text-2xl font-black game-gradient-text">Рейтинг игроков</h1>
          <p className="text-muted-foreground text-sm mt-1">Топ по количеству побед</p>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 animate-fade-in">
            <div className="text-5xl mb-4">👻</div>
            <p>Пока нет игроков</p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {leaderboard.map((player, index) => {
              const isCurrentUser = player.nickname === user?.nickname;
              const winRate = player.totalGames > 0
                ? Math.round((player.totalWins / player.totalGames) * 100)
                : 0;

              return (
                <div
                  key={player.nickname}
                  className={`bg-card rounded-2xl p-4 border transition-all ${
                    isCurrentUser ? "border-primary/50 card-glow" : "border-border"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 text-center">
                      {index < 3 ? (
                        <span className="text-2xl">{medals[index]}</span>
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                      )}
                    </div>

                    <div className="text-3xl">{player.avatar}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold truncate">{player.nickname}</span>
                        {isCurrentUser && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">ты</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span>{player.totalGames} игр</span>
                        <span>{winRate}% побед</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-primary">{player.totalWins}</div>
                      <div className="text-xs text-muted-foreground">побед</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
