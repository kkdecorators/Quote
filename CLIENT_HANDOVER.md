# Client Handover - Quote App

## Release Status
- Branch: `main`
- Latest release commit: `12f2336`
- Deployment: GitHub Pages via GitHub Actions workflow
- Routing mode: `HashRouter` (static-host friendly)
- Auth: Firebase Authentication (Email/Password)
- Data sync: Firestore + localStorage fallback

## Deployment Flow
1. Push to `main`.
2. GitHub Actions runs `.github/workflows/deploy-pages.yml`.
3. Build artifact is deployed to GitHub Pages.
4. No `gh-pages` branch publishing is required.

## Required GitHub Secrets
Set these in repository Settings -> Secrets and variables -> Actions:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)
- `VITE_FIREBASE_VARS_COLLECTION` (recommended: `Quote_App`)
- `VITE_FIREBASE_VARS_DOC_ID` (recommended: `Shared_Variables`)

## Local Development
1. Copy `.env.example` to `.env.local`.
2. Fill Firebase values for the target project.
3. Run:
   - `npm install`
   - `npm run dev`

## Firebase Auth Setup
1. In Firebase Console -> Authentication -> Sign-in method, enable Email/Password.
2. Create or invite allowed operator accounts.
3. Disable any legacy static-password flow (already removed in code).
4. Use app forgot-password flow for account recovery.

## Firestore Data Location
- Collection: `Quote_App`
- Document: `Shared_Variables`

Document shape is key-value numeric variables (`a`..`m`) used by the app.

## Recommended Firestore Rules
Use a production-safe baseline such as:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Quote_App/Shared_Variables {
      allow read, write: if request.auth != null;
    }
  }
}
```

If needed, tighten further to specific emails or custom claims.

## Security Notes
- Firebase web API key is public by design in browser apps.
- Security must be enforced by Firebase Auth + Firestore Rules.
- Restrict Firebase API key in Google Cloud Console:
  - Application restriction: HTTP referrers (your production domain)
  - API restriction: only required Firebase APIs
- Rotate key if previously exposed in historical built assets.

## Sync Status UX
In Edit Variables screen:
- `Sync: Checking` = startup verification in progress
- `Sync: Connected` = Firestore sync active
- `Sync: Local only` = saved locally; cloud sync currently unavailable

## Operations Runbook
- Pre-release checks:
  - `npm test`
  - `npm run build`
- Post-deploy checks:
  - Log in with Firebase account
  - Edit and save variables
  - Confirm sync badge reaches `Connected`
  - Verify value consistency from a second device/session
- Incident fallback:
  - App continues with localStorage when cloud is unavailable
  - Resolve Firebase/Auth/Rules issue, then re-test cloud sync

## Rollback
1. In GitHub, identify last known-good commit on `main`.
2. Revert problematic commit or redeploy known-good commit.
3. Confirm Actions deploy succeeds.
4. Smoke-test login, quote calculation, and variable sync.

## Ownership Transfer Checklist
- [ ] Client has GitHub repo admin or maintainer access
- [ ] Client has Firebase project owner/editor access
- [ ] GitHub Actions secrets are configured by client
- [ ] Firebase Auth users are created and tested
- [ ] Firestore rules are published and validated
- [ ] Production URL shared with client
- [ ] Recovery contact/process agreed for locked accounts
