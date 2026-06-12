export default function AuthGate({
  authUsername,
  authPassword,
  authError,
  authErrorMessage,
  authInfoMessage,
  authLoading,
  authSubmitting,
  authResetting,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
}) {
  return (
    <div className="auth-gate" aria-live="polite">
      <div className="auth-card">
        <h1 className="auth-title">Sign In Required</h1>
        <p className="auth-subtitle">
          Sign in with your Firebase account to access Quote App.
        </p>
        <form className="auth-form" autoComplete="off" onSubmit={onSubmit}>
          <label className="auth-label" htmlFor="auth-username">
            Email
          </label>
          <input
            id="auth-username"
            className="auth-input"
            type="email"
            autoComplete="email"
            required
            value={authUsername}
            disabled={authLoading || authSubmitting}
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
            disabled={authLoading || authSubmitting}
            onChange={onPasswordChange}
          />
          <div
            className="auth-error"
            role="alert"
            style={{ display: authError ? "block" : "none" }}
          >
            {authErrorMessage}
          </div>
          <div
            className="auth-info"
            role="status"
            style={{ display: authInfoMessage ? "block" : "none" }}
          >
            {authInfoMessage}
          </div>
          <button
            type="button"
            className="auth-link-btn"
            disabled={authLoading || authSubmitting || authResetting}
            onClick={onForgotPassword}
          >
            {authResetting ? "Sending reset email..." : "Forgot password?"}
          </button>
          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={authLoading || authSubmitting || authResetting}
          >
            {authSubmitting ? "Signing In..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
