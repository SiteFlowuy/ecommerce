/* ── seo.js ─────────────────────────────────────────────────
   Replaces placeholder domain / brand name in meta tags,
   canonical links, document.title, and meta description.
   Must load after config.js (defer order guarantees this).
   Pages with their own init scripts (producto-init.js,
   categoria-init.js) overwrite meta tags themselves — seo.js
   only handles the static pages.
   ─────────────────────────────────────────────────────────── */

function applyDynamicSEO() {
  if (typeof SITE_CONFIG === 'undefined') return;
  const d = SITE_CONFIG.domain || '';
  const n = SITE_CONFIG.name   || '';

  /* ── 1. Meta tag content: domain + brand name ── */
  document.querySelectorAll('meta[content]').forEach(el => {
    let val = el.getAttribute('content');
    if (!val) return;
    if (val.includes('shopbase.ejemplo.com'))
      val = val.replace(/https?:\/\/shopbase\.ejemplo\.com/g, d);
    if (val.includes('ShopBase'))
      val = val.replace(/ShopBase/g, n);
    el.setAttribute('content', val);
  });

  /* ── 2. Canonical links: domain ── */
  document.querySelectorAll('link[rel="canonical"]').forEach(el => {
    const val = el.getAttribute('href');
    if (val && val.includes('shopbase.ejemplo.com'))
      el.setAttribute('href', val.replace(/https?:\/\/shopbase\.ejemplo\.com/g, d));
  });

  /* ── 3. og:site_name ── */
  const siteNameEl = document.querySelector('meta[property="og:site_name"]');
  if (siteNameEl) siteNameEl.setAttribute('content', n);

  /* ── 3b. og:image — set absolute URL for static pages ─────────────
     producto-init.js sets its own og:image; skip those pages.
     ─────────────────────────────────────────────────────────────── */
  if (SITE_CONFIG.ogImage && d) {
    const skipOgImage = ['producto.html', 'categoria.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (!skipOgImage.includes(currentPage)) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', d + SITE_CONFIG.ogImage);
      const twImg = document.querySelector('meta[name="twitter:image"]');
      if (twImg) twImg.setAttribute('content', d + SITE_CONFIG.ogImage);
    }
  }

  /* ── 4. document.title ── */
  if (n && document.title.includes('ShopBase'))
    document.title = document.title.replace(/ShopBase/g, n);
  if (d && document.title.includes('shopbase.ejemplo.com'))
    document.title = document.title.replace(/https?:\/\/shopbase\.ejemplo\.com/g, d);

  /* ── 5. Meta description — static pages only ──────────────
     producto-init.js and categoria-init.js set their own
     descriptions; buscar.html has no meta description tag.
     ─────────────────────────────────────────────────────── */
  if (typeof PAGE_DESCRIPTIONS === 'undefined') return;

  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1).replace(/\?.*$/, '');

  const pageKey = {
    'index.html':        'home',
    '':                  'home',   // root URL served as index
    'carrito.html':      'cart',
    'favoritos.html':    'favorites',
    'checkout.html':     'checkout',
    'confirmacion.html': 'confirmation',
  }[page];

  if (!pageKey) return; // producto.html, categoria.html, buscar.html, admin.html — skip

  const desc = PAGE_DESCRIPTIONS[pageKey];
  if (!desc) return;

  const descEl = document.querySelector('meta[name="description"]');
  if (descEl) descEl.setAttribute('content', desc);
}

applyDynamicSEO();
