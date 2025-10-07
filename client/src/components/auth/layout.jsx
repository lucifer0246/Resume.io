import { Outlet, useLocation } from "react-router-dom";
//eslint-disable-next-line
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import ThemeToggle from "../common/ThemeToggle";

function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname.includes("register");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 100);
    return () => clearTimeout(timer);
  }, [isRegister]);

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* ---------- Info Side (Left Panel, theme-aware glass) ---------- */}
      <div
        className="
    hidden lg:flex w-1/2 justify-center items-center px-12 relative
    bg-[var(--bg-left)] text-[var(--card-foreground)]
    backdrop-blur-xl border-r border-[var(--border)]
    transition-colors
  "
      >
        <div className="max-w-md text-center space-y-8 z-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              MyResume.io
            </span>
          </h1>
          <p className="text-lg opacity-90">
            Create, manage, and share your resumes effortlessly.
          </p>
          <p className="text-sm opacity-80 italic">
            Your career journey starts here 🚀
          </p>
        </div>

        {/* ✅ Theme Toggle */}
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
      </div>

      {/* ---------- Form Side (Right Panel, theme-aware glass) ---------- */}
      <div
        className="
          w-full lg:w-1/2 relative overflow-hidden 
          flex justify-center items-center 
          bg-[var(--background)] text-[var(--foreground)]
          backdrop-blur-xl
          transition-colors
          px-4 py-12 sm:px-6 lg:px-8
        "
      >
        <AnimatePresence mode="wait">
          {showForm && (
            <motion.div
              key={isRegister ? "register-form" : "login-form"}
              initial={{
                x: isRegister ? 100 : -100,
                opacity: 0,
                filter: "blur(8px)",
              }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{
                x: isRegister ? -100 : 100,
                opacity: 0,
                filter: "blur(8px)",
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 flex justify-center items-center z-10"
            >
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AuthLayout;
