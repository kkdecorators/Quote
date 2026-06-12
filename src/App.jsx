import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AuthGate from "./features/auth/components/AuthGate";
import HomeSection from "./features/home/components/HomeSection";
import Toolbar from "./features/layout/components/Toolbar";
import QuoteSection from "./features/quote/components/QuoteSection";
import { computeQuote } from "./features/quote/utils/quote";
import VarsSection from "./features/variables/components/VarsSection";
import {
  AUTH_PASSWORD,
  AUTH_STORAGE_KEY,
  AUTH_USERNAME,
} from "./features/variables/config/constants";
import { loadVars, saveVars } from "./features/variables/utils/storage";
import { normalizeVars } from "./features/variables/utils/variables";

export default function App() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem(AUTH_STORAGE_KEY) === "true"
  );
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState(false);

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
    if (authenticated) {
      document.body.classList.remove("auth-locked");
    } else {
      document.body.classList.add("auth-locked");
    }

    return () => {
      document.body.classList.remove("auth-locked");
    };
  }, [authenticated]);

  function handleAuthSubmit(event) {
    event.preventDefault();

    if (authUsername.trim() === AUTH_USERNAME && authPassword === AUTH_PASSWORD) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      setAuthenticated(true);
      setAuthError(false);
      setAuthPassword("");
      return;
    }

    setAuthError(true);
    setAuthPassword("");
  }

  function logout() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthenticated(false);
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

  function saveEditVars(event) {
    event.preventDefault();
    const normalized = normalizeVars(editVars);
    setVars(normalized);
    setEditVars(normalized);
    saveVars(normalized);
    window.alert("Variables updated successfully");
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
        onUsernameChange={(event) => setAuthUsername(event.target.value)}
        onPasswordChange={(event) => setAuthPassword(event.target.value)}
        onSubmit={handleAuthSubmit}
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
