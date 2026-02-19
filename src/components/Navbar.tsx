import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import Icon from "@/components/ui/icon";

const navItems = [
  { path: "/", label: "Главная", icon: "Home" },
  { path: "/rps", label: "КНБ", icon: "Swords" },
  { path: "/tictactoe", label: "Крестики", icon: "Grid3x3" },
  { path: "/leaderboard", label: "Рейтинг", icon: "Trophy" },
  { path: "/profile", label: "Профиль", icon: "User" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-2 py-1 md:px-6 md:py-2">
        <Link to="/" className="hidden md:flex items-center gap-2">
          <span className="text-2xl">🎮</span>
          <span className="font-bold text-lg game-gradient-text">GameArena</span>
        </Link>

        <div className="flex items-center justify-around w-full md:w-auto md:gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col md:flex-row items-center gap-0.5 md:gap-2 px-3 py-2 rounded-lg transition-all text-xs md:text-sm ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <button
          onClick={logout}
          className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors px-3 py-2 rounded-lg"
        >
          <Icon name="LogOut" size={18} />
        </button>
      </div>
    </nav>
  );
}
