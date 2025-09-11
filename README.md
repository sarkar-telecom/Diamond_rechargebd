Diamond Recharge — Neon Glass Template (mobile-first)
=====================================================

This is a lightweight HTML/CSS/JS template built as a mobile-friendly "neon glass" UI for a recharge/topup site.
It is intentionally framework-free (plain HTML) so you can drop it into GitHub Pages or any static host.

Files:
- index.html        — main landing / dashboard template
- assets/style.css  — neon glass styles (responsive)
- assets/script.js  — UI behavior: sidebar toggle + demo auth population
- assets/logo.svg   — simple placeholder logo
- README.md         — this file

How to use:
1. Download and unzip.
2. Replace demo placeholders (avatar, names) by integrating your Firebase auth: after your firebase init, call:
   `window.__populateAuth(firebaseUserObjectWithBalance)`
3. Add other pages (order.html, order-history.html, balance.html) by copying index.html and adjusting content.
4. Keep your Firebase / Google Forms / Google Sheets integration as-is; just call __populateAuth when user is known.

If you want, I can integrate your exact firebase.js into this template (keeping your config unchanged) and add demo pages (order, history, admin) prewired to read/write your existing sheets/forms.
