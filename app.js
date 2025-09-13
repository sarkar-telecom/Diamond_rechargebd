// =========================
// Firebase v9 Modular SDK
// =========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, setDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// =========================
// Firebase Config
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyAyhjOsIXNAkBglpRllt0OZIOJYpdB_9-8",
  authDomain: "diamond-recharge-f7f59.firebaseapp.com",
  projectId: "diamond-recharge-f7f59",
  storageBucket: "diamond-recharge-f7f59.appspot.com",
  messagingSenderId: "657717928489",
  appId: "1:657717928489:web:70431ebc9afb7002d4b238",
  measurementId: "G-TDK78BQ8SQ"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// =========================
// Sidebar Toggle
// =========================
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.add("active");
});
closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
});

// =========================
// Auth Elements
// =========================
const authBtn = document.getElementById("authBtn");
const userPic = document.getElementById("userPic");
const userName = document.getElementById("userName");

// Sidebar
const sidebarUserPic = document.getElementById("sidebarUserPic");
const sidebarUserName = document.getElementById("sidebarUserName");
const sidebarUserEmail = document.getElementById("sidebarUserEmail");
const sidebarBalance = document.getElementById("sidebarBalance");

// Footer
const footerUserPic = document.getElementById("footerUserPic");
const footerUserName = document.getElementById("footerUserName");
const footerUserEmail = document.getElementById("footerUserEmail");

// =========================
// Login / Logout Toggle
// =========================
authBtn.addEventListener("click", async () => {
  if (auth.currentUser) {
    await signOut(auth);
  } else {
    await signInWithPopup(auth, provider).catch(err => {
      console.error("Login error:", err);
      alert("Login failed: " + err.message);
    });
  }
});

// =========================
// Auth State Listener
// =========================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Logged in
    authBtn.textContent = "Logout";
    userPic.src = user.photoURL;
    userPic.style.display = "block";
    userName.textContent = user.displayName || "User";

    sidebarUserPic.src = user.photoURL;
    sidebarUserPic.style.display = "block";
    sidebarUserName.textContent = user.displayName || "User";
    sidebarUserEmail.textContent = user.email || "-";

    footerUserPic.src = user.photoURL;
    footerUserPic.style.display = "block";
    footerUserName.textContent = user.displayName || "User";
    footerUserEmail.textContent = user.email || "-";

    // 🔹 Load Balance from Firestore
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        sidebarBalance.textContent = "৳ " + (data.balance || 0);
      } else {
        // If user doc doesn’t exist, create it
        await setDoc(userRef, {
          balance: 0,
          email: user.email,
          name: user.displayName || "User",
          createdAt: serverTimestamp()
        });
        sidebarBalance.textContent = "৳ 0";
      }
    } catch (err) {
      console.error("Balance fetch error:", err);
      sidebarBalance.textContent = "৳ 0";
    }

  } else {
    // Logged out
    authBtn.textContent = "Login";
    userPic.style.display = "none";
    userName.textContent = "";

    sidebarUserPic.style.display = "none";
    sidebarUserName.textContent = "Guest";
    sidebarUserEmail.textContent = "-";
    sidebarBalance.textContent = "৳ 0";

    footerUserPic.style.display = "none";
    footerUserName.textContent = "Guest";
    footerUserEmail.textContent = "-";
  }
});

// =========================
// Footer Year
// =========================
document.getElementById("year").textContent = new Date().getFullYear();