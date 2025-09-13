import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, 
         signInWithEmailAndPassword, createUserWithEmailAndPassword,
         onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

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

// DOM Elements
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const closeSidebar = document.getElementById("closeSidebar");
const authToggleBtn = document.getElementById("authToggleBtn");

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    updateUI(user);
    authToggleBtn.textContent = "Logout";
  } else {
    updateUI(null);
    authToggleBtn.textContent = "Login";
  }
});

// Sidebar toggle
menuToggle.addEventListener("click", () => sidebar.classList.add("active"));
closeSidebar.addEventListener("click", () => sidebar.classList.remove("active"));

// Login/Logout toggle
authToggleBtn.addEventListener("click", async () => {
  if (auth.currentUser) {
    await signOut(auth);
  } else {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google user:", result.user);
    } catch (err) {
      alert(err.message);
    }
  }
});

// Update UI
function updateUI(user) {
  const avatar = user?.photoURL || "https://via.placeholder.com/36";
  const name = user?.displayName || "Guest";
  const email = user?.email || "-";

  document.getElementById("authAvatar").src = avatar;
  document.getElementById("authName").textContent = name;
  document.getElementById("authRole").textContent = user ? "Signed in" : "not signed in";

  document.getElementById("sbAvatar").src = avatar;
  document.getElementById("sbName").textContent = name;
  document.getElementById("sbEmail").textContent = email;

  document.getElementById("ftAvatar").src = avatar;
  document.getElementById("ftName").textContent = name;
  document.getElementById("ftEmail").textContent = email;
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();