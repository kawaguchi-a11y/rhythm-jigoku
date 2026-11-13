# Claude のアーティファクトから書き出した index.html に、ホーム画面用のアイコン設定を差し込む
import sys
p='index.html'
s=open(p,encoding='utf-8').read()
if 'manifest.webmanifest' not in s:
    head=('<link rel="manifest" href="manifest.webmanifest">'
          '<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">'
          '<link rel="apple-touch-icon" href="apple-touch-icon.png">'
          '<meta name="theme-color" content="#2a1636">'
          '<meta name="mobile-web-app-capable" content="yes">'
          '<meta name="apple-mobile-web-app-title" content="リズム地獄">')
    s=s.replace('</head>',head+'</head>',1)
    s=s.replace('</body></html>','<script>if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});</script>\n</body></html>',1)
    open(p,'w',encoding='utf-8').write(s)
print('ok')
