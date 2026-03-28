/* ── ShopBase — categoria-init.js ─────────────────────────
   Reads ?cat= from URL, validates against CATEGORIES,
   filters PRODUCTS, and populates categoria.html.
   Loaded defer after products.js + categories.js so both
   arrays are defined. Overwrites the full-catalog render
   that products.js emits into #products-grid / #filters-bar.
   ─────────────────────────────────────────────────────── */

(function () {

  /* ── 1. Resolve category from URL ─────────────────── */
  const params = new URLSearchParams(window.location.search);
  const catId  = params.get('cat');

  if (!catId) { window.location.replace('index.html'); return; }

  const cat = typeof CATEGORIES !== 'undefined'
    ? CATEGORIES.find(c => c.id === catId)
    : null;
  if (!cat) { window.location.replace('index.html'); return; }

  const catProducts = typeof PRODUCTS !== 'undefined'
    ? PRODUCTS.filter(p => p.category === catId)
    : [];

  /* ── 2. SEO — update head immediately ─────────────── */
  const BASE  = 'https://shopbase.ejemplo.com';
  const url   = `${BASE}/categoria?cat=${catId}`;
  const title = `${cat.name} — ShopBase`;
  const desc  = `${cat.description}. Compra ${cat.name.toLowerCase()} online con envío gratis y los mejores precios. ${catProducts.length} productos disponibles.`;

  document.title = title;

  _meta('name',     'description',    desc);
  _meta('property', 'og:title',       title);
  _meta('property', 'og:description', desc);
  _meta('property', 'og:url',         url);
  _meta('name',     'twitter:title',       title);
  _meta('name',     'twitter:description', desc);
  _link('canonical', url);

  /* Schema.org: ItemList */
  const ldEl = document.querySelector('script[type="application/ld+json"]');
  if (ldEl) {
    ldEl.textContent = JSON.stringify({
      '@context':        'https://schema.org',
      '@type':           'ItemList',
      name:              cat.name,
      description:       cat.description,
      url,
      numberOfItems:     catProducts.length,
      itemListElement:   catProducts.map((p, i) => ({
        '@type':    'ListItem',
        position:   i + 1,
        url:        `${BASE}/producto.html?id=${p.id}`,
        name:       p.name,
      })),
    });
  }

  /* ── 3. DOM population (after DOM is ready) ────────── */
  document.addEventListener('DOMContentLoaded', () => {

    /* Breadcrumb */
    const bcCat = document.getElementById('breadcrumb-cat');
    if (bcCat) bcCat.textContent = cat.name;

    /* Category header */
    const emojiEl = document.getElementById('cat-emoji');
    const nameEl  = document.getElementById('cat-name');
    const descEl  = document.getElementById('cat-description');
    const countEl = document.getElementById('cat-count');
    if (emojiEl) emojiEl.textContent = cat.emoji;
    if (nameEl)  nameEl.textContent  = cat.name;
    if (descEl)  descEl.textContent  = cat.description;
    if (countEl) countEl.textContent =
      catProducts.length === 1 ? '1 producto' : `${catProducts.length} productos`;

    /* ── Type filter bar — only filters present in this category ── */
    const filtersBar = document.getElementById('filters-bar');
    if (filtersBar) {
      const seen    = new Set();
      const filters = ['all'];
      catProducts.forEach(p => {
        if (!seen.has(p.filter)) { seen.add(p.filter); filters.push(p.filter); }
      });

      filtersBar.innerHTML = filters.map((f, i) => {
        const active   = i === 0;
        const label    = (typeof FILTER_LABELS !== 'undefined' && FILTER_LABELS[f])
          || (f.charAt(0).toUpperCase() + f.slice(1));
        const baseCs   = 'filter-btn px-4 py-2 rounded-xl text-sm transition-colors';
        const activeCs = 'bg-brand-600 text-white shadow-sm font-semibold';
        const inactCs  = 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium';
        return `<button class="${baseCs} ${active ? activeCs : inactCs}" data-filter="${f}">${label}</button>`;
      }).join('');
    }

    /* ── Products grid — only this category's products ──────────── */
    const grid = document.getElementById('products-grid');
    if (grid) {
      if (catProducts.length === 0) {
        grid.innerHTML = `
          <li class="col-span-full text-center py-24 flex flex-col items-center gap-3">
            <span class="text-5xl">🔍</span>
            <p class="text-lg font-semibold text-slate-700">No hay productos en esta categoría todavía</p>
            <a href="index.html" class="mt-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              ← Volver a la tienda
            </a>
          </li>`;
      } else if (typeof _cardHtml === 'function') {
        grid.innerHTML = catProducts.map((p, i) => _cardHtml(p, i)).join('');
      }
    }
  });

  /* ════════════════════════════════════════════════════
     HELPERS
     ════════════════════════════════════════════════════ */

  function _meta(attr, name, content) {
    const el = document.querySelector(`meta[${attr}="${name}"]`);
    if (el) el.setAttribute('content', content);
  }

  function _link(rel, href) {
    const el = document.querySelector(`link[rel="${rel}"]`);
    if (el) el.setAttribute('href', href);
  }

})();
