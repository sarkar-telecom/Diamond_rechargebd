// app.js (replace your existing file with this)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

/* ---------------------------
   Firebase config - replace if needed
   --------------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyAyhjOsIXNAkBglpRllt0OZIOJYpdB_9-8",
  authDomain: "diamond-recharge-f7f59.firebaseapp.com",
  projectId: "diamond-recharge-f7f59",
  storageBucket: "diamond-recharge-f7f59.firebasestorage.app",
  messagingSenderId: "657717928489",
  appId: "1:657717928489:web:70431ebc9afb7002d4b238",
  measurementId: "G-TDK78BQ8SQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* ---------------------------
   DOM ready
   --------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Elements (may be null if markup changed)
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const closeSidebar = document.getElementById("closeSidebar");
  const authToggleBtn = document.getElementById("authToggleBtn");

  // UI fields to update
  const authAvatar = document.getElementById("authAvatar");
  const authName = document.getElementById("authName");
  const authRole = document.getElementById("authRole");
  const sbAvatar = document.getElementById("sbAvatar");
  const sbName = document.getElementById("sbName");
  const sbEmail = document.getElementById("sbEmail");
  const ftAvatar = document.getElementById("ftAvatar");
  const ftName = document.getElementById("ftName");
  const ftEmail = document.getElementById("ftEmail");

  // Safety checks
  console.log("Init UI, elements:", {
    sidebar: !!sidebar,
    menuToggle: !!menuToggle,
    closeSidebar: !!closeSidebar,
    authToggleBtn: !!authToggleBtn
  });

  /* Sidebar open/close helpers */
  let overlayEl = null;
  function ensureSidebarZIndex() {
    if (!sidebar) return;
    // keep sidebar above overlay
    sidebar.style.zIndex = "60";
  }
  function createOverlay() {
    if (overlayEl) return;
    overlayEl = document.createElement("div");
    overlayEl.id = "sidebar-overlay";
    overlayEl.style.position = "fixed";
    overlayEl.style.inset = "0";
    overlayEl.style.background = "rgba(0,0,0,0.35)";
    overlayEl.style.zIndex = "50"; // below sidebar which is 60
    overlayEl.addEventListener("click", closeSidebarFn);
    document.body.appendChild(overlayEl);
  }
  function removeOverlay() {
    if (!overlayEl) return;
    overlayEl.removeEventListener("click", closeSidebarFn);
    overlayEl.remove();
    overlayEl = null;
  }
  function openSidebarFn() {
    if (!sidebar) return;
    ensureSidebarZIndex();
    sidebar.classList.add("active");
    createOverlay();
  }
  function closeSidebarFn() {
    if (!sidebar) return;
    sidebar.classList.remove("active");
    removeOverlay();
  }
  function toggleSidebarFn() {
    if (!sidebar) return;
    if (sidebar.classList.contains("active")) closeSidebarFn();
    else openSidebarFn();
  }

  // Attach sidebar listeners safely
  if (menuToggle) menuToggle.addEventListener("click", (e) => {
    e.preventDefault();
    toggleSidebarFn();
  });
  if (closeSidebar) closeSidebar.addEventListener("click", (e) => {
    e.preventDefault();
    closeSidebarFn();
  });

  // close with Escape
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") closeSidebarFn();
  });

  /* ---------------------------
     Auth (Google popup) & UI sync
     --------------------------- */
  async function doGoogleSignIn() {
    try {
      const res = await signInWithPopup(auth, provider);
      console.log("Google sign-in success:", res.user);
      // onAuthStateChanged will update UI
    } catch (err) {
      console.error("Google sign-in error:", err);
      alert("Google sign-in failed: " + (err && err.message ? err.message : err));
    }
  }

  async function doSignOut() {
    try {
      await signOut(auth);
      alert("Signed out");
    } catch (err) {
      console.error("Sign-out error:", err);
      alert("Sign-out failed: " + (err && err.message ? err.message : err));
    }
  }

  if (authToggleBtn) {
    authToggleBtn.addEventListener("click", async () => {
      // guard to avoid multiple clicks
      authToggleBtn.disabled = true;
      try {
        if (auth.currentUser) {
          await doSignOut();
        } else {
          await doGoogleSignIn();
        }
      } catch (err) {
        console.error("Auth toggle handler error:", err);
      } finally {
        authToggleBtn.disabled = false;
      }
    });
  }

  // Keep UI synced
  function updateUI(user) {
    const avatar = user?.photoURL || "https://via.placeholder.com/36";
    const name = user?.displayName || "Guest";
    const email = user?.email || "-";
    const roleText = user ? "Signed in" : "not signed in";

    if (authAvatar) authAvatar.src = avatar;
    if (authName) authName.textContent = name;
    if (authRole) authRole.textContent = roleText;

    if (sbAvatar) sbAvatar.src = avatar;
    if (sbName) sbName.textContent = name;
    if (sbEmail) sbEmail.textContent = email;

    if (ftAvatar) ftAvatar.src = avatar;
    if (ftName) ftName.textContent = name;
    if (ftEmail) ftEmail.textContent = email;

    if (authToggleBtn) authToggleBtn.textContent = user ? "Logout" : "Login";
  }

  // Listen for changes
  onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed, user:", user);
    updateUI(user);
  });

  // initialize UI from current state (fast)
  updateUI(auth.currentUser);
});