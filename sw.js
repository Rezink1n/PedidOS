const CACHE = 'pedidos-v4';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase.co')) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const c = res.clone();
        caches.open(CACHE).then(ca => ca.put(e.request, c));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// ── Push recibido ─────────────────────────────────────────
self.addEventListener('push', e => {
  // Intentar leer el payload — si falla, usar defaults
  let title = 'PedidOS ☕';
  let body  = 'Revisa los pedidos de hoy';
  let icon  = './icon-192.png';

  if (e.data) {
    try {
      const d = e.data.json();
      if (d.title) title = d.title;
      if (d.body)  body  = d.body;
      if (d.icon)  icon  = d.icon;
    } catch {
      // Si no es JSON, usar el texto plano como cuerpo
      try { body = e.data.text() || body; } catch {}
    }
  }

  // Notificar a todos los clientes abiertos (para debug)
  self.clients.matchAll({ includeUncontrolled: true }).then(cls => {
    cls.forEach(c => c.postMessage({ type: 'PUSH_RECEIVED', title, body }));
  });

  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      tag:      'pedidos-reminder',
      renotify: true,
      requireInteraction: false
    })
  );
});

// ── Clic en notificación → abrir app ─────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cls => {
      const w = cls.find(c => c.url.includes(self.location.origin));
      return w ? w.focus() : clients.openWindow('./');
    })
  );
});
