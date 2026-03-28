// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { apiLogin, apiRegister } from "../services/authClient";

export const AuthContext = createContext(null);

const CLIENT_KEY = "at_client"; // clé localStorage

export const AuthProvider = ({ children }) => {
  const [client, setClient] = useState(null);       // données du client connecté
  const [loading, setLoading] = useState(true);      // chargement initial

  // ── Rehydrate depuis localStorage au montage ──────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CLIENT_KEY);
      if (stored) setClient(JSON.parse(stored));
    } catch {
      localStorage.removeItem(CLIENT_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Persiste le client dans localStorage à chaque changement ─────────────────
  useEffect(() => {
    if (client) {
      localStorage.setItem(CLIENT_KEY, JSON.stringify(client));
    } else {
      localStorage.removeItem(CLIENT_KEY);
    }
  }, [client]);

  // ── LOGIN ─────────────────────────────────────────────────────────────────────
  // Le backend attend : { email_ou_telephone, mot_de_passe }
  // On accepte aussi { email, password } venant du formulaire Login
  const login = useCallback(async ({ email, password, email_ou_telephone, mot_de_passe }) => {
    const payload = {
      email_ou_telephone: email_ou_telephone || email,
      mot_de_passe: mot_de_passe || password,
    };
    const data = await apiLogin(payload);
    // data = { message, client: { id, nom, prenom, email, ... } }
    setClient(data.client);
    return data;
  }, []);

  // ── REGISTER ──────────────────────────────────────────────────────────────────
  // Le backend attend : { nom, prenom, email, telephone, mot_de_passe, confirm_mot_de_passe }
  // On adapte depuis le formulaire Register qui envoie { username, email, password, passwordConfirm }
  const register = useCallback(async ({ username, email, password, passwordConfirm, telephone = "" }) => {
    // Découpe username en nom / prenom (si un seul mot → nom = username, prenom = "")
    const parts = username.trim().split(" ");
    const nom = parts[0];
    const prenom = parts.slice(1).join(" ") || nom;

    const payload = {
      nom,
      prenom,
      email,
      telephone,
      mot_de_passe: password,
      confirm_mot_de_passe: passwordConfirm,
    };
    const data = await apiRegister(payload);
    // Ne pas connecter l'utilisateur ici — il doit d'abord vérifier l'OTP
    return data; // { message, client_id, email }
  }, []);

  // ── LOGOUT ────────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setClient(null);
  }, []);

  return (
    <AuthContext.Provider value={{ client, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};