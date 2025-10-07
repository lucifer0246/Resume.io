import { Outlet } from "react-router-dom";
import DashHeader from "./header";

function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen  overflow-hidden ">
      {/* Sidebar / Navbar etc */}
      <DashHeader />
      <main className="flex-1 ">
        <Outlet /> {/* 👈 nested routes render here */}
      </main>
    </div>
  );
}

export default DashboardLayout;
