import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

export default function Auth() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (nickname.length < 2) {
      setError("Ник минимум 2 символа");
      triggerShake();
      return;
    }
    if (password.length < 4) {
      setError("Пароль минимум 4 символа");
      triggerShake();
      return;
    }

    if (isLogin) {
      const ok = login(nickname, password);
      if (!ok) {
        setError("Неверный ник или пароль");
        triggerShake();
      }
    } else {
      const ok = register(nickname, password);
      if (!ok) {
        setError("Этот ник уже занят");
        triggerShake();
      }
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-20">✊</div>
        <div className="absolute top-40 right-16 text-5xl animate-float opacity-20" style={{ animationDelay: "1s" }}>✌️</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-float opacity-20" style={{ animationDelay: "2s" }}>🖐️</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-float opacity-20" style={{ animationDelay: "0.5s" }}>❌</div>
        <div className="absolute top-60 left-1/2 text-5xl animate-float opacity-20" style={{ animationDelay: "1.5s" }}>⭕</div>
      </div>

      <div className={`w-full max-w-md animate-scale-in ${shake ? "animate-shake" : ""}`}>
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-bounce-in">🎮</div>
          <h1 className="text-4xl font-black game-gradient-text mb-2">GameArena</h1>
          <p className="text-muted-foreground">Камень-Ножницы-Бумага & Крестики-Нолики</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border card-glow">
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isLogin ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground"
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !isLogin ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground"
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Никнейм</label>
              <div className="relative">
                <Icon name="User" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Твой игровой ник"
                  className="pl-10 bg-muted border-0 h-12 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Пароль</label>
              <div className="relative">
                <Icon name="Lock" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 4 символа"
                  className="pl-10 bg-muted border-0 h-12 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg animate-fade-in">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base font-bold game-gradient border-0 text-white hover:opacity-90 transition-opacity">
              {isLogin ? "Войти в игру" : "Создать аккаунт"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
