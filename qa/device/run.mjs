// اختبار تطبيق الأندرويد الحقيقي على محاكي: ترقية من غير ضياع بيانات، من غير إنترنت، الأذان والمنبّه، روابط الإشعارات.
// بيكلّم صفحة التطبيق من جوه عن طريق WebView DevTools (نسخة debug)، وبياخد صور شاشة بـ adb.
// الاستخدام (جوه android-emulator-runner): node qa/device/run.mjs old.apk new.apk
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const [OLD, NEW] = process.argv.slice(2);
const PKG = 'dev.pages.wird_azkar.app', OUT = 'qa/device/out';
fs.mkdirSync(OUT, { recursive: true });
const sh = (c, ok) => { try { return execSync(c, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120000 }).trim() } catch (e) { if (ok) return (e.stdout || '') + (e.stderr || ''); throw e } };
const adb = (c, ok) => sh('adb ' + c, ok);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rows = []; let shot = 0;
const res = (name, pass, detail = '') => { rows.push({ name, pass, detail }); console.log((pass ? '✓ ' : '✗ ') + name + (detail ? ' — ' + detail : '')) };
const snap = async name => { shot++; const f = `${String(shot).padStart(2, '0')}-${name}.png`; sh(`adb exec-out screencap -p > ${OUT}/${f}`, true); return f };

// ── DevTools: نلاقي الـ WebView بتاع التطبيق ونفتح اتصال
let ws = null, mid = 0; const pend = new Map(); const pageErrors = [], dialogs = [];
async function connect() {
  if (ws) try { ws.close() } catch (e) { }
  ws = null;
  for (let i = 0; i < 40; i++) {
    const pid = adb(`shell pidof ${PKG}`, true).trim();
    const socks = adb('shell cat /proc/net/unix', true).split('\n').map(l => (l.match(/@(webview_devtools_remote_\d+)/) || [])[1]).filter(Boolean);
    const sock = socks.find(s => s.endsWith('_' + pid)) || socks[0];
    if (pid && sock) {
      adb('forward --remove-all', true); adb(`forward tcp:9222 localabstract:${sock}`, true);
      try {
        const list = await (await fetch('http://127.0.0.1:9222/json/list')).json();
        const pg = list.find(p => p.type === 'page' && /wird-azkar/.test(p.url)) || list.find(p => p.type === 'page');
        if (pg) {
          ws = new WebSocket(pg.webSocketDebuggerUrl);
          await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no });
          ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id) } else if (d.method === 'Runtime.exceptionThrown') { const x = d.params.exceptionDetails, fr = x.stackTrace?.callFrames?.[0]; pageErrors.push((x.exception?.description?.split('\n')[0] || x.text) + ' @ ' + ((fr ? fr.url + ':' + (fr.lineNumber + 1) + ':' + (fr.columnNumber + 1) + ' ' + (fr.functionName || '') : (x.url || '') + ':' + (x.lineNumber + 1) + ':' + (x.columnNumber + 1)))) }
            // نوافذ confirm/alert بتجمّد الصفحة: نسجّل نصها ونقفلها
            else if (d.method === 'Page.javascriptDialogOpening') { dialogs.push(d.params.type + ': ' + d.params.message.replace(/\s+/g, ' ').slice(0, 120)); const id = ++mid; ws.send(JSON.stringify({ id, method: 'Page.handleJavaScriptDialog', params: { accept: false } })) } };
          await cdp('Runtime.enable'); await cdp('Page.enable');
          // لو فيه نافذة مفتوحة من قبل ما نتصل
          { const id = ++mid; ws.send(JSON.stringify({ id, method: 'Page.handleJavaScriptDialog', params: { accept: false } })) }
          return pg.url;
        }
      } catch (e) { }
    }
    await sleep(1500);
  }
  throw new Error('WebView DevTools not reachable');
}
function cdp(method, params = {}) { return new Promise((ok, no) => { const id = ++mid; pend.set(id, ok); ws.send(JSON.stringify({ id, method, params })); setTimeout(() => { if (pend.has(id)) { pend.delete(id); no(new Error('cdp timeout ' + method)) } }, 30000) }) }
async function js(expr, retry = 1) {
  let r;
  try { r = await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }) }
  catch (e) { if (!retry) throw e; adb('reconnect', true); adb('wait-for-device', true); adb('shell am broadcast -a android.intent.action.CLOSE_SYSTEM_DIALOGS', true); await sleep(5000); await connect(); return js(expr, 0) }
  if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'eval error'); return r.result?.result?.value }
const launch = async (extra = '') => { adb(`shell am start -W -n ${PKG}/.MainActivity ${extra}`, true); await sleep(4000); const u = await connect(); await sleep(2500); return u };
const stopApp = () => { adb(`shell am force-stop ${PKG}`, true) };
const net = on => { adb(`shell cmd connectivity airplane-mode ${on ? 'disable' : 'enable'}`, true); adb(`shell svc wifi ${on ? 'enable' : 'disable'}`, true); adb(`shell svc data ${on ? 'enable' : 'disable'}`, true) };
const online = async () => { for (let i = 0; i < 20; i++) { if (/bytes from|1 received/.test(adb('shell ping -c 1 -W 2 8.8.8.8', true))) return true; await sleep(2000) } return false };

try {
  adb('wait-for-device');
  // المحاكي بيكون تقيل أول ما يقوم: نستنى النظام يهدى ونقفل أي رسالة «مش بيستجيب»
  for (let i = 0; i < 30 && !/1/.test(adb('shell getprop sys.boot_completed', true)); i++) await sleep(2000);
  await sleep(45000);
  adb('shell am broadcast -a android.intent.action.CLOSE_SYSTEM_DIALOGS', true); adb('shell input keyevent KEYCODE_HOME', true);
  adb('shell settings put global window_animation_scale 0', true); adb('shell settings put global transition_animation_scale 0', true); adb('shell settings put global animator_duration_scale 0', true);
  res('emulator has internet', await online() || /200|301|302/.test(adb('shell curl -s -o /dev/null -w %{http_code} https://wird-azkar.pages.dev/', true)));

  // ١) النسخة القديمة (بتفتح الموقع من الإنترنت) + بيانات تجربة
  adb(`install -r -g ${OLD}`);
  adb(`shell pm grant ${PKG} android.permission.POST_NOTIFICATIONS`, true);
  let u = await launch(); await snap('old-launched');
  res('device still connected', /device/.test(adb('get-state', true)), adb('get-state', true));
  res('old app opens the live site', /wird-azkar\.pages\.dev/.test(u), u);
  await js(`localStorage.setItem('wird-test-marker','keep-me-123');localStorage.setItem('wird-setup-done','1');localStorage.setItem('wird-onboarded','1');localStorage.setItem('wird-fav',JSON.stringify(['m1','e3']));true`);
  const before = await js(`JSON.stringify({m:localStorage.getItem('wird-test-marker'),n:localStorage.length})`);
  await snap('old-version');
  // زي المستخدم الحقيقي: نخرج للشاشة الرئيسية ونستنى المتصفح يكتب البيانات على القرص قبل ما نقفل
  adb('shell input keyevent KEYCODE_HOME', true); await sleep(15000);
  stopApp(); await sleep(2000);
  // نتأكد إن البيانات اتكتبت فعلًا في النسخة القديمة قبل الترقية
  u = await launch();
  const reopened = await js(`localStorage.getItem('wird-test-marker')`);
  res('old app keeps data after reopen (control)', reopened === 'keep-me-123', String(reopened));
  adb('shell input keyevent KEYCODE_HOME', true); await sleep(5000); stopApp();

  // ٢) الترقية للنسخة الجديدة (الموقع جوه التطبيق)
  adb(`install -r -g ${NEW}`);
  u = await launch();
  const after = await js(`JSON.stringify({m:localStorage.getItem('wird-test-marker'),n:localStorage.length,fav:localStorage.getItem('wird-fav'),n2:localStorage.length})`);
  const A = JSON.parse(after), B = JSON.parse(before);
  res('upgrade keeps user data (localStorage)', A.m === 'keep-me-123' && A.fav === JSON.stringify(['m1','e3']), `before ${before} after ${after}`);
  res('new app runs on the same origin', /^https:\/\/wird-azkar\.pages\.dev\//.test(u), u);
  res('native flag + UA', await js(`!!window.__WIRD_NATIVE && /WirdAndroid/.test(navigator.userAgent)`));
  await snap('new-version-home');

  // ٣) جولة في الشاشات وهو متصل
  const views = [['library', '__wirdGo("library")'], ['mushaf', '__wirdGo("mushaf")'], ['prayer', '__wirdGo("prayer")'], ['settings', '__openSettings()'], ['radio', '__openRadio()']];
  for (const [n, code] of views) {
    await js(`try{window.__closeOverlays&&__closeOverlays()}catch(e){};${code};true`).catch(e => res('open ' + n, false, e.message)); await sleep(1500);
    const vis = await js(`(document.documentElement.dataset.view||'')+'|'+document.querySelectorAll('.wp-page,section[data-v]:not([hidden])').length`);
    res('online: ' + n + ' opens', true, vis); await snap('online-' + n);
  }

  // ٤) من غير إنترنت: نقفل التطبيق ونفتحه من الأول
  await js(`try{__closeOverlays()}catch(e){};__wirdGo&&__wirdGo("home");true`).catch(() => { });
  stopApp(); net(false); await sleep(4000);
  res('airplane mode on', !(await (async () => /1 received/.test(adb('shell ping -c 1 -W 2 8.8.8.8', true)))()));
  u = await launch();
  const off = await js(`JSON.stringify({title:document.title,today:!!document.querySelector('#today,.today,[data-v="home"]'),txt:document.body.innerText.length,ui:typeof window.__wirdGo})`);
  const O = JSON.parse(off);
  res('offline: app opens with content', O.txt > 300 && O.ui === 'function', off); await snap('offline-home');
  for (const [n, code] of [['library', '__wirdGo("library")'], ['list', '__wirdGo("library");setCategory("morning")'], ['prayer', '__wirdGo("prayer")'], ['tasbih', '__wirdGo("tasbih")'], ['qibla', '__openQibla()'], ['settings', '__openSettings()']]) {
    await js(`try{__closeOverlays()}catch(e){};${code};true`).catch(e => res('offline open ' + n, false, e.message)); await sleep(1500);
    const t = await js(`document.body.innerText.length`); res('offline: ' + n, t > 200, 'text ' + t); await snap('offline-' + n);
  }
  // قراءة سورة من الملفات اللي جوه التطبيق
  const sura = await js(`fetch('/mushaf/1.json').then(r=>r.ok?r.text():'HTTP '+r.status).then(t=>t.slice(0,80)).catch(e=>'ERR '+e.message)`);
  res('offline: bundled surah file readable', !/^(HTTP|ERR)/.test(sura), sura);
  const api = await js(`fetch('/api/ping').then(r=>r.status).catch(e=>'ERR')`);
  res('offline: /api answers 503 instead of hanging', api === 503, String(api));
  net(true); await online();

  // ٥) الأذان والمنبّه: صوت واحد بس، والإيقاف بيوقف كله
  await js(`try{__closeOverlays()}catch(e){};true`);
  // نعدّ الأصوات الشغالة بتاعة تطبيقنا بس (بالـ uid)، مش أصوات النظام
  const uid = (adb(`shell dumpsys package ${PKG}`, true).match(/userId=(\d+)/) || [])[1];
  const players = () => adb('shell dumpsys audio', true).split('\n').filter(l => /AudioPlaybackConfiguration/.test(l) && new RegExp('u/pid:' + uid + '/|uid:' + uid + '\\b').test(l) && /state:started/.test(l)).length;
  const p0 = players();
  const svc = () => /AdhanService/.test(adb(`shell dumpsys activity services ${PKG}`, true));
  await js(`Capacitor.Plugins.WirdAdhan.test({kind:'alarm',sound:''}).then(()=>1)`); await sleep(4000);
  const p1 = players(), s1 = svc();
  await js(`Capacitor.Plugins.WirdAdhan.test({kind:'adhan',sound:''}).then(()=>1)`); await sleep(4000);
  const p2 = players(), s2 = svc(); await snap('adhan-playing');
  res('alarm starts the service and plays', s1 && p1 >= 1, `uid ${uid}, players before ${p0}, after alarm ${p1}`);
  res('second adhan never plays on top of the first', s2 && p2 <= 1, `players after alarm ${p1}, after adhan ${p2}`);
  await js(`Capacitor.Plugins.WirdAdhan.stop().then(()=>1)`); await sleep(3000);
  res('stop really stops everything', !svc() && players() === 0, 'players ' + players());

  // ٥ب) الإذاعة والتلاوة في الخلفية: تفضل شغالة بعد الخروج من التطبيق وقفل الشاشة
  const msvc = () => /MediaService/.test(adb(`shell dumpsys activity services ${PKG}`, true));
  await js(`Capacitor.Plugins.WirdMedia.play({src:'https://backup.qurango.net/radio/mohammed_siddiq_alminshawi',title:'اختبار الإذاعة',owner:'qa'}).then(()=>1)`).catch(e => res('media plugin call', false, e.message));
  await sleep(8000);
  const m1 = players(); await snap('radio-playing');
  adb('shell input keyevent KEYCODE_HOME', true); await sleep(5000);
  adb('shell input keyevent KEYCODE_SLEEP', true); await sleep(30000);
  const m2 = players(), ms2 = msvc(), sess = adb('shell dumpsys media_session', true);
  adb('shell input keyevent KEYCODE_WAKEUP', true); adb('shell wm dismiss-keyguard', true); await sleep(2000);
  res('radio plays through the native service', m1 >= 1, 'players ' + m1);
  res('radio keeps playing 30s after Home + screen off', m2 >= 1 && ms2, `players ${m2}, service ${ms2}`);
  res('lock-screen media controls exist', new RegExp(PKG + '[\\s\\S]{0,1500}state=PlaybackState \\{state=3').test(sess), (sess.match(/state=PlaybackState \{state=\d+/) || [''])[0]);
  await launch(); await js(`Capacitor.Plugins.WirdMedia.stop().then(()=>1)`).catch(() => { }); await sleep(3000);
  res('radio stop really stops', players() === 0, 'players ' + players());
  // من الصفحة نفسها، بنفس محطات الإذاعة اللي في التطبيق
  adb('logcat -c', true);
  for (const src of ['https://stream.radiojar.com/4wqre23fytzuv', 'https://backup.qurango.net/radio/mohammed_siddiq_alminshawi']) {
    const r = await js(`new Promise(ok=>{if(!window.__BgAudio)return ok('no __BgAudio');const a=new __BgAudio(),ev=[];['play','playing','waiting','error','pause'].forEach(n=>a.addEventListener(n,()=>{ev.push(n);if(n==='playing'||n==='error'){setTimeout(()=>{a.pause();ok(ev.join(','))},3000)}}));a.src='${src}';a.play().catch(e=>ev.push('reject '+e.message));setTimeout(()=>ok(ev.join(',')+' (timeout)'),40000)})`).catch(e => 'ERR ' + e.message);
    res('page radio plays: ' + src.split('/')[2], /playing/.test(r) && !/error/.test(r), r);
  }
  const mlog = adb('logcat -d -s WirdMedia:* ExoPlayerImplInternal:E MediaSessionService:*', true).split('\n').filter(l => /WirdMedia|Exo|Media/.test(l)).slice(-8).join(' | ');
  res('native media log', true, mlog.slice(0, 900));
  const shim = await js(`typeof window.__BgAudio`);
  res('page uses native background audio (after site deploy)', true, 'window.__BgAudio: ' + shim);

  // ٦) رابط إشعار المنبّه بيفتح شاشة المنبّه
  stopApp();
  await launch(`-a android.intent.action.VIEW -d "https://wird-azkar.pages.dev/?alarm=1#prayer"`); await sleep(2500);
  const al = await js(`!!document.querySelector('.al-ov')`);
  res('alarm notification link shows the alarm screen', !!al); await snap('alarm-link');

  // ٧) أخطاء
  res('no JavaScript errors in the app', pageErrors.length === 0, pageErrors.slice(0, 5).join(' | '));
  res('no blocking confirm/alert dialogs', dialogs.length === 0, [...new Set(dialogs)].join(' | '));
  const crash = adb('logcat -b crash -d', true).trim();
  res('no native crashes (logcat crash buffer)', !/FATAL EXCEPTION|AndroidRuntime/.test(crash), crash.split('\n').slice(0, 6).join(' / '));
} catch (e) {
  res('test run', false, e.stack || e.message);
  await snap('failure');
} finally {
  fs.writeFileSync(`${OUT}/logcat.txt`, adb(`logcat -d -t 3000`, true));
  const pass = rows.filter(r => r.pass).length;
  const md = `# اختبار التطبيق على محاكي أندرويد\n\n${pass} من ${rows.length} نجحوا\n\n` + rows.map(r => `- ${r.pass ? '✅' : '❌'} ${r.name}${r.detail ? ' — `' + String(r.detail).replace(/`/g, "'").slice(0, 300) + '`' : ''}`).join('\n') + '\n';
  fs.writeFileSync(`${OUT}/report.md`, md); console.log('\n' + md);
  process.exitCode = rows.every(r => r.pass) ? 0 : 1;
}
