# Diamond Recharge — Neon Glass Template (Ready-to-use)

This is a small demo project with Firebase Authentication and Firestore integration.
It includes the following pages:

- `login.html` — Email/password login + Google login + Guest + links to Register & Forgot.
- `register.html` — Create account (name, email, password).
- `forgot.html` — Send password reset link.
- `index.html` — Dashboard that shows user info from Firestore (or fallback to Auth).

## How to use

1. Download the ZIP and extract.
2. Open `app.js` and replace the Firebase config with your actual Firebase project config if needed.
   (The project currently uses the config provided earlier.)
3. Upload to a static hosting (GitHub Pages, Firebase Hosting, Netlify) or open locally with a static server.
4. Make sure in Firebase Console:
   - Authentication → Sign-in methods: enable Email/Password, Google, and Anonymous (for Guest).
   - Firestore: create database in appropriate mode (test or locked down with rules).
5. Test flows: register, login, google login, forgot password.

If you want, I can directly push this to a GitHub repo for you (you'll need to provide the repo name or authorize), or create a zip download here.