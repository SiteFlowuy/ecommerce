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
   WISHLIST MODULE
   Persists to localStorage under "shopbase_wishlist".
   Stores an array of product IDs.
   ════════════════════════════════════════════════════ */

const WISHLIST_KEY = 'shopbase_wishlist';

/** @returns {string[]} Array of product IDs in the wishlist. */
function getWishlist() {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; } catch { return []; }
}

function _saveWishlist(ids) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  _syncWishlistBadge();
}

/**
 * Add the id if absent, remove it if present.
 * @param {string} id
 * @returns {boolean} true if now in wishlist, false if removed.
 */
function toggleWishlist(id) {
  const ids = getWishlist();
  const idx = ids.indexOf(id);
  if (idx === -1) { ids.push(id); } else { ids.splice(idx, 1); }
  _saveWishlist(ids);
  return idx === -1;
}

/** @param {string} id @returns {boolean} */
function isInWishlist(id) {
  return getWishlist().includes(id);
}

/**
 * Returns full product objects for all wishlisted IDs.
 * Requires PRODUCTS global to be loaded.
 * @returns {Array}
 */
function getWishlistProducts() {
  const ids = getWishlist();
  if (!ids.length) return [];
  const products = typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
  return ids.map(id => products.find(p => p.id === id)).filter(Boolean);
}

/** Keep every [data-wishlist-badge] element in sync. */
function _syncWishlistBadge() {
  const count = getWishlist().length;
  document.querySelectorAll('[data-wishlist-badge]').forEach(badge => {
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  });
}

/* ════════════════════════════════════════════════════
   COUPON MODULE
   Persists active coupon to sessionStorage under
   "shopbase_coupon" so it survives navigation to
   checkout within the same tab.
   ════════════════════════════════════════════════════ */

const COUPON_KEY = 'shopbase_coupon';

/**
 * Validate and apply a coupon code.
 * @param {string} code
 * @returns {{ valid: boolean, discount: number, type: string, message: string }}
 */
function applyCoupon(code) {
  const coupons = typeof COUPONS !== 'undefined' ? COUPONS : [];
  const subtotal = getCartTotal();
  const normalized = (code || '').trim().toUpperCase();

  if (!normalized) {
    return { valid: false, discount: 0, type: '', message: 'Ingresa un código de descuento.' };
  }

  const coupon = coupons.find(c => c.code === normalized && c.active);

  if (!coupon) {
    return { valid: false, discount: 0, type: '', message: '✗ Código inválido o expirado.' };
  }

  if (subtotal < coupon.minOrder) {
    const sym = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.currencySymbol) || '$';
    return {
      valid: false, discount: 0, type: coupon.type,
      message: `✗ Este cupón requiere un pedido mínimo de ${sym}${coupon.minOrder.toFixed(2)}.`,
    };
  }

  let discountAmount = 0;
  let label = '';

  if (coupon.type === 'percent') {
    discountAmount = subtotal * coupon.discount;
    label = `−${Math.round(coupon.discount * 100)}%`;
  } else if (coupon.type === 'fixed') {
    discountAmount = Math.min(coupon.discount, subtotal);
    const sym = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.currencySymbol) || '$';
    label = `−${sym}${coupon.discount.toFixed(2)}`;
  } else if (coupon.type === 'shipping') {
    discountAmount = 0; // shipping is already free; label communicates the benefit
    label = 'Envío gratis';
  }

  const payload = { code: coupon.code, type: coupon.type, discount: coupon.discount, discountAmount, label };
  sessionStorage.setItem(COUPON_KEY, JSON.stringify(payload));

  return {
    valid: true,
    discount: discountAmount,
    type: coupon.type,
    message: `✓ Código aplicado: ${label}.`,
  };
}

/** @returns {object|null} Active coupon payload from sessionStorage. */
function getCoupon() {
  try {
    return JSON.parse(sessionStorage.getItem(COUPON_KEY)) || null;
  } catch {
    return null;
  }
}

/** Remove the active coupon from sessionStorage. */
function clearCoupon() {
  sessionStorage.removeItem(COUPON_KEY);
}

/* ════════════════════════════════════════════════════
   ORDER MODULE
   ════════════════════════════════════════════════════ */

const ORDER_KEY = 'shopbase_last_order';

function generateOrderId() {
  const date = new Date();
  const y    = date.getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `SB-${y}-${rand}`;
}

/**
 * Persist order to localStorage. Call BEFORE clearCart().
 * @param {object} orderData  Extra fields to merge (e.g. shipping, coupon).
 */
function saveOrder(orderData) {
  const coupon = typeof getCoupon === 'function' ? getCoupon() : null;
  const subtotal = getCartTotal();
  let discountAmount = 0;
  if (coupon) {
    if (coupon.type === 'percent') discountAmount = subtotal * coupon.discount;
    else if (coupon.type === 'fixed') discountAmount = Math.min(coupon.discount, subtotal);
  }
  localStorage.setItem(ORDER_KEY, JSON.stringify({
    id:       generateOrderId(),
    items:    getCart(),
    subtotal,
    discount: discountAmount,
    total:    Math.max(0, subtotal - discountAmount),
    coupon:   coupon ? coupon.code : null,
    date:     new Date().toISOString(),
    ...orderData,
  }));
}

/** @returns {object|null} Last saved order from localStorage. */
function getLastOrder() {
  try { return JSON.parse(localStorage.getItem(ORDER_KEY)); } catch { return null; }
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
    const sym   = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.currencySymbol) || '$';

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
          <p class="text-sm text-brand-600 font-bold mt-0.5">${sym}${item.price.toFixed(2)}</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button class="cart-qty-btn w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors flex items-center justify-center"
            data-id="${item.id}" data-delta="-1" aria-label="Reducir cantidad">−</button>
          <span class="w-6 text-center text-sm font-semibold tabular-nums">${item.quantity}</span>
          <button class="cart-qty-btn w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors flex items-center justify-center"
            data-id="${item.id}" data-delta="1" aria-label="Aumentar cantidad">+</button>
        </div>
        <p class="w-20 text-right text-sm font-black text-slate-900 shrink-0 tabular-nums">
          ${sym}${(item.price * item.quantity).toFixed(2)}
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
          <p class="text-2xl font-black text-slate-900">${sym}${total.toFixed(2)}</p>
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

  // Inject shared header/footer before any DOM queries that depend on them
  if (typeof injectHeader === 'function') injectHeader();
  if (typeof injectFooter === 'function') injectFooter();

  // Sync badges on every page load from localStorage
  _syncCartBadge();
  _syncWishlistBadge();

  // Restore wishlist active state on all .wishlist-btn cards already in DOM
  function _restoreWishlistButtons() {
    document.querySelectorAll('.product-card').forEach(card => {
      const id  = card.dataset.id;
      const btn = card.querySelector('.wishlist-btn');
      if (!btn || !id) return;
      const active = isInWishlist(id);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-label', active ? 'Quitar de favoritos' : 'Agregar a favoritos');
    });
  }
  _restoreWishlistButtons();

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
      const card = btn.closest('.product-card');
      const id   = card?.dataset.id;
      const p    = (typeof PRODUCTS !== 'undefined' && id)
                     ? PRODUCTS.find(x => x.id === id) : null;

      addToCart({
        id:    p?.id    ?? id ?? crypto.randomUUID(),
        name:  p?.name  ?? 'Producto',
        price: p?.price ?? 0,
        image: p?.image ?? '',
      });

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

  /* ── Wishlist (toggle + persist) ─────────────────── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.wishlist-btn');
    if (!btn) return;
    const card = btn.closest('.product-card');
    const id   = card?.dataset.id;
    if (!id) return;
    const nowActive = toggleWishlist(id);
    btn.classList.toggle('active', nowActive);
    btn.setAttribute('aria-label', nowActive ? 'Quitar de favoritos' : 'Agregar a favoritos');
  });

  /* ── Filtros + Búsqueda + Carga progresiva ────────── */
  let activeFilter   = 'all';
  let activeCategory = 'all';
  let searchQuery    = '';
  const _perPage     = (typeof PRODUCTS_PER_PAGE !== 'undefined') ? PRODUCTS_PER_PAGE : 8;
  let   _visibleCount = _perPage;

  function _getFilteredProducts() {
    const q = searchQuery.toLowerCase();
    return (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).filter(p => {
      const matchesFilter   = activeFilter   === 'all' || p.filter   === activeFilter;
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch   = !q ||
        (p.name + ' ' + p.brand + ' ' + (p.description || '') + ' ' + (p.tags || []).join(' '))
          .toLowerCase().includes(q);
      return matchesFilter && matchesCategory && matchesSearch;
    });
  }

  function _updateLoadMoreBtn(filtered) {
    const btn   = document.getElementById('btn-load-more');
    const label = document.getElementById('btn-load-more-label');
    if (!btn) return;
    const remaining = filtered.length - _visibleCount;
    if (remaining <= 0) {
      btn.classList.add('hidden');
    } else {
      btn.classList.remove('hidden');
      const next = Math.min(remaining, _perPage);
      if (label) label.textContent = `Ver ${next} producto${next !== 1 ? 's' : ''} más`;
    }
  }

  // Lazy-create the empty-state node once, inserted after the product grid
  function _getEmptyState() {
    let el = document.getElementById('products-empty');
    if (!el) {
      el = document.createElement('p');
      el.id = 'products-empty';
      el.className = 'hidden col-span-full text-center py-16 text-slate-400 text-sm font-medium';
      el.textContent = 'No se encontraron productos.';
      document.getElementById('products-grid')
        ?.insertAdjacentElement('afterend', el);
    }
    return el;
  }

  function filterProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const filtered = _getFilteredProducts();
    const slice    = filtered.slice(0, _visibleCount);

    grid.innerHTML = slice.map((p, i) => _cardHtml(p, i)).join('');
    _restoreWishlistButtons();

    const empty = _getEmptyState();
    if (empty) empty.classList.toggle('hidden', filtered.length > 0);

    _updateLoadMoreBtn(filtered);
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
      _visibleCount = _perPage;
      filterProducts();
    });
  });

  document.addEventListener('shopbase:category-filter', e => {
    activeCategory = e.detail.category;
    _visibleCount = _perPage;
    filterProducts();
  });

  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim();
      _visibleCount = _perPage;
      filterProducts();
    });
  }

  const loadMoreBtn = document.getElementById('btn-load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      _visibleCount += _perPage;
      filterProducts();
    });
    // Initial load-more state (products.js already rendered the first slice)
    _updateLoadMoreBtn(_getFilteredProducts());
  }

  /* ── Announcement bar ─────────────────────────────── */
  const announcementBar   = document.getElementById('announcement-bar');
  const closeAnnouncement = document.getElementById('close-announcement');
  if (announcementBar) {
    if (sessionStorage.getItem('shopbase_bar_closed') === '1') {
      announcementBar.classList.add('hidden-bar');
    }
    if (closeAnnouncement) {
      closeAnnouncement.addEventListener('click', () => {
        announcementBar.classList.add('hidden-bar');
        sessionStorage.setItem('shopbase_bar_closed', '1');
      });
    }
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

    const id = _qvCard.dataset.id;
    const p  = (typeof PRODUCTS !== 'undefined' && id)
                 ? PRODUCTS.find(x => x.id === id) : null;

    addToCart({
      id:    p?.id    ?? id ?? crypto.randomUUID(),
      name:  p?.name  ?? 'Producto',
      price: p?.price ?? 0,
      image: p?.image ?? '',
      qty:   _qvQty,
    });

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
    // id/name/price are set via data attributes by producto-init.js
    const addCartBtn = document.getElementById('product-add-cart');
    addCartBtn?.addEventListener('click', () => {
      addToCart({
        id:    addCartBtn.dataset.productId                        || 'unknown',
        name:  addCartBtn.dataset.productName                      || 'Producto',
        price: parseFloat(addCartBtn.dataset.productPrice || '0') || 0,
        image: mainProductImage.src,
        qty:   productQty,
      });

      const orig = addCartBtn.innerHTML;
      addCartBtn.disabled = true;
      addCartBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ¡Añadido al carrito!`;
      addCartBtn.style.background = '#059669';
      setTimeout(() => { addCartBtn.innerHTML = orig; addCartBtn.style.background = ''; addCartBtn.disabled = false; }, 1800);
      showToast();
    });

  }

});
