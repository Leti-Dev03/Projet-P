import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const { user, hasPermission: hasAuthPermission } = useAuth();   // ← Ça marche maintenant

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (user) {
      setPermissions(user.permissions || []);
    } else {
      setPermissions([]);
    }
  }, [user]);

  const hasPermission = (ressource, action) => {
    if (!user) return false;
    if (user.est_superadmin === true) return true;
    return hasAuthPermission ? hasAuthPermission(ressource, action) : false;
  };

  return (
    <PermissionContext.Provider value={{ permissions, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission doit être utilisé à l’intérieur de PermissionProvider');
  }
  return context;
};