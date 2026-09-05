/* Service worker for Nora's US Open Guide. Registered with a relative path so it works on a GitHub Pages subpath.
   - precaches the app shell + data + every player photo listed in data/players.js
   - images: cache-first; data + shell: network-first with cache fallback */
var VERSION = 'nora-usopen-v4';
var SHELL = ['./', './index.html', './styles/main.css', './scripts/app.js', './data/players.js', './manifest.webmanifest', './img/icon.svg'];

function photoList() {
  try {
    importScripts('./data/players.js');
    var d = self.PLAYERS_DATA || {};
    return (d.players || []).map(function (p) { return p.photo && p.photo.exists !== false && p.photo.localPath; }).filter(Boolean).map(function (x) { return './' + x; });
  } catch (e) { return []; }
}

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    var all = SHELL.concat(photoList());
    // add one by one so a single missing photo doesn't fail the whole install
    return Promise.all(all.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return; // fonts etc. go straight to network
  var isImage = /\/img\//.test(url.pathname) || req.destination === 'image';
  if (isImage) {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); return res; });
    }));
    return;
  }
  e.respondWith(fetch(req).then(function (res) {
    var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); return res;
  }).catch(function () {
    return caches.match(req).then(function (hit) { return hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined); });
  }));
});
