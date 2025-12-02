// Safe scroll-top handling
window.addEventListener('scroll', () => {
    const el = document.querySelector('#scroll-top');
    if (!el) return;
    if (window.scrollY > 60) el.classList.add('active');
    else el.classList.remove('active');
});

// Loader handling (hide once after 3s)
function loader() {
    const c = document.querySelector('.loader-container');
    if (!c) return;
    c.classList.add('fade-out');
}

function fadeOut() {
    setTimeout(loader, 3000);
}

window.addEventListener('load', fadeOut);

/* Order form: save submissions to localStorage (client-side) */
const ORDERS_KEY = 'tb_orders_v1';

function getOrders() {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; } catch (e) { return []; }
}

function saveOrders(orders) { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }

function saveOrder(order) {
    const orders = getOrders();
    orders.push(order);
    saveOrders(orders);
}

// small toast helper
function showToast(title, message, opts = {}) {
    // remove existing
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const t = document.createElement('div');
    t.className = 'toast';
    const tt = document.createElement('div'); tt.className = 'title'; tt.textContent = title;
    const tm = document.createElement('div'); tm.className = 'msg'; tm.textContent = message;
    const actions = document.createElement('div'); actions.className = 'actions';

    if (opts.sendEmail) {
        const sendBtn = document.createElement('button');
        sendBtn.textContent = opts.sendLabel || 'Open Email';
        sendBtn.addEventListener('click', () => { window.location.href = opts.mailto; });
        actions.appendChild(sendBtn);
    }

    const closeBtn = document.createElement('button'); closeBtn.className = 'secondary'; closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', () => t.remove());
    actions.appendChild(closeBtn);

    t.appendChild(tt); t.appendChild(tm); t.appendChild(actions);
    document.body.appendChild(t);

    if (opts.autoHide) setTimeout(() => t.remove(), opts.hideAfter || 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('order-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = (document.getElementById('order-name') || {}).value || '';
        const email = (document.getElementById('order-email') || {}).value || '';
        const phone = (document.getElementById('order-phone') || {}).value || '';
        const food = (document.getElementById('order-food') || {}).value || '';
        const address = (document.getElementById('order-address') || {}).value || '';

        if (!name || !phone || !food || !address) {
            alert('Please fill Name, Phone, Food Name, and Address.');
            return;
        }

        const order = {
            id: 'ord_' + Date.now(),
            name, email, phone, food, address,
            createdAt: new Date().toISOString()
        };

        // save order once (avoid duplicate saves)
        saveOrder(order);

        const mailBody = `New order from ${name}%0D%0A%0D%0AName: ${name}%0D%0APhone: ${phone}%0D%0AEmail: ${email}%0D%0AFood: ${food}%0D%0AAddress: ${address}%0D%0AOrderID: ${order.id}`;
        const mailto = `mailto:manasgoyal02@gmail.com?subject=${encodeURIComponent('New Order from ' + name)}&body=${mailBody}`;

        showToast('Order placed', 'Your order has been saved locally. An email will open so you can send it to the site owner.', { sendEmail: true, mailto, autoHide: false, sendLabel: 'Open Email' });


        try { setTimeout(() => { window.location.href = mailto; }, 700); } catch (e) { /* ignore */ }

        form.reset();
        console.log('Saved order:', order);
    });
});