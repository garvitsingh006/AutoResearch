import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { api } from "./api";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NewPaper from "./pages/NewPaper";
import PaperView from "./pages/PaperView";

function Protected({ user, children }) {
  if (user === null) return <Navigate to="/login" replace />;
  if (user === undefined) return null; // still loading
  return children;
}

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onAuth={setUser} />} />
        <Route path="/signup" element={<Signup onAuth={setUser} />} />
        <Route
          path="/dashboard"
          element={
            <Protected user={user}>
              <Dashboard user={user} />
            </Protected>
          }
        />
        <Route
          path="/new"
          element={
            <Protected user={user}>
              <NewPaper user={user} />
            </Protected>
          }
        />
        <Route
          path="/paper"
          element={
            <Protected user={user}>
              <PaperView user={user} />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
