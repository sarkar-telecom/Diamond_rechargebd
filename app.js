// App JS — handles Firebase Auth (compat build)
// Replace firebaseConfig values below with your project's config
const firebaseConfig = {
  apiKey: "AIzaSyAyhjOsIXNAkBglpRllt0OZIOJYpdB_9-8",
  authDomain: "diamond-recharge-f7f59.firebaseapp.com",
  projectId: "diamond-recharge-f7f59",
  storageBucket: "diamond-recharge-f7f59.appspot.com",
  messagingSenderId: "657717928489",
  appId: "1:657717928489:web:70431ebc9afb7002d4b238",
  measurementId: "G-TDK78BQ8SQ"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Helper: create user doc if missing
async function ensureUserDoc(user) {
  if (!user) return;
  const ref = db.collection('users').doc(user.uid);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({
      name: user.displayName || 'User',
      email: user.email || '',
      avatar: user.photoURL || '',
      role: 'member',
      balance: 0,
      weeklyTotal: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

// Auth state listener — update UI or redirect
auth.onAuthStateChanged(async (user) => {
  const path = location.pathname.split('/').pop();
  if (user) {
    await ensureUserDoc(user);
    // If on login/register/forgot pages, redirect to index
    if (path === 'login.html' || path === 'register.html' || path === 'forgot.html' || path === '') {
      location.href = 'index.html';
      return;
    }
    // If on index, populate UI
    if (path === 'index.html' || path === '') {
      try {
        const ref = db.collection('users').doc(user.uid);
        const snap = await ref.get();
        const data = snap.exists ? snap.data() : {
          name: user.displayName || 'User',
          email: user.email || '',
          avatar: user.photoURL || '',
          role: 'member',
          balance: 0,
          weeklyTotal: 0
        };
        // populate
        document.getElementById('authName').textContent = data.name || user.displayName || 'User';
        document.getElementById('authRole').textContent = data.role || 'member';
        document.getElementById('authAvatar').src = data.avatar || user.photoURL || 'https://via.placeholder.com/80';
        document.getElementById('sbName').textContent = data.name || user.displayName || 'User';
        document.getElementById('sbEmail').textContent = data.email || user.email || '-';
        document.getElementById('sbAvatar').src = data.avatar || user.photoURL || 'https://via.placeholder.com/80';
        document.getElementById('sbBalance').textContent = '৳ ' + (data.balance ?? 0);
        document.getElementById('profileName').textContent = data.name || user.displayName || 'User';
        document.getElementById('profileRole').textContent = data.role || 'member';
        document.getElementById('profileEmail').textContent = data.email || user.email || '-';
        document.getElementById('profilePhoto').src = data.avatar || user.photoURL || 'https://via.placeholder.com/80';
        document.getElementById('profileBalance').textContent = '৳ ' + (data.balance ?? 0);
        document.getElementById('profileWeeklyTotal').textContent = data.weeklyTotal ?? 0;
        // set button
        const btn = document.getElementById('authToggleBtn');
        if (btn) btn.textContent = 'Logout';
      } catch (e) {
        console.error(e);
      }
    }
  } else {
    // not logged in
    const path = location.pathname.split('/').pop();
    if (path === 'index.html' || path === '') {
      // redirect to login if trying to access dashboard
      location.href = 'login.html';
      return;
    }
    const btn = document.getElementById('authToggleBtn');
    if (btn) btn.textContent = 'Login';
  }
});

// ----- Auth Actions ----- //

// Email + Password login
async function emailLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const remember = document.getElementById('rememberMe')?.checked;

  try {
    await auth.setPersistence(remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION);
    await auth.signInWithEmailAndPassword(email, password);
    // onAuthStateChanged will redirect
  } catch (err) {
    alert(err.message);
  }
}

// Google login
async function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const res = await auth.signInWithPopup(provider);
    await ensureUserDoc(res.user);
    // onAuthStateChanged will handle redirect
  } catch (err) {
    alert('Google login failed: ' + err.message);
  }
}

// Guest (anonymous) login
async function guestLogin() {
  try {
    await auth.signInAnonymously();
    // create a simple user doc for anonymous user
    const user = auth.currentUser;
    if (user) {
      const ref = db.collection('users').doc(user.uid);
      await ref.set({
        name: 'Guest',
        email: '',
        avatar: '',
        role: 'guest',
        balance: 0,
        weeklyTotal: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  } catch (err) {
    alert('Guest login failed: ' + err.message);
  }
}

// Register
async function registerUser(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;

  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);
    await res.user.updateProfile({ displayName: name });
    await db.collection('users').doc(res.user.uid).set({
      name: name,
      email: email,
      avatar: '',
      role: 'member',
      balance: 0,
      weeklyTotal: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    // redirect handled by auth state
  } catch (err) {
    alert(err.message);
  }
}

// Send password reset
async function sendReset(e) {
  e.preventDefault();
  const email = document.getElementById('resetEmail').value.trim();
  try {
    await auth.sendPasswordResetEmail(email);
    alert('Password reset email sent. Check your inbox.');
    location.href = 'login.html';
  } catch (err) {
    alert(err.message);
  }
}

// Logout function (used on index header)
function logout() {
  auth.signOut().then(() => {
    location.href = 'login.html';
  });
}

// Sidebar toggle & small UI helpers
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('closeSidebar');
  if (menu && sidebar) {
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.add('open');
    });
  }
  if (closeBtn && sidebar) closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
  document.addEventListener('click', (e) => {
    if (sidebar && menu && !sidebar.contains(e.target) && !menu.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
  if (document.getElementById('year')) document.getElementById('year').textContent = new Date().getFullYear();
});