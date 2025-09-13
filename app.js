// =========================
// Firebase Config (use your own config)
// =========================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// =========================
// Sidebar Toggle
// =========================
const menuToggle = document.getElementById("menuToggle");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.add("open");
});

closeSidebar.addEventListener("click", () => {
  sidebar.classList.remove("open");
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

const ftName = document.getElementById("ftName");
const ftEmail = document.getElementById("ftEmail");
const ftAvatar = document.getElementById("ftAvatar");

// =========================
// Google Auth Provider
// =========================
const provider = new firebase.auth.GoogleAuthProvider();

// =========================
// Login / Logout Toggle
// =========================
authToggleBtn.addEventListener("click", () => {
  if (auth.currentUser) {
    auth.signOut();
  } else {
    auth.signInWithPopup(provider).catch(err => {
      console.error("Login error:", err);
    });
  }
});

// =========================
// Auth State Listener
// =========================
auth.onAuthStateChanged(user => {
  if (user) {
    // Logged in
    authToggleBtn.textContent = "Logout";
    authName.textContent = user.displayName || "User";
    authRole.textContent = "Signed in";
    authAvatar.src = user.photoURL || "https://via.placeholder.com/36";

    sbName.textContent = user.displayName || "User";
    sbEmail.textContent = user.email || "-";
    sbAvatar.src = user.photoURL || "https://via.placeholder.com/48";

    ftName.textContent = user.displayName || "User";
    ftEmail.textContent = user.email || "-";
    ftAvatar.src = user.photoURL || "https://via.placeholder.com/32";
  } else {
    // Logged out
    authToggleBtn.textContent = "Login";
    authName.textContent = "Guest";
    authRole.textContent = "not signed in";
    authAvatar.src = "https://via.placeholder.com/36";

    sbName.textContent = "Guest";
    sbEmail.textContent = "-";
    sbAvatar.src = "https://via.placeholder.com/48";

    ftName.textContent = "Guest";
    ftEmail.textContent = "-";
    ftAvatar.src = "https://via.placeholder.com/32";
  }
});

// =========================
// Footer Year
// =========================
document.getElementById("year").textContent = new Date().getFullYear();