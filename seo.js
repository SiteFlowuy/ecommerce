/* ── seo.js ─────────────────────────────────────────────────
   Replaces placeholder domain / brand name in meta tags and
   canonical links at runtime using values from SITE_CONFIG.
   Must load after config.js (defer order guarantees this).
   ─────────────────────────────────────────────────────────── */

function applyDynamicSEO() {
  if (typeof SITE_CONFIG === 'undefined') return;
  const d = SITE_CONFIG.domain || '';
  const n = SITE_CONFIG.name   || '';

  document.querySelectorAll('meta[content]').forEach(el => {
    const val = el.getAttribute('content');
    if (val && val.includes('shopbase.ejemplo.com'))
      el.setAttribute('content', val.replace(/https?:\/\/shopbase\.ejemplo\.com/g, d));
    if (val && val.includes('ShopBase'))
      el.setAttribute('content', val.replace(/ShopBase/g, n));
  });

  document.querySelectorAll('link[rel="canonical"]').forEach(el => {
    const val = el.getAttribute('href');
    if (val && val.includes('shopbase.ejemplo.com'))
      el.setAttribute('href', val.replace(/https?:\/\/shopbase\.ejemplo\.com/g, d));
  });

  const siteNameEl = document.querySelector('meta[property="og:site_name"]');
  if (siteNameEl) siteNameEl.setAttribute('content', n);
}

applyDynamicSEO();
