// src/hooks/crm/useCrmAuth.js
import { useAuth } from '../../context/crm/AuthContext.jsx';

export const useCrmAuth = () => {
  return useAuth();
};