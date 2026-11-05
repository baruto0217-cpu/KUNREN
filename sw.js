// Service Worker — 救急 訓練・現場ツール
// 同じ公開先(baruto0217-cpu.github.io)のほかのアプリの保存には触らない（kunren- で始まるものだけ扱う）
const CACHE_PREFIX = 'kunren-';
const CACHE_NAME = CACHE_PREFIX + 'v9';
const FILES = [
  './',
  './apps/ccf/index.html',
  './apps/check/index.html',
  './apps/cpa/index.html',
  './apps/drag/index.html',
  './apps/gaisho/gaisho.enc.js',
  './apps/gaisho/icon-192.png',
  './apps/gaisho/icon-512.png',
  './apps/gaisho/index.html',
  './apps/hansou/index.html',
  './apps/jikahou/assets/bunri-PiMMcLOV.png',
  './apps/jikahou/assets/honoo-BBLSwLOU.png',
  './apps/jikahou/assets/index-CNNLCe09.js',
  './apps/jikahou/assets/index-dHsyAj_m.css',
  './apps/jikahou/assets/kodenshi-Bf1plGea.png',
  './apps/jikahou/assets/sado-BZzDLzK5.png',
  './apps/jikahou/assets/teion-BExtTfvx.png',
  './apps/jikahou/images/bunri.png',
  './apps/jikahou/images/honoo.png',
  './apps/jikahou/images/kodenshi.png',
  './apps/jikahou/images/sado.png',
  './apps/jikahou/images/teion.png',
  './apps/jikahou/index.html',
  './apps/jitsugi/icon-180.png',
  './apps/jitsugi/icon-512.png',
  './apps/jitsugi/index.html',
  './apps/jitsugi/sheets.enc.js',
  './apps/pemec/index.html',
  './apps/simulator/app.js',
  './apps/simulator/index.html',
  './apps/tasuu/index.html',
  './apps/time/index.html',
  './icon-192.png',
  './icon-512.png',
  './index.html',
  './manifest.json',
  './vendor/html2canvas.min.js',
  './vendor/jspdf.umd.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => Promise.all(FILES.map(u =>
    fetch(new Request(u, { cache: 'reload' })).then(r => { if (!r.ok) throw new Error(u + ' ' + r.status); return c.put(u, r); })
  ))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(
    ks.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME).map(k => caches.delete(k))
  )));
  self.clients.claim();
});

// 保存してある分を先に返す（圏外でも開ける）。新しい版は VERSION を上げて入れ替える
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE_NAME).then(c => c.match(e.request, { ignoreSearch: true }).then(hit =>
    hit || fetch(e.request).then(r => { if (r.ok && r.type === 'basic') c.put(e.request, r.clone()); return r; })
  )));
});
