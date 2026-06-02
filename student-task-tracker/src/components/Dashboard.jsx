import { useState } from "react";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <div>
      {page === "landing" && (
        <Landing goToDashboard={() => setPage("dashboard")} />
      )}

      {page === "dashboard" && (
        <Dashboard goToLanding={() => setPage("landing")} />
      )}
    </div>
  );
}