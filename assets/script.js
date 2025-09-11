// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAyhjOsIXNAkBglpRllt0OZIOJYpdB_9-8",
  authDomain: "diamond-recharge-f7f59.firebaseapp.com",
  projectId: "diamond-recharge-f7f59",
  storageBucket: "diamond-recharge-f7f59.firebasestorage.app",
  messagingSenderId: "657717928489",
  appId: "1:657717928489:web:70431ebc9afb7002d4b238",
  measurementId: "G-TDK78BQ8SQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Populate UI
function populate(u) {
  const name = u?.displayName || u?.email || 'Guest User';
  const email = u?.email || 'Not signed in';
  const photo = u?.photoURL || 'https://via.placeholder.com/80?text=👤';
  const balance = u?.balance !== undefined ? u.balance : 0;

  document.getElementById('authName').textContent = name;
  document.getElementById('authEmail').textContent = email;
  document.getElementById('authAvatar').src = photo;

  document.getElementById('profileName').textContent = name;
  document.getElementById('profileEmail').textContent = email;
  document.getElementById('profilePhoto').src = photo;
  document.getElementById('profileBalance').textContent = u ? '৳ ' + balance : '৳ 0';

  document.getElementById('sbName').textContent = name;
  document.getElementById('sbEmail').textContent = email;
  document.getElementById('sbBalance').textContent = u ? '৳ ' + balance : '৳ 0';

  if (u) {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-flex';
  } else {
    document.getElementById('loginBox').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
  }
}

// Auth Methods
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => alert(err.message));
}

function loginWithEmail() {
  const email = document.getElementById('emailInput').value;
  const pass = document.getElementById('passInput').value;
  auth.signInWithEmailAndPassword(email, pass).catch(err => alert(err.message));
}

function registerWithEmail() {
  const email = document.getElementById('emailInput').value;
  const pass = document.getElementById('passInput').value;
  auth.createUserWithEmailAndPassword(email, pass).catch(err => alert(err.message));
}

function logout() {
  auth.signOut().catch(err => alert(err.message));
}

// Listen for auth state changes
auth.onAuthStateChanged(user => {
  window.authUser = user || null;
  populate(user);
});

// Sidebar toggle + year
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('closeSidebar');

  menu.addEventListener('click', () => sidebar.classList.add('open'));
  closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !menu.contains(e.target)) sidebar.classList.remove('open');
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // Button events
  document.getElementById('googleBtn').addEventListener('click', loginWithGoogle);
  document.getElementById('emailLoginBtn').addEventListener('click', loginWithEmail);
  document.getElementById('emailRegisterBtn').addEventListener('click', registerWithEmail);
  document.getElementById('logoutBtn').addEventListener('click', logout);
});