import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FileUser, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import useAuthStore from "../../store/userStore";
import authAPI from "../../API/API";
import ThemeToggle from "../common/ThemeToggle";

const menuLinks = [
  { label: "Uploads", to: "/dashboard" },
  { label: "Previous Uploads", to: "/uploads" },
  { label: "Settings", to: "/settings" },
  { label: "About", to: "/about" },
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
                  : "text-foreground hover:text-[var(--primary)]"
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
    <header className="sticky top-0 z-40 w-full bg-[var(--navbar-background)] text-foreground backdrop-blur-md border-b border-border shadow-md">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* LEFT: Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 hover:text-primary transition-colors no-underline"
        >
          <FileUser className="h-6 w-6" />
          <span className="font-bold text-lg">MyResume.io</span>
        </Link>

        {/* CENTER: Nav (desktop only) */}
        <div className="hidden lg:flex flex-1 justify-center">
          <MenuItems />
        </div>

        {/* RIGHT: Logout + ThemeToggle (desktop only) */}
        <div className="hidden lg:flex items-center gap-4">
          {user && (
            <>
              <span className="font-medium">Hello, {user.username}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-destructive border-border hover:bg-muted"
              >
                Logout
              </Button>
              <ThemeToggle />
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
                className="bg-primary text-primary-foreground hover:bg-primary/80"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            {mobileOpen && (
              <SheetContent
                side="left"
                className="flex flex-col justify-between w-full max-w-xs p-4
                           bg-background text-foreground border-border"
              >
                <div>
                  <MenuItems
                    vertical
                    onLinkClick={() => setMobileOpen(false)}
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-destructive border-border hover:bg-muted"
                  >
                    Logout
                  </Button>
                  <ThemeToggle />
                </div>
              </SheetContent>
            )}
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default DashHeader;
