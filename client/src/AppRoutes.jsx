// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import CheckAuth from "./components/common/check-auth";
import AuthCheckerRoute from "./components/public-resume/resumeAuth";

// Layouts
import AuthLayout from "./components/auth/layout";
import DashboardLayout from "./components/dashboard/layout";

// Pages
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import UploadPage from "./pages/dashboard/dashboard";
import UploadResume from "./pages/upload-view/uploadResume";
import SettingsPage from "./pages/settings/setting";
import PublicResume from "./pages/public-resume/public-resume";
import About from "./pages/about/about";

// Common
import Unauthorized from "./pages/unauthorized/unauthorized";
import NotFound from "./pages/not-found/not-found";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ---------- AUTH ROUTES (Public) ---------- */}
      <Route
        element={
          <CheckAuth requireAuth={false}>
            <AuthLayout />
          </CheckAuth>
        }
      >
        <Route index element={<AuthLogin />} />
        <Route path="login" element={<AuthLogin />} />
        <Route path="register" element={<AuthRegister />} />
      </Route>

      {/* ---------- DASHBOARD ROUTES (Protected) ---------- */}
      <Route
        element={
          <CheckAuth requireAuth={true}>
            <DashboardLayout />
          </CheckAuth>
        }
      >
        <Route path="dashboard" element={<UploadPage />} />
        <Route path="uploads" element={<UploadResume />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="about" element={<About />} />
      </Route>

      {/* ---------- PUBLIC RESUME ROUTE ---------- */}
      <Route element={<AuthCheckerRoute />}>
        <Route index element={<PublicResume />} />
        <Route path=":username/:slug" element={<PublicResume />} />
      </Route>

      {/* ---------- UNAUTHORIZED ---------- */}
      <Route path="unauthorized" element={<Unauthorized />} />

      {/* ---------- 404 NOT FOUND ---------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
