/* ── ShopBase — admin.js ──────────────────────────────────
   Visual catalog editor. Reads PRODUCTS / CATEGORIES globals
   (loaded via products.js + categories.js before this file).
   No backend — generates JS code to copy-paste into products.js
   ─────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════
     STATE
     ════════════════════════════════════════════════════ */

  // Working copy of the catalog (in-memory for this session)
  let _catalog = [];
  // Index of the product being edited (-1 = new product)
  let _editIndex = -1;

  /* ════════════════════════════════════════════════════
     INIT
     ════════════════════════════════════════════════════ */

  document.addEventListener('DOMContentLoaded', () => {
    _catalog = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : [])
      .map(p => Object.assign({}, p));   // shallow clone

    _renderTable();
    _populateCategorySelect();
    _bindGlobalEvents();
  });

  /* ════════════════════════════════════════════════════
     TABLE
     ════════════════════════════════════════════════════ */

  function _renderTable() {
    const tbody = document.getElementById('products-tbody');
    const subtitle = document.getElementById('admin-subtitle');
    subtitle.textContent = `${_catalog.length} producto${_catalog.length !== 1 ? 's' : ''}`;

    if (_catalog.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-12 text-slate-400 text-sm">Sin productos. Haz clic en <strong>Nuevo producto</strong> para empezar.</td></tr>`;
      return;
    }

    tbody.innerHTML = _catalog.map((p, i) => {
      const imgSrc  = p.image || '';
      const price   = `$${Number(p.price).toFixed(2)}`;
      const origBadge = p.originalPrice
        ? `<span class="ml-1 text-[10px] line-through text-slate-300">$${Number(p.originalPrice).toFixed(2)}</span>` : '';
      const stockCls = p.stock === 0 ? 'text-rose-500 font-semibold' : p.stock <= 5 ? 'text-amber-500 font-semibold' : 'text-emerald-600';
      const ownerBadge = p.owner === 'partner'
        ? `<span class="text-[10px] bg-violet-50 text-violet-600 border border-violet-200 font-semibold px-1.5 py-0.5 rounded-md">Partner</span>`
        : `<span class="text-[10px] bg-slate-100 text-slate-500 font-semibold px-1.5 py-0.5 rounded-md">Self</span>`;
      const catLabel = _catLabel(p.category);

      return `
        <tr class="border-t border-slate-100 hover:bg-slate-50 transition-colors group" data-index="${i}">
          <td class="py-2.5 px-4">
            <div class="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0">
              ${imgSrc
                ? `<img src="${imgSrc}" alt="" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<span class=\\'text-slate-300 text-lg flex items-center justify-center h-full\\'>?</span>'" />`
                : `<span class="text-slate-300 text-lg flex items-center justify-center h-full">?</span>`}
            </div>
          </td>
          <td class="py-2.5 px-4">
            <p class="text-sm font-semibold text-slate-800 leading-snug">${_esc(p.name)}</p>
            <p class="text-[11px] text-slate-400 font-mono">${_esc(p.id)}</p>
          </td>
          <td class="py-2.5 px-4 whitespace-nowrap">
            <span class="text-sm font-bold text-slate-900">${price}</span>${origBadge}
          </td>
          <td class="py-2.5 px-4 hidden lg:table-cell">
            <span class="text-xs text-slate-600">${catLabel}</span>
          </td>
          <td class="py-2.5 px-4 hidden md:table-cell">
            <span class="text-xs ${stockCls}">${p.stock}</span>
          </td>
          <td class="py-2.5 px-4 hidden xl:table-cell">${ownerBadge}</td>
          <td class="py-2.5 px-4 text-right">
            <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="btn-edit text-xs text-brand-600 hover:bg-brand-50 font-semibold px-2.5 py-1 rounded-lg transition-colors" data-index="${i}">Editar</button>
              <button class="btn-delete text-xs text-rose-500 hover:bg-rose-50 font-semibold px-2.5 py-1 rounded-lg transition-colors" data-index="${i}">Eliminar</button>
            </div>
          </td>
        </tr>`;
    }).join('');

    // Bind row buttons
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => _openForm(Number(btn.dataset.index)));
    });
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => _deleteProduct(Number(btn.dataset.index)));
    });
  }

  /* ════════════════════════════════════════════════════
     FORM — OPEN / POPULATE
     ════════════════════════════════════════════════════ */

  function _openForm(index) {
    _editIndex = index;
    const isNew = index === -1;
    const p = isNew ? _emptyProduct() : _catalog[index];

    document.getElementById('form-title').textContent = isNew ? 'Nuevo producto' : `Editando: ${p.name}`;
    document.getElementById('code-output').classList.add('hidden');

    _populateSpecRows(p.specs || {});
    _populateBadgeRows(p.badges || []);
    _populateColorRows(p.colors || []);
    _populateTestimonialRows(p.testimonials || []);

    // Basic fields
    _val('f-name',           p.name          || '');
    _val('f-id',             p.id            || '');
    _val('f-brand',          p.brand         || '');
    _val('f-unit',           p.unit          || 'unidad');
    _val('f-category',       p.category      || '');
    _val('f-filter',         p.filter        || 'new');
    _val('f-price',          p.price         != null ? p.price       : '');
    _val('f-original-price', p.originalPrice != null ? p.originalPrice : '');
    _val('f-stock',          p.stock         != null ? p.stock       : '');
    _val('f-rating',         p.rating        != null ? p.rating      : '');
    _val('f-reviews',        p.reviews       != null ? p.reviews     : '');
    _checked('f-featured',     !!p.featured);
    _checked('f-free-shipping', p.freeShipping !== false);
    _val('f-description',    p.description   || '');
    _val('f-image',          p.image         || '');
    _val('f-images',         (p.images || []).join('\n'));
    _val('f-urgency-text',   (p.urgency || {}).text  || '');
    _val('f-urgency-color',  (p.urgency || {}).color || '');
    _val('f-tags',           (p.tags  || []).join(', '));

    // Owner
    const ownerVal = p.owner === 'partner' ? 'partner' : 'self';
    document.querySelector(`input[name="f-owner"][value="${ownerVal}"]`).checked = true;
    _togglePartnerFields(ownerVal === 'partner');
    _val('f-partner-name',   p.partnerName   || '');
    _val('f-partner-handle', p.partnerHandle || '');
    _val('f-commission',     p.commission    != null ? p.commission : '');

    // Clear image preview
    document.getElementById('f-image-filename').classList.add('hidden');
    document.getElementById('f-image-preview-wrap').classList.add('hidden');
    document.getElementById('f-image-file').value = '';

    // Show panel
    document.getElementById('panel-form').classList.remove('hidden');
    document.getElementById('f-name').focus();
  }

  function _closeForm() {
    document.getElementById('panel-form').classList.add('hidden');
    document.getElementById('code-output').classList.add('hidden');
    _editIndex = -1;
  }

  /* ════════════════════════════════════════════════════
     FORM — SPECS & BADGES DYNAMIC ROWS
     ════════════════════════════════════════════════════ */

  function _addSpecRow(key, val) {
    const container = document.getElementById('specs-container');
    const row = document.createElement('div');
    row.className = 'flex gap-2 items-center spec-row';
    row.innerHTML = `
      <input type="text" placeholder="Clave" value="${_esc(key)}"
        class="spec-key flex-1 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
      <input type="text" placeholder="Valor" value="${_esc(val)}"
        class="spec-val flex-[2] border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
      <button type="button" class="remove-row w-6 h-6 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors shrink-0" aria-label="Eliminar">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`;
    row.querySelector('.remove-row').addEventListener('click', () => row.remove());
    container.appendChild(row);
  }

  function _populateSpecRows(specs) {
    document.getElementById('specs-container').innerHTML = '';
    Object.entries(specs).forEach(([k, v]) => _addSpecRow(k, v));
    if (Object.keys(specs).length === 0) _addSpecRow('', '');
  }

  function _addBadgeRow(text, color) {
    const container = document.getElementById('badges-container');
    const row = document.createElement('div');
    row.className = 'flex gap-2 items-center badge-row';
    row.innerHTML = `
      <input type="text" placeholder="Texto (ej: -25%)" value="${_esc(text)}"
        class="badge-text flex-1 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
      <select class="badge-color border border-slate-200 rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 transition bg-white">
        ${['brand','rose','amber','violet','emerald','slate'].map(c =>
          `<option value="${c}" ${c === color ? 'selected' : ''}>${c}</option>`
        ).join('')}
      </select>
      <button type="button" class="remove-row w-6 h-6 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors shrink-0" aria-label="Eliminar">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`;
    row.querySelector('.remove-row').addEventListener('click', () => row.remove());
    container.appendChild(row);
  }

  function _populateBadgeRows(badges) {
    document.getElementById('badges-container').innerHTML = '';
    badges.forEach(b => _addBadgeRow(b.text, b.color));
  }

  function _addColorRow(name, hex) {
    const container = document.getElementById('colors-container');
    const row = document.createElement('div');
    row.className = 'flex gap-2 items-center color-row';
    row.innerHTML = `
      <input type="text" placeholder="Nombre (ej: Negro)" value="${_esc(name)}"
        class="color-name flex-1 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 transition" />
      <input type="color" value="${hex || '#000000'}"
        class="color-hex w-10 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5 shrink-0" />
      <button type="button" class="remove-row w-6 h-6 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors shrink-0" aria-label="Eliminar">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`;
    row.querySelector('.remove-row').addEventListener('click', () => row.remove());
    container.appendChild(row);
  }

  function _populateColorRows(colors) {
    document.getElementById('colors-container').innerHTML = '';
    (colors || []).forEach(c => _addColorRow(c.name, c.hex));
  }

  function _addTestimonialRow(name, location, rating, text) {
    const container = document.getElementById('testimonials-container');
    const row = document.createElement('div');
    row.className = 'testimonial-row border border-slate-100 rounded-xl p-3 space-y-2 bg-slate-50';
    row.innerHTML = `
      <div class="grid grid-cols-3 gap-2">
        <input type="text" placeholder="Nombre" value="${_esc(name)}"
          class="t-name col-span-1 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 transition bg-white" />
        <input type="text" placeholder="Ubicación" value="${_esc(location)}"
          class="t-location col-span-1 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 transition bg-white" />
        <div class="flex gap-2 items-center">
          <input type="number" placeholder="★" min="1" max="5" value="${rating || 5}"
            class="t-rating w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 transition bg-white" />
          <button type="button" class="remove-row w-6 h-6 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors shrink-0" aria-label="Eliminar">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <textarea rows="2" placeholder="Texto del testimonio"
        class="t-text w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 transition bg-white resize-none">${_esc(text)}</textarea>`;
    row.querySelector('.remove-row').addEventListener('click', () => row.remove());
    container.appendChild(row);
  }

  function _populateTestimonialRows(testimonials) {
    document.getElementById('testimonials-container').innerHTML = '';
    (testimonials || []).forEach(t => _addTestimonialRow(t.name, t.location, t.rating, t.text));
  }

  /* ════════════════════════════════════════════════════
     FORM — READ VALUES
     ════════════════════════════════════════════════════ */

  function _readForm() {
    const name  = _get('f-name').trim();
    const id    = _get('f-id').trim() || _slugify(name);

    // Specs
    const specs = {};
    document.querySelectorAll('.spec-row').forEach(row => {
      const k = row.querySelector('.spec-key').value.trim();
      const v = row.querySelector('.spec-val').value.trim();
      if (k) specs[k] = v;
    });

    // Badges
    const badges = [];
    document.querySelectorAll('.badge-row').forEach(row => {
      const t = row.querySelector('.badge-text').value.trim();
      const c = row.querySelector('.badge-color').value;
      if (t) badges.push({ text: t, color: c });
    });

    // Urgency
    const urgencyText  = _get('f-urgency-text').trim();
    const urgencyColor = _get('f-urgency-color');
    const urgency = urgencyText ? { text: urgencyText, color: urgencyColor } : null;

    // Owner
    const owner = document.querySelector('input[name="f-owner"]:checked').value;

    // Images gallery
    const imagesRaw = _get('f-images').trim();
    const images = imagesRaw ? imagesRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];

    // Tags
    const tags = _get('f-tags').split(',').map(s => s.trim()).filter(Boolean);

    // Preserve fields not in the form
    const existing = _editIndex >= 0 ? _catalog[_editIndex] : {};

    return {
      id,
      name,
      brand:         _get('f-brand').trim(),
      price:         parseFloat(_get('f-price')) || 0,
      originalPrice: _get('f-original-price') ? parseFloat(_get('f-original-price')) : null,
      image:         _get('f-image').trim() || (images[0] || ''),
      images:        images.length ? images : (existing.images || []),
      category:      _get('f-category'),
      filter:        _get('f-filter'),
      badges,
      description:   _get('f-description').trim(),
      specs,
      stock:         parseInt(_get('f-stock'), 10) || 0,
      unit:          _get('f-unit').trim() || 'unidad',
      tags,
      featured:      document.getElementById('f-featured').checked,
      rating:        parseFloat(_get('f-rating')) || 0,
      reviews:       parseInt(_get('f-reviews'), 10) || 0,
      urgency,
      viewing:       existing.viewing    ?? null,
      soldToday:     existing.soldToday  ?? null,
      freeShipping:  document.getElementById('f-free-shipping').checked,
      feature:       existing.feature    ?? null,
      owner,
      partnerName:   owner === 'partner' ? _get('f-partner-name').trim()   : '',
      partnerHandle: owner === 'partner' ? _get('f-partner-handle').trim() : '',
      commission:    owner === 'partner' ? parseFloat(_get('f-commission')) || 0.15 : 0,
      colors: (() => {
        const colors = [];
        document.querySelectorAll('.color-row').forEach(row => {
          const name = row.querySelector('.color-name').value.trim();
          const hex  = row.querySelector('.color-hex').value;
          if (name) colors.push({ name, hex });
        });
        return colors;
      })(),
      testimonials: (() => {
        const testimonials = [];
        document.querySelectorAll('.testimonial-row').forEach(row => {
          const name     = row.querySelector('.t-name').value.trim();
          const location = row.querySelector('.t-location').value.trim();
          const rating   = parseInt(row.querySelector('.t-rating').value) || 5;
          const text     = row.querySelector('.t-text').value.trim();
          if (name && text) testimonials.push({ name, location, rating, text });
        });
        return testimonials;
      })(),
    };
  }

  /* ════════════════════════════════════════════════════
     SAVE — GENERATE CODE
     ════════════════════════════════════════════════════ */

  function _save() {
    const nameEl = document.getElementById('f-name');
    if (!nameEl.value.trim()) { nameEl.focus(); nameEl.classList.add('ring-2', 'ring-rose-400'); return; }
    nameEl.classList.remove('ring-2', 'ring-rose-400');

    const product = _readForm();

    // Update in-memory catalog
    if (_editIndex === -1) {
      _catalog.push(product);
      _editIndex = _catalog.length - 1;
    } else {
      _catalog[_editIndex] = product;
    }

    document.getElementById('form-title').textContent = `Editando: ${product.name}`;
    _renderTable();

    // Generate code
    const singleCode  = _serializeProduct(product, 2);
    const fullArray   = `const PRODUCTS = [\n${_catalog.map(p => _serializeProduct(p, 4)).join(',\n')}\n];`;

    document.getElementById('code-single').textContent = singleCode;
    document.getElementById('code-array').textContent  = fullArray;
    document.getElementById('code-output').classList.remove('hidden');

    // Scroll output into view
    setTimeout(() => {
      document.getElementById('code-output').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  /* ════════════════════════════════════════════════════
     DELETE
     ════════════════════════════════════════════════════ */

  function _deleteProduct(index) {
    const p = _catalog[index];
    if (!confirm(`¿Eliminar "${p.name}"?\n\nRecuerda actualizar products.js con el array generado.`)) return;
    _catalog.splice(index, 1);
    if (_editIndex === index) _closeForm();
    else if (_editIndex > index) _editIndex--;
    _renderTable();
  }

  /* ════════════════════════════════════════════════════
     GLOBAL EVENTS
     ════════════════════════════════════════════════════ */

  function _bindGlobalEvents() {
    // New product button
    document.getElementById('btn-new').addEventListener('click', () => _openForm(-1));

    // Close form
    document.getElementById('btn-close-form').addEventListener('click', _closeForm);

    // Save
    document.getElementById('btn-save').addEventListener('click', _save);

    // Add spec / badge rows
    document.getElementById('btn-add-spec').addEventListener('click', () => _addSpecRow('', ''));
    document.getElementById('btn-add-badge').addEventListener('click', () => _addBadgeRow('', 'rose'));
    document.getElementById('btn-add-color').addEventListener('click', () => _addColorRow('', '#000000'));
    document.getElementById('btn-add-testimonial').addEventListener('click', () => _addTestimonialRow('', '', 5, ''));

    // Auto-generate slug from name
    document.getElementById('f-name').addEventListener('input', e => {
      const idEl = document.getElementById('f-id');
      // Only auto-fill if field is empty or was previously auto-generated
      if (_editIndex === -1 || !idEl.dataset.manual) {
        idEl.value = _slugify(e.target.value);
      }
    });
    document.getElementById('f-id').addEventListener('input', e => {
      e.target.dataset.manual = e.target.value ? '1' : '';
    });

    // Owner radio → toggle partner fields
    document.querySelectorAll('input[name="f-owner"]').forEach(radio => {
      radio.addEventListener('change', () => _togglePartnerFields(radio.value === 'partner'));
    });

    // Image file picker
    document.getElementById('f-image-file').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const suggestedPath = `assets/products/${file.name}`;
      const nameEl  = document.getElementById('f-image-filename');
      const wrapEl  = document.getElementById('f-image-preview-wrap');
      const prevEl  = document.getElementById('f-image-preview');
      const pathEl  = document.getElementById('f-image');

      nameEl.textContent = `Coloca el archivo en: ${suggestedPath}`;
      nameEl.classList.remove('hidden');

      if (!pathEl.value) pathEl.value = suggestedPath;

      // Local preview via FileReader
      const reader = new FileReader();
      reader.onload = ev => {
        prevEl.src = ev.target.result;
        wrapEl.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    });

    // Copy buttons
    document.getElementById('btn-copy-single').addEventListener('click', () => {
      _copyText(document.getElementById('code-single').textContent, document.getElementById('btn-copy-single'));
    });
    document.getElementById('btn-copy-array').addEventListener('click', () => {
      _copyText(document.getElementById('code-array').textContent, document.getElementById('btn-copy-array'));
    });
  }

  /* ════════════════════════════════════════════════════
     HELPERS
     ════════════════════════════════════════════════════ */

  function _populateCategorySelect() {
    const sel = document.getElementById('f-category');
    const cats = typeof CATEGORIES !== 'undefined' ? CATEGORIES : [];
    sel.innerHTML = cats.map(c =>
      `<option value="${c.id}">${c.emoji || ''} ${c.name}</option>`
    ).join('');
    if (!cats.length) sel.innerHTML = '<option value="">Sin categorías</option>';
  }

  function _catLabel(id) {
    if (typeof CATEGORIES === 'undefined') return id;
    const c = CATEGORIES.find(x => x.id === id);
    return c ? `${c.emoji || ''} ${c.name}` : id;
  }

  function _togglePartnerFields(show) {
    document.getElementById('partner-fields').classList.toggle('hidden', !show);
  }

  function _emptyProduct() {
    return {
      id: '', name: '', brand: '', price: '', originalPrice: null,
      image: '', images: [], category: '', filter: 'new', badges: [],
      description: '', specs: {}, stock: 0, unit: 'unidad', tags: [],
      featured: false, rating: 0, reviews: 0, urgency: null,
      viewing: null, soldToday: null, freeShipping: true, feature: null,
      owner: 'self', partnerName: '', partnerHandle: '', commission: 0,
      colors: [], testimonials: [],
    };
  }

  function _slugify(str) {
    return str.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60);
  }

  function _esc(str) {
    return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function _val(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  function _get(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }

  function _checked(id, value) {
    const el = document.getElementById(id);
    if (el) el.checked = value;
  }

  function _copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = btn.innerHTML.replace(/Copiar.*/,'✓ Copiado');
      btn.classList.add('bg-emerald-500/20', 'text-emerald-300');
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('bg-emerald-500/20', 'text-emerald-300');
      }, 2000);
    });
  }

  /* ── JS object serializer (produces clean, readable code) ── */
  function _serializeProduct(p, indent) {
    const pad  = ' '.repeat(indent);
    const pad2 = ' '.repeat(indent + 2);

    const lines = [
      `${pad}{`,
      `${pad2}id:            '${p.id}',`,
      `${pad2}name:          '${_jsStr(p.name)}',`,
      `${pad2}brand:         '${_jsStr(p.brand)}',`,
      `${pad2}price:         ${Number(p.price).toFixed(2)},`,
      `${pad2}originalPrice: ${p.originalPrice != null ? Number(p.originalPrice).toFixed(2) : 'null'},`,
      `${pad2}image:         '${_jsStr(p.image)}',`,
      `${pad2}images: [`,
      ...(p.images || []).map(img => `${pad2}  '${_jsStr(img)}',`),
      `${pad2}],`,
      `${pad2}category:      '${p.category}',`,
      `${pad2}filter:        '${p.filter}',`,
      `${pad2}badges: [`,
      ...(p.badges || []).map(b => `${pad2}  { text: '${_jsStr(b.text)}', color: '${b.color}' },`),
      `${pad2}],`,
      `${pad2}description:   '${_jsStr(p.description)}',`,
      `${pad2}specs: {`,
      ...Object.entries(p.specs || {}).map(([k, v]) => `${pad2}  '${_jsStr(k)}': '${_jsStr(v)}',`),
      `${pad2}},`,
      `${pad2}stock:        ${p.stock},`,
      `${pad2}unit:         '${p.unit || 'unidad'}',`,
      `${pad2}tags:         [${(p.tags || []).map(t => `'${_jsStr(t)}'`).join(', ')}],`,
      `${pad2}featured:     ${!!p.featured},`,
      `${pad2}rating:       ${Number(p.rating).toFixed(1)},`,
      `${pad2}reviews:      ${p.reviews || 0},`,
      `${pad2}urgency:      ${p.urgency ? `{ text: '${_jsStr(p.urgency.text)}', color: '${p.urgency.color}' }` : 'null'},`,
      `${pad2}viewing:      ${p.viewing  ?? 'null'},`,
      `${pad2}soldToday:    ${p.soldToday ?? 'null'},`,
      `${pad2}freeShipping: ${!!p.freeShipping},`,
      `${pad2}feature:      ${p.feature  ? `'${_jsStr(p.feature)}'` : 'null'},`,
      `${pad2}owner:        '${p.owner || 'self'}',`,
      `${pad2}partnerName:  '${_jsStr(p.partnerName || '')}',`,
      `${pad2}partnerHandle:'${_jsStr(p.partnerHandle || '')}',`,
      `${pad2}commission:   ${p.commission || 0},`,
      `${pad2}colors: [`,
      ...(p.colors || []).map(c => `${pad2}  { name: '${_jsStr(c.name)}', hex: '${_jsStr(c.hex)}' },`),
      `${pad2}],`,
      `${pad2}testimonials: [`,
      ...(p.testimonials || []).map(t =>
        `${pad2}  { name: '${_jsStr(t.name)}', location: '${_jsStr(t.location)}', rating: ${t.rating}, text: '${_jsStr(t.text)}' },`
      ),
      `${pad2}],`,
      `${pad}}`,
    ];
    return lines.join('\n');
  }

  function _jsStr(s) {
    return String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
  }

})();
