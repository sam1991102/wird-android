// روبوت فحص الموقع الحي: لقطات + تقرير مشاكل
import { chromium, devices } from 'playwright';
import fs from 'fs';
const SITE = process.env.SITE || 'https://wird-azkar.pages.dev/';
const OUT = new URL('./out/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const issues = [], notes = [];
const bad = (where, msg) => issues.push(`[${where}] ${msg}`);
const wait = ms => new Promise(r => setTimeout(r, ms));
const SKINS = [
  { k: 'classic-light', ls: { 'wird-skin': 'classic', 'wird-dark': 'false' } },
  { k: 'classic-dark', ls: { 'wird-skin': 'classic', 'wird-dark': 'true' } },
  { k: 'creative-light', ls: { 'wird-skin': 'ios', 'wird-dark': 'false' } },
  { k: 'creative-dark', ls: { 'wird-skin': 'ios', 'wird-dark': 'true' } },
];
const browser = await chromium.launch();

async function open(ls, fresh = false) {
  const ctx = await browser.newContext({ ...devices['Pixel 7'], locale: 'ar', timezoneId: 'Asia/Riyadh', geolocation: { latitude: 24.71, longitude: 46.67 }, permissions: ['geolocation'] });
  await ctx.addInitScript(([ls, fresh]) => {
    if (!fresh) { localStorage.setItem('wird-setup-done', '1'); localStorage.setItem('wird-onboarded', '1'); }
    for (const [k, v] of Object.entries(ls)) localStorage.setItem(k, v);
    window.__qa = { shifts: 0, longtask: 0, moves: 0 };
    try { new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) __qa.shifts += e.value })).observe({ type: 'layout-shift', buffered: true }); } catch (e) {}
    try { new PerformanceObserver(l => l.getEntries().forEach(e => __qa.longtask += e.duration)).observe({ type: 'longtask', buffered: true }); } catch (e) {}
  }, [ls, fresh]);
  const page = await ctx.newPage();
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
  return { items: cols.map(x => x.t), lit: odd.map(x => x.t) };
});

for (const S of SKINS) {
  const { ctx, page, errs } = await open(S.ls);
  const k = S.k;
  // الرئيسية: ترتيب + رعشة
  await page.evaluate(() => { const m = document.querySelector('main'); new MutationObserver(r => __qa.moves += r.length).observe(m, { childList: true }) });
  await wait(5000);
  const q = await page.evaluate(() => __qa);
  if (q.shifts > 0.1) bad(k + '/home', `اهتزاز في التخطيط CLS=${q.shifts.toFixed(3)}`);
  if (q.moves > 0) bad(k + '/home', `عناصر الرئيسية اتحركت ${q.moves} مرة بعد التحميل (رعشة)`);
  if (q.longtask > 1500) bad(k + '/home', `مهام طويلة تعطّل الواجهة ${Math.round(q.longtask)}ms`);
  for (const [sel, name] of [['#skyCard', 'كارت اليوم'], ['#ayCard', 'الآية والحديث'], ['#homeAlerts', 'أذكار اليوم']]) if (!(await vis(page, sel))) bad(k + '/home', `${name} مش ظاهر`);
  if (await vis(page, '.hero.container')) bad(k + '/home', 'الهيدر القديم ظاهر');
  const order = await page.evaluate(() => ['#skyCard', '#ayCard', '#homeAlerts', '#quranCard'].map(s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : -1 }));
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
      await page.evaluate(i => { const n = document.querySelector('.bottom-nav.nav5'); [...n.children].filter(c => getComputedStyle(c).display !== 'none' && c.offsetWidth)[i].click() }, i);
      await wait(1200);
      const st = await navLit(page);
      if (st.lit.length !== 1) bad(`${k}/nav:${label}`, `الزرار المنوّر: [${st.lit.join('، ') || 'ولا واحد'}]`);
      else if (st.lit[0] !== label) bad(`${k}/nav:${label}`, `المنوّر «${st.lit[0]}» بدل «${label}»`);
      if (label !== 'الرئيسية') { if (await vis(page, '#ayCard')) bad(`${k}/nav:${label}`, 'كارت الآية والحديث ظاهر برا الرئيسية'); if (await vis(page, '#homeAlerts')) bad(`${k}/nav:${label}`, 'أذكار اليوم ظاهرة برا الرئيسية') }
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
      const opened = await page.evaluate(() => { const p = [...document.querySelectorAll('.wp-page,.st:not([hidden]),.mp,#focus:not([hidden])')].filter(e => e.offsetWidth); const h = p.length ? (p.at(-1).querySelector('h1,h2,.wp-h') || {}).textContent : ''; return { n: p.length, h: (h || '').trim().slice(0, 40), view: document.documentElement.dataset.view || '' } });
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
  const big = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.offsetWidth && e.getBoundingClientRect().right > innerWidth + 2 && getComputedStyle(e).position !== 'fixed').slice(0, 3).map(e => e.tagName + '.' + e.className).join(' | '));
  if (big) bad(k, 'عناصر خارجة عن عرض الشاشة: ' + big);
  [...new Set(errs)].forEach(e => bad(k + '/js', e));
  await ctx.close();
}
// المعالج لمستخدم جديد
{
  const { ctx, page, errs } = await open({}, true);
  await wait(2500); await shot(page, 'wizard-0');
  if (!(await vis(page, '.su-ov'))) bad('wizard', 'المعالج ما ظهرش لمستخدم جديد');
  else {
    await page.click('[data-su="go"]');
    for (let s = 1; s <= 7; s++) { const t0 = Date.now(); await wait(1500); await shot(page, 'wizard-' + s); const has = await page.evaluate(() => [...document.querySelectorAll('.wp-page.sh-page,.wp-page.nt-page')].filter(e => e.offsetWidth).length); if (s <= 6 && !has) bad('wizard', `الخطوة ${s} ما فتحتش صفحتها`); const nx = await page.$('[data-su="next"],[data-su="end"]'); if (!nx) break; await nx.click() }
  }
  [...new Set(errs)].forEach(e => bad('wizard/js', e));
  await ctx.close();
}
await browser.close();
const rep = `مشاكل: ${issues.length}\n\n${issues.join('\n')}\n\n--- ملاحظات ---\n${notes.join('\n')}\n`;
fs.writeFileSync(OUT + 'report.txt', rep); console.log(rep);
