import { useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/userStore";
import authAPI from "../../API/API";
import { Skeleton } from "@/components/ui/skeleton";

function CheckAuth({ children, requireAuth }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [loading, setLoading] = useState(requireAuth); // check only if route requires auth

  useEffect(() => {
    if (!requireAuth) return;

    const checkAuth = async () => {
      try {
        const response = await authAPI.checkAuth();
        setAuth({
          user: response.data.user,
          token: response.data.token || null, // keep token if backend provides
        });
      } catch {
        setAuth({ user: null, token: null });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, setAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-8 w-48 rounded-full" />
      </div>
    );
  }

  const isAuthenticated = !!user;
  const path = location.pathname;

  // 🔹 Case 1: already logged in and trying to visit /login or /register → redirect
  if (
    isAuthenticated &&
    (path === "/login" || path === "/register" || path === "/")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // 🔹 Case 2: route requires auth but user is NOT logged in → redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔹 Otherwise → allow access
  return <>{children}</>;
}

export default CheckAuth;
