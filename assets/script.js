// Basic behavior: sidebar toggle + demo auth placeholder + year fill
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('closeSidebar');

  // Sidebar toggle
  menu.addEventListener('click', () => sidebar.classList.add('open'));
  closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menu.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  // Dynamic year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Demo auth placeholder: if window.authUser provided (by firebase init), populate fields
  const user = window.authUser || null;

  function populate(u) {
    if (!u) return;
    const name = u.displayName || u.email || 'User';
    const email = u.email || '';
    const photo = u.photoURL || 'https://via.placeholder.com/80';
    const balance = u.balance !== undefined ? u.balance : 0;

    // Header
    document.getElementById('authName').textContent = name;
    document.getElementById('authEmail').textContent = email;
    document.getElementById('authAvatar').src = photo;

    // Hero profile card
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileEmail').textContent = email;
    document.getElementById('profilePhoto').src = photo;
    document.getElementById('profileBalance').textContent = '৳ ' + balance;

    // Sidebar footer
    document.getElementById('sbName').textContent = name;
    document.getElementById('sbEmail').textContent = email;
    document.getElementById('sbBalance').textContent = '৳ ' + balance;
  }

  // Auto-fill if Firebase sets user
  if (window.currentUser) populate(window.currentUser);
  if (window.authUser) populate(window.authUser);

  // Global helper for server/demo
  window.__populateAuth = populate;
});