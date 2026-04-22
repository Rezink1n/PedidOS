const CACHE_NAME = 'pedidos-v2';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase.co')) return;
  e.respondWith(
    fetch(e.request)
      .then(res => { const c = res.clone(); caches.open(CACHE_NAME).then(ca => ca.put(e.request, c)); return res; })
      .catch(() => caches.match(e.request))
  );
});

// ── Push notification received ──────────────────────────────
self.addEventListener('push', e => {
  let data = { title: 'PedidOS ☕', body: 'Revisa los pedidos de hoy', icon: './icon-192.png' };
  try { data = { ...data, ...e.data.json() }; } catch {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body:  data.body,
      icon:  data.icon || './icon-192.png',
      badge: './icon-192.png',
      tag:   'pedidos-reminder',
      renotify: true,
      data:  { url: self.location.origin }
    })
  );
});

// ── Notification click → open app ───────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cls => {
      const existing = cls.find(c => c.url.includes(self.location.origin));
      if (existing) return existing.focus();
      return clients.openWindow(e.notification.data?.url || '/');
    })
  );
});
