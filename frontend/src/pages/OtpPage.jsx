// src/pages/OtpPage.jsx
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiVerifyOTP, apiResendOTP } from "../services/authClient";
import { useAuth } from "../hooks/useAuth";

const RESEND_DELAY = 60; // secondes avant de pouvoir renvoyer

const OtpPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // state passé depuis Register ou Login : { email, type, redirectTo }
  const email      = state?.email      || "";
  const type       = state?.type       || "register"; // "register" | "inactivity"
  const redirectTo = state?.redirectTo || "/client/dashboard";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_DELAY);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // ── Countdown pour le renvoi OTP ─────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ── Rediriger si aucun email en state ────────────────────────────────────────
  useEffect(() => {
    if (!email) navigate("/register", { replace: true });
  }, [email, navigate]);

  // ── Gestion des inputs OTP ───────────────────────────────────────────────────
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // chiffres seulement
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // un seul chiffre
    setOtp(newOtp);
    setError("");

    // Avancer au champ suivant automatiquement
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // ── Soumission ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Veuillez entrer les 6 chiffres du code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiVerifyOTP({ email, otp: code });

      setSuccess("Compte vérifié avec succès ! Redirection...");

      // Si c'est un register, on connecte directement après vérification
      // (le backend ne renvoie pas de token ici — on redirige vers login)
      setTimeout(() => {
        if (type === "register") {
          navigate("/login", { replace: true });
        } else {
          navigate(redirectTo, { replace: true });
        }
      }, 1500);
    } catch (err) {
      setError(err.message || "Code OTP invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  // ── Renvoi du code ───────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(RESEND_DELAY);
    setError("");
    setSuccess("");
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();

    try {
      await apiResendOTP({ email });
      setSuccess("Un nouveau code a été envoyé sur votre email.");
    } catch (err) {
      setError(err.message || "Impossible de renvoyer le code.");
    }
  };

  // ── Auto-submit quand les 6 chiffres sont saisis ─────────────────────────────
  useEffect(() => {
    if (otp.every((d) => d !== "")) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F4F6F9",
        padding: 16,
        fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,112,184,0.12)",
          width: "100%",
          maxWidth: 440,
          overflow: "hidden",
        }}
      >
        {/* Header bleu AT */}
        <div
          style={{
            background: "linear-gradient(135deg, #0070B8, #004f85)",
            padding: "28px 32px",
            textAlign: "center",
          }}
        >
          {/* Logo AT */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <svg width="60" height="60" viewBox="0 0 120 120" fill="none">
              <rect width="120" height="120" rx="24" fill="white" fillOpacity="0.15" />
              <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
                fill="white" fontSize="44" fontWeight="900" fontFamily="serif" letterSpacing="-2">AT</text>
              <rect x="20" y="85" width="80" height="6" rx="3" fill="#78BE20" />
            </svg>
          </div>

          <h2 style={{ color: "#fff", margin: "0 0 6px 0", fontSize: 20, fontWeight: 800 }}>
            Vérification de l'email
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: 13 }}>
            Un code à 6 chiffres a été envoyé à
          </p>
          <p style={{ color: "#78BE20", margin: "4px 0 0 0", fontSize: 14, fontWeight: 700 }}>
            {email}
          </p>
        </div>

        {/* Barre dégradée */}
        <div style={{ height: 4, background: "linear-gradient(to right, #0070B8, #78BE20)" }} />

        {/* Corps */}
        <div style={{ padding: "32px 32px 28px" }}>
          {/* Icône enveloppe animée */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ textAlign: "center", marginBottom: 24 }}
          >
            <span style={{ fontSize: 48 }}>📧</span>
          </motion.div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#7f8c8d", marginBottom: 24 }}>
            Entrez le code reçu par email. Il est valide pendant <strong>10 minutes</strong>.
          </p>

          {/* Inputs OTP */}
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                marginBottom: 20,
              }}
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  whileFocus={{ scale: 1.08 }}
                  style={{
                    width: 48,
                    height: 56,
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: 800,
                    border: digit
                      ? "2px solid #0070B8"
                      : "2px solid #d1dae3",
                    borderRadius: 12,
                    outline: "none",
                    background: digit ? "#e8f4fc" : "#fff",
                    color: "#0070B8",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                    cursor: "text",
                    boxShadow: digit ? "0 0 0 3px rgba(0,112,184,0.12)" : "none",
                  }}
                />
              ))}
            </div>

            {/* Messages */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  color: "#E2001A",
                  fontSize: 13,
                  textAlign: "center",
                  marginBottom: 14,
                  background: "#fff0f0",
                  borderRadius: 8,
                  padding: "8px 12px",
                }}
              >
                ⚠️ {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  color: "#78BE20",
                  fontSize: 13,
                  textAlign: "center",
                  marginBottom: 14,
                  background: "#f4fce8",
                  borderRadius: 8,
                  padding: "8px 12px",
                }}
              >
                ✅ {success}
              </motion.p>
            )}

            {/* Bouton vérifier */}
            <button
              type="submit"
              disabled={loading || otp.join("").length < 6}
              style={{
                width: "100%",
                padding: "13px 0",
                background: loading ? "#7f8c8d" : "#0070B8",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "background 0.2s",
                marginBottom: 16,
              }}
            >
              {loading ? "Vérification..." : "Vérifier le code"}
            </button>
          </form>

          {/* Renvoi du code */}
          <div style={{ textAlign: "center" }}>
            {canResend ? (
              <button
                onClick={handleResend}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0070B8",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textDecoration: "underline",
                }}
              >
                Renvoyer le code
              </button>
            ) : (
              <p style={{ fontSize: 12, color: "#7f8c8d", margin: 0 }}>
                Renvoyer le code dans{" "}
                <span style={{ color: "#0070B8", fontWeight: 700 }}>
                  {countdown}s
                </span>
              </p>
            )}
          </div>

          {/* Retour */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              onClick={() => navigate(type === "register" ? "/register" : "/login")}
              style={{
                background: "none",
                border: "none",
                color: "#78BE20",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ← Retour
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpPage;