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

const COUPONS = [
  { code: 'BIENVENIDO10', discount: 0.10, type: 'percent',  minOrder: 0,  active: true },
  { code: 'ENVIOGRATIS',  discount: 0,    type: 'shipping', minOrder: 20, active: true },
];
