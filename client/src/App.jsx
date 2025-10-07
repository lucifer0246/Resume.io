import "./App.css";
import AppRoutes from "./AppRoutes";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import useThemeStore from "./store/themeStore";

function App() {
  const { theme } = useThemeStore();

  // Sync Tailwind's dark mode class with Zustand theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex flex-col overflow-hidden bg-white ">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#363636", color: "#fff" },
        }}
      />
      <AppRoutes />
    </div>
  );
}

export default App;
