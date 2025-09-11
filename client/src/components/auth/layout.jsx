import { Outlet, useLocation } from "react-router-dom";
//eslint-disable-next-line
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname.includes("register");
  const [showForm, setShowForm] = useState(false);

  // Add small delay to mount form smoothly
  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 100); // 100ms delay
    return () => clearTimeout(timer);
  }, [isRegister]);

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* ---------- Info Side (Static Left Panel) ---------- */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-center items-center px-12">
        <div className="max-w-md text-center text-primary-foreground space-y-8">
          {/* Main Title */}
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to <span className="text-yellow-300">MyResume.io</span>
          </h1>

          {/* Sub Title */}
          <p className="text-lg opacity-90">
            Create, manage, and share your resumes effortlessly.
          </p>

          {/* Footer Note */}
          <p className="text-sm opacity-80 italic">
            Your career journey starts here 🚀
          </p>
        </div>
      </div>

      {/* ---------- Form Side (Animated Right Side) ---------- */}
      <div className="w-full lg:w-1/2 relative overflow-hidden flex justify-center items-center bg-background px-4 py-12 sm:px-6 lg:px-8">
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
              className="absolute inset-0 flex justify-center items-center"
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
