(function(){
  const ORDERS_KEY = 'tb_orders_v1';
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'admin4';

  function getOrders(){
    try{ return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }catch(e){ return []; }
  }

  function saveOrders(list){ localStorage.setItem(ORDERS_KEY, JSON.stringify(list)); }

  const loginForm = document.getElementById('admin-login-form');
  if (loginForm){
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const u = (document.getElementById('admin-username')||{}).value || '';
      const p = (document.getElementById('admin-password')||{}).value || '';
      if (u === ADMIN_USER && p === ADMIN_PASS){
        sessionStorage.setItem('tb_admin_logged', '1');
        window.location.href = 'admin.html';
      } else {
        alert('Invalid credentials');
      }
    });
    return;
  }

  const isAdmin = sessionStorage.getItem('tb_admin_logged') === '1';
  if (document.getElementById('orders-table') && !isAdmin){
    // not logged in
    window.location.href = 'admin-login.html';
  }

  function renderOrders(){
    const body = document.getElementById('orders-body');
    const noOrders = document.getElementById('no-orders');
    const list = getOrders();
    if (!body) return;
    body.innerHTML = '';
    if (!list.length){
      noOrders.style.display = 'block';
      return;
    }
    noOrders.style.display = 'none';
    list.slice().reverse().forEach(order => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="padding:.6rem;border-bottom:1px solid #f1f1f1;font-family:monospace">${order.id}</td>
        <td style="padding:.6rem;border-bottom:1px solid #f1f1f1">${escapeHtml(order.name)}</td>
        <td style="padding:.6rem;border-bottom:1px solid #f1f1f1">${escapeHtml(order.email||'')}</td>
        <td style="padding:.6rem;border-bottom:1px solid #f1f1f1">${escapeHtml(order.phone||'')}</td>
        <td style="padding:.6rem;border-bottom:1px solid #f1f1f1">${escapeHtml(order.food||'')}</td>
        <td style="padding:.6rem;border-bottom:1px solid #f1f1f1">${escapeHtml(order.address||'')}</td>
        <td style="padding:.6rem;border-bottom:1px solid #f1f1f1">${escapeHtml(order.createdAt||'')}</td>
        <td style="padding:.6rem;border-bottom:1px solid #f1f1f1">
          <button class="btn0" data-id="${order.id}" data-action="delete" style="background:#fff;color:var(--red);border-color:var(--red);">Delete</button>
        </td>
      `;
      body.appendChild(tr);
    });
  }

  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest && e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    if (action === 'delete'){
      if (!confirm('Delete this order?')) return;
      let list = getOrders();
      list = list.filter(o => o.id !== id);
      saveOrders(list);
      renderOrders();
    }
  });
  const btnClear = document.getElementById('clear-all');
  if (btnClear) btnClear.addEventListener('click', ()=>{
    if (!confirm('Clear all saved orders? This cannot be undone.')) return;
    localStorage.removeItem(ORDERS_KEY);
    renderOrders();
  });

  const btnLogout = document.getElementById('admin-logout');
  if (btnLogout) btnLogout.addEventListener('click', ()=>{
    sessionStorage.removeItem('tb_admin_logged');
    window.location.href = 'admin-login.html';
  });


  if (document.getElementById('orders-table')) renderOrders();

})();
