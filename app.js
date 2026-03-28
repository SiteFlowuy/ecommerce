/* ── ShopBase — app.js ────────────────────────────── */

/* ════════════════════════════════════════════════════
   CART MODULE
   Persists to localStorage under "shopbase_cart".
   Each item: { id, name, price, image, quantity }
   ════════════════════════════════════════════════════ */

const CART_KEY = 'shopbase_cart';

/** @returns {Array<{id:string, name:string, price:number, image:string, quantity:number}>} */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

/** @param {ReturnType<typeof getCart>} cart */
function _saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  _syncCartBadge();
}

/**
 * Add a product or increment its quantity if already present.
 * @param {{ id:string, name:string, price:number, image:string, qty?:number }} product
 */
function addToCart({ id, name, price, image, qty = 1 }) {
  const cart  = getCart();
  const index = cart.findIndex(item => item.id === id);

  if (index !== -1) {
    cart[index].quantity += qty;
  } else {
    cart.push({ id, name, price, image, quantity: qty });
  }

  _saveCart(cart);
}

/**
 * Remove an item entirely.
 * @param {string} id
 */
function removeFromCart(id) {
  _saveCart(getCart().filter(item => item.id !== id));
}

/**
 * Increment or decrement quantity by delta. Removes item if quantity reaches 0.
 * @param {string} id
 * @param {number} delta  +1 or -1
 */
function updateQuantity(id, delta) {
  const cart  = getCart();
  const index = cart.findIndex(item => item.id === id);
  if (index === -1) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  _saveCart(cart);
}

/** Remove every item from the cart. */
function clearCart() {
  _saveCart([]);
}

/** @returns {number} Sum of price × quantity for all items. */
function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/** @returns {number} Total number of individual units in the cart. */
function _getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/** Keep every [aria-live="polite"] badge in sync with localStorage. */
function _syncCartBadge() {
  const count = _getCartCount();
  document.querySelectorAll('[aria-live="polite"]').forEach(badge => {
    badge.textContent = count;
  });
}

/* ════════════════════════════════════════════════════
   RENDER CART  (call from carrito.html)
   Usage: renderCart('#cart-container')
   ════════════════════════════════════════════════════ */

/**
 * Renders the full cart UI into `containerSelector`.
 * Wires up quantity controls and remove buttons automatically.
 * @param {string} containerSelector  CSS selector for the mount element.
 */
function renderCart(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  function draw() {
    const cart  = getCart();
    const total = getCartTotal();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="text-center py-20">
          <div class="text-6xl mb-4">🛒</div>
          <h2 class="text-xl font-bold text-slate-800 mb-2">Tu carrito está vacío</h2>
          <p class="text-slate-500 mb-6">Agrega productos para continuar.</p>
          <a href="/" class="inline-block bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors">
            Seguir comprando
          </a>
        </div>`;
      return;
    }

    const rows = cart.map(item => `
      <li class="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0" data-cart-id="${item.id}">
        <img src="${item.image}" alt="${item.name}"
          class="w-20 h-20 object-cover rounded-xl bg-slate-100 shrink-0"
          onerror="this.onerror=null;this.src='https://picsum.photos/80/80?random=99'" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-slate-800 truncate">${item.name}</p>
          <p class="text-sm text-brand-600 font-bold mt-0.5">$${item.price.toFixed(2)}</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button class="cart-qty-btn w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors flex items-center justify-center"
            data-id="${item.id}" data-delta="-1" aria-label="Reducir cantidad">−</button>
          <span class="w-6 text-center text-sm font-semibold tabular-nums">${item.quantity}</span>
          <button class="cart-qty-btn w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors flex items-center justify-center"
            data-id="${item.id}" data-delta="1" aria-label="Aumentar cantidad">+</button>
        </div>
        <p class="w-20 text-right text-sm font-black text-slate-900 shrink-0 tabular-nums">
          $${(item.price * item.quantity).toFixed(2)}
        </p>
        <button class="cart-remove-btn w-7 h-7 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center shrink-0"
          data-id="${item.id}" aria-label="Eliminar ${item.name}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </li>`).join('');

    container.innerHTML = `
      <ul class="divide-y divide-slate-100">${rows}</ul>
      <div class="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button id="cart-clear" class="text-sm text-slate-400 hover:text-rose-500 transition-colors underline underline-offset-2">
          Vaciar carrito
        </button>
        <div class="text-right">
          <p class="text-xs text-slate-400 mb-1">Total estimado</p>
          <p class="text-2xl font-black text-slate-900">$${total.toFixed(2)}</p>
        </div>
      </div>
      <a href="/checkout" class="mt-4 w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg text-sm">
        Ir a pagar →
      </a>`;

    // Wire up quantity buttons
    container.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        updateQuantity(btn.dataset.id, Number(btn.dataset.delta));
        draw();
      });
    });

    // Wire up remove buttons
    container.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.dataset.id);
        draw();
      });
    });

    // Wire up clear button
    container.querySelector('#cart-clear')?.addEventListener('click', () => {
      if (confirm('¿Vaciar el carrito?')) { clearCart(); draw(); }
    });
  }

  draw();
}

/* ════════════════════════════════════════════════════
   PAGE INIT
   ════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // Sync badge on every page load from localStorage
  _syncCartBadge();

  /* ── Toast de carrito ─────────────────────────────── */
  const cartToast = _createToast();

  function _createToast() {
    const el = document.createElement('div');
    el.id = 'cart-toast';
    el.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
        fill="none" stroke="#6ee7b7" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>Producto añadido al carrito</span>`;
    document.body.appendChild(el);
    return el;
  }

  function showToast() {
    cartToast.classList.add('show');
    clearTimeout(cartToast._timer);
    cartToast._timer = setTimeout(() => cartToast.classList.remove('show'), 2200);
  }

  /* ── Botones "Agregar al carrito" ─────────────────── */
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      // Walk up to the .product-card li to read data
      const card = btn.closest('.product-card');

      const id    = card?.dataset.id || crypto.randomUUID();
      const name  = card?.querySelector('h3')?.textContent.trim() || 'Producto';
      const image = card?.querySelector('img')?.src || '';
      const priceText = card?.querySelector('.text-xl.font-black')?.textContent || '0';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

      addToCart({ id, name, price, image });

      // Button feedback
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        ¡Añadido!`;
      btn.style.background = '#059669';

      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 1800);

      showToast();
    });
  });

  /* ── Wishlist (toggle) ────────────────────────────── */
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const isActive = btn.classList.contains('active');
      btn.setAttribute('aria-label', isActive ? 'Quitar de favoritos' : 'Agregar a favoritos');
    });
  });

  /* ── Filtros + Búsqueda (estado combinado) ────────── */
  let activeFilter = 'all';
  let searchQuery  = '';

  // Lazy-create the empty-state node once, inserted after the product grid
  function _getEmptyState() {
    let el = document.getElementById('products-empty');
    if (!el) {
      el = document.createElement('p');
      el.id = 'products-empty';
      el.className = 'hidden col-span-full text-center py-16 text-slate-400 text-sm font-medium';
      el.textContent = 'No se encontraron productos.';
      document.querySelector('.product-card')
        ?.closest('ul')
        ?.insertAdjacentElement('afterend', el);
    }
    return el;
  }

  function filterProducts() {
    const q     = searchQuery.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    let   visible = 0;

    cards.forEach(card => {
      const matchesFilter = activeFilter === 'all' || card.dataset.filter === activeFilter;
      const matchesSearch = !q || (card.querySelector('h3')?.textContent.toLowerCase().includes(q) ?? false);
      const show = matchesFilter && matchesSearch;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    const empty = _getEmptyState();
    if (empty) empty.classList.toggle('hidden', visible > 0);
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-brand-600', 'text-white', 'shadow-sm', 'font-semibold');
        b.classList.add('bg-slate-100', 'text-slate-600', 'font-medium');
      });
      btn.classList.add('bg-brand-600', 'text-white', 'shadow-sm', 'font-semibold');
      btn.classList.remove('bg-slate-100', 'text-slate-600', 'font-medium');

      activeFilter = btn.dataset.filter;
      filterProducts();
    });
  });

  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim();
      filterProducts();
    });
  }

  /* ── Announcement bar ─────────────────────────────── */
  const announcementBar   = document.getElementById('announcement-bar');
  const closeAnnouncement = document.getElementById('close-announcement');
  if (closeAnnouncement && announcementBar) {
    closeAnnouncement.addEventListener('click', () => {
      announcementBar.classList.add('hidden-bar');
    });
  }

  /* ── Mobile menu ──────────────────────────────────── */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen   = document.getElementById('menu-icon-open');
  const iconClose  = document.getElementById('menu-icon-close');

  function openMenu() {
    mobileMenu.classList.remove('hidden');
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    iconOpen.classList.add('hidden');
    iconClose.classList.remove('hidden');
  }

  function closeMenu() {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.contains('hidden') ? openMenu() : closeMenu();
    });
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  /* ── Countdown timer ──────────────────────────────── */
  const cdHours   = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  if (cdHours && cdMinutes && cdSeconds) {
    function _getNextSundayMidnight() {
      const now = new Date();
      const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
      const target = new Date(now);
      target.setDate(now.getDate() + daysUntilSunday);
      target.setHours(0, 0, 0, 0);
      return target;
    }

    function _pad(n) { return String(n).padStart(2, '0'); }

    function _tick() {
      const diff = _getNextSundayMidnight() - Date.now();
      if (diff <= 0) {
        cdHours.textContent = cdMinutes.textContent = cdSeconds.textContent = '00';
        return;
      }
      cdHours.textContent   = _pad(Math.floor(diff / 3_600_000));
      cdMinutes.textContent = _pad(Math.floor((diff % 3_600_000) / 60_000));
      cdSeconds.textContent = _pad(Math.floor((diff % 60_000) / 1_000));
    }

    _tick();
    setInterval(_tick, 1000);
  }

  /* ── Newsletter submit ────────────────────────────── */
  const newsletterForm    = document.getElementById('newsletter-form');
  const newsletterSuccess = document.getElementById('newsletter-success');

  if (newsletterForm && newsletterSuccess) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      newsletterForm.classList.add('hidden');
      newsletterSuccess.classList.remove('hidden');
    });
  }

  /* ── Auto-render cart page if container present ───── */
  if (document.getElementById('cart-container')) {
    renderCart('#cart-container');
  }

  /* ── Quick View Modal ────────────────────────────── */
  let _qvQty  = 1;
  let _qvCard = null;

  function _openQV(card) {
    _qvCard = card;
    _qvQty  = 1;

    // ── Read data from card DOM ──
    const img       = card.querySelector('img');
    const h3link    = card.querySelector('h3 a') || card.querySelector('h3');
    const brandEl   = card.querySelector('p.uppercase');
    const starsEl   = card.querySelector('.stars');
    const ratingRow = starsEl?.parentElement;
    const priceEl   = card.querySelector('.text-xl.font-black') || card.querySelector('.text-lg.font-black');
    const origEl    = card.querySelector('.line-through');
    const savingsEl = card.querySelector('.text-emerald-700');

    const $  = id => document.getElementById(id);
    $('qv-image').src = img?.src || '';
    $('qv-image').alt = img?.alt || '';
    $('qv-brand').textContent    = brandEl?.textContent.trim()             || '';
    $('qv-name').textContent     = h3link?.textContent.trim()              || '';
    $('qv-stars').textContent    = starsEl?.textContent                    || '';
    $('qv-rating').textContent   = ratingRow?.children[1]?.textContent.trim() || '';
    $('qv-reviews').textContent  = ratingRow?.children[2]?.textContent.trim() || '';
    $('qv-price').textContent    = priceEl?.textContent.trim()             || '';
    $('qv-qty-display').textContent = '1';

    const origTxt = origEl?.textContent.trim() || '';
    $('qv-original').textContent = origTxt;
    $('qv-original').classList.toggle('hidden', !origTxt);

    const savingsTxt = savingsEl?.textContent.trim() || '';
    $('qv-savings').textContent = savingsTxt;
    $('qv-savings-wrap').classList.toggle('hidden', !savingsTxt);

    $('qv-detail-link').href = card.querySelector('h3 a')?.getAttribute('href') || 'producto.html';

    document.getElementById('quick-view-modal').classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.getElementById('qv-close')?.focus();
  }

  function _closeQV() {
    document.getElementById('quick-view-modal')?.classList.add('hidden');
    document.body.classList.remove('modal-open');
    _qvCard = null;
  }

  // Qty controls
  document.getElementById('qv-qty-dec')?.addEventListener('click', () => {
    if (_qvQty > 1) { _qvQty--; document.getElementById('qv-qty-display').textContent = _qvQty; }
  });
  document.getElementById('qv-qty-inc')?.addEventListener('click', () => {
    if (_qvQty < 10) { _qvQty++; document.getElementById('qv-qty-display').textContent = _qvQty; }
  });

  // Add to cart from modal
  document.getElementById('qv-add-cart')?.addEventListener('click', () => {
    if (!_qvCard) return;

    const id    = _qvCard.dataset.id || crypto.randomUUID();
    const name  = document.getElementById('qv-name').textContent;
    const image = document.getElementById('qv-image').src;
    const price = parseFloat(document.getElementById('qv-price').textContent.replace(/[^0-9.]/g, '')) || 0;

    addToCart({ id, name, price, image, qty: _qvQty });

    const btn  = document.getElementById('qv-add-cart');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg> ¡Añadido!`;
    btn.style.background = '#059669';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 1800);
    showToast();
  });

  // Close: button, backdrop, Escape
  document.getElementById('qv-close')?.addEventListener('click', _closeQV);
  document.getElementById('qv-backdrop')?.addEventListener('click', _closeQV);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') _closeQV(); });

  // Open: vista rápida buttons
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      if (card) _openQV(card);
    });
  });

  /* ── Product page ─────────────────────────────────── */
  const mainProductImage = document.getElementById('main-product-image');
  if (mainProductImage) {

    // Gallery: thumbnail click → swap main image
    document.querySelectorAll('.thumbnail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        mainProductImage.src = btn.dataset.full;
        mainProductImage.onerror = () => { mainProductImage.src = btn.dataset.fallback; mainProductImage.onerror = null; };

        document.querySelectorAll('.thumbnail-btn').forEach(t => {
          t.classList.remove('ring-2', 'ring-brand-600');
          t.classList.add('ring-1', 'ring-slate-200');
          t.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('ring-2', 'ring-brand-600');
        btn.classList.remove('ring-1', 'ring-slate-200');
        btn.setAttribute('aria-pressed', 'true');
      });
    });

    // Tabs
    document.querySelectorAll('.product-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.product-tab').forEach(t => {
          t.classList.remove('text-brand-600', 'border-brand-600', 'font-semibold');
          t.classList.add('text-slate-500', 'border-transparent', 'font-medium');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('text-brand-600', 'border-brand-600', 'font-semibold');
        tab.classList.remove('text-slate-500', 'border-transparent', 'font-medium');
        tab.setAttribute('aria-selected', 'true');

        document.querySelectorAll('#tab-description, #tab-specs, #tab-reviews').forEach(p => p.classList.add('hidden'));
        document.getElementById('tab-' + tab.dataset.tab)?.classList.remove('hidden');
      });
    });

    // Quantity picker
    let productQty = 1;
    const qtyDisplay = document.getElementById('qty-display');
    document.getElementById('qty-dec')?.addEventListener('click', () => {
      if (productQty > 1) { productQty--; qtyDisplay.textContent = productQty; }
    });
    document.getElementById('qty-inc')?.addEventListener('click', () => {
      if (productQty < 10) { productQty++; qtyDisplay.textContent = productQty; }
    });

    // Color swatches
    const selectedColorLabel = document.getElementById('selected-color');
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach(s => {
          s.classList.remove('ring-2', 'ring-brand-600');
          s.classList.add('ring-1', 'ring-slate-300');
          s.setAttribute('aria-pressed', 'false');
        });
        swatch.classList.add('ring-2', 'ring-brand-600');
        swatch.classList.remove('ring-1', 'ring-slate-300');
        swatch.setAttribute('aria-pressed', 'true');
        if (selectedColorLabel) selectedColorLabel.textContent = swatch.dataset.color;
      });
    });

    // Main product add-to-cart button
    document.getElementById('product-add-cart')?.addEventListener('click', () => {
      addToCart({
        id:    'auriculares-bt',
        name:  'Auriculares Bluetooth Pro',
        price: 89.99,
        image: mainProductImage.src,
        qty:   productQty,
      });

      const btn  = document.getElementById('product-add-cart');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ¡Añadido al carrito!`;
      btn.style.background = '#059669';
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 1800);
      showToast();
    });

  }

});
