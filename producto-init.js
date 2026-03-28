/* ── ShopBase — producto-init.js ─────────────────────────
   Runs deferred, after products.js, before app.js.
   Reads ?id= from URL, finds the product in PRODUCTS,
   populates all dynamic slots in producto.html, and
   updates SEO meta tags / Schema.org JSON-LD.
   ─────────────────────────────────────────────────────── */

(function () {
  /* ── 1. Resolve product from URL ──────────────────── */
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');

  if (!id) { window.location.replace('index.html'); return; }

  const p = typeof PRODUCTS !== 'undefined' ? PRODUCTS.find(x => x.id === id) : null;
  if (!p)  { window.location.replace('index.html'); return; }

  /* ── 2. SEO — update head immediately ─────────────── */
  const BASE   = 'https://shopbase.ejemplo.com';
  const url    = `${BASE}/producto/${p.id}`;
  const title  = `${p.name} — ${p.brand} | ShopBase`;
  const imgAbs = p.image.startsWith('http') ? p.image : `${BASE}/${p.image}`;
  const desc   = `${p.name} ${p.brand}: ${p.description.slice(0, 115)}. ${p.price.toFixed(2)} USD con envío gratis.`;

  document.title = title;

  _meta('name',     'description',           desc);
  _meta('property', 'og:title',              title);
  _meta('property', 'og:description',        desc);
  _meta('property', 'og:url',                url);
  _meta('property', 'og:image',              imgAbs);
  _meta('property', 'og:image:alt',          `${p.name} ${p.brand}`);
  _meta('property', 'product:price:amount',  p.price.toFixed(2));
  _meta('name',     'twitter:title',         title);
  _meta('name',     'twitter:description',   desc);
  _meta('name',     'twitter:image',         imgAbs);
  _link('canonical',                          url);

  /* Schema.org JSON-LD */
  const ldEl = document.querySelector('script[type="application/ld+json"]');
  if (ldEl) {
    const avail = p.stock > 5
      ? 'https://schema.org/InStock'
      : p.stock > 0
        ? 'https://schema.org/LimitedAvailability'
        : 'https://schema.org/OutOfStock';

    ldEl.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type':    'Product',
      name:       p.name,
      description: p.description,
      sku:        p.id.toUpperCase(),
      brand:      { '@type': 'Brand', name: p.brand },
      image:      p.images.map(img => img.startsWith('http') ? img : `${BASE}/${img}`),
      aggregateRating: {
        '@type':       'AggregateRating',
        ratingValue:   p.rating.toFixed(1),
        reviewCount:   String(p.reviews),
        bestRating:    '5',
        worstRating:   '1',
      },
      offers: {
        '@type':         'Offer',
        url:              url,
        priceCurrency:   'USD',
        price:            p.price.toFixed(2),
        priceValidUntil: '2026-12-31',
        itemCondition:   'https://schema.org/NewCondition',
        availability:     avail,
        seller:           { '@type': 'Organization', name: 'ShopBase' },
      },
    });
  }

  /* ── 3. DOM population (after DOM is ready) ────────── */
  document.addEventListener('DOMContentLoaded', () => _populate(p));

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

  function _stars(rating) {
    const n = Math.round(rating);
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  function _fmt(n) { return '$' + n.toFixed(2); }

  const BADGE_BG = {
    brand:  'bg-brand-600', rose: 'bg-rose-500',
    amber:  'bg-amber-500', violet: 'bg-violet-600',
    emerald:'bg-emerald-500',
  };

  const CATEGORY_LABEL = {
    electronics: 'Electrónica',
    clothing:    'Ropa y Calzado',
    home:        'Hogar',
  };

  /* ════════════════════════════════════════════════════
     POPULATE
     ════════════════════════════════════════════════════ */

  function _populate(p) {
    const $  = id => document.getElementById(id);
    const $$ = sel => document.querySelector(sel);

    /* ── Breadcrumb ─────────────────────────────────── */
    const bcCat  = $('breadcrumb-category');
    const bcProd = $('breadcrumb-product');
    if (bcCat)  bcCat.textContent  = CATEGORY_LABEL[p.category] || p.category;
    if (bcProd) bcProd.textContent = p.name;

    /* ── Brand / SKU ────────────────────────────────── */
    const brandEl = $('product-brand');
    const skuEl   = $('product-sku');
    if (brandEl) brandEl.textContent = p.brand;
    if (skuEl)   skuEl.textContent   = 'SKU: ' + p.id.toUpperCase();

    /* ── Partner badge ─────────────────────────────── */
    const partnerBadge = $('product-partner-badge');
    if (partnerBadge) {
      if (p.owner === 'partner' && p.partnerName) {
        $('product-partner-name').textContent = p.partnerName;
        partnerBadge.classList.remove('hidden');
      } else {
        partnerBadge.classList.add('hidden');
      }
    }

    /* ── Title ──────────────────────────────────────── */
    const titleEl = $('product-title');
    if (titleEl) titleEl.textContent = p.name;

    /* ── Rating ─────────────────────────────────────── */
    const starsEl   = $('product-stars');
    const ratingEl  = $('product-rating');
    const reviewsEl = $('product-reviews-link');
    if (starsEl)   starsEl.textContent  = _stars(p.rating);
    if (ratingEl)  ratingEl.textContent = p.rating.toFixed(1);
    if (reviewsEl) reviewsEl.textContent = `(${p.reviews} reseñas)`;

    /* ── Stock status ───────────────────────────────── */
    const stockEl = $('product-stock');
    if (stockEl) {
      if (p.stock > 0) {
        stockEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> En stock`;
        stockEl.className = stockEl.className.replace(/text-(?:emerald|rose)-\d+/, 'text-emerald-600');
      } else {
        stockEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Sin stock`;
        stockEl.className = stockEl.className.replace(/text-(?:emerald|rose)-\d+/, 'text-rose-600');
      }
    }

    /* ── Main image ─────────────────────────────────── */
    const mainImg = $('main-product-image');
    if (mainImg) {
      mainImg.src = p.image;
      mainImg.alt = p.name;
      mainImg.onerror = () => {
        mainImg.src = `https://picsum.photos/600/600?random=20`;
        mainImg.onerror = null;
      };
    }

    /* ── Badge on main image ────────────────────────── */
    const badgeEl = $('product-main-badge');
    if (badgeEl) {
      if (p.stock === 0) {
        badgeEl.textContent = 'AGOTADO';
        badgeEl.className   = `absolute top-4 left-4 bg-slate-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow`;
      } else {
        const b = p.badges.find(b => b.text.startsWith('-')) || p.badges[0];
        if (b) {
          badgeEl.textContent = b.text;
          badgeEl.className   = `absolute top-4 left-4 ${BADGE_BG[b.color] || 'bg-rose-500'} text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow`;
        } else {
          badgeEl.classList.add('hidden');
        }
      }
    }

    /* ── Gallery thumbnails ─────────────────────────── */
    const thumbContainer = $('product-gallery-thumbs');
    if (thumbContainer) {
      thumbContainer.innerHTML = p.images.map((src, i) => `
        <button class="thumbnail-btn ${i === 0 ? 'ring-2 ring-brand-600' : 'ring-1 ring-slate-200 hover:ring-brand-300 hover:ring-2'} ring-offset-2 rounded-xl overflow-hidden aspect-square bg-slate-100 transition-all"
          data-full="${src}" data-fallback="https://picsum.photos/600/600?random=${20 + i}"
          aria-label="Imagen ${i + 1}" aria-pressed="${i === 0}">
          <img src="${src}" alt="" class="w-full h-full object-cover"
            onerror="this.onerror=null;this.src='https://picsum.photos/150/150?random=${20 + i}'" />
        </button>`).join('');
    }

    /* ── Prices ─────────────────────────────────────── */
    const priceEl   = $('product-price');
    const origEl    = $('product-original-price');
    const discEl    = $('product-discount-badge');
    const savingsEl = $('product-savings');

    if (priceEl) priceEl.textContent = _fmt(p.price);

    if (p.originalPrice) {
      const saved = p.originalPrice - p.price;
      const pct   = Math.round((saved / p.originalPrice) * 100);
      if (origEl)    { origEl.textContent = _fmt(p.originalPrice); origEl.classList.remove('hidden'); }
      if (discEl)    { discEl.textContent = `−${pct}%`; discEl.classList.remove('hidden'); }
      if (savingsEl) { savingsEl.textContent = `Ahorras ${_fmt(saved)}`; }
      $('product-savings-row')?.classList.remove('hidden');
    } else {
      origEl?.classList.add('hidden');
      discEl?.classList.add('hidden');
      $('product-savings-row')?.classList.add('hidden');
    }

    /* ── Urgency ────────────────────────────────────── */
    const urgencyEl = $('product-urgency');
    if (urgencyEl && p.urgency) {
      const strong = urgencyEl.querySelector('strong');
      if (strong) strong.textContent = `${p.stock} unidades`;
      const pTag  = urgencyEl.querySelector('p');
      if (pTag && !strong) pTag.textContent = p.urgency.text;
    } else if (urgencyEl && !p.urgency) {
      urgencyEl.classList.add('hidden');
    }

    /* ── Description tab ────────────────────────────── */
    const descEl = $('product-description-content');
    if (descEl) {
      descEl.innerHTML = `
        <h3 class="text-lg font-bold text-slate-900 mb-4">${p.name}</h3>
        <p class="text-slate-600 text-sm leading-relaxed mb-6">${p.description}</p>
        <ul class="space-y-3">
          ${Object.entries(p.specs).map(([k, v]) => `
            <li class="flex items-start gap-2.5 text-sm text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="#4f46e5" stroke-width="2.5" class="mt-0.5 shrink-0">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span><strong class="text-slate-800">${k}:</strong> ${v}</span>
            </li>`).join('')}
        </ul>`;
    }

    /* ── Specs table ────────────────────────────────── */
    const specsBody = $('product-specs-body');
    if (specsBody) {
      const entries = Object.entries(p.specs);
      specsBody.innerHTML = entries.map(([k, v], i) => `
        <tr class="${i < entries.length - 1 ? 'border-b border-slate-100' : ''}">
          <td class="py-3 pr-8 text-slate-500 font-medium w-52">${k}</td>
          <td class="py-3 text-slate-800 font-semibold">${v}</td>
        </tr>`).join('');
    }

    /* ── Reviews tab chip ───────────────────────────── */
    const reviewsChip = $('product-reviews-count-chip');
    if (reviewsChip) reviewsChip.textContent = p.reviews;

    /* ── Reviews summary ────────────────────────────── */
    const sumRating = $('product-reviews-summary-rating');
    const sumStars  = $('product-reviews-summary-stars');
    const sumCount  = $('product-reviews-summary-count');
    if (sumRating) sumRating.textContent = p.rating.toFixed(1);
    if (sumStars)  sumStars.textContent  = _stars(p.rating);
    if (sumCount)  sumCount.textContent  = `${p.reviews} reseñas verificadas`;

    /* ── Wire up #product-add-cart data attributes ───── */
    const addCartBtn = $('product-add-cart');
    if (addCartBtn) {
      addCartBtn.dataset.productId    = p.id;
      addCartBtn.dataset.productName  = p.name;
      addCartBtn.dataset.productPrice = p.price.toFixed(2);
      if (p.stock === 0) {
        addCartBtn.disabled = true;
        addCartBtn.textContent = 'Sin stock';
        addCartBtn.className = addCartBtn.className
          .replace(/bg-brand-\d+\s*/g, '')
          .replace(/hover:bg-brand-\d+\s*/g, '')
          .replace(/active:scale-\S+\s*/g, '')
          .replace(/hover:shadow-\S+\s*/g, '')
          + ' bg-slate-200 text-slate-400 cursor-not-allowed';
      }
    }

    /* ── Related products ───────────────────────────── */
    const relatedUl = $('related-products');
    if (relatedUl) {
      // Prefer same category, then fill from the rest
      const sameCat = PRODUCTS.filter(x => x.id !== p.id && x.category === p.category);
      const others  = PRODUCTS.filter(x => x.id !== p.id && x.category !== p.category);
      const related = [...sameCat, ...others].slice(0, 4);

      relatedUl.innerHTML = related.map((rp, i) => _cardHtml(rp, i)).join('');
    }
  }

})();
