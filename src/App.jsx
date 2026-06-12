import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AuthGate from "./features/auth/components/AuthGate";
import {
  loginWithFirebase,
  logoutFromFirebase,
  sendResetEmail,
  subscribeAuthState,
} from "./features/auth/utils/firebaseAuth";
import HomeSection from "./features/home/components/HomeSection";
import Toolbar from "./features/layout/components/Toolbar";
import QuoteSection from "./features/quote/components/QuoteSection";
import { computeQuote } from "./features/quote/utils/quote";
import VarsSection from "./features/variables/components/VarsSection";
import {
  loadSyncedVars,
  saveSyncedVars,
} from "./features/variables/utils/firebaseSync";
import { loadVars, saveVars } from "./features/variables/utils/storage";
import { normalizeVars } from "./features/variables/utils/variables";

export default function App() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authResetting, setAuthResetting] = useState(false);
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState("Invalid email or password");
  const [authInfoMessage, setAuthInfoMessage] = useState("");

  const [vars, setVars] = useState(loadVars);
  const [editVars, setEditVars] = useState(loadVars);

  const [meters, setMeters] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quoteErrors, setQuoteErrors] = useState({
    meters: false,
    qty: false,
    global: false,
  });
  const [quoteResult, setQuoteResult] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeAuthState((user) => {
      setAuthenticated(Boolean(user));
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authenticated) {
      document.body.classList.remove("auth-locked");
    } else {
      document.body.classList.add("auth-locked");
    }

    return () => {
      document.body.classList.remove("auth-locked");
    };
  }, [authenticated]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapVarsSync() {
      const remoteVars = await loadSyncedVars();
      if (cancelled) {
        return;
      }

      if (remoteVars) {
        setVars(remoteVars);
        setEditVars(remoteVars);
        saveVars(remoteVars);
        return;
      }

      await saveSyncedVars(vars);
    }

    bootstrapVarsSync();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthSubmitting(true);
    setAuthError(false);
    setAuthInfoMessage("");

    const result = await loginWithFirebase(authUsername.trim(), authPassword);
    if (result.ok) {
      setAuthPassword("");
      setAuthSubmitting(false);
      return;
    }

    setAuthError(true);
    setAuthErrorMessage(getAuthErrorMessage(result.code));
    setAuthPassword("");
    setAuthSubmitting(false);
  }

  async function handleForgotPassword() {
    const email = authUsername.trim();
    if (!email) {
      setAuthError(true);
      setAuthInfoMessage("");
      setAuthErrorMessage("Enter your email first, then tap Forgot password.");
      return;
    }

    setAuthResetting(true);
    setAuthError(false);
    setAuthInfoMessage("");

    const result = await sendResetEmail(email);
    if (result.ok) {
      setAuthInfoMessage("Password reset email sent. Check your inbox and spam folder.");
      setAuthResetting(false);
      return;
    }

    setAuthError(true);
    setAuthErrorMessage(getResetErrorMessage(result.code));
    setAuthResetting(false);
  }

  async function logout() {
    await logoutFromFirebase();
    setAuthUsername("");
    setAuthPassword("");
    setAuthError(false);
    navigate("/");
  }

  function stepQuoteField(field, delta) {
    if (field === "meters") {
      const current = parseFloat(meters) || 0;
      const next = Math.round((current + delta) * 100) / 100;
      setMeters(next.toFixed(2));
      return;
    }

    const current = parseInt(quantity, 10) || 0;
    setQuantity(String(current + delta));
  }

  function clearQuote() {
    setMeters("");
    setQuantity("");
    setQuoteErrors({ meters: false, qty: false, global: false });
    setQuoteResult(null);
  }

  function calculateQuote(event) {
    event.preventDefault();

    const metersNumber = parseFloat(meters);
    const quantityNumber = parseInt(quantity, 10);

    const metersInvalid = Number.isNaN(metersNumber) || metersNumber <= 0;
    const quantityInvalid = Number.isNaN(quantityNumber) || quantityNumber <= 0;
    const hasErrors = metersInvalid || quantityInvalid;

    setQuoteErrors({
      meters: metersInvalid,
      qty: quantityInvalid,
      global: hasErrors,
    });

    if (hasErrors) {
      setQuoteResult(null);
      return;
    }

    setQuoteResult(computeQuote(metersNumber, quantityNumber, vars));
  }

  function stepEditField(key, delta) {
    setEditVars((prev) => {
      const current = parseFloat(prev[key]) || 0;
      const next = Math.round((current + delta) * 100) / 100;
      return { ...prev, [key]: next };
    });
  }

  function updateEditField(key, value) {
    setEditVars((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function saveEditVars(event) {
    event.preventDefault();
    const normalized = normalizeVars(editVars);
    setVars(normalized);
    setEditVars(normalized);
    saveVars(normalized);

    const syncResult = await saveSyncedVars(normalized);
    if (syncResult.ok) {
      window.alert("Variables updated successfully");
    } else {
      window.alert(`Variables updated locally. ${getSyncErrorMessage(syncResult.code)}`);
    }

    navigate("/");
  }

  function cancelEdit() {
    setEditVars(normalizeVars(vars));
  }

  return (
    <>
      <AuthGate
        authUsername={authUsername}
        authPassword={authPassword}
        authError={authError}
        authErrorMessage={authErrorMessage}
        authInfoMessage={authInfoMessage}
        authLoading={authLoading}
        authSubmitting={authSubmitting}
        authResetting={authResetting}
        onUsernameChange={(event) => setAuthUsername(event.target.value)}
        onPasswordChange={(event) => setAuthPassword(event.target.value)}
        onSubmit={handleAuthSubmit}
        onForgotPassword={handleForgotPassword}
      />

      <div className="app-shell">
        <Toolbar onLogout={logout} />

        <main className="page-host">
          <Routes>
            <Route path="/" element={<HomeSection onNavigate={navigate} />} />
            <Route
              path="/quote"
              element={
                <QuoteSection
                  meters={meters}
                  quantity={quantity}
                  quoteErrors={quoteErrors}
                  quoteResult={quoteResult}
                  onMetersChange={(event) => setMeters(event.target.value)}
                  onQuantityChange={(event) => setQuantity(event.target.value)}
                  onStepField={stepQuoteField}
                  onClear={clearQuote}
                  onCalculate={calculateQuote}
                />
              }
            />
            <Route
              path="/variables"
              element={
                <VarsSection
                  editVars={editVars}
                  onStepField={stepEditField}
                  onInputChange={updateEditField}
                  onSave={saveEditVars}
                  onCancel={cancelEdit}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="app-footer">&copy; 2026 Quote App</footer>
      </div>
    </>
  );
}

function getAuthErrorMessage(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/invalid-email":
      return "That email format looks invalid.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes or use Forgot password.";
    case "auth/not-configured":
      return "Authentication is not configured for this environment.";
    default:
      return "Sign-in failed. Please try again.";
  }
}

function getResetErrorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Enter a valid email address to reset your password.";
    case "auth/user-not-found":
      return "No account found with that email.";
    case "auth/too-many-requests":
      return "Too many reset requests. Wait a few minutes and try again.";
    case "auth/not-configured":
      return "Password reset is not configured for this environment.";
    default:
      return "Could not send reset email. Please try again.";
  }
}

function getSyncErrorMessage(code) {
  switch (code) {
    case "permission-denied":
      return "Firebase denied access. Check Firestore rules for Quote_App/Shared_Variables.";
    case "unauthenticated":
      return "You are not authenticated with Firebase. Log in again and retry.";
    case "sync/not-configured":
      return "Firebase sync is not configured in this deployed environment.";
    default:
      return "Firebase sync is unavailable right now.";
  }
}
