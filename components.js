/* ── ShopBase — components.js ─────────────────────────────
   Shared header/footer injection.
   injectHeader() → writes into  #site-header
   injectFooter() → writes into  #site-footer
   Called at the very start of DOMContentLoaded in app.js so
   all IDs (#menu-toggle, #search, [aria-live="polite"] cart
   badge, etc.) are in the DOM before the rest of app.js runs.
   ─────────────────────────────────────────────────────── */

/* ════════════════════════════════════════════════════════
   HEADER  (announcement bar + sticky header + mobile menu)
   ════════════════════════════════════════════════════════ */

function injectHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const _c = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {};
  const _name    = _c.name    || 'ShopBase';
  const _coupon  = _c.couponCode    || 'BIENVENIDO10';
  const _pct     = _c.couponDiscount != null ? Math.round(_c.couponDiscount * 100) : 10;
  const _thresh  = _c.freeShippingThreshold != null ? _c.freeShippingThreshold : 50;
  const _sym     = _c.currencySymbol || '$';
  const _tag     = _c.tagline     || '';
  const _desc    = _c.description || '';
  const _ig      = (_c.social || {}).instagram || 'https://instagram.com';
  const _tw      = (_c.social || {}).twitter   || 'https://twitter.com';
  const _fb      = (_c.social || {}).facebook  || 'https://facebook.com';

  el.innerHTML = `
  <!-- ===================== ANNOUNCEMENT BAR ===================== -->
  <div id="announcement-bar" class="bg-brand-600 text-white text-xs font-semibold text-center py-2.5 px-4 relative" role="banner">
    <span>🎉 Usa el código <strong class="bg-white/20 px-1.5 py-0.5 rounded font-bold tracking-wider">${_coupon}</strong> y obtén ${_pct}% de descuento en tu primera compra</span>
    <button id="close-announcement" class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/70 hover:text-white rounded transition-colors" aria-label="Cerrar anuncio">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>

  <!-- ===================== HEADER ===================== -->
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 gap-4">

        <!-- Logo -->
        <a href="index.html" class="flex items-center gap-2 shrink-0" aria-label="${_name} — Inicio">
          <div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <span class="text-xl font-bold text-slate-900 tracking-tight">${_name}</span>
        </a>

        <!-- Nav desktop -->
        <nav class="hidden md:flex items-center gap-1" aria-label="Navegación principal">
          <a href="index.html#categories" class="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">Categorías</a>
          <a href="index.html#products"   class="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">Productos</a>
          <a href="index.html#offers"     class="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">Ofertas</a>
          <a href="index.html#about"      class="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">Nosotros</a>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Search -->
          <form class="hidden sm:flex items-center bg-slate-100 rounded-xl px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-brand-500 focus-within:bg-white transition-all" role="search" action="buscar.html" method="get">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <label for="search" class="sr-only">Buscar productos</label>
            <input type="search" id="search" name="q" placeholder="Buscar…" class="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-36 lg:w-52" />
          </form>

          <!-- Account -->
          <a href="/cuenta" class="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Mi cuenta">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </a>

          <!-- Mobile menu toggle -->
          <button id="menu-toggle" class="md:hidden w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-menu">
            <svg id="menu-icon-open" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <svg id="menu-icon-close" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="hidden"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <!-- Wishlist -->
          <a href="favoritos.html" class="relative w-9 h-9 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Mis favoritos">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span class="hidden absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center" data-wishlist-badge>0</span>
          </a>

          <!-- Cart -->
          <a href="carrito.html" class="relative w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Carrito de compras">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span class="cart-count absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center" aria-live="polite">0</span>
          </a>
        </div>

      </div>
    </div>
  </header>

  <!-- ===================== MOBILE MENU ===================== -->
  <div id="mobile-menu" class="fixed inset-0 z-40 bg-white hidden flex-col" aria-label="Menú móvil">
    <div class="flex-1 overflow-y-auto px-6 pt-8 pb-6">
      <nav class="flex flex-col gap-1 mb-8">
        <a href="index.html#categories" class="text-lg font-semibold text-slate-800 py-3 border-b border-slate-100 hover:text-brand-600 transition-colors">Categorías</a>
        <a href="index.html#products"   class="text-lg font-semibold text-slate-800 py-3 border-b border-slate-100 hover:text-brand-600 transition-colors">Productos</a>
        <a href="index.html#offers"     class="text-lg font-semibold text-slate-800 py-3 border-b border-slate-100 hover:text-brand-600 transition-colors">Ofertas</a>
        <a href="index.html#about"      class="text-lg font-semibold text-slate-800 py-3 border-b border-slate-100 hover:text-brand-600 transition-colors">Nosotros</a>
      </nav>
      <div class="flex flex-col gap-3">
        <a href="/registro" class="w-full bg-brand-600 text-white text-center font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-colors">Crear cuenta</a>
        <a href="/login"    class="w-full border-2 border-slate-200 text-slate-700 text-center font-semibold py-3.5 rounded-xl hover:border-brand-600 hover:text-brand-600 transition-colors">Iniciar sesión</a>
      </div>
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════
   FOOTER  (trust bar + full footer with nav columns)
   ════════════════════════════════════════════════════════ */

function injectFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
  <!-- ===================== TRUST BAR ===================== -->
  <div class="bg-slate-900 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-x divide-white/5">
        <div class="flex items-center gap-3 px-4 first:pl-0">
          <div class="text-slate-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <p class="text-white text-xs font-semibold">Pago 100% seguro</p>
            <p class="text-slate-500 text-[11px]">SSL 256-bit</p>
          </div>
        </div>
        <div class="flex items-center gap-3 px-4">
          <div class="text-slate-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div>
            <p class="text-white text-xs font-semibold">Envío gratis +${_sym}${_thresh}</p>
            <p class="text-slate-500 text-[11px]">Express disponible</p>
          </div>
        </div>
        <div class="flex items-center gap-3 px-4">
          <div class="text-slate-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <div>
            <p class="text-white text-xs font-semibold">Devolución 30 días</p>
            <p class="text-slate-500 text-[11px]">Sin preguntas</p>
          </div>
        </div>
        <div class="flex items-center gap-3 px-4">
          <div class="text-slate-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.38 2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.7 16z"/></svg>
          </div>
          <div>
            <p class="text-white text-xs font-semibold">Soporte 24/7</p>
            <p class="text-slate-500 text-[11px]">Chat y teléfono</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ===================== FOOTER ===================== -->
  <footer class="bg-slate-950 border-t border-white/5 text-slate-400" aria-label="Pie de página">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <!-- Brand -->
        <div>
          <a href="index.html" class="flex items-center gap-2 mb-4" aria-label="${_name} — Inicio">
            <div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </div>
            <span class="text-lg font-bold text-white tracking-tight">${_name}</span>
          </a>
          <p class="text-sm leading-relaxed mb-5">${_tag}. ${_desc}</p>
          <div class="flex gap-3" aria-label="Redes sociales">
            <a href="${_ig}" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              class="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="${_tw}" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
              class="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
            <a href="${_fb}" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              class="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        <!-- Tienda -->
        <nav aria-label="Tienda">
          <h3 class="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Tienda</h3>
          <ul class="space-y-2.5 text-sm">
            <li><a href="index.html"             class="hover:text-white transition-colors">Todos los productos</a></li>
            <li><a href="index.html#categories"  class="hover:text-white transition-colors">Categorías</a></li>
            <li><a href="index.html#offers"       class="hover:text-white transition-colors">Ofertas</a></li>
            <li><a href="index.html#products"     class="hover:text-white transition-colors">Novedades</a></li>
          </ul>
        </nav>

        <!-- Mi cuenta -->
        <nav aria-label="Mi cuenta">
          <h3 class="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Mi cuenta</h3>
          <ul class="space-y-2.5 text-sm">
            <li><a href="/cuenta"       class="hover:text-white transition-colors">Perfil</a></li>
            <li><a href="/pedidos"      class="hover:text-white transition-colors">Mis pedidos</a></li>
            <li><a href="/favoritos"    class="hover:text-white transition-colors">Favoritos</a></li>
            <li><a href="/direcciones"  class="hover:text-white transition-colors">Mis direcciones</a></li>
            <li><a href="/devoluciones" class="hover:text-white transition-colors">Devoluciones</a></li>
          </ul>
        </nav>

        <!-- Ayuda -->
        <nav aria-label="Ayuda">
          <h3 class="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Ayuda</h3>
          <ul class="space-y-2.5 text-sm">
            <li><a href="/faq"        class="hover:text-white transition-colors">Preguntas frecuentes</a></li>
            <li><a href="/envios"     class="hover:text-white transition-colors">Información de envíos</a></li>
            <li><a href="/contacto"   class="hover:text-white transition-colors">Contacto</a></li>
            <li><a href="/privacidad" class="hover:text-white transition-colors">Privacidad</a></li>
            <li><a href="/terminos"   class="hover:text-white transition-colors">Términos y condiciones</a></li>
          </ul>
        </nav>

      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-slate-600">&copy; ${new Date().getFullYear()} ${_name}. Todos los derechos reservados.</p>
        <div class="flex items-center gap-2" aria-label="Métodos de pago aceptados">
          <span class="bg-white/5 text-slate-400 text-xs font-medium px-3 py-1 rounded-lg border border-white/5">Visa</span>
          <span class="bg-white/5 text-slate-400 text-xs font-medium px-3 py-1 rounded-lg border border-white/5">Mastercard</span>
          <span class="bg-white/5 text-slate-400 text-xs font-medium px-3 py-1 rounded-lg border border-white/5">PayPal</span>
          <span class="bg-white/5 text-slate-400 text-xs font-medium px-3 py-1 rounded-lg border border-white/5">Apple Pay</span>
        </div>
      </div>
    </div>
  </footer>`;
}
