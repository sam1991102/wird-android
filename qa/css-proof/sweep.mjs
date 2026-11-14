// مسح شامل: كل شاشة × ٤ مظاهر × موبايل وكمبيوتر — أخطاء JS، طلبات فاشلة، صور مكسورة، عناصر طالعة بره الشاشة،
// أزرار أصغر من ٣٢ بكسل، نص أصغر من ١١ بكسل، أزرار من غير اسم، IDs متكررة.
const { chromium } = await import('/tmp/node_modules/playwright-core/index.mjs');
const SITE = 'http://localhost:8787/';
const SK = { cl: ['classic', false], id: ['ios', true] };
const VP = { m: [390, 844, true], d: [1280, 860, false] };
const SET = ['notif', 'st-prayer', 'st-adhan', 'st-alarm', 'st-fast', 'st-dr', 'st-remind', 'st-look', 'st-qari', 'st-data', 'st-about'];
const SCREENS = [['home', ''], ['library', '__wirdGo("library")'], ['list', '__wirdGo("library");setCategory("morning")'], ['mushaf', '__wirdGo("mushaf")'],
  ['prayer', '__wirdGo("prayer")'], ['radio', '__openRadio()'], ['settings', '__openSettings()'], ...SET.map(s => ['set:' + s, `__openSettingsPage("${s}")`]),
  ['drawer', '__openDrawer()'], ['search', '__openSearch()'], ['tools', '__openTools()'], ['kids', '__openKids()'], ['learn', '__openLearn()'], ['hajj', '__openHajj()'],
  ['hadith', '__openHadith()'], ['hijri', '__openHijri()'], ['qibla', '__openQibla()'], ['names', '__openNames()'], ['tasbih', '__wirdGo("tasbih")'], ['setup', '__openSetup()'],
  ['focus', '__wirdGo("library");setCategory("morning");setTimeout(()=>document.querySelector("#adhkarList .dhikr-card")?.click(),300)'],
  ['surah', '__openSurah&&__openSurah(1)'], ['bookmarks', '__openBookmarks&&__openBookmarks()'], ['ruqya', '__openRuqya&&__openRuqya()']];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const issues = new Map(); const add = (k, where) => { if (!issues.has(k)) issues.set(k, new Set()); issues.get(k).add(where) };
for (const [sk, [skin, dark]] of Object.entries(SK)) for (const [vk, vp] of Object.entries(VP)) {
  const c = await b.newContext({ viewport: { width: vp[0], height: vp[1] }, isMobile: vp[2], hasTouch: vp[2], colorScheme: dark ? 'dark' : 'light' });
  await c.addInitScript(([skin, dark]) => { const S = (k, v) => localStorage.setItem(k, v); S('wird-setup-done', '1'); S('wird-onboarded', '1'); S('wird-skin', skin); S('wird-theme-mode', 'manual'); S('wird-dark', dark ? 'true' : 'false'); S('wird-theme-v2', '1'); S('wird-welcome', String(Date.now())); S('wird-perm', '1'); window.__WIRD_NATIVE = 1 }, [skin, dark]);
  for (const [name, js] of SCREENS) {
    const where = `${sk}-${vk}-${name}`;
    const p = await c.newPage();
    p.on('pageerror', e => add('JS error: ' + e.message.slice(0, 120), where));
    p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_TUNNEL|net::/.test(m.text())) add('console.error: ' + m.text().slice(0, 120), where) });
    p.on('requestfailed', r => { const u = r.url(); if (u.startsWith(SITE)) add('request failed: ' + u.replace(SITE, '/'), where) });
    p.on('response', r => { const u = r.url(); if (u.startsWith(SITE) && r.status() >= 400 && !/\/mushaf\/\d+\.json/.test(u)) add('HTTP ' + r.status() + ': ' + u.replace(SITE, '/'), where) });
    await p.goto(SITE); await p.waitForTimeout(1800);
    if (js) await p.evaluate(js => { try { (0, eval)(js) } catch (e) { console.error('open failed: ' + e.message) } }, js);
    await p.waitForTimeout(1300);
    const r = await p.evaluate(() => {
      const out = [], W = document.documentElement.clientWidth, H = innerHeight;
      const vis = e => { const r = e.getBoundingClientRect(); if (!r.width || !r.height) return null; const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || +cs.opacity < .05) return null; return r };
      const name = e => (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '') || e.tagName.toLowerCase();
      const top = e => { const r = e.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2; if (y < 0 || y > H || x < 0 || x > W) return true; const t = document.elementFromPoint(x, y); return t && (t === e || e.contains(t) || t.contains(e)) };
      // صور مكسورة
      for (const i of document.images) if (i.complete && i.naturalWidth === 0 && vis(i) && i.src && !/data:/.test(i.src)) out.push('broken image: ' + i.src.replace(location.origin, ''));
      // عناصر طالعة بره عرض الشاشة (من غير ما يكون الأب عامل overflow)
      for (const e of document.querySelectorAll('body *')) { const r = vis(e); if (!r) continue; if (r.right > W + 2 || r.left < -2) { let p = e.parentElement, clip = false; for (; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p); if (/hidden|auto|scroll|clip/.test(o.overflowX) || o.position === 'fixed' && getComputedStyle(e).position === 'fixed') { clip = true; break } } if (!clip && getComputedStyle(e).position !== 'fixed') out.push('off-screen: ' + name(e)) } }
      if (document.documentElement.scrollWidth > W + 1) out.push('horizontal scroll: ' + (document.documentElement.scrollWidth - W) + 'px');
      // أزرار صغيرة جدًا أو من غير اسم
      for (const e of document.querySelectorAll('button,a[href],[role=button],input,select,[tabindex="0"]')) { const r = vis(e); if (!r || !top(e)) continue;
        if ((r.width < 28 || r.height < 28) && !e.closest('.mp,.mushaf,#mushafView,p,li')) out.push('tiny target: ' + name(e) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
        const label = (e.getAttribute('aria-label') || e.textContent || e.title || e.getAttribute('placeholder') || e.value || (e.labels && e.labels[0] && e.labels[0].textContent) || '').trim();
        if (!label && e.tagName !== 'INPUT' || e.tagName === 'INPUT' && !label && e.type !== 'hidden' && e.type !== 'range') out.push('no name: ' + name(e)) }
      // نص صغير جدًا
      for (const e of document.querySelectorAll('body *')) { if (![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue; const r = vis(e); if (!r || !top(e)) continue; const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < 11) out.push('tiny text ' + fs + 'px: ' + name(e) + ' «' + e.textContent.trim().slice(0, 14) + '»') }
      // IDs متكررة
      const ids = {}; for (const e of document.querySelectorAll('[id]')) ids[e.id] = (ids[e.id] || 0) + 1; for (const k in ids) if (ids[k] > 1) out.push('duplicate id: #' + k + ' ×' + ids[k]);
      return [...new Set(out)];
    });
    r.forEach(x => add(x, where)); await p.close();
  }
  await c.close(); process.stdout.write(sk + '-' + vk + ' done\n');
}
const rows = [...issues].sort((a, b) => b[1].size - a[1].size);
console.log('\n' + rows.length + ' distinct issues');
for (const [k, w] of rows) console.log(String(w.size).padStart(3), k, '  e.g.', [...w].slice(0, 3).join(' '));
await b.close();
