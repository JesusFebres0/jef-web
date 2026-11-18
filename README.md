# JeF — landing de transporte

Página de promoción estática para un servicio de transporte de pasajeros y carga.
Sin build, sin backend y sin dependencias externas: se sube a Cloudflare Pages tal cual
y funciona en el plan gratuito. `index.html`, `styles.css` y `script.js` van separados
para que el navegador los cacheé entre páginas; no hay nada más que enlazar.

## Archivos

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Estructura y textos de la landing |
| `styles.css` | Todos los estilos (variables de color en el bloque `:root` del inicio) |
| `script.js` | Contacto, menú móvil, revelado al scroll y formulario (WhatsApp/email) |
| `legal.html` | Aviso legal, privacidad y cookies (plantilla a completar) |
| `404.html` | Página de error personalizada de Cloudflare Pages |
| `datos/maquinaria.json` | Catálogo de unidades y equipos (se pinta en `maquinaria.html`) |
| `datos/conductores.json` | Conductores y personal (se pinta en `equipo.html`) |
| `_headers` | Cabeceras de seguridad y caché para Cloudflare Pages |

## Ver la web en local

```bash
cd /root/projects/my-app
python3 -m http.server 8080
```

Abre <http://127.0.0.1:8080> en el navegador.

## Publicar en Cloudflare Pages (gratis)

**Opción A — subir la carpeta (la más rápida, sin Git):**

1. Entra en <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Pon un nombre al proyecto (por ejemplo `jef`) y arrastra la carpeta completa.
3. Publica. Te dará una URL tipo `https://jef.pages.dev`.

**Opción B — conectado a GitHub (actualizaciones automáticas):**

1. Sube estos archivos a un repositorio.
2. En Cloudflare Pages: **Create** → **Connect to Git**, elige el repo.
3. Framework preset: **None**. Build command: *(vacío)*. Output directory: `/`.
4. Cada `git push` redespliega solo.

El plan gratuito de Pages incluye peticiones y ancho de banda ilimitados, hasta 500 builds
al mes y certificado HTTPS automático. Esta web **no usa** funciones de pago: ni bases de
datos, ni Workers, ni APIs externas, ni fuentes de pago.

### Dominio propio (opcional, también gratis)

Si el dominio ya está en Cloudflare: **Pages → tu proyecto → Custom domains → Set up a domain**.
El certificado se emite solo. No hace falta el plan de pago.

## Personalizar

### 1. Datos de contacto (lo más importante)

En `index.html`, al final, busca el bloque `CONTACT`:

```js
const CONTACT = {
  phoneDisplay: "+58 414 123 4567",
  phoneRaw: "+584141234567",
  whatsapp: "34600123456",   // sin "+", sin espacios
  email: "hola@jef.com"
};
```

Con eso se actualizan todos los enlaces y textos de teléfono, email y WhatsApp de la página.
Hay dos excepciones que se editan a mano: el bloque JSON-LD de `index.html` (el `telephone`
que leen los buscadores) y los datos de `legal.html`.
Si cambias de marca, busca y reemplaza `JeF` en `index.html`, `legal.html` y `404.html`.

- **Datos pendientes de rellenar:** todo dato que aún no conoces aparece como `[texto entre corchetes]`
  (años, n.º de servicios completados, % de puntualidad, horario de atención, ventajas del hero,
  los 4 servicios, etiquetas, 3 reseñas, respuestas del FAQ, plazos de respuesta). Búscalos con
  `grep -n "\[" index.html` y sustituye cada `[...]` por tu dato real antes de publicar.
- **Nombre y textos:** en `index.html` y `script.js` (constante `CONTACT`), sin minificar.
- **Colores y tipografía:** variables al principio de `styles.css`
  (`--accent`, `--ink`, `--bg`, `--radius`…).
- **Zona y horarios:** aparecen en el hero, en la sección de presupuesto y en `legal.html`.
- **Aviso legal:** completa los campos entre corchetes de `legal.html` con los datos reales
  de la empresa (RIF, domicilio, registro). En Venezuela no hay aún ley general de datos
  personales, pero sí obligaciones de consumo (LOPCU / Indepabis); conviene revisarlo con un
  profesional.

### 2. Cómo funciona el formulario (sin costes)

El formulario **no envía nada a ningún servidor**. Al pulsarlo:

1. Valida los campos en el propio navegador.
2. Genera un mensaje con todos los datos y abre WhatsApp (`wa.me`) en una pestaña nueva.
3. Muestra un panel con dos botones: **Abrir WhatsApp** y **Enviar por email** (`mailto:`),
   por si el navegador bloquea la ventana o el cliente prefiere el correo.

Así no necesitas backend, base de datos, ni servicio de correo transaccional.
Si más adelante quieres recibir los envíos por correo sin abrir el cliente del usuario,
la alternativa gratuita habitual es un formulario de Cloudflare Workers + Resend/Brevo
(planes gratuitos con límite mensual), pero añade complejidad y una cuenta más. Para empezar,
WhatsApp suele convertir mejor.

### 3. Detalles que quizá quieras añadir

- **Imagen para redes sociales (`og:image`):** ahora mismo no hay. Sube una imagen 1200 × 630 px
  y añade `<meta property="og:image" content="https://tudominio.com/og.jpg">` más
  `<meta name="twitter:card" content="summary_large_image">`.
- **Canonical y sitemap:** añade `<link rel="canonical" href="https://tudominio.com/">` y un
  `sitemap.xml` cuando tengas el dominio definitivo. Envía el sitemap en Search Console.
- **Analítica sin cookies:** Cloudflare Web Analytics es gratuita y no usa cookies. Si la activas,
  actualiza el apartado de cookies de `legal.html`.
- **Reseñas:** la sección de opiniones se eliminó por completo. Si más adelante tienes
  reseñas verificables (fichas de Google, mensajes reales), vuelve a añadir una sección propia;
  no publiques testimonios inventados.

## Cómo añadir maquinaria o personal

Las tarjetas de `maquinaria.html` y `equipo.html` se generan desde los archivos de `datos/`.
No hace falta tocar el HTML ni el CSS: se copia un objeto, se cambian los valores y se guarda.

1. Abre `datos/maquinaria.json` (o `datos/conductores.json`).
2. Copia un objeto completo del listado y pégalo al final, separado por una coma.
3. Cambia los valores y sube la foto a `img/` con el mismo nombre que pongas en `foto`.
4. Guarda y recarga la web.

Esquema de cada objeto:

| Campo | Qué es | Ejemplo |
| --- | --- | --- |
| `id` | Identificador único, sin espacios ni acentos (se usa como ancla `#id`) | `"camion-350"` |
| `nombre` | Nombre que se muestra | `"Camión 350"` |
| `foto` | Ruta de la imagen dentro del sitio | `"img/camion-350.webp"` |
| `alt` | Texto alternativo para accesibilidad | `"Camión 350 cargado con material"` |
| `capacidad` | Tonelaje, puestos o rol, según el caso | `"10 toneladas"` |
| `detalle` | Descripción breve | `"Cava abierta para material de obra."` |
| `disponible` | `true` se muestra, `false` se oculta sin borrar | `true` |
| `orden` | Número: menor va primero | `1` |

Reglas:

- **Nunca se borra una unidad retirada**: se pone `"disponible": false` y desaparece de la web.
- Si un objeto no tiene `id`, `nombre`, `foto`, `alt`, `capacidad` o `detalle`, **se ignora solo
  ese objeto** (los demás se muestran igual).
- Si el archivo no se puede leer (error de coma, servidor caído), la sección muestra un aviso
  con un botón de WhatsApp en lugar de quedarse vacía.
- Las unidades se ordenan por `orden`; si falta, van al final.
- El JSON-LD de `maquinaria.html` y `equipo.html` (para buscadores) es estático: al añadir una
  unidad nueva, añade también su nombre y `#id` ahí si quieres que los buscadores la indexen.
- Nada de teléfonos, cédulas, direcciones ni placas: esos datos no van en los JSON públicos.

## Comprobaciones antes de publicar

- [ ] Teléfono, WhatsApp y email reales (y `wa.me` probado desde el móvil).
- [ ] Nombre de marca y textos revisados.
- [ ] Sin `[corchetes]` pendientes en el HTML ni en `datos/*.json`.
- [ ] Datos de empresa completos en `legal.html`.
- [ ] Enlaces del pie y navegación sin destinos vacíos.
- [ ] Probado en móvil (el diseño es responsive desde 360 px).

## Accesibilidad y rendimiento

- HTML semántico, un solo `<h1>`, enlace «Saltar al contenido», foco visible.
- Contraste alto y áreas táctiles de 44 px como mínimo.
- Respeta `prefers-reduced-motion`.
- Sin fuentes, imágenes ni librerías externas: solo tus 3 archivos y el favicon SVG embebido.
