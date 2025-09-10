// header-script.js - initialize firebase if window.firebaseConfig provided and populate header
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

let firebaseConfig = typeof window !== 'undefined' ? window.firebaseConfig : undefined;
let app;
if(!getApps().length && typeof firebaseConfig !== 'undefined' && firebaseConfig){
  app = initializeApp(firebaseConfig);
} else if(getApps().length){
  app = getApps()[0];
}

let auth, db;
if(app){
  auth = getAuth(app);
  db = getFirestore(app);
  window.auth = auth;
  window.db = db;
}

function showUser(user){
  const userInfo = document.getElementById('userInfo');
  if(!userInfo) return;
  if(user){
    const name = user.displayName || user.email || 'User';
    userInfo.innerHTML = `<div style="text-align:right"><div style="font-weight:700">${name}</div><div class="muted small" id="userBalance">Loading...</div><button id="logoutBtn" class="btn" style="margin-top:6px">Logout</button></div>`;
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) logoutBtn.addEventListener('click', async ()=> { try{ await signOut(auth); window.location.href='login.html'; }catch(e){console.error(e)} });
    (async ()=>{
      try{
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        const el = document.getElementById('userBalance');
        if(snap.exists() && el){
          const data = snap.data();
          el.textContent = '৳ ' + (data.balance !== undefined ? data.balance : '0');
        } else if(el){
          el.textContent = '৳ 0';
        }
      }catch(err){ console.error(err); const el = document.getElementById('userBalance'); if(el) el.textContent = '-' }
    })();
  } else {
    userInfo.innerHTML = `<button class="btn" onclick="location.href='login.html'">Login</button>`;
  }
}

try{
  if(typeof auth !== 'undefined' && auth){
    onAuthStateChanged(auth, (user)=> showUser(user));
  } else {
    const userInfo = document.getElementById('userInfo');
    if(userInfo) userInfo.innerHTML = `<button class="btn" onclick="location.href='login.html'">Login</button>`;
  }
}catch(e){ console.error(e) }
