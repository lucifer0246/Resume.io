import "./App.css";
import AppRoutes from "./AppRoutes";
import { Toaster } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

function App() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
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
