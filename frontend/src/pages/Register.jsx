// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaShieldAlt, FaCheckCircle, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import FormCard from "../components/FormCard.jsx";
import InputField from "../components/InputField.jsx";
import Button from "../components/Button.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";

// ── Features affichées en bas du panneau gauche ───────────────────────────────
const LeftFeatures = () => (
  <div>
    <h2 style={{ color: "#505a69", fontSize: 20, fontWeight: 800, lineHeight: 1.35, margin: "0 0 6px 0" }}>
      Créez votre compte{" "}
      <span style={{ color: "#78BE20" }}>Algérie Télécom</span>
    </h2>
    <p style={{ color: "#505a69", fontSize: 13, lineHeight: 1.6, margin: "0 0 18px 0" }}>
      Rejoignez des milliers de clients qui gèrent leurs services en ligne.
    </p>
    {[
      // { icon: <FaShieldAlt size={11} />, label: "Compte sécurisé" },
      // { icon: <FaCheckCircle size={11} />, label: "Vérification par email" },
      // { icon: <FaStar size={11} />, label: "Accès à tous vos services" },
    ].map((f, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 + i * 0.1 }}
        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}
      >
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: "rgba(120,190,32,0.18)",
          border: "1px solid rgba(120,190,32,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#78BE20", flexShrink: 0,
        }}>
          {f.icon}
        </div>
        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{f.label}</span>
      </motion.div>
    ))}
  </div>
);

// ── Page Register ─────────────────────────────────────────────────────────────
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "", email: "", telephone: "", password: "", passwordConfirm: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!formData.username || !formData.email || !formData.password || !formData.passwordConfirm) {
      setError("Tous les champs obligatoires doivent être remplis."); return;
    }
    if (formData.username.trim().length < 3) { setError("Le nom doit contenir au moins 3 caractères."); return; }
    if (formData.password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    if (formData.password !== formData.passwordConfirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (!acceptTerms) { setError("Vous devez accepter les conditions d'utilisation."); return; }

    setLoading(true);
    try {
      await register({
        username: formData.username, email: formData.email,
        telephone: formData.telephone, password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      });
      navigate("/OtpPage", { state: { email: formData.email, type: "register", redirectTo: "/client/dashboard" } });
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("email") && msg.includes("existe")) setError("Un compte avec cet email existe déjà.");
      else if (msg.includes("téléphone") && msg.includes("existe")) setError("Un compte avec ce numéro existe déjà.");
      else setError(msg || "Erreur lors de la création du compte.");
    } finally { setLoading(false); }
  };

  return (
    <FormCard leftContent={<LeftFeatures />} topRight={<LanguageToggle />}>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "#505a69", margin: "0 0 4px 0" }}>Créer un compte</h2>
      <p style={{ color: "#718096", fontSize: 14, margin: "0 0 22px 0" }}>Rejoignez le portail Algérie Télécom</p>

      <form onSubmit={handleSubmit}>
        <InputField type="text" name="username" placeholder="Nom complet (ex: Ahmed Benali)"
          icon={<FaUser />} value={formData.username} onChange={handleChange} />
        <InputField type="email" name="email" placeholder="Adresse e-mail"
          icon={<FaEnvelope />} value={formData.email} onChange={handleChange} />
        <InputField type="text" name="telephone" placeholder="Numéro de téléphone (optionnel)"
          icon={<FaPhone />} value={formData.telephone} onChange={handleChange} />
        <InputField type="password" name="password" placeholder="Mot de passe (min. 8 caractères)"
          icon={<FaLock />} value={formData.password} onChange={handleChange} />
        <InputField type="password" name="passwordConfirm" placeholder="Confirmer le mot de passe"
          icon={<FaLock />} value={formData.passwordConfirm} onChange={handleChange} />

        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
            <p style={{ color: "#c53030", fontSize: 13, margin: 0 }}>⚠️ {error}</p>
          </motion.div>
        )}

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)}
              style={{ marginTop: 3, width: 15, height: 15, accentColor: "#0070B8", cursor: "pointer", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.5 }}>
              J'accepte les{" "}
              <a href="/terms-of-service" target="_blank" rel="noopener noreferrer"
                style={{ color: "#0070B8", fontWeight: 600, textDecoration: "underline" }}>
                Conditions d'Utilisation
              </a>
            </span>
          </label>
        </div>

        <Button type="submit" label={loading ? "Création..." : "Créer mon compte"} disabled={loading} />
      </form>

      <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#718096" }}>
        Déjà un compte ?{" "}
        <a href="/login" style={{ color: "#0070B8", fontWeight: 700, textDecoration: "none" }}>Se connecter</a>
      </p>
      <p style={{ textAlign: "center", marginTop: 8, fontSize: 12 }}>
        <a href="/welcome" style={{ color: "#78BE20", fontWeight: 600, textDecoration: "none" }}>← Retour à l'accueil</a>
      </p>
    </FormCard>
  );
};

export default Register;