/* ── ShopBase — config.js ─────────────────────────────────
   Single source of truth for brand identity and site-wide
   settings. Load this as the FIRST script on every page
   (before products.js, components.js, app.js, etc.) so all
   other files can safely read SITE_CONFIG at any point.
   ─────────────────────────────────────────────────────── */

const SITE_CONFIG = {
  name:        'ShopBase',
  tagline:     'Tu tienda de confianza',
  description: 'Los mejores precios y envío gratis.',
  domain:      'https://shopbase.ejemplo.com',
  ogImage:     '/assets/og-home.jpg',

  currency:       'USD',
  currencySymbol: '$',

  freeShippingThreshold: 50,

  couponCode:     'BIENVENIDO10',
  couponDiscount: 0.10,

  social: {
    instagram: 'https://instagram.com',
    twitter:   'https://twitter.com',
    facebook:  'https://facebook.com',
  },

  contact: {
    email: 'hola@shopbase.com',
    phone: '',
  },

  commission: {
    default: 0.15,
  },

  productsPerPage: 8,

  filterLabels: {
    all:  'Todos',
    new:  'Nuevos',
    sale: 'Oferta',
    top:  'Más vendidos',
  },

  badgeColors: {
    brand:   'bg-brand-600',
    rose:    'bg-rose-500',
    amber:   'bg-amber-500',
    violet:  'bg-violet-600',
    emerald: 'bg-emerald-500',
    slate:   'bg-slate-500',
  },

  urgencyColors: {
    orange: 'text-orange-600',
    rose:   'text-rose-600',
    slate:  'text-slate-500',
  },

  about: {
    headline: 'Importamos lo que el mercado no te ofrece',
    subtitle:  'Trabajamos con importadores especializados para traerte productos de calidad real, sin intermediarios que inflen el precio.',
    values: [
      {
        icon:        'check',
        title:       'Selección cuidada',
        description: 'Cada producto que publicamos pasa por una revisión interna. Si no cumple el estándar de calidad, no entra al catálogo.',
      },
      {
        icon:        'partners',
        title:       'Red de partners',
        description: 'Trabajamos con importadores especializados por rubro, no con un único proveedor. Eso nos da mejores precios y mayor diversidad.',
      },
      {
        icon:        'price',
        title:       'Precio justo',
        description: 'Sin intermediarios innecesarios. El margen que ahorramos en la cadena de distribución lo trasladamos directo al precio final.',
      },
    ],
    partnerCTA: {
      heading:     '¿Sos importador o tenés stock para vender?',
      description: 'Si tenés productos con potencial y querés llegar a más clientes, podemos publicarlos en nuestra plataforma con visibilidad inmediata.',
      buttonText:  'Quiero ser partner',
      emailSubject: 'Quiero ser partner en ShopBase',
    },
  },
};

const PAGE_DESCRIPTIONS = {
  home:         `${SITE_CONFIG.name} — Los mejores precios, envío gratis y devolución en 30 días.`,
  cart:         `Tu carrito de compras en ${SITE_CONFIG.name}. Revisá tus productos y completá tu pedido.`,
  favorites:    `Tus productos guardados en ${SITE_CONFIG.name}.`,
  checkout:     `Completá tu compra de forma segura en ${SITE_CONFIG.name}. Ingresá tus datos de envío en pocos pasos.`,
  confirmation: `Tu pedido en ${SITE_CONFIG.name} fue confirmado. Revisá el resumen y los detalles de entrega.`,
};

const COUPONS = [
  { code: 'BIENVENIDO10', discount: 0.10, type: 'percent',  minOrder: 0,  active: true },
  { code: 'ENVIOGRATIS',  discount: 0,    type: 'shipping', minOrder: 20, active: true },
];
