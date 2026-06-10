import { useEffect, useRef, useState } from "react";
import AuthGate from "./features/auth/components/AuthGate";
import HomeSection from "./features/home/components/HomeSection";
import Toolbar from "./features/layout/components/Toolbar";
import QuoteSection from "./features/quote/components/QuoteSection";
import { computeQuote } from "./features/quote/utils/quote";
import EditVarsSection from "./features/variables/components/EditVarsSection";
import VarsSection from "./features/variables/components/VarsSection";
import {
  AUTH_PASSWORD,
  AUTH_STORAGE_KEY,
  AUTH_USERNAME,
} from "./features/variables/config/constants";
import { loadVars, saveVars } from "./features/variables/utils/storage";
import { normalizeVars } from "./features/variables/utils/variables";

export default function App() {
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
  const [activeSection, setActiveSection] = useState("home");

  const refs = {
    home: useRef(null),
    quote: useRef(null),
    vars: useRef(null),
    edit: useRef(null),
  };

  useEffect(() => {
    if (authenticated) {
      document.body.classList.remove("auth-locked");
      requestAnimationFrame(() => {
        scrollToSection("home", false);
      });
    } else {
      document.body.classList.add("auth-locked");
    }

    return () => {
      document.body.classList.remove("auth-locked");
    };
  }, [authenticated]);

  function scrollToSection(sectionId, smooth = true) {
    const node = refs[sectionId]?.current;

    if (!node) {
      return;
    }

    node.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start",
    });
    setActiveSection(sectionId);

    if (sectionId === "edit") {
      setEditVars(normalizeVars(vars));
    }
  }

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
    setActiveSection("home");
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
    saveVars(normalized);
    scrollToSection("vars");
  }

  function cancelEdit() {
    setEditVars(normalizeVars(vars));
    scrollToSection("vars");
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
        <Toolbar
          activeSection={activeSection}
          onScrollToSection={scrollToSection}
          onLogout={logout}
        />

        <main className="page-host single-page-layout">
          <HomeSection sectionRef={refs.home} onScrollToSection={scrollToSection} />
          <QuoteSection
            sectionRef={refs.quote}
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
          <VarsSection
            sectionRef={refs.vars}
            vars={vars}
            onEditClick={() => scrollToSection("edit")}
          />
          <EditVarsSection
            sectionRef={refs.edit}
            editVars={editVars}
            onStepField={stepEditField}
            onInputChange={updateEditField}
            onSave={saveEditVars}
            onCancel={cancelEdit}
          />
        </main>

        <footer className="app-footer">&copy; 2026 Quote App</footer>
      </div>
    </>
  );
}
