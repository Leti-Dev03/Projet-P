import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/crm/AuthContext.jsx';     // ← Chemin corrigé
import { PermissionProvider } from './context/crm/PermissionContext'; // ou './context/crm/PermissionContext' si déplacé

// Client Pages
import ClientDashboard from './pages/client/Dashboard';
import ClientReclamation from './pages/client/Reclamation';
import SuiviReclamation from './pages/client/SuiviReclamation';
import Historique from './pages/client/Historique';

// CRM Pages
import LoginCRM from './pages/crm/login.jsx';
import CRMDashboard from './pages/crm/Dashboard';
import Clients from './pages/crm/Clients';
import Factures from './pages/crm/Factures';
import Reclamations from './pages/crm/Reclamations';
import Interventions from './pages/crm/Interventions';
import Offres from './pages/crm/Offres';
import Statistiques from './pages/crm/Statistiques';

// Administration
import Profils from './pages/crm/administration/Profils';
import Employes from './pages/crm/administration/Employes';
import Permissions from './pages/crm/administration/Permissions';
import Parametres from './pages/crm/administration/Parametres';
import Logs from './pages/crm/administration/logs.jsx';

export default function App() {
  return (
    <AuthProvider>
      <PermissionProvider>
        <BrowserRouter>
          <Routes>
            {/* Login */}
            <Route path="/crm/login" element={<LoginCRM />} />

            {/* Client Routes */}
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/reclamation" element={<ClientReclamation />} />
            <Route path="/client/suivi" element={<SuiviReclamation />} />
            <Route path="/client/historique" element={<Historique />} />

            {/* CRM Routes */}
            <Route path="/crm/dashboard" element={<CRMDashboard />} />
            <Route path="/crm/clients" element={<Clients />} />
            <Route path="/crm/factures" element={<Factures />} />
            <Route path="/crm/reclamations" element={<Reclamations />} />
            <Route path="/crm/interventions" element={<Interventions />} />
            <Route path="/crm/offres" element={<Offres />} />
            <Route path="/crm/statistiques" element={<Statistiques />} />

            {/* Administration */}
            <Route path="/crm/administration/profils" element={<Profils />} />
            <Route path="/crm/administration/employes" element={<Employes />} />
            <Route path="/crm/administration/permissions" element={<Permissions />} />
            <Route path="/crm/administration/parametres" element={<Parametres />} />
            <Route path="/crm/administration/logs" element={<Logs />} />


            {/* Redirections */}
            <Route path="/" element={<Navigate to="/crm/login" replace />} />
            <Route path="*" element={<Navigate to="/crm/login" replace />} />
          </Routes>
        </BrowserRouter>
      </PermissionProvider>
    </AuthProvider>
  );
}