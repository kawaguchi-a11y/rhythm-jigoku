// インストール用の最小サービスワーカー（キャッシュしないので、更新はすぐ反映されます）
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',()=>{});
