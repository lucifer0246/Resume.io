import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FileUser, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import useAuthStore from "../../store/userStore";
import authAPI from "../../API/API";

// Navigation Links
const menuLinks = [
  { label: "Uploads", to: "/dashboard" }, // Dashboard home
  { label: "Previous Uploads", to: "/uploads" }, // Uploads page
  { label: "Settings", to: "/settings" }, // Settings page
  { label: "About", to: "/about" }, // About page
];

function MenuItems({ vertical = false, onLinkClick }) {
  return (
    <nav
      className={`flex gap-4 font-medium ${vertical ? "flex-col" : "flex-row"}`}
    >
      {menuLinks.map(({ label, to }, idx) => (
        <NavLink key={idx} to={to} onClick={onLinkClick}>
          {({ isActive }) => (
            <span
              className={`no-underline transition-colors ${
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              {label}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function DashHeader() {
  const { user, setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = Boolean(user);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setAuth({ user: null, token: null });
      navigate("/login");
    } catch {
      console.error("Logout error");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white backdrop-blur-md backdrop-saturate-150  border-blue-300 shadow-md">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 text-gray-800">
        {/* LEFT: Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors no-underline"
        >
          <FileUser className="h-6 w-6" />
          <span className="font-bold text-lg">MyResume.io</span>
        </Link>

        {/* CENTER: Nav (desktop only) */}
        <div className="hidden lg:flex flex-1 justify-center">
          <MenuItems />
        </div>

        {/* RIGHT: Hello + Logout (desktop only) */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated && (
            <>
              <span className="font-medium">Hello, {user.username}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-500 border-red-300 hover:bg-red-50"
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* MOBILE MENU */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            {mobileOpen && (
              <SheetContent
                side="left"
                className="flex flex-col w-full max-w-xs p-4 bg-white"
              >
                <MenuItems vertical onLinkClick={() => setMobileOpen(false)} />
              </SheetContent>
            )}
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default DashHeader;
