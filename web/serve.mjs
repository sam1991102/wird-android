// خادم محلي للتجربة: يخدم ملفات web/ مبنية زي الـ Worker (بدون واجهات السيرفر)
import http from 'node:http';
import { build } from './build.mjs';
const PORT = +process.env.PORT || 8787;
http.createServer((q, s) => {
  const F = build();
  let p = decodeURIComponent(new URL(q.url, 'http://x').pathname).replace(/^\/+/, '');
  if (!p) p = 'index.html';
  let f = F[p] || F[p + '.html'] || (!p.includes('.') && F['index.html']);
  if (!f) { s.writeHead(404); return s.end('not found') }
  const [type, body] = f;
  const bin = /^(image\/(png|jpeg|webp|gif)|font\/|application\/(octet|font))/.test(type);
  s.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' });
  s.end(bin ? Buffer.from(body, 'base64') : body);
}).listen(PORT, () => console.log('wird local on http://localhost:' + PORT));
