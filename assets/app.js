// =========================
// Firebase Config
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyAyhjOsIXNAkBglpRllt0OZIOJYpdB_9-8",
  authDomain: "diamond-recharge-f7f59.firebaseapp.com",
  projectId: "diamond-recharge-f7f59",
  storageBucket: "diamond-recharge-f7f59.firebasestorage.app",
  messagingSenderId: "657717928489",
  appId: "1:657717928489:web:70431ebc9afb7002d4b238",
  measurementId: "G-TDK78BQ8SQ"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// =========================
// Sidebar & Overlay Toggle
// =========================
const menuToggle = document.getElementById("menuToggle");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuToggle.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("active");
  sidebar.setAttribute("aria-hidden", "false");
});

closeSidebar.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("active");
  sidebar.setAttribute("aria-hidden", "true");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("active");
  sidebar.setAttribute("aria-hidden", "true");
});

// =========================
// Auth Elements
// =========================
const authToggleBtn = document.getElementById("authToggleBtn");
const authName = document.getElementById("authName");
const authRole = document.getElementById("authRole");
const authAvatar = document.getElementById("authAvatar");

const sbName = document.getElementById("sbName");
const sbEmail = document.getElementById("sbEmail");
const sbAvatar = document.getElementById("sbAvatar");
const sbBalance = document.getElementById("sbBalance");

const ftName = document.getElementById("ftName");
const ftEmail = document.getElementById("ftEmail");
const ftAvatar = document.getElementById("ftAvatar");

// =========================
// Google Auth Provider
// =========================
const provider = new firebase.auth.GoogleAuthProvider();

// =========================
// Login / Logout
// =========================
authToggleBtn.addEventListener("click", () => {
  if (auth.currentUser) {
    auth.signOut();
  } else {
    auth.signInWithPopup(provider).catch(err => {
      console.error("Login error:", err);
      alert("Login failed: " + err.message);
    });
  }
});

// =========================
// Auth State Listener
// =========================
auth.onAuthStateChanged(async user => {
  if (user) {
    // Logged in
    authToggleBtn.textContent = "Logout";
    authName.textContent = user.displayName || "User";
    authRole.textContent = "Signed in";
    authAvatar.src = user.photoURL || "https://via.placeholder.com/36";

    sbName.textContent = user.displayName || "User";
    sbEmail.textContent = user.email || "-";
    sbAvatar.src = user.photoURL || "https://via.placeholder.com/48";

    ftName.text