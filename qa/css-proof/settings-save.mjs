// لكل صفحة إعدادات: نغيّر كل مفتاح/اختيار ظاهر، ونتأكد إن التخزين اتغيّر وإن مفيش IDs متكررة
const { chromium } = await import('/tmp/node_modules/playwright-core/index.mjs');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await c.addInitScript(() => { const S = (k, v) => localStorage.setItem(k, v); S('wird-setup-done', '1'); S('wird-onboarded', '1'); S('wird-welcome', String(Date.now())); S('wird-perm', '1'); window.__WIRD_NATIVE = 1 });
const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('http://localhost:8787/'); await p.waitForTimeout(2000);
const snap = () => p.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k) } return o });
const pages = ['notif', 'st-prayer', 'st-adhan', 'st-alarm', 'st-fast', 'st-dr', 'st-remind', 'st-look', 'st-qari', 'st-data', 'st-about'];
for (const id of pages) {
  await p.evaluate(() => { __closeOverlays(); document.querySelectorAll('.wp-page').forEach(x => x.remove()) }); await p.waitForTimeout(300);
  await p.evaluate(id => __openSettingsPage(id), id); await p.waitForTimeout(900);
  const dups = await p.evaluate(() => { const ids = {}; for (const e of document.querySelectorAll('[id]')) ids[e.id] = (ids[e.id] || 0) + 1; return Object.keys(ids).filter(k => ids[k] > 1) });
  const ctrls = await p.evaluate(() => { const pg = [...document.querySelectorAll('.wp-page')].pop(); if (!pg) return []; return [...pg.querySelectorAll('input[type=checkbox],select,.og-sw,[role=switch]')].filter(e => e.getClientRects().length).map((e, i) => { e.dataset.tst = i; return { i, tag: e.tagName, id: e.id, type: e.type || e.getAttribute('role') || '', lbl: (e.closest('label,.st-row,.og-row')?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28) } }) });
  const res = [];
  for (const k of ctrls) {
    const before = await snap();
    const sel = `.wp-page [data-tst="${k.i}"]`;
    try {
      if (k.tag === 'SELECT') { const opts = await p.$$eval(sel + ' option', o => o.map(x => x.value)); const cur = await p.$eval(sel, e => e.value); const nv = opts.find(v => v !== cur); if (nv == null) { res.push('· ' + k.lbl + ' (خيار واحد)'); continue } await p.selectOption(sel, nv) }
      else await p.locator(sel).click({ force: true, timeout: 2000 });
    } catch (e) { res.push('✗ ' + (k.id || k.lbl) + ' تعذّر الضغط'); continue }
    await p.waitForTimeout(300);
    const after = await snap(); const ch = Object.keys({ ...before, ...after }).filter(x => before[x] !== after[x] && !/wird-(visits|ping|anon|last|deep)/.test(x));
    res.push((ch.length ? '✓ ' : '✗ ') + (k.id || k.tag.toLowerCase()) + ' «' + k.lbl + '» ' + (ch.join(',') || 'ما اتحفظش'));
  }
  console.log('\n## ' + id + (dups.length ? '  DUP IDS: ' + dups.join(',') : '') + '\n' + res.join('\n'));
}
console.log('\nerrors:', errs.join(' | ') || 'none'); await b.close();
