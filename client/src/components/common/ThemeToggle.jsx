import { Sun, Moon } from "lucide-react";
import useThemeStore from "../../store/themeStore";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border shadow-sm transition flex items-center justify-center"
      style={{
        backgroundColor: theme === "dark" ? "var(--background)" : "var(--card)",
        color:
          theme === "dark" ? "var(--primary-foreground)" : "var(--foreground)",
        borderColor: theme === "dark" ? "var(--border)" : "var(--border)",
      }}
    >
      {theme === "dark" ? (
        <Moon size={18} className="text-blue-500" />
      ) : (
        <Sun size={18} className="text-orange-500" />
      )}
    </button>
  );
}
