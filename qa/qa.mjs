// روبوت فحص الموقع الحي: لقطات + تقرير مشاكل
const { chromium, devices } = await import(process.env.PW || 'playwright');
import fs from 'fs';
const SITE = process.env.SITE || 'https://wird-azkar.pages.dev/';
const OUT = new URL('./out/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const issues = [], notes = [];
const bad = (where, msg) => issues.push(`[${where}] ${msg}`);
const wait = ms => new Promise(r => setTimeout(r, ms));
const SKINS = [
  { k: 'classic-light', ls: { 'wird-skin': 'classic', 'wird-dark': 'false', 'wird-theme': 'light' } },
  { k: 'classic-dark', ls: { 'wird-skin': 'classic', 'wird-dark': 'true', 'wird-theme': 'dark' } },
  { k: 'creative-light', ls: { 'wird-skin': 'ios', 'wird-dark': 'false', 'wird-theme': 'light' } },
  { k: 'creative-dark', ls: { 'wird-skin': 'ios', 'wird-dark': 'true', 'wird-theme': 'dark' } },
];
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});

async function open(ls, fresh = false) {
  const ctx = await browser.newContext({ ...devices['Pixel 7'], colorScheme: ls['wird-dark'] === 'true' ? 'dark' : 'light', locale: 'ar', timezoneId: 'Asia/Riyadh', geolocation: { latitude: 24.71, longitude: 46.67 }, permissions: ['geolocation'] });
  await ctx.addInitScript(([ls, fresh]) => {
    if (!fresh) { localStorage.setItem('wird-setup-done', '1'); localStorage.setItem('wird-onboarded', '1'); }
    for (const [k, v] of Object.entries(ls)) localStorage.setItem(k, v);
    window.__qa = { shifts: 0, longtask: 0, moves: 0 };
    try { new PerformanceObserver(l => l.getEntries().forEach(e => { if (e.hadRecentInput) return; __qa.shifts += e.value; (e.sources || []).forEach(x => { const n = x.node; if (n && n.nodeType === 1) (__qa.src = __qa.src || []).push((n.id ? '#' + n.id : n.tagName.toLowerCase() + '.' + String(n.className).split(' ').slice(0, 2).join('.')) + ' ' + Math.round(x.previousRect.y) + '→' + Math.round(x.currentRect.y)) }) })).observe({ type: 'layout-shift', buffered: true }); } catch (e) {}
    try { new PerformanceObserver(l => l.getEntries().forEach(e => __qa.longtask += e.duration)).observe({ type: 'longtask', buffered: true }); } catch (e) {}
  }, [ls, fresh]);
  const page = await ctx.newPage();
  if (ls['wird-dark'] === 'false') await page.clock.install({ time: new Date('2026-11-14T07:30:00Z') }); // نهار الرياض: الوضع التلقائي فاتح
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)) });
  await page.goto(SITE, { waitUntil: 'load', timeout: 60000 });
  return { ctx, page, errs };
}
const shot = (page, name, full = false) => page.screenshot({ path: OUT + name + '.png', fullPage: full }).catch(() => {});
const vis = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); if (!e) return false; const r = e.getBoundingClientRect(), c = getComputedStyle(e); return r.height > 0 && c.display !== 'none' && c.visibility !== 'hidden' && +c.opacity > 0.05 }, sel);

// حالة الشريط السفلي: كم زر «منوّر»
const navLit = page => page.evaluate(() => {
  const n = document.querySelector('.bottom-nav.nav5'); if (!n) return { missing: true };
  const items = [...n.children].filter(c => getComputedStyle(c).display !== 'none' && c.offsetWidth);
  const cols = items.map(c => ({ t: c.textContent.trim(), col: getComputedStyle(c).color }));
  const count = {}; cols.forEach(x => count[x.col] = (count[x.col] || 0) + 1);
  const odd = cols.filter(x => count[x.col] < items.length / 2); // اللون المختلف = المنوّر
  return { items: cols.map(x => x.t), lit: odd.map(x => x.t), cols: cols.map(x => x.t + '=' + x.col).join(' | '), cls: n.className + ' / html: ' + document.documentElement.className + ' / view=' + (document.documentElement.dataset.view || '') };
});

for (const S of SKINS) {
  const { ctx, page, errs } = await open(S.ls);
  const k = S.k;
  await wait(1500);
  const later = async () => page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.offsetWidth && /^(لاحقًا|لاحقاً|بعدين)$/.test(b.textContent.trim())).forEach(b => b.click()));
  await later(); await wait(400);
  if (await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3')].some(h => h.offsetWidth && /جهّز وِرد في دقيقة/.test(h.textContent)))) bad(k, 'شاشة «جهّز وِرد في دقيقة» القديمة لسه بتظهر');
  // الرئيسية: ترتيب + رعشة
  await page.evaluate(() => { const m = document.querySelector('main'); new MutationObserver(r => { __qa.moves += r.length; __qa.what = (__qa.what || []).concat(r.map(x => [...x.addedNodes, ...x.removedNodes].map(n => (n.id || n.className || n.nodeName)).join(','))) }).observe(m, { childList: true }) });
  await wait(5000);
  const q = await page.evaluate(() => __qa);
  if (q.shifts > 0.1) bad(k + '/home', `اهتزاز في التخطيط CLS=${q.shifts.toFixed(3)}`);
  if (q.moves > 0) bad(k + '/home', `عناصر الرئيسية اتحركت ${q.moves} مرة بعد التحميل (رعشة): ${(q.what || []).join(' ; ')}`);
  if (q.longtask > 1500) bad(k + '/home', `مهام طويلة تعطّل الواجهة ${Math.round(q.longtask)}ms`);
  for (const [sel, name] of [['#skyCard', 'كارت اليوم'], ['#ayCard', 'الآية والحديث'], ['#homeAlerts', 'أذكار اليوم']]) if (!(await vis(page, sel))) bad(k + '/home', `${name} مش ظاهر`);
  if (await vis(page, '.hero.container')) bad(k + '/home', 'الهيدر القديم ظاهر');
  const broken = await page.evaluate(() => [...document.images].filter(i => i.complete && i.offsetWidth && !i.naturalWidth).map(i => i.getAttribute('src')).slice(0, 5));
  if (broken.length) bad(k + '/home', 'صور مكسورة: ' + broken.join(' , '));
  const fonts = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.status === 'error').map(f => f.family).slice(0, 5) });
  if (fonts.length) bad(k + '/home', 'خطوط فشلت في التحميل: ' + [...new Set(fonts)].join(' , '));
  if (!(await vis(page, '#homeAlerts .da-svg'))) bad(k + '/home', 'مسار اليوم مش مرسوم');
  if (!(await vis(page, '#skyCard .sk-x'))) bad(k + '/home', 'ميعاد الصلاة مش ظاهر في كارت اليوم: ' + await page.evaluate(() => { const s = document.getElementById('skyCard'); return s ? [...s.querySelectorAll('*')].filter(e => /بعد/.test(e.textContent) && e.children.length < 4).map(e => e.tagName + '.' + e.className).slice(0, 5).join(' ; ') : 'no skyCard' }));
  const order = await page.evaluate(() => ['#skyCard', '#homeAlerts', '#ayCard', '#quranCard'].map(s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : -1 }));
  if (order.some((v, i) => i && v >= 0 && order[i - 1] >= 0 && v < order[i - 1])) bad(k + '/home', 'ترتيب الرئيسية غلط ' + order.join(','));
  const ayTabs = await page.$$eval('#ayCard .ay-tabs button', b => b.map(x => x.textContent.trim()));
  notes.push(`${k} تبويبات: ${ayTabs.join(' / ') || 'لا يوجد'}`);
  await shot(page, `${k}-01-home`, true);

  // كل زر في الشريط السفلي
  const nav = await navLit(page);
  if (nav.missing) bad(k, 'الشريط السفلي مش موجود');
  else {
    if (nav.items.includes('السبحة')) bad(k + '/nav', 'السبحة لسه في الشريط');
    for (let i = 0; i < nav.items.length; i++) {
      const label = nav.items[i];
      const t0 = Date.now();
      await page.evaluate(() => { __qa.shifts = 0; __qa.longtask = 0; __qa.src = [] });
      await later();
      await page.evaluate(i => { const n = document.querySelector('.bottom-nav.nav5'); [...n.children].filter(c => getComputedStyle(c).display !== 'none' && c.offsetWidth)[i].click() }, i);
      await wait(120); await shot(page, `${k}-02-nav-${i}-early`); await wait(1080);
      const jq = await page.evaluate(() => ({ s: __qa.shifts, l: __qa.longtask, src: (__qa.src || []).slice(0, 6).join(' ; ') }));
      if (jq.s > 0.05) bad(`${k}/nav:${label}`, `رعشة بعد الفتح CLS=${jq.s.toFixed(3)} — ${jq.src}`);
      if (jq.l > 400) bad(`${k}/nav:${label}`, `بطء: مهام طويلة ${Math.round(jq.l)}ms`);
      const st = await navLit(page);
      if (st.lit.length !== 1) bad(`${k}/nav:${label}`, `الزرار المنوّر: [${st.lit.join('، ') || 'ولا واحد'}] — ${st.cols} — ${st.cls}`);
      else if (st.lit[0] !== label) bad(`${k}/nav:${label}`, `المنوّر «${st.lit[0]}» بدل «${label}»`);
      const covered = await page.evaluate(() => [...document.querySelectorAll('.wp-page,.st:not([hidden]),.mp')].some(e => e.offsetWidth && e.getBoundingClientRect().height > innerHeight * .6));
      if (label !== 'الرئيسية' && !covered) { if (await vis(page, '#ayCard')) bad(`${k}/nav:${label}`, 'كارت الآية والحديث ظاهر برا الرئيسية'); if (await vis(page, '#homeAlerts')) bad(`${k}/nav:${label}`, 'أذكار اليوم ظاهرة برا الرئيسية') }
      if (label === 'المواقيت' && !(await vis(page, '#ptTomorrow'))) bad(k + '/prayer', 'مواقيت الغد مش ظاهرة ' + await page.evaluate(() => window.__wPagesDiag ? __wPagesDiag() : 'no-module'));
      if (label === 'المصحف') { const f = await page.evaluate(() => { const v = document.getElementById('mushafView'); return v ? [...v.children].filter(c => c.offsetHeight).slice(0, 2).map(c => c.textContent.trim().slice(0, 30)).join(' | ') : '' }); if (!/القراءة/.test(f)) bad(k + '/mushaf', 'زر القراءة مش في أول الصفحة: ' + f + ' ' + await page.evaluate(() => window.__wPagesDiag ? __wPagesDiag() : 'no-module')) }
      if (label === 'المواقيت') { const n = await page.evaluate(() => [...document.querySelectorAll('#prayer button,#prayer a')].filter(b => b.offsetWidth && /إعداد|ضبط/.test((b.getAttribute('aria-label') || '') + b.textContent)).length); if (n > 1) bad(k + '/prayer', `${n} أزرار إعدادات`) }
      await shot(page, `${k}-02-nav-${i}`);
      await page.evaluate(() => window.__closeOverlays && __closeOverlays()); await wait(400);
      await page.evaluate(() => { const a = document.querySelector('.bottom-nav.nav5 [data-tab="home"],.bottom-nav.nav5 a[href$="#top"]'); a && a.click() }); await wait(600);
    }
  }
  // القائمة الجانبية
  if (k === 'classic-light' || k === 'creative-dark') {
    await page.evaluate(() => { const m = document.querySelector('[aria-label="القائمة"],#menuBtn'); m && m.click() }); await wait(700);
    await shot(page, `${k}-03-drawer`);
    const items = await page.$$eval('.dr2 .dr-p [data-n]', b => b.map(x => [x.dataset.n, x.textContent.trim()]));
    for (const [n, t] of items) {
      await page.evaluate(() => window.__closeOverlays && __closeOverlays()); await wait(300);
      await page.evaluate(() => { const m = document.querySelector('[aria-label="القائمة"],#menuBtn'); m && m.click() }); await wait(600);
      await page.evaluate(n => { const b = document.querySelector(`.dr2 .dr-p [data-n="${n}"]`); b && b.click() }, n); await wait(1500);
      const opened = await page.evaluate(() => { const p = [...document.querySelectorAll('.wp-page,.st:not([hidden]),.mp,#focus:not([hidden]),.wd-sheet:not(.dr2),[role="dialog"]:not([hidden])')].filter(e => e.offsetWidth); const h = p.length ? (p.at(-1).querySelector('h1,h2,.wp-h') || {}).textContent : ''; return { n: p.length, h: (h || '').trim().slice(0, 40), view: document.documentElement.dataset.view || '' } });
      notes.push(`${k} قائمة «${t}» ← ${opened.h || 'view=' + opened.view}`);
      if (!opened.n && !opened.view) bad(`${k}/drawer:${t}`, 'ما فتحش حاجة');
      await shot(page, `${k}-04-drawer-${n}`);
    }
    await page.evaluate(() => window.__closeOverlays && __closeOverlays()); await wait(300);
    // الإعدادات: كل صف
    const rows = await page.evaluate(() => { window.__openSettings && __openSettings(); return null }).then(() => wait(800)).then(() => page.$$eval('.st .sh-row[data-id]', r => r.map(x => [x.dataset.id, x.textContent.trim().slice(0, 25)])));
    await shot(page, `${k}-05-settings`);
    for (const [id, t] of rows) {
      const t0 = Date.now();
      await page.evaluate(id => window.__openSettingsPage && __openSettingsPage(id), id); await wait(1400);
      const ok = await page.evaluate(() => [...document.querySelectorAll('.wp-page.sh-page,.wp-page.nt-page')].filter(e => e.offsetWidth).length);
      if (!ok) bad(`${k}/settings:${t}`, 'صفحة الإعداد ما فتحتش');
      await shot(page, `${k}-06-set-${id}`);
      await page.evaluate(() => window.__closeOverlays && __closeOverlays()); await wait(300);
    }
  }
  const big = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { if (!e.offsetWidth || e.getBoundingClientRect().right <= innerWidth + 2 || getComputedStyle(e).position === 'fixed') return false; for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o !== 'visible' && a.getBoundingClientRect().right <= innerWidth + 2) return false } return true }).slice(0, 3).map(e => e.tagName + '.' + e.className + '«' + e.textContent.trim().slice(0, 30) + '» in ' + (e.closest('[id],section')||{}).id).join(' | '));
  if (big) bad(k, 'عناصر خارجة عن عرض الشاشة: ' + big);
  [...new Set(errs)].filter(e => !/Clipboard|clipboard/.test(e)).forEach(e => bad(k + '/js', e));
  await ctx.close();
}
// تقرير مكونات شاشة القراءة وصفحة المواقيت (للتطوير)
{
  const { ctx, page } = await open(SKINS[0].ls);
  await wait(1500);
  await page.evaluate(() => { const a = document.querySelector('.bottom-nav.nav5 [data-tab="mushaf"]'); a && a.click() }); await wait(1200);
  await page.evaluate(() => { const b = document.querySelector('.mv-card.mv-primary'); b && b.click() }); await wait(3000);
  await shot(page, 'reader-1');
  const outline = await page.evaluate(() => { const root = document.querySelector('.mp') || document.querySelector('[class*="reader"]'); if (!root) return 'no .mp'; const walk = (e, d) => d > 4 ? '' : '  '.repeat(d) + e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : '') + (e.children.length ? '' : ' «' + e.textContent.trim().slice(0, 25) + '»') + (e.getAttribute('aria-label') ? ' [' + e.getAttribute('aria-label') + ']' : '') + '\n' + [...e.children].slice(0, 12).map(c => walk(c, d + 1)).join(''); return walk(root, 0) });
  notes.push('READER:\n' + outline);
  await page.evaluate(() => { const p = document.querySelector('.mp .mp-head'); p && p.click() }); await wait(500); await shot(page, 'reader-2-imm');
  if (!(await page.evaluate(() => document.querySelector('.mp')?.classList.contains('mp-imm')))) bad('reader', 'اللمسة على المكان الفاضي ما خبّتش الشريطين');
  await page.evaluate(() => { const p = document.querySelector('.mp .mp-head'); p && p.click() }); await wait(400);
  await page.evaluate(() => { const b = document.querySelector('.mp .mp-nt'); b && b.click() }); await wait(500); await shot(page, 'reader-3-night');
  if (!(await page.evaluate(() => document.querySelector('.mp')?.classList.contains('mp-night')))) bad('reader', 'زر الوضع الليلي مش شغال');
  const ls = await page.evaluate(() => Object.keys(localStorage).join(' '));
  notes.push('LS: ' + ls);
  notes.push('GLOBALS: ' + Object.keys(await page.evaluate(() => { const o = {}; for (const k in window) if (/adhan|notif|azan|prayer|mushaf|qari/i.test(k)) o[k] = 1; return o })).join(' '));
  await ctx.close();
}
// مسح كل زر في صفحات الإعدادات لكل مظهر: هل الزر قابل للضغط فعلاً؟ وهل بيعمل أي حاجة؟
const SKIP = /حذف|مسح|إعادة ضبط|تصفير|استيراد|تصدير|نسخة|مشاركة|شارك|تثبيت|إلغاء الاشتراك|تسجيل|إرسال|تواصل|الخصوصية|تحقق من التحديث|إعادة معالج/;
for (const S of SKINS) {
  const k = S.k;
  let ids = [];
  {
    const { ctx, page } = await open(S.ls); await wait(1500);
    await page.evaluate(() => window.__openSettings && __openSettings()); await wait(900);
    ids = await page.$$eval('.sh-row[data-id]', r => [...new Set(r.map(x => x.dataset.id))]);
    notes.push(`${k} sweep pages: ${ids.join(',') || 'NONE'}`);
    if (!ids.length) bad(k + '/sweep', 'ما لقيتش صفحات الإعدادات للفحص');
    for (const need of ['notif', 'st-prayer', 'st-adhan', 'st-dr', 'st-remind', 'st-look', 'st-qari', 'st-data', 'st-about']) if (!ids.includes(need)) bad(k + '/settings', 'صف ناقص من الإعدادات: ' + need);
    await ctx.close();
  }
  for (const id of ids) {
    const { ctx, page } = await open(S.ls); await wait(1300);
    await page.evaluate(id => window.__openSettingsPage && __openSettingsPage(id), id); await wait(1500);
    const n = await page.evaluate(() => { const p = [...document.querySelectorAll('.wp-page.sh-page,.wp-page.nt-page')].filter(e => e.offsetWidth).pop(); if (!p) return -1; p.dataset.qa = 1; const els = [...p.querySelectorAll('button,[role=switch],[role=button],input[type=checkbox],input[type=radio],label.switch')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 8 && r.height > 8 && getComputedStyle(e).visibility !== 'hidden' && !e.closest('.wp-back,.wp-h') }); els.forEach((e, i) => e.dataset.qb = i); return els.length });
    if (n < 0) { bad(`${k}/${id}`, 'الصفحة ما فتحتش'); await ctx.close(); continue }
    const dead = [], covered = [];
    for (let i = 0; i < n; i++) {
      // نقفل أي نافذة فتحها الزر اللي قبله (منبّه/قائمة اختيار) لأنها بتظهر فوق صفحة الإعدادات عن قصد
      await page.evaluate(() => { document.querySelectorAll('.al-ov,.adhan-ov,.wd-sheet,.sheet,.ig-sheet').forEach(o => { if (o.closest('[data-qa]') || !o.offsetWidth) return; const b = o.querySelector('[data-x],.close,#alStop,[aria-label="إغلاق"]'); if (b) b.click(); if (o.offsetWidth) o.hidden = true }); try { window.__wirdNative && __wirdNative.stop() } catch (e) { } }); await wait(250);
      const info = await page.evaluate(i => { const e = document.querySelector(`[data-qa] [data-qb="${i}"]`); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); const lab = e.closest('label'); const t = (e.getAttribute('aria-label') || e.textContent || (lab && lab.textContent) || e.name || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 30); const x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); const ok = !!top && (e === top || e.contains(top) || top.contains(e) || (!!lab && lab.contains(top))); return { t, x, y, ok, top: top ? top.tagName + '.' + String(top.className).slice(0, 30) : 'none' } }, i);
      if (!info || SKIP.test(info.t)) continue;
      if (!info.ok && /^HEADER\.wp-h/.test(info.top)) continue; // الهيدر الثابت فوق العنصر بعد التمرير، مش مشكلة حقيقية
      if (!info.ok) { if (await page.evaluate(() => [...document.querySelectorAll('.wp-page')].filter(e => e.offsetWidth).pop()?.dataset.qa !== '1')) break; covered.push(info.t + ' ← ' + info.top); continue }
      await page.evaluate(() => { window.__qm = 0; window.__qo && __qo.disconnect(); window.__qo = new MutationObserver(r => __qm += r.length); __qo.observe(document.documentElement, { subtree: true, attributes: true, childList: true, characterData: true }); window.__qls = JSON.stringify(localStorage) });
      await page.mouse.click(info.x, info.y); await wait(500);
      const ch = await page.evaluate(() => typeof __qm === 'undefined' ? { reload: true } : ({ m: __qm, ls: JSON.stringify(localStorage) !== __qls })).catch(() => ({ reload: true }));
      if (ch.reload) { notes.push(`${k}/${id}: «${info.t}» أعاد تحميل الصفحة`); await wait(1500); break }
      if (!ch.m && !ch.ls) dead.push(info.t);
      if (!(await page.evaluate(() => !!document.querySelector('[data-qa]')).catch(() => false))) break;
    }
    notes.push(`${k}/${id}: ${n} عناصر`);
    if (covered.length) bad(`${k}/${id}`, 'أزرار مغطّية مش بتتضغط: ' + covered.join(' | '));
    if (dead.length) bad(`${k}/${id}`, 'أزرار مش بتعمل حاجة: ' + dead.join(' | '));
    await shot(page, `${k}-07-btn-${id}`);
    await ctx.close();
  }
}
// تقرير شاشة الأذكار بخط كبير
{
  const { ctx, page } = await open(SKINS[0].ls);
  await wait(1500);
  await page.evaluate(() => { const b = document.querySelector('#homeAlerts .da-lb[data-k="morning"]') || document.querySelector('#homeAlerts .da-go'); b && b.click() }); await wait(1500);
  for (let i = 0; i < 4; i++) { await page.evaluate(() => { const b = [...document.querySelectorAll('#focus button')].find(b => /^أ\+?$/.test(b.textContent.trim()) || /حجم|تكبير/.test(b.getAttribute('aria-label') || '')); b && b.click() }); await wait(300) }
  await wait(1500); await shot(page, 'focus-big');
  const fo = await page.evaluate(() => { const root = document.getElementById('focus'); if (!root) return 'no #focus'; const walk = (e, d) => d > 5 ? '' : '  '.repeat(d) + e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).join('.') : '') + ' ' + Math.round(e.getBoundingClientRect().top) + '/' + Math.round(e.getBoundingClientRect().height) + ' ' + getComputedStyle(e).display + '/' + getComputedStyle(e).overflowY + '/' + getComputedStyle(e).justifyContent + (e.children.length ? '' : ' «' + e.textContent.trim().slice(0, 20) + '»') + (e.getAttribute('aria-label') ? ' [' + e.getAttribute('aria-label') + ']' : '') + '\n' + [...e.children].slice(0, 14).map(c => walk(c, d + 1)).join(''); return walk(root, 0) });
  notes.push('FOCUS:\n' + fo.split('\n').slice(0, 25).join('\n'));
  const fl = await page.evaluate(() => { const f = document.getElementById('focus'), st = document.getElementById('fStage'), t = document.getElementById('fText'); if (!f || !st || !t) return 'no-focus'; return { long: f.classList.contains('f-long'), textTop: Math.round(t.getBoundingClientRect().top - st.getBoundingClientRect().top), acts: getComputedStyle(document.getElementById('fActs')).display } });
  if (fl === 'no-focus') bad('focus', 'شاشة الأذكار ما فتحتش'); else if (fl.long && fl.textTop < -2) bad('focus', 'أول النص مقصوص من فوق ' + JSON.stringify(fl)); else notes.push('FOCUS-CHECK ' + JSON.stringify(fl));
  await ctx.close();
}
// المعالج لمستخدم جديد
{
  const { ctx, page, errs } = await open({}, true);
  await wait(2500); await shot(page, 'wizard-0');
  if (!(await vis(page, '.su-ov'))) bad('wizard', 'المعالج ما ظهرش لمستخدم جديد');
  else {
    await page.click('[data-su="go"]');
    for (let s = 1; s <= 7; s++) { const t0 = Date.now(); await wait(1500); await shot(page, 'wizard-' + s); if (await vis(page, '.su-ov')) break; const has = await page.evaluate(() => [...document.querySelectorAll('.wp-page.sh-page,.wp-page.nt-page')].filter(e => e.offsetWidth).length); if (!has) bad('wizard', `الخطوة ${s} ما فتحتش صفحتها`); const nx = await page.$('[data-su="next"],[data-su="end"]'); if (!nx) break; await nx.click() }
  }
  [...new Set(errs)].forEach(e => bad('wizard/js', e));
  await ctx.close();
}
await browser.close();
const rep = `مشاكل: ${issues.length}\n\n${issues.join('\n')}\n\n--- ملاحظات ---\n${notes.join('\n')}\n`;
fs.writeFileSync(OUT + 'report.txt', rep); console.log(rep);
if (issues.length) process.exitCode = 1;
