# ☕ Lista Cafetería — PWA

App de lista de compras para cafetería. Funciona como PWA (instalable en móvil).

## 🚀 Publicar en GitHub Pages

1. Crea un repositorio en GitHub (ej: `lista-cafeteria`)
2. Sube estos archivos:
   - `index.html`
   - `manifest.json`
   - `sw.js`
3. Ve a **Settings → Pages → Source: Deploy from a branch → main / root**
4. Tu app estará en: `https://TU_USUARIO.github.io/lista-cafeteria/`

## 📱 Instalar como app en el móvil

**Android (Chrome):**
- Abre la URL en Chrome
- Toca el banner "Agregar a pantalla de inicio"
- O: menú ⋮ → "Instalar app"

**iPhone (Safari):**
- Abre la URL en Safari
- Toca el botón compartir (cuadrado con flecha)
- "Añadir a pantalla de inicio"

## ✨ Funcionalidades

- ✅ Agregar productos con nombre, cantidad, unidad, categoría y notas
- 📂 Categorías predefinidas: Lácteos, Panadería, Bebidas, Frutas, Carnes, etc.
- ✏️ Editar y eliminar productos
- ☑️ Marcar/desmarcar productos como listos
- 🔍 Filtrar por estado (todos / pendientes / marcados) o por categoría
- 📤 Compartir lista por WhatsApp con formato bonito
- 📋 Copiar lista como texto
- 📶 Funciona sin conexión (caché PWA)
- 💾 Datos sincronizados en Supabase

## 🗄️ Base de Datos (Supabase)

Tablas creadas automáticamente:
- `categorias` — Categorías con icono y color
- `productos` — Productos de la lista

## 🔧 Personalización

Para cambiar la URL/key de Supabase, edita en `index.html`:
```js
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_KEY = 'TU_ANON_KEY';
```
