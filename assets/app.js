// app.js (modular Firebase v10) — drop into project as-is
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

/* ---------------------------
   Config
   --------------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyAyhjOsIXNAkBglpRllt0OZIOJYpdB_9-8",
  authDomain: "diamond-recharge-f7f59.firebaseapp.com",
  projectId: "diamond-recharge-f7f59",
  storageBucket: "diamond-recharge-f7f59.appspot.com",
  messagingSenderId: "657717928489",
  appId: "1:657717928489:web:70431ebc9afb7002d4b238",
  measurementId: "G-TDK78BQ8SQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

/* ---------------------------
   DOM Ready
   --------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeBtn");
  const sidebar = document.getElementById("sidebar");

  const authBtn = document.getElementById("authBtn");
  const userPic = document.getElementById("userPic");
  const userName = document.getElementById("userName");
  const userRole = document.getElementById("userRole");

  const sidebarUserPic = document.getElementById("sidebarUserPic");
  const sidebarUserName = document.getElementById("sidebarUserName");
  const sidebarUserEmail = document.getElementById("sidebarUserEmail");
  const sidebarBalance = document.getElementById("sidebarBalance");

  const footerUserPic = document.getElementById("footerUserPic");
  const footerUserName = document.getElementById("footerUserName");
  const footerUserEmail = document.getElementById("footerUserEmail");

  // safe guards
  if (!menuBtn || !closeBtn || !sidebar || !authBtn) {
    console.warn("Missing core DOM elements — check your HTML IDs.");
  }

  /* Overlay helpers */
  let overlay = null;
  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.id = "sidebar-overlay";
    overlay.addEventListener("click", closeSidebar);
    document.body.appendChild(overlay);
  }
  function removeOverlay() {
    if (!overlay) return;
    overlay.removeEventListener("click", closeSidebar);
    overlay.remove();
    overlay = null;
  }

  /* Sidebar */
  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add("active");
    createOverlay();
  }
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("active");
    removeOverlay();
  }
  function toggleSidebar() {
    if (!sidebar) return;
    if (sidebar.classList.contains("active")) closeSidebar();
    else openSidebar();
  }

  menuBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleSidebar();
  });
  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeSidebar();
  });
  // Escape to close
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") closeSidebar();
  });

  /* Auth toggle (Login with Google / Logout) */
  authBtn?.addEventListener("click", async () => {
    if (authBtn.disabled) return;
    authBtn.disabled = true;
    try {
      if (auth.currentUser) {
        await signOut(auth);
        console.log("Signed out.");
      } else {
        // prefer popup but catch errors
        try {
          await signInWithPopup(auth, provider);
          console.log("Signed in with popup.");
        } catch (err) {
          console.warn("Popup sign-in failed, try redirect or check popup blocker:", err);
          alert("Sign-in failed: " + (err.message || err));
        }
      }
    } catch (err) {
      console.error("Auth toggle error:", err);
      alert("Auth error: " + (err.message || err));
    } finally {
      authBtn.disabled = false;
    }
  });

  /* Update UI helper */
  function setLoggedInUI(user) {
    const avatar = user.photoURL || "https://via.placeholder.com/36";
    const name = user.displayName || user.email || "User";
    const email = user.email || "-";

    if (userPic) { userPic.src = avatar; userPic.style.display = "block"; }
    if (userName) userName.textContent = name;
    if (userRole) userRole.textContent = "Signed in";

    if (sidebarUserPic) { sidebarUserPic.src = avatar; sidebarUserPic.style.display = "block"; }
    if (sidebarUserName) sidebarUserName.textContent = name;
    if (sidebarUserEmail) sidebarUserEmail.textContent = email;

    if (footerUserPic) { footerUserPic.src = avatar; footerUserPic.style.display = "block"; }
    if (footerUserName) footerUserName.textContent = name;
    if (footerUserEmail) footerUserEmail.textContent = email;
  }

  function setLoggedOutUI() {
    if (userPic) userPic.style.display = "none";
    if (userName) userName.textContent = "Guest";
    if (userRole) userRole.textContent = "not signed in";

    if (sidebarUserPic) sidebarUserPic.style.display = "none";
    if (sidebarUserName) sidebarUserName.textContent = "Guest";
    if (sidebarUserEmail) sidebarUserEmail.textContent = "-";
    if (sidebarBalance) sidebarBalance.textContent = "৳ 0";

    if (footerUserPic) footerUserPic.style.display = "none";
    if (footerUserName) footerUserName.textContent = "Guest";
    if (footerUserEmail) footerUserEmail.textContent = "-";
  }

  /* Auth state listener */
  onAuthStateChanged(auth, async (user) => {
    console.log("Auth state changed:", user);
    if (user) {
      // set UI
      if (authBtn) authBtn.textContent = "Logout";
      setLoggedInUI(user);

      // Load or create user doc & balance
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (sidebarBalance) sidebarBalance.textContent = "৳ " + (data.balance ?? 0);
        } else {
          await setDoc(userRef, {
            name: user.displayName ?? "User",
            email: user.email ?? "",
            balance: 0,
            createdAt: serverTimestamp()
          });
          if (sidebarBalance) sidebarBalance.textContent = "৳ 0";
        }
      } catch (err) {
        console.error("Failed to load/create user doc:", err);
        if (sidebarBalance) sidebarBalance.textContent = "৳ 0";
      }
    } else {
      if (authBtn) authBtn.textContent = "Login";
      setLoggedOutUI();
    }
  });

  // footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // initial UI set (in case onAuthStateChanged fires after)
  setLoggedOutUI();
});