# MANUAL DE USO — ShopBase

> Guía completa para el dueño del negocio. No se requieren conocimientos de programación para las tareas del día a día.

---

## 1. Introducción

**ShopBase** es una tienda online lista para usar. Tiene todo lo necesario para mostrar productos, recibir pedidos y ofrecer una experiencia de compra profesional a tus clientes: página de inicio con categorías y productos destacados, ficha de detalle por producto, carrito de compras con cupones de descuento, proceso de checkout paso a paso y página de confirmación de pedido.

El sitio está construido de forma que la mayoría de los cambios del día a día —actualizar precios, agregar productos, cambiar el nombre de la tienda— los podés hacer vos mismo sin necesidad de llamar a un programador.

### Lo que podés hacer sin saber programar

- Cambiar el nombre, slogan, redes sociales y datos de contacto de la tienda editando el archivo `config.js`
- Agregar, editar y eliminar productos usando la herramienta visual `admin.html`
- Cambiar los cupones de descuento (código, porcentaje, condiciones)
- Agregar imágenes de productos, banner y foto de portada copiando archivos a la carpeta `assets/`
- Activar o desactivar categorías editando `categories.js`

### Lo que necesitás pedirle a un desarrollador

- **Activar los pagos reales con Stripe**: requiere crear una cuenta Stripe, configurar claves secretas y poner en marcha el servidor backend incluido en la carpeta `backend/`
- **Publicar el sitio en internet**: subir los archivos a un servicio de hosting (Netlify, GitHub Pages) y conectar el backend (Railway, Render)
- **Configurar un dominio propio**: por ejemplo, `www.mitienda.com`
- **Automatizar la distribución de comisiones** a partners mediante Stripe Connect

---

## 2. Archivos importantes

Estos son los archivos que más vas a usar. No necesitás tocar los demás para operar la tienda normalmente.

| Archivo | Para qué sirve |
|---|---|
| `config.js` | El "cerebro" de la tienda. Acá se define el nombre del negocio, el dominio, el símbolo de moneda, el umbral de envío gratis, los cupones de descuento, los links de redes sociales y los textos de la sección "Sobre nosotros". Todos los demás archivos leen los datos de aquí. |
| `products.js` | El catálogo completo de productos. Contiene todos los datos de cada artículo: nombre, precio, imágenes, descripción, stock, etc. Lo más práctico es editarlo usando `admin.html`, pero también se puede editar directamente. |
| `categories.js` | Define las secciones de la tienda (Electrónica, Ropa, Hogar, etc.). Si un producto no tiene una categoría válida, no aparece en los filtros. Si una categoría no tiene productos asignados, no se muestra en la página de inicio. |
| `assets/` | Carpeta de imágenes. Dentro tiene subcarpetas y archivos con roles específicos (ver sección 6). |

### Subcarpetas y archivos de `assets/`

| Ruta | Contenido |
|---|---|
| `assets/products/` | Imágenes de los productos (ej: `product-1.jpg`, `product-2.jpg`, etc.) |
| `assets/hero.jpg` | Imagen de fondo grande de la página de inicio |
| `assets/offer-banner.jpg` | Imagen del banner de la sección de ofertas |
| `assets/og-home.jpg` | Imagen que aparece cuando alguien comparte el link de la tienda en WhatsApp, Instagram, etc. |

---

## 3. Cómo configurar la tienda por primera vez

Antes de publicar el sitio, hay que editar el archivo `config.js` para reemplazar los datos de ejemplo con los datos reales de tu negocio. Este archivo se puede abrir con cualquier editor de texto (el Bloc de Notas funciona, pero se recomienda Visual Studio Code para una mejor experiencia).

### Tabla de campos a configurar

| Campo | Qué hace | Ejemplo | Consecuencia si no se cambia |
|---|---|---|---|
| `name` | Nombre de la tienda. Aparece en el logo, título de las pestañas del navegador, footer y correos. | `'Mi Tienda'` | Aparece "ShopBase" en todos lados |
| `domain` | Dirección web completa de la tienda. Se usa en los metadatos para SEO y redes sociales. | `'https://mitienda.com'` | Google indexa con la URL de ejemplo; los links de redes no funcionan bien |
| `tagline` | Frase corta que resume la propuesta de valor. Aparece debajo del nombre en algunos lugares. | `'Los mejores precios, directo al cliente'` | Aparece el texto de ejemplo |
| `description` | Descripción breve del negocio. La usan los buscadores para el snippet de búsqueda. | `'Importamos tecnología y moda con precios directos.'` | Google usa el texto genérico de ejemplo |
| `currencySymbol` | Símbolo de moneda que se muestra en todos los precios. | `'$'`, `'€'`, `'S/'` | Si no se cambia, muestra `$` (puede no corresponder) |
| `freeShippingThreshold` | Monto mínimo de compra para que el envío sea gratis (en la moneda configurada). | `50` | El banner de envío gratis mostrará el monto de ejemplo |
| `couponCode` | Código del cupón de bienvenida que aparece en la barra de anuncio superior. | `'BIENVENIDO10'` | Los clientes ven el código de ejemplo |
| `couponDiscount` | Descuento del cupón principal expresado como decimal (`0.10` = 10%). | `0.10` | El descuento puede no corresponder al prometido |
| `social.instagram` | Link completo al perfil de Instagram de la tienda. | `'https://instagram.com/mitienda'` | El botón de Instagram lleva al perfil de ejemplo |
| `social.twitter` | Link completo al perfil de Twitter/X. | `'https://twitter.com/mitienda'` | El botón de Twitter lleva al perfil de ejemplo |
| `social.facebook` | Link completo a la página de Facebook. | `'https://facebook.com/mitienda'` | El botón de Facebook lleva a la página de ejemplo |
| `contact.email` | Correo electrónico de contacto del negocio. | `'hola@mitienda.com'` | El botón "Quiero ser partner" envía al mail de ejemplo |
| `about.headline` | Título grande de la sección "Sobre nosotros" en la página de inicio. | `'Importamos lo que el mercado no te ofrece'` | Aparece el texto de ejemplo |
| `about.subtitle` | Párrafo explicativo debajo del título de "Sobre nosotros". | `'Trabajamos directo con importadores para darte el mejor precio.'` | Aparece el texto de ejemplo |

### Cómo editar config.js paso a paso

1. Abrí el archivo `config.js` con Visual Studio Code (o el Bloc de Notas)
2. Buscá el campo que querés cambiar. Por ejemplo, para cambiar el nombre:
   ```
   name: 'ShopBase',
   ```
3. Reemplazá el texto entre comillas con el tuyo:
   ```
   name: 'Mi Tienda',
   ```
4. Guardá el archivo con Ctrl+S
5. Recargá el navegador para ver los cambios

⚠️ **Atención:** No borres las comillas ni los dos puntos. El formato exacto es importante. Si algo deja de funcionar después de editar, revisá que no hayas borrado algún símbolo.

💡 **Tip:** Hacé los cambios de a uno y verificá en el navegador antes de seguir con el siguiente.

---

## 4. Cómo gestionar el catálogo de productos

### 4a. Usando el Admin visual (admin.html)

El admin es una herramienta visual incluida en el proyecto que te permite crear y editar productos sin tocar código. Es la forma recomendada para gestionar el catálogo.

#### Cómo abrir el admin

1. En Visual Studio Code, instalá la extensión **Live Server** (si no la tenés, buscala en la pestaña de Extensiones)
2. Hacé clic derecho sobre el archivo `admin.html`
3. Seleccioná **"Open with Live Server"**
4. Se abre el admin en el navegador. Vas a ver la tabla con todos los productos cargados desde `products.js`

⚠️ **Atención:** El admin **no guarda cambios automáticamente**. Solo genera el código que luego vos tenés que copiar y pegar en `products.js`. Este es el paso más importante y el que más fácil es olvidar.

#### Cómo crear un producto nuevo

1. Hacé clic en el botón **"Nuevo producto"** (arriba a la derecha)
2. Se abre un panel lateral con el formulario
3. Completá todos los campos obligatorios: Nombre, Marca, Precio, Categoría, Imagen principal
4. Completá los campos opcionales que correspondan: descripción, specs, colores, etc.
5. Hacé clic en **"Guardar y generar código"**
6. Aparece un bloque de código en pantalla. **Copialo completo** (Ctrl+A dentro del área de código, luego Ctrl+C)
7. Abrí el archivo `products.js`
8. Dentro del array `PRODUCTS = [ ... ]`, pegá el objeto nuevo antes del último `]`
9. Guardá `products.js`

#### Cómo editar un producto existente

1. En la tabla del admin, buscá el producto que querés modificar
2. Hacé clic en el botón **"Editar"** en la fila correspondiente
3. Se abre el formulario con los datos actuales del producto
4. Realizá los cambios necesarios
5. Hacé clic en **"Guardar y generar código"**
6. Copiá el código generado
7. En `products.js`, buscá el objeto del producto original (por su `id`) y reemplazalo completo con el código copiado
8. Guardá `products.js`

#### Cómo eliminar un producto

1. En la tabla del admin, hacé clic en **"Eliminar"** junto al producto
2. Confirmá la acción
3. El admin te muestra el array completo actualizado (sin ese producto)
4. Copiá el código completo
5. En `products.js`, reemplazá todo el contenido del array `PRODUCTS = [ ... ]` con el código copiado
6. Guardá `products.js`

⚠️ **Advertencia importante:** Si un cliente tiene ese producto en su carrito cuando lo eliminás, el producto desaparecerá de su carrito la próxima vez que recargue la página.

---

### 4b. Estructura de un producto

Cada producto en el catálogo es un objeto con los siguientes campos:

| Campo | Tipo | Obligatorio | Descripción | Ejemplo |
|---|---|---|---|---|
| `id` | Texto | Sí | Identificador único. Solo minúsculas y guiones. Se usa en la URL de la página del producto. No repetir. | `'auriculares-bt'` |
| `name` | Texto | Sí | Nombre visible en la tienda y en la ficha del producto. | `'Auriculares Bluetooth Pro'` |
| `brand` | Texto | Sí | Marca o fabricante. Aparece en la ficha del producto. | `'SoundTech'` |
| `unit` | Texto | No | Unidad de venta. Aparece junto al precio. | `'unidad'`, `'par'`, `'kit'` |
| `price` | Número | Sí | Precio de venta actual. Sin símbolo de moneda, solo el número. | `89.99` |
| `originalPrice` | Número o null | No | Precio anterior tachado. Poner `null` si no hay descuento. | `119.99` o `null` |
| `image` | Texto | Sí | Ruta a la imagen principal que aparece en la tarjeta del producto. | `'assets/products/product-1.jpg'` |
| `images[]` | Lista de textos | Sí | Galería de imágenes para la ficha del producto. Mínimo una. | `['assets/products/product-1.jpg', 'assets/products/product-2.jpg']` |
| `category` | Texto | Sí | Categoría a la que pertenece. Debe coincidir exactamente con un `id` de `categories.js`. | `'electronics'` |
| `filter` | Texto | No | Etiqueta de filtro para la grilla principal. Ver valores válidos abajo. | `'new'`, `'sale'`, `'top'` |
| `badges[]` | Lista | No | Etiquetas visuales sobre la imagen (ej: "-25%", "NUEVO"). Cada una con `text` y `color`. | `[{ text: 'NUEVO', color: 'brand' }]` |
| `description` | Texto | No | Descripción larga que aparece en la ficha del producto. | `'Auriculares inalámbricos con...'` |
| `specs{}` | Objeto | No | Ficha técnica. Pares clave-valor que se muestran en una tabla en la ficha del producto. | `{ 'Batería': '30 h', 'Peso': '250 g' }` |
| `stock` | Número | No | Unidades disponibles. En `0` el botón de compra se deshabilita y aparece "Sin stock". | `15` |
| `tags[]` | Lista de textos | No | Palabras clave para el buscador interno y SEO. | `['auriculares', 'bluetooth']` |
| `featured` | true/false | No | Si es `true`, el producto aparece en la sección de destacados. | `true` |
| `freeShipping` | true/false | No | Muestra la etiqueta "Envío gratis" en la tarjeta del producto. | `true` |
| `rating` | Número | No | Calificación promedio de 0 a 5. Aparece como estrellas. | `4.5` |
| `reviews` | Número | No | Cantidad de reseñas mostrada junto a las estrellas. | `128` |
| `urgency` | Objeto o null | No | Texto de urgencia bajo el precio (ej: "¡Solo quedan 3 unidades!"). Colores: `'orange'`, `'rose'`, `'slate'`. | `{ text: '¡Solo quedan 3!', color: 'orange' }` |
| `owner` | Texto | Sí | Quién vende el producto. Ver explicación abajo. | `'self'` o `'partner'` |
| `partnerName` | Texto | Solo si partner | Nombre del partner que se muestra en la tarjeta: "Vendido por [nombre]". | `'RunStore Oficial'` |
| `commission` | Número | Solo si partner | Comisión del partner en decimal. Ver cálculo abajo. | `0.15` (= 15%) |
| `colors[]` | Lista | No | Colores disponibles del producto con nombre y código hexadecimal. Lista vacía `[]` oculta el selector. | `[{ name: 'Negro', hex: '#1e293b' }]` |
| `testimonials[]` | Lista | No | Reseñas de clientes con nombre, ciudad, calificación y texto. Lista vacía `[]` muestra "Sé el primero en reseñar". | Ver ejemplo en products.js |

#### Valores válidos para `filter`

| Valor | Etiqueta que aparece |
|---|---|
| `'new'` | Nuevos |
| `'sale'` | Oferta |
| `'top'` | Más vendidos |

#### Valores válidos para `color` en badges

| Valor | Color |
|---|---|
| `'brand'` | Azul índigo (color principal de la tienda) |
| `'rose'` | Rojo rosado (para descuentos) |
| `'amber'` | Amarillo ámbar (para destacados) |
| `'violet'` | Violeta |
| `'emerald'` | Verde esmeralda |
| `'slate'` | Gris |

#### Owner: 'self' vs 'partner'

**`owner: 'self'`** significa que el producto es de la tienda propia. Vos compraste o importaste la mercadería y la vendés directamente. No se muestra ningún badge de vendedor en la tarjeta. Los campos `partnerName` y `commission` se dejan en blanco y en `0`.

**`owner: 'partner'`** significa que el producto pertenece a un importador externo (un "partner") que usa tu tienda como vitrina de ventas. En la tarjeta y en la ficha del producto aparece "Vendido por [nombre del partner]". Esto es útil si trabajás con proveedores que te entregan mercadería en consignación o si publicás productos de terceros a cambio de una comisión.

#### Cómo funciona la comisión

La comisión es un campo informativo. El sistema no descuenta automáticamente el dinero, pero te indica cuánto le corresponde al partner cuando recibís un pago.

**Fórmula:**
- Monto que retiene la tienda = precio × (1 − comisión)
- Monto a transferir al partner = precio × comisión

**Ejemplo:** Un producto a $100 con `commission: 0.15` (15%)
- La tienda retiene: $100 × 0.85 = **$85**
- Se transfiere al partner: $100 × 0.15 = **$15**

💡 **Tip:** Para llevar el registro de comisiones, podés exportar los pagos desde el panel de Stripe y cruzarlos con el nombre del partner de cada pedido. La automatización de transferencias requiere Stripe Connect (pedirlo a un desarrollador).

---

## 5. Cómo gestionar las categorías

Las categorías se definen en el archivo `categories.js`. Cada categoría es una línea dentro del array `CATEGORIES`.

### Cómo agregar una categoría nueva

1. Abrí `categories.js`
2. Dentro del array `CATEGORIES = [ ... ]`, agregá un nuevo objeto con este formato:
   ```
   { id: 'belleza', name: 'Belleza', emoji: '💄', description: 'Cosméticos y cuidado personal', color: 'pink' },
   ```
3. Guardá el archivo
4. Asegurate de que al menos un producto en `products.js` tenga `category: 'belleza'`

| Campo | Descripción | Ejemplo |
|---|---|---|
| `id` | Identificador único de la categoría. Los productos lo usan en su campo `category`. Solo minúsculas y guiones. | `'belleza'` |
| `name` | Nombre visible en la tienda | `'Belleza'` |
| `emoji` | Emoji que aparece en la tarjeta de categoría | `'💄'` |
| `description` | Descripción breve que aparece al pasar el mouse | `'Cosméticos y cuidado personal'` |
| `color` | Color del fondo del icono. Opciones: `'blue'`, `'pink'`, `'amber'`, `'emerald'`, `'violet'`, `'orange'` | `'pink'` |

### Cómo "desactivar" una categoría sin borrarla

Si querés que una categoría deje de mostrarse temporalmente sin perder los datos, podés comentarla poniendo `//` al inicio de la línea:

```
// { id: 'toys', name: 'Juguetes', emoji: '🧸', ... },
```

Esto la oculta del sitio pero la conserva en el archivo para activarla cuando quieras (borrando el `//`).

### Qué pasa si una categoría no tiene productos

Si una categoría está en `categories.js` pero ningún producto tiene ese `category`, **no aparece en la sección de categorías de la página de inicio** ni en los filtros de la grilla. El sistema lo detecta automáticamente.

---

## 6. Cómo agregar imágenes

Las imágenes van en la carpeta `assets/`. No se requiere ninguna configuración adicional: con solo poner el archivo en la ubicación correcta con el nombre correcto, el sitio las usa automáticamente.

| Imagen | Dónde va | Tamaño recomendado | Nombre del archivo |
|---|---|---|---|
| Foto de un producto | `assets/products/` | Mínimo 600×600 px, cuadrada | Mismo que la ruta en `products.js`. Ej: `product-9.jpg` |
| Fondo del hero (página de inicio) | `assets/` | 1920×800 px (horizontal) | `hero.jpg` |
| Banner de ofertas | `assets/` | 960×640 px (horizontal) | `offer-banner.jpg` |
| Imagen para compartir en redes | `assets/` | Exactamente 1200×630 px | `og-home.jpg` |

### Nomenclatura de imágenes de productos

Las imágenes de productos siguen el patrón `product-N.jpg` donde N es un número. Cuando agregás un producto nuevo desde el admin, el campo "Imagen principal" y la galería se completan con rutas del tipo `assets/products/product-9.jpg`. Vos tenés que asegurarte de que exista un archivo con ese nombre en la carpeta `assets/products/`.

💡 **Tip:** Para productos con galería de 4 fotos, usá nombres consecutivos: `product-9.jpg`, `product-10.jpg`, `product-11.jpg`, `product-12.jpg`.

### Qué pasa si falta una imagen

Si el archivo de imagen no existe, el navegador muestra automáticamente una imagen de reemplazo (placeholder genérico). El sitio no se rompe ni muestra un error visible. Podés subir las fotos reales después sin problema.

### Formatos aceptados

JPG y PNG son los más recomendados. JPG para fotos (menor peso), PNG si la imagen tiene fondo transparente.

---

## 7. Cómo gestionar cupones

Los cupones se definen en el array `COUPONS` al final del archivo `config.js`.

### Tipos de cupón disponibles

| Tipo | Qué hace | Ejemplo |
|---|---|---|
| `'percent'` | Descuenta un porcentaje del total del carrito | 10% de descuento → `discount: 0.10` |
| `'fixed'` | Descuenta un monto fijo en la moneda configurada | $5 de descuento → `discount: 5` |
| `'shipping'` | Otorga envío gratis independientemente del monto del carrito | `discount: 0` (el valor del campo no importa) |

### Ejemplos de cupones

```
{ code: 'BIENVENIDO10', discount: 0.10, type: 'percent',  minOrder: 0,  active: true  }
{ code: 'DESCUENTO5',   discount: 5,    type: 'fixed',    minOrder: 30, active: true  }
{ code: 'ENVIOGRATIS',  discount: 0,    type: 'shipping', minOrder: 20, active: true  }
{ code: 'VERANO20',     discount: 0.20, type: 'percent',  minOrder: 0,  active: false }
```

### Campos de cada cupón

| Campo | Descripción |
|---|---|
| `code` | Código que el cliente ingresa en el carrito. Sin espacios, mayúsculas recomendadas. |
| `discount` | Valor del descuento. Para `percent`: decimal (0.15 = 15%). Para `fixed`: monto. Para `shipping`: cualquier número (se ignora). |
| `type` | Tipo de descuento: `'percent'`, `'fixed'` o `'shipping'`. |
| `minOrder` | Monto mínimo de compra para que el cupón sea válido. `0` significa sin mínimo. |
| `active` | `true` para activo, `false` para desactivado. |

### Cómo agregar un cupón nuevo

1. Abrí `config.js`
2. Dentro del array `COUPONS = [ ... ]`, agregá una línea nueva siguiendo el formato:
   ```
   { code: 'MICUPON', discount: 0.15, type: 'percent', minOrder: 0, active: true },
   ```
3. Guardá el archivo

### Cómo desactivar un cupón sin borrarlo

Cambiá `active: true` a `active: false`. El código ya no funcionará en el carrito, pero queda guardado para activarlo cuando quieras.

---

## 8. Cómo agregar un partner/importador

### Qué es un partner

Un partner es un importador o proveedor externo que vende sus productos a través de tu tienda. En lugar de que vos compres la mercadería, el partner la pone a la venta en tu plataforma y vos cobrás una comisión por cada venta. En la tienda, los productos de partners se identifican con la etiqueta "Vendido por [nombre del partner]".

### Paso a paso para cargar un producto de partner

1. Abrí `admin.html` con Live Server
2. Hacé clic en **"Nuevo producto"**
3. Completá los datos del producto normalmente (nombre, precio, imágenes, categoría, etc.)
4. En la sección **"Vendedor"**, cambiá la opción de `'self'` a `'partner'`
5. Completá el campo **Nombre del partner** (ej: `RunStore Oficial`)
6. Completá el campo **Comisión** (ej: `0.15` para 15%)
7. Hacé clic en **"Guardar y generar código"**
8. Copiá el código y pegalo en `products.js` como se describe en la sección 4a

### Cómo se ve el producto en la tienda

En la tarjeta del producto aparece una etiqueta discreta que dice **"Vendido por RunStore Oficial"**. Lo mismo aparece en la ficha completa del producto. Esto le da transparencia al cliente sobre el origen del producto.

### Fórmula de comisión

```
Tienda retiene = Precio × (1 − comisión)
Partner recibe = Precio × comisión
```

| Precio | Comisión | Tienda retiene | Partner recibe |
|---|---|---|---|
| $100 | 15% (0.15) | $85 | $15 |
| $50 | 20% (0.20) | $40 | $10 |
| $200 | 10% (0.10) | $180 | $20 |

⚠️ **Importante:** El sistema no transfiere el dinero automáticamente. La comisión es un campo informativo. Para llevar el registro, consultá el dashboard de Stripe y cruzá cada pago con el `partnerName` del producto.

---

## 9. Cómo ver y probar el sitio localmente

### Sin servidor (modo básico)

Podés hacer doble clic sobre `index.html` para abrirlo directamente en el navegador. Esto funciona para ver el diseño general, pero puede tener limitaciones con algunas imágenes locales dependiendo del navegador.

### Con Live Server (recomendado)

1. Instalá la extensión **Live Server** en Visual Studio Code (buscala en la pestaña Extensiones con Ctrl+Shift+X)
2. Hacé clic derecho sobre `index.html`
3. Seleccioná **"Open with Live Server"**
4. El sitio se abre en `http://localhost:5500` (o similar) y se actualiza automáticamente cada vez que guardás un archivo

💡 **Tip:** Con Live Server también podés usar `admin.html` de la misma manera.

### Flujo de prueba recomendado

Para verificar que todo funciona correctamente antes de publicar, recorré este flujo completo:

1. **Inicio** (`index.html`): verificá que aparecen el nombre de la tienda, las categorías y los productos
2. **Ficha de producto** (`producto.html`): hacé clic en cualquier producto y verificá que carga bien la galería, la descripción y el botón de agregar al carrito
3. **Carrito** (`carrito.html`): agregá 1-2 productos y verificá que el total se calcula bien
4. **Cupón**: ingresá el código `BIENVENIDO10` y verificá que aplica el 10% de descuento
5. **Checkout** (`checkout.html`): completá el formulario de datos de envío
6. **Reserva del pedido**: completá el paso final y verificá que llega a la pantalla de confirmación
7. **Confirmación** (`confirmacion.html`): verificá que muestra el resumen del pedido

⚠️ **Nota sobre pagos:** Sin el backend de Stripe activo, el proceso de pago llega hasta la "reserva del pedido" pero no procesa un cobro real. Los pagos reales requieren configuración adicional (ver sección 1).

---

## 10. Secciones del sitio explicadas

| Página | Qué muestra | De dónde saca los datos |
|---|---|---|
| `index.html` | Página de inicio: banner hero, grilla de categorías, productos destacados y grilla general, banner de oferta, sección "Sobre nosotros", newsletter | `config.js` (nombre, textos), `products.js` (productos), `categories.js` (categorías), `assets/hero.jpg`, `assets/offer-banner.jpg` |
| `producto.html` | Ficha completa de un producto: galería de imágenes, nombre, precio, descripción, especificaciones técnicas, selector de colores, testimonios de clientes, urgencia de stock | `products.js` (el producto específico según el `?id=` de la URL) |
| `categoria.html` | Grilla de productos filtrada por una categoría específica | `products.js` y `categories.js` según el `?cat=` de la URL |
| `carrito.html` | Lista de productos agregados, campo para ingresar cupón, resumen con subtotal, descuento y total, botón para ir al checkout | Carrito guardado en el navegador (localStorage) |
| `checkout.html` | Proceso de compra en pasos: 1) formulario de datos de envío, 2) pago con Stripe (requiere backend), 3) confirmación | Carrito del navegador + datos ingresados por el cliente |
| `confirmacion.html` | Resumen del pedido con número de orden, productos, datos de envío y total. Válido por 24 horas. | Datos guardados en el navegador al completar el pedido |
| `favoritos.html` | Productos que el cliente marcó con el corazón en otras páginas | Lista de favoritos guardada en el navegador (localStorage) |
| `buscar.html` | Resultados de búsqueda por texto ingresado en el buscador del header | `products.js` (busca en nombre, descripción y tags) |
| `admin.html` | Editor visual del catálogo. Permite crear, editar y eliminar productos y genera el código para pegar en `products.js` | `products.js` (lectura) + edición manual posterior |

### Páginas "Próximamente"

Las siguientes secciones están previstas pero aún no están implementadas. Los links pueden aparecer en el footer pero no tienen contenido todavía:

- Mi cuenta
- Mis pedidos
- Preguntas frecuentes (FAQ)
- Información de envíos
- Contacto
- Política de privacidad
- Términos y condiciones

---

## 11. Checklist antes de publicar

Usá esta lista para asegurarte de que el sitio está listo antes de hacerlo público.

### Marca (config.js)

- [ ] Cambié `name` con el nombre real de mi negocio
- [ ] Cambié `domain` con la URL real del sitio
- [ ] Cambié `tagline` y `description` con textos propios
- [ ] Actualicé `contact.email` con mi correo real
- [ ] Actualicé los links de `social` (Instagram, Twitter, Facebook) con mis cuentas reales
- [ ] Actualicé `about.headline` y `about.subtitle` con mi propuesta de valor
- [ ] Configuré `currencySymbol` con el símbolo de moneda correcto para mi país
- [ ] Definí el `freeShippingThreshold` que corresponde a mi negocio
- [ ] Cambié el `couponCode` de ejemplo por uno propio

### Productos (catálogo real)

- [ ] Reemplacé los productos de ejemplo con mis productos reales en `products.js`
- [ ] Verifiqué que todos los productos tienen precio, categoría e imagen correctos
- [ ] Revisé que el stock de cada producto es correcto
- [ ] Los productos de partners tienen `owner: 'partner'` y la comisión configurada

### Imágenes (fotos reales)

- [ ] Reemplacé las fotos de ejemplo en `assets/products/` por fotos reales de mis productos
- [ ] Reemplacé `assets/hero.jpg` por mi imagen de portada (1920×800 px)
- [ ] Reemplacé `assets/offer-banner.jpg` por mi banner de oferta
- [ ] Reemplacé `assets/og-home.jpg` por mi imagen para redes sociales (exactamente 1200×630 px)

### Categorías (reales del negocio)

- [ ] Revisé `categories.js` y dejé solo las categorías que uso en mi negocio
- [ ] Comenté o eliminé las categorías que no corresponden
- [ ] Cada categoría activa tiene al menos un producto asignado

### Cupones (códigos propios)

- [ ] Reemplacé los cupones de ejemplo por los míos en `config.js`
- [ ] Verifiqué que los descuentos y condiciones son los correctos
- [ ] Desactivé los cupones de ejemplo que no voy a usar (`active: false`)

### Prueba final (flujo completo)

- [ ] Recorrí el flujo completo: inicio → producto → carrito → checkout → confirmación
- [ ] Probé ingresar un cupón y verificar que descuenta correctamente
- [ ] Verifiqué que el carrito persiste si recargo la página
- [ ] Revisé el sitio en el celular (o usando las herramientas de desarrollo del navegador en pantalla de 375px)
- [ ] Verifiqué que la imagen de Open Graph es correcta usando [opengraph.xyz](https://opengraph.xyz)

---

## 12. Preguntas frecuentes

**¿Qué pasa si borro un producto que alguien tiene en el carrito?**
El producto desaparece del carrito del cliente la próxima vez que recarga la página. No hay forma de recuperarlo automáticamente. Si necesitás dar de baja un producto con urgencia, es mejor primero poner el `stock` en `0` (el botón queda deshabilitado) antes de eliminarlo definitivamente.

---

**¿Puedo poner el mismo producto en dos categorías?**
No. Cada producto solo puede tener una categoría. Si necesitás que un artículo aparezca en dos secciones diferentes, la solución es duplicarlo con un `id` distinto (ej: `'auriculares-bt'` y `'auriculares-bt-deportes'`). No es ideal, pero es la única forma sin modificar el código.

---

**¿Cómo cambio el precio de un producto?**
Tenés dos opciones:
1. Abrí `admin.html` → hacé clic en "Editar" junto al producto → cambiá el precio → "Guardar y generar código" → copiá y pegá en `products.js`
2. Abrí `products.js` directamente, buscá el producto por su `id` y editá el campo `price`

---

**¿Cómo sé cuántos pedidos hubo?**
Hoy el sistema no tiene un historial de pedidos centralizado. Los datos del pedido se guardan durante 24 horas en el navegador del cliente, pero vos no tenés acceso a esa información desde tu lado. Para tener un historial completo de pedidos, se necesita un backend con base de datos. Lo que sí podés hacer es revisar los cobros directamente en el panel de Stripe una vez que los pagos estén activos.

---

**¿Qué significa el campo `filter`?**
Es la etiqueta que filtra los productos en la grilla principal de la página de inicio. Los clientes pueden hacer clic en los botones de filtro para ver solo un tipo de producto:

| Valor en products.js | Lo que ve el cliente |
|---|---|
| `'new'` | Nuevos |
| `'sale'` | Oferta |
| `'top'` | Más vendidos |

---

**¿Cómo activo los pagos reales?**
Necesitás:
1. Crear una cuenta en [stripe.com](https://stripe.com)
2. Pedirle a un desarrollador que configure el backend incluido en la carpeta `backend/` con tu clave secreta de Stripe
3. Reemplazar la clave pública de prueba en `checkout.html` por tu clave pública real
4. Publicar el backend en un servidor (Railway o Render son opciones económicas)

Sin estos pasos, el checkout funciona en modo "reserva de pedido" (sin cobro real).

---

**¿Puedo usar otra moneda?**
Sí. Cambiá el campo `currencySymbol` en `config.js`. Por ejemplo:
- `'€'` para euros
- `'S/'` para soles peruanos
- `'$'` para pesos o dólares (el símbolo es el mismo; la moneda real depende de cómo configurés Stripe)

El símbolo se muestra en todos los precios del sitio automáticamente.

---

**¿Qué pasa si el sitio se ve roto o en blanco?**
Lo más probable es un error en alguno de los archivos `.js`. Abrí el navegador, presioná F12 para abrir las herramientas de desarrollo y revisá la pestaña "Consola". Los errores en rojo te indican exactamente qué está fallando y en qué archivo. Si editaste `config.js` o `products.js` recientemente, revisá que no falte alguna coma, comilla o corchete.

---

*Manual generado el 28 de marzo de 2026. Versión del proyecto: ShopBase v1.*
