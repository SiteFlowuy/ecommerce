# ShopBase — Tienda de importación personal

Sitio e-commerce estático (HTML + Tailwind CDN + Vanilla JS) con backend Node/Express para pagos via Stripe. Sin frameworks, sin build step, sin base de datos. Todo el catálogo vive en `products.js`; la configuración de marca en `config.js`.

---

## 1. Estructura del proyecto

```
ecommerce/
│
├── index.html          # Página principal — hero, categorías, grilla de productos, about, newsletter
├── producto.html       # Página de detalle de producto (lee ?id= de la URL)
├── categoria.html      # Grilla filtrada por categoría (lee ?cat= de la URL)
├── carrito.html        # Carrito de compras con cupones
├── checkout.html       # Proceso de pago en 3 pasos (envío → Stripe → confirmación)
├── confirmacion.html   # Página de confirmación de pedido (lee localStorage)
├── favoritos.html      # Lista de productos guardados (wishlist en localStorage)
├── admin.html          # Editor visual del catálogo — genera código JS para copiar en products.js
│
├── config.js           # ★ FUENTE DE VERDAD DE MARCA — nombre, dominio, cupones, redes, about
├── products.js         # Catálogo PRODUCTS[] + función _cardHtml() + render de la grilla
├── categories.js       # Catálogo CATEGORIES[] + render de la sección de categorías
├── app.js              # Módulos: carrito, cupones, órdenes, wishlist, filtros, búsqueda, checkout
├── components.js       # injectHeader() + injectFooter() — header/footer compartido entre páginas
├── producto-init.js    # Inicializa producto.html: lee ?id=, puebla DOM, SEO, schema.org
├── categoria-init.js   # Inicializa categoria.html: lee ?cat=, puebla DOM, SEO, schema.org
├── admin.js            # Lógica del editor de catálogo (admin.html)
│
├── style.css           # Estilos globales mínimos (Tailwind maneja el 95% via CDN)
│
├── assets/
│   ├── products/       # Imágenes de productos (product-1.jpg … product-N.jpg)
│   ├── hero.jpg        # Imagen del hero de la página principal
│   ├── offer-banner.jpg# Banner de la sección de ofertas
│   └── og-home.jpg     # Open Graph image (1200×630) para compartir en redes sociales
│
├── backend/
│   ├── server.js       # API Express: POST /create-payment-intent (Stripe)
│   ├── package.json    # Dependencias del backend (express, stripe, cors, dotenv)
│   └── .env.example    # Variables de entorno requeridas — copiar a .env y completar
│
└── scripts/
    └── download-placeholders.js   # Utilidad para descargar imágenes placeholder de desarrollo
```

---

## 2. Cómo agregar un producto

Abrí `products.js` y agregá un objeto al array `PRODUCTS`. Podés usar `admin.html` para generar el código visualmente y luego pegarlo.

```js
{
  // ── Identificación ─────────────────────────────────────────────
  id:            'nombre-del-producto',   // Slug único, solo minúsculas y guiones. Se usa en la URL (?id=)
  name:          'Nombre del Producto',   // Nombre visible en la tienda
  brand:         'MarcaEjemplo',          // Marca o fabricante
  unit:          'unidad',                // 'unidad' | 'par' | 'kit' | lo que corresponda

  // ── Precios ────────────────────────────────────────────────────
  price:         49.99,                   // Precio de venta actual (número, en USD)
  originalPrice: 69.99,                   // Precio tachado. null si no hay descuento

  // ── Imágenes ───────────────────────────────────────────────────
  image:         'assets/products/product-9.jpg',   // Imagen principal de la card
  images: [                                          // Galería completa (mínimo 1)
    'assets/products/product-9.jpg',
    'assets/products/product-10.jpg',
  ],

  // ── Clasificación ──────────────────────────────────────────────
  category:      'electronics',           // Debe coincidir con un id de CATEGORIES
  filter:        'new',                   // 'new' | 'sale' | 'top'

  // ── Badges sobre la imagen ─────────────────────────────────────
  badges: [
    { text: 'NUEVO', color: 'brand'  },   // color: 'brand'|'rose'|'amber'|'violet'|'emerald'|'slate'
    { text: '-28%',  color: 'rose'   },
  ],

  // ── Contenido ──────────────────────────────────────────────────
  description:   'Descripción larga del producto que aparece en la página de detalle.',
  specs: {
    'Conectividad': 'Bluetooth 5.2',
    'Batería':      '30 h',
    // Tantos pares clave-valor como necesites
  },

  // ── Inventario ─────────────────────────────────────────────────
  stock:         25,                      // Unidades disponibles. 0 = "Sin stock" (botón deshabilitado)

  // ── Metadata ───────────────────────────────────────────────────
  tags:          ['auriculares', 'bluetooth', 'audio'],   // Para búsqueda y SEO interno
  featured:      false,                   // true → aparece en sección destacados
  freeShipping:  true,                    // Muestra "Envío gratis" en la card
  feature:       null,                    // String corto extra. Ej: 'Compatible Alexa'. null = oculto

  // ── Rating ─────────────────────────────────────────────────────
  rating:        4.3,                     // 0.0 – 5.0
  reviews:       87,                      // Cantidad de reseñas (número visible)

  // ── Urgencia (fila bajo el precio) ─────────────────────────────
  urgency: { text: '¡Solo quedan 5 unidades!', color: 'orange' },
  // color: 'orange' | 'rose' | 'slate'  |  null si no querés mostrar urgencia

  // ── Prueba social ──────────────────────────────────────────────
  viewing:       null,                    // Número: "X viendo ahora". null = oculto
  soldToday:     null,                    // Número: "X vendidos hoy". null = oculto

  // ── Vendedor ───────────────────────────────────────────────────
  owner:         'self',                  // 'self' = tienda propia | 'partner' = vendedor externo
  partnerName:   '',                      // Nombre del partner. Solo se muestra si owner === 'partner'
  partnerHandle: '',                      // Handle/usuario del partner (para referencia interna)
  commission:    0,                       // Comisión decimal: 0.15 = 15%. Solo relevante si owner === 'partner'

  // ── Colores disponibles ────────────────────────────────────────
  colors: [
    { name: 'Negro', hex: '#1e293b' },
    { name: 'Blanco', hex: '#f1f5f9' },
  ],
  // [] = sin selector de color (la sección se oculta automáticamente)

  // ── Reseñas de clientes ────────────────────────────────────────
  testimonials: [
    { name: 'Carlos V.', location: 'Buenos Aires', rating: 5, text: 'Excelente producto, llegó rápido.' },
  ],
  // [] = muestra "Sé el primero en reseñar este producto"
},
```

**Orden de campos:** el orden no importa, pero mantener el mismo por consistencia visual en el archivo.

---

## 3. Cómo agregar una categoría

Abrí `categories.js` y agregá un objeto al array `CATEGORIES`:

```js
{
  id:          'sports',                // Slug único. Los productos usan este valor en su campo category
  name:        'Deportes',             // Nombre visible en la UI
  emoji:       '⚽',                   // Emoji que aparece en la card de categoría y en el breadcrumb
  description: 'Equipamiento y ropa deportiva para todos los niveles.',
  color:       'emerald',              // Usado para tematizar la card: 'blue'|'pink'|'amber'|'emerald'|'violet'|'orange'
},
```

Una vez agregada la categoría, asegurate de que al menos un producto tenga `category: 'sports'`. La sección de categorías en `index.html` solo muestra las que tienen 1 o más productos.

---

## 4. Cómo configurar la marca

Antes de publicar, editá `config.js`. Estos son los campos que **sí o sí** hay que cambiar:

```js
const SITE_CONFIG = {
  name:        'NombreDeTuTienda',           // Aparece en el logo, título, footer, emails
  tagline:     'Tu propuesta de valor corta',
  description: 'Descripción para SEO y footer.',
  domain:      'https://tudominio.com',       // URL base real — usada en meta tags y schema.org

  currencySymbol: '$',                        // Cambiar a '€', 'S/', etc. según moneda

  freeShippingThreshold: 50,                  // Mínimo para envío gratis (en la moneda configurada)

  couponCode:     'PRIMERPEDIDO',             // Código que aparece en el announcement bar
  couponDiscount: 0.10,                       // 0.10 = 10%

  social: {
    instagram: 'https://instagram.com/TUUSUARIO',
    twitter:   'https://twitter.com/TUUSUARIO',
    facebook:  'https://facebook.com/TUPAGINA',
  },

  contact: {
    email: 'hola@tudominio.com',              // Se usa en el botón "Quiero ser partner"
    phone: '+54 11 0000-0000',
  },

  about: {
    headline: 'Tu headline de propuesta de valor',
    subtitle:  'Subtítulo explicativo de 1-2 oraciones.',
    // values[] y partnerCTA: editar textos a gusto
  },
};

const COUPONS = [
  { code: 'PRIMERPEDIDO', discount: 0.10, type: 'percent', minOrder: 0,  active: true },
  { code: 'ENVIOGRATIS',  discount: 0,    type: 'shipping', minOrder: 20, active: true },
  // Agregar o desactivar cupones aquí (active: false para desactivar sin borrar)
];
```

---

## 5. Cómo correr el backend

El backend solo es necesario para procesar pagos reales con Stripe. Para desarrollo local sin pagos, el frontend funciona solo.

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tu STRIPE_SECRET_KEY real o de pruebas
node server.js
# Servidor corriendo en http://localhost:3001
```

Variables en `.env`:

| Variable            | Descripción                                         |
|---------------------|-----------------------------------------------------|
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe (`sk_test_...` o `sk_live_...`) |
| `PORT`              | Puerto del servidor. Default: `3001`                |
| `FRONTEND_URL`      | URL del frontend para CORS. Ej: `http://localhost:5500` |

En `checkout.html`, la clave pública de Stripe se configura en el `<head>`:
```html
<meta name="stripe-pk" content="pk_test_REEMPLAZA_CON_TU_CLAVE_PUBLICA" />
```

**Tarjetas de prueba Stripe:**
| Número              | Resultado         |
|---------------------|-------------------|
| `4242 4242 4242 4242` | Pago exitoso      |
| `4000 0000 0000 9995` | Fondos insuficientes |
| `4000 0025 0000 3155` | Requiere 3D Secure |

Fecha: cualquier fecha futura. CVC: cualquier 3 dígitos.

---

## 6. Checklist de lanzamiento

### Marca y contenido

- [ ] Cambiar `SITE_CONFIG.name`, `domain`, `contact.email` en `config.js`
- [ ] Cambiar `SITE_CONFIG.social` con las cuentas reales (Instagram, Twitter, Facebook)
- [ ] Cambiar `SITE_CONFIG.about.headline` y `subtitle` con la propuesta de valor real
- [ ] Reemplazar el `couponCode` de ejemplo por uno propio y ajustar `couponDiscount`
- [ ] Reemplazar los 8 productos de ejemplo por el catálogo real en `products.js`
- [ ] Agregar las categorías reales en `categories.js`

### Assets e imágenes

- [ ] Reemplazar todas las imágenes en `assets/products/` por fotos reales de los productos
- [ ] Crear `assets/hero.jpg` (imagen de fondo del hero — sugerido: 1920×800px)
- [ ] Crear `assets/offer-banner.jpg` (banner de la sección de ofertas)
- [ ] Crear `assets/og-home.jpg` (1200×630px) para Open Graph de redes sociales

### SEO y metadatos

- [ ] Cambiar la URL canónica base de `shopbase.ejemplo.com` al dominio real en todos los HTML
- [ ] Actualizar `<title>`, `<meta name="description">` y Open Graph en cada página
- [ ] Verificar que `schema.org` JSON-LD en `producto.html` usa el dominio real (via `SITE_CONFIG.domain`)

### Pagos

- [ ] Configurar `STRIPE_SECRET_KEY` real en `backend/.env`
- [ ] Reemplazar `pk_test_REEMPLAZA_CON_TU_CLAVE_PUBLICA` en `checkout.html` por la clave pública real
- [ ] Probar un pago completo con tarjeta `4242 4242 4242 4242` antes de publicar
- [ ] Verificar que el webhook de Stripe (si se usa) apunta a la URL correcta del backend

### Infraestructura

- [ ] Configurar dominio y hosting:
  - **Frontend:** [Netlify](https://netlify.com) (arrastrá la carpeta `ecommerce/` al dashboard) o GitHub Pages
  - **Backend:** [Railway](https://railway.app) o [Render](https://render.com) — conectá el repo y configurá las env vars
- [ ] Activar HTTPS en el dominio (Netlify y Railway lo hacen automáticamente)
- [ ] Configurar variable `FRONTEND_URL` en el backend con la URL real del frontend (para CORS)
- [ ] Verificar que el `BACKEND_URL` en `checkout.html` apunte al backend en producción

### Prueba final

- [ ] Abrir el sitio en modo incógnito y navegar el flujo completo: inicio → producto → carrito → checkout
- [ ] Verificar que el carrito persiste al recargar
- [ ] Probar un cupón válido y verificar que descuenta del total
- [ ] Completar un pago de prueba y verificar que llega al paso 3 con el número de pedido correcto
- [ ] Abrir `favoritos.html` y verificar que los corazones persisten entre páginas
- [ ] Revisar el sitio en móvil (Chrome DevTools → viewport 375px)
- [ ] Verificar Open Graph usando [opengraph.xyz](https://opengraph.xyz) con la URL real

---

## 7. Modelo de partners

El sistema soporta dos tipos de vendedor por producto, controlado por el campo `owner` en cada objeto de `PRODUCTS`:

### `owner: 'self'`

Producto propio de la tienda. No muestra badge de vendedor. `partnerName`, `partnerHandle` y `commission` se dejan vacíos/0.

### `owner: 'partner'`

Producto publicado por un importador externo. Muestra "Vendido por [partnerName]" en la card y en la página de detalle.

```js
owner:         'partner',
partnerName:   'RunStore Oficial',    // Nombre visible en la card
partnerHandle: '@runstore',           // Referencia interna (no se muestra al cliente por ahora)
commission:    0.15,                  // 15% de comisión sobre el precio de venta
```

### Cómo funciona la comisión

La comisión es un campo **informativo** en este momento — la plataforma no la deduce automáticamente. Cuando se recibe un pago, la lógica de distribución es:

```
Monto recibido por la tienda = precio × (1 − commission)
Monto a transferir al partner = precio × commission
```

**Ejemplo:** producto a $100 con `commission: 0.15` → la tienda retiene $85, transfiere $15 al partner.

Para automatizar la distribución, Stripe ofrece [Connect](https://stripe.com/connect), que permite transferencias automáticas a cuentas de terceros al confirmar el pago. La integración básica requiere:

1. Crear una cuenta Stripe Connect para cada partner
2. Al crear el `PaymentIntent`, agregar `transfer_data: { destination: partner.stripeAccountId, amount: commissionCents }`
3. Stripe se encarga de la transferencia en el momento del cobro

Mientras no se integre Connect, llevar el registro de comisiones manualmente exportando los pagos del dashboard de Stripe y cruzando con el campo `partnerName` de cada pedido.

### Agregar un nuevo partner

1. Decidir el nombre comercial y handle del importador
2. En `products.js`, agregar sus productos con `owner: 'partner'` y los datos correspondientes
3. (Opcional) cuando se integre Stripe Connect, agregar un campo `stripeAccountId` al objeto del producto o a un registro separado de partners

---

## Desarrollo local

No se requiere servidor para el frontend. Abrí `index.html` directamente en el navegador, o usá una extensión como **Live Server** (VS Code) para evitar problemas de CORS con imágenes locales.

```
# Con Live Server (VS Code)
Click derecho en index.html → "Open with Live Server"
# O con Python
python -m http.server 5500
```

El backend de pagos corre por separado en el puerto `3001` (ver sección 5).
