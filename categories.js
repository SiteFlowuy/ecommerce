/* ── ShopBase — categories.js ─────────────────────────────
   Category catalog + dynamic rendering of:
     - #categories-grid  (section "Categorías" in index.html)
     - #category-filters-bar  (above the product grid)
   Loaded defer after products.js so PRODUCTS is already defined.
   ─────────────────────────────────────────────────────── */

/* ════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════ */

const CATEGORIES = [
  { id: 'electronics', name: 'Electrónica',    emoji: '📱', description: 'Gadgets, audio, wearables y más',           color: 'blue'    },
  { id: 'clothing',    name: 'Ropa y Calzado', emoji: '👗', description: 'Moda, calzado deportivo y accesorios',      color: 'pink'    },
  { id: 'home',        name: 'Hogar',          emoji: '🏠', description: 'Decoración, iluminación y muebles',         color: 'amber'   },
  { id: 'sports',      name: 'Deportes',       emoji: '⚽', description: 'Equipamiento y ropa deportiva',             color: 'emerald' },
  { id: 'toys',        name: 'Juguetes',       emoji: '🧸', description: 'Juguetes educativos y de entretenimiento',  color: 'violet'  },
  { id: 'books',       name: 'Libros',         emoji: '📚', description: 'Libros, ebooks y material educativo',       color: 'orange'  },
];

/* ════════════════════════════════════════════════════════
   CONFIG
   ════════════════════════════════════════════════════════ */

/** Tailwind bg classes for category icon pill. */
const _CAT_BG = {
  blue:    'bg-blue-50 group-hover:bg-blue-100',
  pink:    'bg-pink-50 group-hover:bg-pink-100',
  amber:   'bg-amber-50 group-hover:bg-amber-100',
  emerald: 'bg-emerald-50 group-hover:bg-emerald-100',
  violet:  'bg-violet-50 group-hover:bg-violet-100',
  orange:  'bg-orange-50 group-hover:bg-orange-100',
};

/* ════════════════════════════════════════════════════════
   RENDER
   ════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Count products per category ────────────────────── */
  const counts = {};
  if (typeof PRODUCTS !== 'undefined') {
    PRODUCTS.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
  }

  /* ── Categories section grid ─────────────────────────── */
  const sectGrid = document.getElementById('categories-grid');
  if (sectGrid) {
    sectGrid.innerHTML = CATEGORIES.map(cat => {
      const count     = counts[cat.id] || 0;
      const bg        = _CAT_BG[cat.color] || 'bg-slate-50 group-hover:bg-slate-100';
      const countText = count === 1 ? '1 producto' : `${count} productos`;

      return `
          <li>
            <button type="button" data-category="${cat.id}" title="${cat.description}"
              class="category-card-btn group w-full flex flex-col items-center gap-3 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-brand-200">
              <div class="w-14 h-14 ${bg} rounded-2xl flex items-center justify-center text-2xl transition-colors">
                ${cat.emoji}
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-800">${cat.name}</h3>
                <span class="text-xs text-slate-400">${countText}</span>
              </div>
            </button>
          </li>`;
    }).join('');

    sectGrid.querySelectorAll('.category-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = `categoria.html?cat=${btn.dataset.category}`;
      });
    });
  }

  /* ── Category filter bar (above product grid) ─────────── */
  const catBar = document.getElementById('category-filters-bar');
  if (catBar) {
    const withProducts = CATEGORIES.filter(cat => (counts[cat.id] || 0) > 0);

    if (withProducts.length > 1) {
      const items = [{ id: 'all', name: 'Todas', emoji: null }, ...withProducts];

      catBar.innerHTML = items.map((cat, i) => {
        const active  = i === 0;
        const label   = cat.emoji ? `${cat.emoji}\u202F${cat.name}` : cat.name;
        const countBadge = cat.id !== 'all'
          ? ` <span class="opacity-55 font-normal">(${counts[cat.id]})</span>`
          : '';
        return `<button
          class="category-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${active ? 'bg-slate-800 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
          data-category="${cat.id}">${label}${countBadge}</button>`;
      }).join('');

      catBar.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          _setActiveCategoryBtn(btn.dataset.category);
          _dispatchCategoryFilter(btn.dataset.category);
        });
      });
    } else {
      catBar.classList.add('hidden');
    }
  }

  /* ════════════════════════════════════════════════════
     HELPERS
     ════════════════════════════════════════════════════ */

  function _dispatchCategoryFilter(category) {
    document.dispatchEvent(new CustomEvent('shopbase:category-filter', {
      detail: { category },
    }));
  }

  function _setActiveCategoryBtn(category) {
    document.querySelectorAll('#category-filters-bar .category-btn').forEach(b => {
      const isActive = b.dataset.category === category;
      b.classList.toggle('bg-slate-800',  isActive);
      b.classList.toggle('text-white',    isActive);
      b.classList.toggle('font-semibold', isActive);
      b.classList.toggle('bg-slate-100',  !isActive);
      b.classList.toggle('text-slate-600', !isActive);
    });
  }
});
