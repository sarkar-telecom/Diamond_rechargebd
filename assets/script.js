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
const db = firebase.firestore();

// Populate UI
function populate(u, balance = 0) {
  const name = u?.displayName || u?.email || 'Guest User';
  const email = u?.email || 'Not signed in';
  const photo = u?.photoURL || 'https://scontent.fdac110-1.fna.fbcdn.net/v/t39.30808-6/463744798_1535978883703781_7881387006422647165_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFRmJ9K3v4YzY1mzAuX72tmutP8LgSkH8e60_wuBKQfx5ALlGesHbz-xDi_1njXgxmuFkc0yTpdpJkVSYwMJ0QX&_nc_ohc=lefecAd3iRkQ7kNvwGsdypF&_nc_oc=Adm8jPqT_7SkZW-P4Cg8t6ElJiFhyKIJGfCDiFTaAGBcP1hVN1dY_P_i0sfxCoAf0EM&_nc_zt=23&_nc_ht=scontent.fdac110-1.fna&_nc_gid=EG5pxh35CnO24PgbBnifUw&oh=00_AfagLP6aA5TjST0_IwvXDfPeACKF6NbyCpA_e_0p0_-ulw&oe=68C900F4?text=👤';

  // Header
  document.getElementById('authName').textContent = name;
  document.getElementById('authEmail').textContent = email;
  document.getElementById('authAvatar').src = photo;

  // Profile card
  document.getElementById('profileName').textContent = name;
  document.getElementById('profileEmail').textContent = email;
  document.getElementById('profilePhoto').src = photo;
  document.getElementById('profileBalance').textContent = '৳ ' + balance;

  // Sidebar
  document.getElementById('sbName').textContent = name;
  document.getElementById('sbEmail').textContent = email;
  document.getElementById('sbAvatar').src = photo;
  document.getElementById('sbBalance').textContent = '৳ ' + balance;

  if (u) {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-flex';
  } else {
    document.getElementById('loginBox').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
  }
}

// 🔹 Fetch balance from Firestore
async function getBalance(user) {
  try {
    const docRef = db.collection("users").doc(user.uid);
    const doc = await docRef.get();
    if (doc.exists) {
      return doc.data().balance || 0;
    }
    return 0;
  } catch (e) {
    console.error("Balance fetch error:", e);
    return 0;
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
  auth.createUserWithEmailAndPassword(email, pass)
    .then(cred => {
      // Create Firestore record with default balance
      return db.collection("users").doc(cred.user.uid).set({
        email: email,
        balance: 0
      });
    })
    .catch(err => alert(err.message));
}

function logout() {
  auth.signOut().catch(err => alert(err.message));
}

// Listen for auth state changes
auth.onAuthStateChanged(async user => {
  if (user) {
    const balance = await getBalance(user);
    populate(user, balance);
  } else {
    populate(null, 0);
  }
});

// Sidebar toggle + year
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('closeSidebar');

  // Open sidebar
  menu.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.add('open');
  });

  // Close sidebar
  closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));

  // Close sidebar if clicking outside
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menu.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  // Prevent clicks inside sidebar from closing
  sidebar.addEventListener('click', (e) => e.stopPropagation());

  document.getElementById('year').textContent = new Date().getFullYear();

  // Button events
  document.getElementById('googleBtn').addEventListener('click', loginWithGoogle);
  document.getElementById('emailLoginBtn').addEventListener('click', loginWithEmail);
  document.getElementById('emailRegisterBtn').addEventListener('click', registerWithEmail);
  document.getElementById('logoutBtn').addEventListener('click', logout);
});