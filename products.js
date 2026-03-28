/* ── ShopBase — products.js ──────────────────────────────
   Product catalog data + dynamic grid/filter rendering.
   This file must be loaded (defer) BEFORE app.js so that
   .product-card and .filter-btn/.btn-add-cart/.wishlist-btn
   elements exist when app.js registers its DOMContentLoaded
   listeners.
   ─────────────────────────────────────────────────────── */

/* ════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════ */

const PRODUCTS = [
  {
    id:            'auriculares-bt',
    name:          'Auriculares Bluetooth Pro',
    brand:         'SoundTech',
    price:         89.99,
    originalPrice: 119.99,
    image:         'assets/products/product-1.jpg',
    images: [
      'assets/products/product-1.jpg',
      'assets/products/product-2.jpg',
      'assets/products/product-3.jpg',
      'assets/products/product-4.jpg',
    ],
    category:      'electronics',
    filter:        'new',
    badges:        [
      { text: 'NUEVO', color: 'brand' },
      { text: '-25%',  color: 'rose'  },
    ],
    description:   'Auriculares inalámbricos con tecnología Bluetooth 5.2, cancelación de ruido activa y hasta 30 h de batería. Diseño premium plegable con almohadillas de memory foam.',
    specs: {
      'Conectividad': 'Bluetooth 5.2',
      'Batería':      'Hasta 30 h',
      'Carga':        'USB-C, 1.5 h',
      'Controlador':  '40 mm dinámico',
      'Frecuencia':   '20 Hz – 20 kHz',
      'Peso':         '250 g',
    },
    stock:        3,
    unit:         'unidad',
    tags:         ['auriculares', 'bluetooth', 'audio', 'cancelación de ruido'],
    featured:     true,
    rating:       4.5,
    reviews:      128,
    urgency:      { text: '¡Solo quedan 3 unidades!', color: 'orange' },
    viewing:      12,
    soldToday:    null,
    freeShipping: true,
    feature:      null,
    owner:        'self',
    partnerName:  '',
    partnerHandle: '',
    commission:   0,
    colors: [
      { name: 'Negro',       hex: '#1e293b' },
      { name: 'Blanco',      hex: '#f1f5f9' },
      { name: 'Azul Marino', hex: '#1d4ed8' },
      { name: 'Verde Bosque',hex: '#166534' },
    ],
    testimonials: [
      { name: 'Andrés P.',  location: 'Madrid',    rating: 5, text: 'La cancelación de ruido es increíble. Los uso en el metro y apenas escucho nada. Sonido muy equilibrado y la batería dura exactamente lo que prometen.' },
      { name: 'Sofía R.',   location: 'Barcelona', rating: 4, text: 'Muy cómodos todo el día. El multipoint es un plus enorme para pasar del ordenador al móvil. Le quito una estrella porque el estuche es un poco pequeño.' },
      { name: 'Javier M.',  location: 'Valencia',  rating: 5, text: 'Relación calidad-precio insuperable. Los tenía en lista de deseos y cuando los vi en oferta no lo dudé. Llegaron en menos de 24 horas y el embalaje impecable.' },
    ],
  },
  {
    id:            'zapatillas-run',
    name:          'Zapatillas Running Air',
    brand:         'RunFast',
    price:         74.99,
    originalPrice: 99.99,
    image:         'assets/products/product-2.jpg',
    images: [
      'assets/products/product-2.jpg',
      'assets/products/product-3.jpg',
      'assets/products/product-4.jpg',
      'assets/products/product-5.jpg',
    ],
    category:      'clothing',
    filter:        'sale',
    badges:        [
      { text: '-25%',      color: 'rose'  },
      { text: 'TOP VENTA', color: 'amber' },
    ],
    description:   'Zapatillas de running con suela Air Max de alto impacto, parte superior transpirable y tecnología de amortiguación adaptativa. Ideales para maratones y entrenamientos diarios.',
    specs: {
      'Suela':      'Air Max rubber',
      'Parte sup.': 'Mesh transpirable',
      'Drop':       '8 mm',
      'Peso':       '280 g por pie',
      'Tallas':     '38 – 47',
      'Género':     'Unisex',
    },
    stock:        15,
    unit:         'par',
    tags:         ['zapatillas', 'running', 'deporte', 'calzado'],
    featured:     true,
    rating:       5.0,
    reviews:      312,
    urgency:      { text: '🔥 ¡Tendencia esta semana!', color: 'rose' },
    viewing:      null,
    soldToday:    230,
    freeShipping: true,
    feature:      null,
    owner:        'partner',
    partnerName:  'RunStore Oficial',
    partnerHandle: '@runstore',
    commission:   0.15,
    colors: [],
    testimonials: [
      { name: 'Carlos V.',  location: 'Sevilla',   rating: 5, text: 'Las mejores zapatillas que he tenido. Amortiguación perfecta para mis tiradas largas y no me han dado ni una rozadura.' },
      { name: 'Lucía M.',   location: 'Bilbao',    rating: 5, text: 'Talla bien, son muy ligeras y transpiran genial. Las uso tanto para correr como para el día a día.' },
    ],
  },
  {
    id:            'lampara-smart',
    name:          'Lámpara Smart LED',
    brand:         'HomeLux',
    price:         34.99,
    originalPrice: null,
    image:         'assets/products/product-3.jpg',
    images: [
      'assets/products/product-3.jpg',
      'assets/products/product-4.jpg',
      'assets/products/product-5.jpg',
      'assets/products/product-6.jpg',
    ],
    category:      'home',
    filter:        'sale',
    badges:        [
      { text: 'SMART HOME', color: 'violet' },
    ],
    description:   'Lámpara inteligente LED regulable con control por voz (Alexa y Google Home), 16 millones de colores, temporizador programable y consumo de solo 9 W.',
    specs: {
      'Protocolo':       'Wi-Fi 2.4 GHz',
      'Compatibilidad':  'Alexa, Google Home',
      'Potencia':        '9 W (equiv. 60 W)',
      'Colores':         '16 millones',
      'Vida útil':       '25.000 h',
      'Casquillo':       'E27',
    },
    stock:        42,
    unit:         'unidad',
    tags:         ['smart home', 'iluminación', 'alexa', 'led'],
    featured:     false,
    rating:       4.0,
    reviews:      54,
    urgency:      { text: '✓ Stock disponible · Llega en 24 h', color: 'slate' },
    viewing:      null,
    soldToday:    null,
    freeShipping: true,
    feature:      'Compatible Alexa',
    owner:        'self',
    partnerName:  '',
    partnerHandle: '',
    commission:   0,
    colors: [],
    testimonials: [],
  },
  {
    id:            'smartwatch-x1',
    name:          'Smartwatch X1 Series',
    brand:         'TechWear',
    price:         149.99,
    originalPrice: 199.99,
    image:         'assets/products/product-4.jpg',
    images: [
      'assets/products/product-4.jpg',
      'assets/products/product-5.jpg',
      'assets/products/product-6.jpg',
      'assets/products/product-7.jpg',
    ],
    category:      'electronics',
    filter:        'top',
    badges:        [
      { text: '⭐ TOP', color: 'amber' },
      { text: '-25%',   color: 'rose'  },
    ],
    description:   'Smartwatch con pantalla AMOLED 1.4", GPS integrado, monitoreo de frecuencia cardiaca 24/7, 100+ modos deportivos y resistencia al agua 5 ATM.',
    specs: {
      'Pantalla':       'AMOLED 1.4"',
      'GPS':            'Integrado',
      'Batería':        'Hasta 14 días',
      'Resistencia':    '5 ATM (50 m)',
      'Sensores':       'FC, SpO₂, acelerómetro',
      'Compatibilidad': 'iOS / Android',
    },
    stock:        8,
    unit:         'unidad',
    tags:         ['smartwatch', 'wearable', 'fitness', 'gps'],
    featured:     true,
    rating:       4.8,
    reviews:      207,
    urgency:      { text: '¡Solo quedan 8 unidades!', color: 'orange' },
    viewing:      8,
    soldToday:    null,
    freeShipping: true,
    feature:      null,
    owner:        'self',
    partnerName:  '',
    partnerHandle: '',
    commission:   0,
    colors: [],
    testimonials: [
      { name: 'Roberto F.',  location: 'Madrid',   rating: 5, text: 'El GPS es muy preciso y la pantalla AMOLED se ve perfecta incluso bajo el sol directo. La batería aguanta de sobra toda la semana.' },
    ],
  },
  {
    id:            'mochila-urban',
    name:          'Mochila Urban Pro 30L',
    brand:         'UrbanStyle',
    price:         59.99,
    originalPrice: 79.99,
    image:         'assets/products/product-5.jpg',
    images: [
      'assets/products/product-5.jpg',
      'assets/products/product-6.jpg',
      'assets/products/product-7.jpg',
      'assets/products/product-8.jpg',
    ],
    category:      'clothing',
    filter:        'new',
    badges:        [
      { text: 'NUEVO', color: 'brand' },
      { text: '-25%',  color: 'rose'  },
    ],
    description:   'Mochila urbana impermeable de 30 L con compartimento para portátil 15.6", carga USB integrada, espalda ergonómica ventilada y reflectivos de seguridad.',
    specs: {
      'Capacidad':   '30 L',
      'Material':    'Nylon 600D impermeable',
      'Portátil':    'Hasta 15.6"',
      'Carga USB':   'Puerto externo integrado',
      'Dimensiones': '47 × 30 × 18 cm',
      'Peso':        '0.85 kg',
    },
    stock:        20,
    unit:         'unidad',
    tags:         ['mochila', 'urban', 'portátil', 'viaje'],
    featured:     false,
    rating:       4.6,
    reviews:      89,
    urgency:      { text: '✓ Envío exprés disponible', color: 'slate' },
    viewing:      6,
    soldToday:    null,
    freeShipping: true,
    feature:      null,
    owner:        'partner',
    partnerName:  'UrbanBag Co.',
    partnerHandle: '@urbanbag',
    commission:   0.15,
    colors: [],
    testimonials: [],
  },
  {
    id:            'silla-gaming',
    name:          'Silla Gaming Pro RGB',
    brand:         'GameZone',
    price:         299.99,
    originalPrice: 399.99,
    image:         'assets/products/product-6.jpg',
    images: [
      'assets/products/product-6.jpg',
      'assets/products/product-7.jpg',
      'assets/products/product-8.jpg',
      'assets/products/product-1.jpg',
    ],
    category:      'home',
    filter:        'top',
    badges:        [
      { text: '⭐ TOP', color: 'amber' },
      { text: '-25%',   color: 'rose'  },
    ],
    description:   'Silla gaming ergonómica con retroiluminación RGB, reposacabezas ajustable, soporte lumbar, reclinación 165° y ruedas silenciosas para superficies duras.',
    specs: {
      'Cap. máx.':   '150 kg',
      'Alt. asiento': '44–52 cm ajustable',
      'Reclinación': '90°–165°',
      'Material':    'PU premium + malla',
      'Ruedas':      '60 mm PU silenciosas',
      'RGB':         '16 millones de colores',
    },
    stock:        5,
    unit:         'unidad',
    tags:         ['gaming', 'silla', 'ergonómica', 'rgb'],
    featured:     true,
    rating:       4.7,
    reviews:      156,
    urgency:      { text: '¡Solo quedan 5 unidades!', color: 'orange' },
    viewing:      15,
    soldToday:    null,
    freeShipping: true,
    feature:      null,
    owner:        'partner',
    partnerName:  'GameZone Store',
    partnerHandle: '@gamezone',
    commission:   0.15,
    colors: [],
    testimonials: [],
  },
  {
    id:            'tablet-pro',
    name:          'Tablet Pro 11" 256 GB',
    brand:         'TechPad',
    price:         349.99,
    originalPrice: 449.99,
    image:         'assets/products/product-7.jpg',
    images: [
      'assets/products/product-7.jpg',
      'assets/products/product-8.jpg',
      'assets/products/product-1.jpg',
      'assets/products/product-2.jpg',
    ],
    category:      'electronics',
    filter:        'new',
    badges:        [
      { text: 'NUEVO', color: 'brand' },
      { text: '-22%',  color: 'rose'  },
    ],
    description:   'Tablet con pantalla IPS 11" 2K 120 Hz, procesador octa-core 2.8 GHz, 8 GB RAM, 256 GB expandible, doble cámara y batería de 8.000 mAh con carga de 33 W.',
    specs: {
      'Pantalla':        '11" IPS 2K 120 Hz',
      'Procesador':      'Octa-core 2.8 GHz',
      'RAM':             '8 GB',
      'Almacenamiento':  '256 GB (expandible)',
      'Cámara':          '13 MP + frontal 8 MP',
      'Batería':         '8.000 mAh, carga 33 W',
    },
    stock:        11,
    unit:         'unidad',
    tags:         ['tablet', 'android', 'portátil', 'trabajo'],
    featured:     false,
    rating:       4.4,
    reviews:      73,
    urgency:      { text: '✓ Stock disponible · Llega mañana', color: 'slate' },
    viewing:      9,
    soldToday:    null,
    freeShipping: true,
    feature:      null,
    owner:        'self',
    partnerName:  '',
    partnerHandle: '',
    commission:   0,
    colors: [],
    testimonials: [],
  },
  {
    id:            'auriculares-nc',
    name:          'Auriculares Noise Cancel 2',
    brand:         'SoundTech',
    price:         129.99,
    originalPrice: 179.99,
    image:         'assets/products/product-8.jpg',
    images: [
      'assets/products/product-8.jpg',
      'assets/products/product-1.jpg',
      'assets/products/product-2.jpg',
      'assets/products/product-3.jpg',
    ],
    category:      'electronics',
    filter:        'sale',
    badges:        [
      { text: '-28%',  color: 'rose'  },
      { text: 'HI-FI', color: 'brand' },
    ],
    description:   'Auriculares over-ear de alta fidelidad con ANC de última generación, 40 h de batería, micrófono beam-forming para llamadas y app con ecualizador personalizable.',
    specs: {
      'ANC':        'Activo (40 dB)',
      'Batería':    '40 h (ANC off: 50 h)',
      'Carga':      'USB-C, 1 h carga rápida',
      'Controlador':'40 mm neodimio',
      'Respuesta':  '4 Hz – 40 kHz',
      'App':        'iOS / Android',
    },
    stock:        18,
    unit:         'unidad',
    tags:         ['auriculares', 'noise cancelling', 'hi-fi', 'premium'],
    featured:     false,
    rating:       4.9,
    reviews:      445,
    urgency:      { text: '🔥 Más de 100 vendidos este mes', color: 'rose' },
    viewing:      null,
    soldToday:    180,
    freeShipping: true,
    feature:      null,
    owner:        'self',
    partnerName:  '',
    partnerHandle: '',
    commission:   0,
    colors: [],
    testimonials: [],
  },
];

/* ════════════════════════════════════════════════════════
   CONFIG
   ════════════════════════════════════════════════════════ */

/** Human-readable labels for each filter value. */
const FILTER_LABELS = {
  all:  'Todos',
  new:  'Nuevos',
  sale: 'Oferta',
  top:  'Más vendidos',
};

/** Tailwind bg-color classes per badge color key. */
const _BADGE_BG = {
  brand:   'bg-brand-600',
  rose:    'bg-rose-500',
  amber:   'bg-amber-500',
  violet:  'bg-violet-600',
  emerald: 'bg-emerald-500',
  slate:   'bg-slate-500',
};

/** Tailwind text-color classes per urgency color key. */
const _URGENCY_TEXT = {
  orange: 'text-orange-600',
  rose:   'text-rose-600',
  slate:  'text-slate-500',
};

/* ════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════ */

function _stars(rating) {
  const filled = Math.round(rating);
  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}

/** Inline SVGs reused in card templates. */
const _SVG = {
  cart: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="transition-transform group-hover/btn:-rotate-12"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,

  eye:  `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,

  heart: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,

  truck: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,

  users: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,

  info: `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
};

/* ════════════════════════════════════════════════════════
   CARD TEMPLATE
   ════════════════════════════════════════════════════════ */

function _cardHtml(p, index) {
  const savings     = p.originalPrice ? (p.originalPrice - p.price).toFixed(2) : null;
  const stars       = _stars(p.rating);
  const fallback    = `https://picsum.photos/300/300?random=${index + 2}`;

  /* Partner badge */
  const partnerHtml = p.owner === 'partner'
    ? `<p class="text-[10px] text-slate-400 flex items-center gap-1 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Vendido por <span class="font-semibold text-slate-500">${p.partnerName}</span>
                </p>`
    : '';

  /* Badges — replaced by AGOTADO when stock === 0 */
  const badgesHtml = p.stock === 0
    ? `<span class="bg-slate-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm leading-5">AGOTADO</span>`
    : p.badges.map(b =>
        `<span class="${_BADGE_BG[b.color] || 'bg-slate-600'} text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm leading-5">${b.text}</span>`
      ).join('\n                  ');

  /* Social proof chip (4th element in rating row — QV reads children[1] and [2] only) */
  let socialProofHtml = '';
  if (p.viewing) {
    socialProofHtml = `<span class="ml-auto text-[10px] text-slate-400 flex items-center gap-0.5">${_SVG.users} ${p.viewing} viendo</span>`;
  } else if (p.soldToday) {
    socialProofHtml = `<span class="ml-auto text-[10px] text-emerald-600 font-semibold">${p.soldToday} hoy</span>`;
  }

  /* Price row */
  const origHtml    = p.originalPrice
    ? `<span class="text-sm text-slate-400 line-through">$${p.originalPrice.toFixed(2)}</span>`
    : '';

  /* Savings + shipping + feature pills */
  const savingsHtml = savings
    ? `<span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">Ahorras $${savings}</span>`
    : '';

  const shippingHtml = p.freeShipping
    ? `<span class="text-[11px] text-slate-500 flex items-center gap-0.5">${_SVG.truck} Envío gratis</span>`
    : '';

  const featureHtml = p.feature
    ? `<span class="text-[11px] text-violet-600 font-semibold bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-md">${p.feature}</span>`
    : '';

  /* Urgency line */
  let urgencyHtml = '';
  if (p.urgency) {
    const icon = p.urgency.color === 'orange' ? _SVG.info : '';
    urgencyHtml = `
              <p class="text-[11px] font-semibold ${_URGENCY_TEXT[p.urgency.color] || 'text-slate-500'} flex items-center gap-1 mb-3">
                ${icon}${p.urgency.text}
              </p>`;
  }

  return `
          <li class="product-card" data-id="${p.id}" data-category="${p.category}" data-filter="${p.filter}">
            <article class="group relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-brand-200">

              <!-- Imagen -->
              <div class="relative bg-slate-50 aspect-square overflow-hidden">
                <a href="producto.html?id=${p.id}" tabindex="-1">
                  <img src="${p.image}" alt="${p.name}"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width="300" height="300" loading="lazy"
                    onerror="this.onerror=null;this.src='${fallback}'" />
                </a>

                <!-- Overlay vista rápida -->
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none group-hover:pointer-events-auto">
                  <button class="quick-view-btn bg-white text-slate-900 text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg translate-y-3 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5 hover:bg-brand-600 hover:text-white">
                    ${_SVG.eye}
                    Vista rápida
                  </button>
                </div>

                <!-- Badges -->
                <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                  ${badgesHtml}
                </div>

                <!-- Wishlist -->
                <button class="wishlist-btn absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-slate-300 hover:text-rose-500 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Agregar a favoritos">
                  ${_SVG.heart}
                </button>
              </div>

              <!-- Info -->
              <div class="p-4 flex flex-col flex-1">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">${p.brand}</p>
                ${partnerHtml}<h3 class="text-sm font-semibold text-slate-800 mb-2 leading-snug">
                  <a href="producto.html?id=${p.id}" class="hover:text-brand-600 transition-colors">${p.name}</a>
                </h3>

                <!-- Rating + social proof -->
                <div class="flex items-center gap-1.5 mb-3">
                  <span class="stars text-xs" aria-hidden="true">${stars}</span>
                  <span class="text-xs font-medium text-slate-600">${p.rating.toFixed(1)}</span>
                  <span class="text-xs text-slate-400">(${p.reviews})</span>
                  ${socialProofHtml}
                </div>

                <!-- Precio -->
                <div class="flex items-baseline gap-2 mb-1">
                  <span class="text-xl font-black text-slate-900">$${p.price.toFixed(2)}</span>
                  ${origHtml}
                </div>
                <div class="flex items-center gap-2 mb-3">
                  ${savingsHtml}
                  ${shippingHtml}
                  ${featureHtml}
                </div>
                ${urgencyHtml}

                <!-- CTA principal -->
                <button class="btn-add-cart group/btn mt-auto w-full ${p.stock === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white hover:shadow-lg hover:shadow-brand-600/30'} text-sm font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                  type="button" aria-label="Agregar ${p.name} al carrito"${p.stock === 0 ? ' disabled' : ''}>
                  ${p.stock === 0 ? '' : _SVG.cart}
                  ${p.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                </button>

                <!-- CTA secundario -->
                <a href="producto.html?id=${p.id}" class="mt-2 text-center text-xs text-slate-400 hover:text-brand-600 transition-colors">Ver detalles →</a>
              </div>

            </article>
          </li>`;
}

/* ════════════════════════════════════════════════════════
   RENDER
   Runs in DOMContentLoaded (deferred script, fires before
   app.js's DOMContentLoaded because products.js is listed
   first in the HTML).
   ════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Filter buttons ─────────────────────────────────── */
  const filtersBar = document.getElementById('filters-bar');
  if (filtersBar) {
    // Derive unique filter values from PRODUCTS, preserving declaration order
    const seen    = new Set();
    const filters = ['all'];
    PRODUCTS.forEach(p => { if (!seen.has(p.filter)) { seen.add(p.filter); filters.push(p.filter); } });

    filtersBar.innerHTML = filters.map((f, i) => {
      const active   = i === 0;
      const label    = FILTER_LABELS[f] || (f.charAt(0).toUpperCase() + f.slice(1));
      const baseCs   = 'filter-btn px-4 py-2 rounded-xl text-sm transition-colors';
      const activeCs = 'bg-brand-600 text-white shadow-sm font-semibold';
      const inactCs  = 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium';
      return `<button class="${baseCs} ${active ? activeCs : inactCs}" data-filter="${f}">${label}</button>`;
    }).join('');
  }

  /* ── Product grid ───────────────────────────────────── */
  const grid = document.getElementById('products-grid');
  if (grid) {
    grid.innerHTML = PRODUCTS.map((p, i) => _cardHtml(p, i)).join('');
  }
});
