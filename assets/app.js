document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  toggle && toggle.addEventListener('click', () => sidebar.classList.toggle('open'));

  const auth = window.firebaseAuth;

  // Email/Password login
  const form = document.getElementById('loginForm');
  form && form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value.trim();
    try {
      const cred = await window.firebaseSignInWithEmailAndPassword(auth, email, pass);
      alert(`Logged in as ${cred.user.email}`);
    } catch (err) {
      alert(err.message);
    }
  });

  // Sign up new account
  const signupBtn = document.getElementById('signupBtn');
  signupBtn && signupBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value.trim();
    try {
      const cred = await window.firebaseCreateUserWithEmailAndPassword(auth, email, pass);
      alert(`Account created: ${cred.user.email}`);
    } catch (err) {
      alert(err.message);
    }
  });

  // Google login
  const googleBtn = document.getElementById('googleBtn');
  googleBtn && googleBtn.addEventListener('click', async () => {
    try {
      const result = await window.firebaseSignInWithPopup(auth, window.firebaseProvider);
      const user = result.user;
      alert(`Welcome ${user.displayName}!`);
    } catch (err) {
      alert(err.message);
    }
  });

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn && logoutBtn.addEventListener('click', async () => {
    try {
      await window.firebaseSignOut(auth);
      alert("Logged out");
    } catch (err) {
      alert(err.message);
    }
  });

  // Auto-detect login state
  window.firebaseOnAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User logged in:", user);
      document.querySelector('.topbar h1').textContent = `Welcome, ${user.email || user.displayName}`;
    } else {
      console.log("No user logged in");
      document.querySelector('.topbar h1').textContent = "Welcome";
    }
  });
});