// Basic behavior: sidebar toggle + demo auth placeholder + year fill
document.addEventListener('DOMContentLoaded', ()=>{
  const menu = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('closeSidebar');
  menu.addEventListener('click', ()=> sidebar.classList.add('open'));
  closeBtn.addEventListener('click', ()=> sidebar.classList.remove('open'));
  document.addEventListener('click', (e)=>{ if(!sidebar.contains(e.target) && !menu.contains(e.target)) sidebar.classList.remove('open'); });
  document.getElementById('year').textContent = new Date().getFullYear();

  // Demo auth placeholder: if window.authUser provided (by your firebase init), populate fields
  const user = window.authUser || null;
  function populate(u){
    if(!u) return;
    const name = u.displayName || u.email || 'User';
    const email = u.email || '';
    const photo = u.photoURL || 'https://via.placeholder.com/80';
    const balance = u.balance !== undefined ? u.balance : 0;
    document.getElementById('authName').textContent = name;
    document.getElementById('authEmail').textContent = email;
    document.getElementById('authAvatar').src = photo;
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileEmail').textContent = email;
    document.getElementById('profilePhoto').src = photo;
    document.getElementById('profileBalance').textContent = '৳ '+balance;
    document.getElementById('sbName').textContent = name;
    document.getElementById('sbEmail').textContent = email;
    document.getElementById('sbBalance').textContent = '৳ '+balance;
  }
  // If your firebase code sets window.currentUser or window.authUser, this will auto-fill.
  if(window.currentUser) populate(window.currentUser);
  if(window.authUser) populate(window.authUser);

  // Provide a global helper to let server code populate (for demo)
  window.__populateAuth = populate;
});