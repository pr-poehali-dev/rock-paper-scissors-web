import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  nickname: string;
  avatar: string;
  stats: {
    rpsWins: number;
    rpsLosses: number;
    rpsDraws: number;
    tttWins: number;
    tttLosses: number;
    tttDraws: number;
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (nickname: string, password: string) => boolean;
  register: (nickname: string, password: string) => boolean;
  logout: () => void;
  updateStats: (game: "rps" | "ttt", result: "win" | "loss" | "draw") => void;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

const AVATARS = ["🦊", "🐸", "🐱", "🐶", "🐼", "🦁", "🐯", "🐨", "🐰", "🐵", "🦄", "🐲"];

function getRandomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      const nickname = JSON.parse(saved);
      const users = JSON.parse(localStorage.getItem("users") || "{}");
      if (users[nickname]) {
        setUser(users[nickname]);
      }
    }
  }, []);

  const saveUser = (u: User) => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    users[u.nickname] = u;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(u.nickname));
    setUser(u);
  };

  const register = (nickname: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const passwords = JSON.parse(localStorage.getItem("passwords") || "{}");
    if (users[nickname]) return false;
    const newUser: User = {
      nickname,
      avatar: getRandomAvatar(),
      stats: { rpsWins: 0, rpsLosses: 0, rpsDraws: 0, tttWins: 0, tttLosses: 0, tttDraws: 0 },
      createdAt: new Date().toISOString(),
    };
    users[nickname] = newUser;
    passwords[nickname] = password;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("passwords", JSON.stringify(passwords));
    localStorage.setItem("currentUser", JSON.stringify(nickname));
    setUser(newUser);
    return true;
  };

  const login = (nickname: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const passwords = JSON.parse(localStorage.getItem("passwords") || "{}");
    if (!users[nickname] || passwords[nickname] !== password) return false;
    localStorage.setItem("currentUser", JSON.stringify(nickname));
    setUser(users[nickname]);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  const updateStats = (game: "rps" | "ttt", result: "win" | "loss" | "draw") => {
    if (!user) return;
    const updated = { ...user, stats: { ...user.stats } };
    if (game === "rps") {
      if (result === "win") updated.stats.rpsWins++;
      else if (result === "loss") updated.stats.rpsLosses++;
      else updated.stats.rpsDraws++;
    } else {
      if (result === "win") updated.stats.tttWins++;
      else if (result === "loss") updated.stats.tttLosses++;
      else updated.stats.tttDraws++;
    }
    saveUser(updated);
  };

  const getAllUsers = (): User[] => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    return Object.values(users);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateStats, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthProvider;
