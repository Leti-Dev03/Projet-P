// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// ── Pages auth ──────────────────────────────────────────────────────────────────
import Welcome  from "./pages/welcome.jsx";
import Login    from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import OtpPage  from "./pages/OtpPage.jsx";

// ── Pages client (protégées) ────────────────────────────────────────────────────
import Dashboard        from "./pages/client/Dashboard";
import ClientReclamation from "./pages/client/Reclamation";
import SuiviReclamation  from "./pages/client/SuiviReclamation";
import Historique        from "./pages/client/Historique";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Accueil ─────────────────────────────────────────────────────── */}
          <Route path="/"        element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<Welcome />} />

          {/* ── Auth ────────────────────────────────────────────────────────── */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/OtpPage"  element={<OtpPage />} />

          {/* ── Espace client (connexion obligatoire) ────────────────────────── */}
          <Route
            path="/client/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/client/reclamation"
            element={<ProtectedRoute><ClientReclamation /></ProtectedRoute>}
          />
          <Route
            path="/client/suivi"
            element={<ProtectedRoute><SuiviReclamation /></ProtectedRoute>}
          />
          <Route
            path="/client/historique"
            element={<ProtectedRoute><Historique /></ProtectedRoute>}
          />

          {/* ── 404 ─────────────────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}