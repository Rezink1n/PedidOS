const CACHE = 'pedidos-v3';
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

// Recibir push del servidor y mostrarlo
self.addEventListener('push', e => {
  let data = { title: 'PedidOS ☕', body: 'Revisa los pedidos de hoy', icon: './icon-192.png' };
  try { Object.assign(data, e.data.json()); } catch {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body:     data.body,
      icon:     data.icon,
      badge:    './icon-192.png',
      tag:      'pedidos-reminder',
      renotify: true,
      vibrate:  [200, 100, 200]
    })
  );
});

// Al tocar la notificación → abrir la app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cls => {
      const w = cls.find(c => c.url.includes(self.location.origin));
      return w ? w.focus() : clients.openWindow('./');
    })
  );
});
