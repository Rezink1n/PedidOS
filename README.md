# PedidOS ☕
### Gestión de pedidos para cafetería — v1.2.01

PWA (Progressive Web App) para gestionar los pedidos y lista de compras de una cafetería. Funciona en móvil como app nativa, sin App Store ni Play Store.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML + CSS + JS vanilla (sin frameworks) |
| Base de datos | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + contraseña) |
| Hosting | GitHub Pages |
| PWA | Service Worker + Web App Manifest |

---

## Funcionalidades

### Lista de productos
- Agregar, editar y eliminar productos
- Contadores por producto — toca el nombre para abrir el popup `+` / `−`
- Formato `3× Botella de leche` para unidades o `750 g Harina` para gramos
- Paso configurable por producto (ej: 1 unidad, 250g, 0.5L)
- Marcar/desmarcar lo que falta — se marca solo al sumar cantidad
- Reordenar productos dentro de cada categoría con ↑ ↓

### Categorías
- Crear, editar, eliminar y reordenar categorías
- Cada categoría con nombre, emoji e icono de color
- Filtros rápidos por categoría en el header
- Al crear un producto estando en una categoría, se pre-selecciona

### Compartir
- Plantilla de mensaje personalizable con variables `{titulo}` `{fecha}` `{total}` `{categorias}`
- Compartir directamente por WhatsApp
- Copiar como texto plano

### CSV
- Exportar lista completa a `.csv`
- Importar desde `.csv` — crea categorías nuevas automáticamente
- Columnas: `nombre`, `cantidad`, `unidad`, `categoria`, `notas`, `falta`

### Multi-usuario y roles
- Registro e inicio de sesión con email y contraseña
- Confirmación de email al registrarse
- Cada usuario ve solo sus propios datos (RLS en Supabase)
- Roles: `admin` y `user`
- Panel de administración con lista de usuarios, emails, fechas de registro y último acceso
- El admin puede cambiar roles desde el panel

---

## Estructura de archivos

```
/
├── index.html      ← App completa (todo en un solo archivo)
├── manifest.json   ← Configuración PWA
├── sw.js           ← Service Worker (caché offline)
└── README.md
```

---

## Base de datos (Supabase)

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `profiles` | Perfil de cada usuario con rol y último acceso |
| `categorias` | Categorías con icono, color y orden |
| `productos` | Productos con cantidad, unidad, paso, notas y estado |
| `user_config` | Plantilla de mensaje personalizada por usuario |

### Seguridad
- Row Level Security (RLS) activado en todas las tablas
- Cada usuario solo accede a sus propios datos
- Los admins pueden leer todos los perfiles mediante función RPC `get_all_users()`

---

## Despliegue en GitHub Pages

1. Crea un repositorio en GitHub (ej: `pedidos`)
2. Sube los 4 archivos: `index.html`, `manifest.json`, `sw.js`, `README.md`
3. Ve a **Settings → Pages → Source: Deploy from a branch → main / root**
4. Tu app estará disponible en `https://TU_USUARIO.github.io/pedidos/`

> Cada vez que hagas cambios, sube el archivo modificado y GitHub Pages se actualiza en ~1 minuto.

---

## Instalar como app en el móvil

**Android (Chrome)**
1. Abre la URL en Chrome
2. Toca el banner "Agregar a pantalla de inicio"
   — o — menú `⋮` → "Instalar app"

**iPhone / iPad (Safari)**
1. Abre la URL en Safari
2. Toca el botón compartir `⎙`
3. "Añadir a pantalla de inicio"

Una vez instalada, funciona como una app nativa con pantalla completa y sin barra del navegador.

---

## Configuración de Supabase

Las credenciales están al inicio de `index.html`:

```js
const SB_URL = 'https://TU_PROYECTO.supabase.co';
const SB_KEY = 'TU_PUBLISHABLE_KEY';
```

### Hacer un usuario admin manualmente

Ejecuta en el SQL Editor de Supabase:

```sql
UPDATE profiles SET role = 'admin'
WHERE email = 'tu@email.com';
```

---

## Dar acceso a nuevos usuarios

Simplemente comparte la URL de la app. Cada persona se registra con su propio email y contraseña. Sus datos son completamente independientes de los demás usuarios.

Si quieres que alguien tenga acceso de admin, actualiza su rol desde el panel de administración (botón "Admin" en el header) o mediante SQL como se indica arriba.

---

## Versión

**v1.2.01** — Abril 2026

### Historial de cambios

| Versión | Cambios |
|---------|---------|
| 1.2.01 | Popup contador +/− por producto, prefijo `N×` en lista, fix pull-to-refresh iOS, categoría auto en nuevo producto |
| 1.2.00 | Roles admin/user, dashboard de usuarios, rediseño navy/gris, fix inputs auth, fix importación CSV |
| 1.1.00 | Multi-usuario con auth, gestión de categorías, plantilla de mensaje, exportar/importar CSV |
| 1.0.00 | Lista base, categorías, marcar productos, compartir WhatsApp, PWA offline |
