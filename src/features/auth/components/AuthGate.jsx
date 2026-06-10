export default function AuthGate({
  authUsername,
  authPassword,
  authError,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <div className="auth-gate" aria-live="polite">
      <div className="auth-card">
        <h1 className="auth-title">Sign In Required</h1>
        <p className="auth-subtitle">
          Enter your username and password to access Quote App.
        </p>
        <form className="auth-form" autoComplete="off" onSubmit={onSubmit}>
          <label className="auth-label" htmlFor="auth-username">
            Username
          </label>
          <input
            id="auth-username"
            className="auth-input"
            type="text"
            autoComplete="username"
            required
            value={authUsername}
            onChange={onUsernameChange}
          />
          <label className="auth-label" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            className="auth-input"
            type="password"
            autoComplete="current-password"
            required
            value={authPassword}
            onChange={onPasswordChange}
          />
          <div
            className="auth-error"
            role="alert"
            style={{ display: authError ? "block" : "none" }}
          >
            Invalid username or password
          </div>
          <button type="submit" className="btn-primary auth-submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
