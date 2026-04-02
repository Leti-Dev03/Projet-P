// src/context/crm/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginCRM, logoutCRM, getMeCRM } from '../../services/crm/auth.js';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('crm_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getMeCRM();
        setUser(data.utilisateur);
        setRoles(data.roles || []);
        setPermissions(data.permissions); // null = superadmin accès total
      } catch (err) {
        console.error('Erreur vérification session:', err);
        localStorage.removeItem('crm_token');
        localStorage.removeItem('crm_user');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      // Étape 1 : login → token
      const data = await loginCRM(email, password);
      localStorage.setItem('crm_token', data.token);
      localStorage.setItem('crm_user', JSON.stringify(data.utilisateur));

      // Étape 2 : /me → permissions complètes
      // loginCRM ne retourne PAS les permissions, seulement le token
      const meData = await getMeCRM();
      setUser(meData.utilisateur);
      setRoles(meData.roles || []);
      setPermissions(meData.permissions); // null si superadmin

      return meData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur de connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('crm_token');
      if (token) await logoutCRM();
    } catch (err) {
      console.error('Erreur déconnexion:', err);
    } finally {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
      setUser(null);
      setRoles([]);
      setPermissions(null);
    }
  };

  const hasPermission = (ressource, action) => {
    if (!user) return false;
    // superadmin ou permissions null → accès total
    if (user.est_superadmin || permissions === null) return true;
    if (!permissions[ressource]) return false;
    return permissions[ressource].includes(action);
  };

  const hasRole = (roleName) => roles.some((r) => r.nom === roleName);

  return (
    <AuthContext.Provider value={{
      user, roles, permissions, loading, error,
      login, logout,
      isAuthenticated: !!user,
      hasPermission,
      hasRole,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};