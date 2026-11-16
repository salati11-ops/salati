var CACHE='iraqshopping-v1';
var SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  var req=e.request, url=new URL(req.url);
  if(req.method!=='GET') return;
  // بيانات Supabase والصور المرفوعة: دائماً من الشبكة
  if(url.hostname.indexOf('supabase.co')!==-1) return;
  // صفحات التطبيق: الشبكة أولاً (حتى توصل التحديثات)، والكاش إذا ماكو إنترنت
  if(req.mode==='navigate'||url.origin===location.origin){
    e.respondWith(fetch(req).then(function(r){
      var copy=r.clone(); caches.open(CACHE).then(function(c){c.put(req,copy);}); return r;
    }).catch(function(){return caches.match(req).then(function(m){return m||caches.match('index.html');});}));
  }
});
