// فحص الأيقونات والمقاسات: يكمّل audit.mjs (اللي بيستثني svg).
// 1) تباين كل أيقونة مع الخلفية اللي تحتها فعلاً (حد أدنى 3:1).
// 2) أيقونات نفس المجموعة (نفس الحاوية) لازم يكون لها نفس المقاس ونفس اللون.
// 3) نص مقصوص (أطول من مكانه ومخفي) أو عنصر طالع برّه الشاشة.
// 4) المحاذاة: في أي قائمة (٣ عناصر أو أكتر من نفس النوع)، العمود الواحد لازم يبدأ من نفس المكان في كل الصفوف.
// التشغيل: SITE=http://localhost:8787/ node qa/theme/icons.mjs [out.json]
import fs from 'node:fs';
import { COMBOS, PAGES } from './audit.mjs';
const PW = process.env.PW || '/tmp/node_modules/playwright-core/index.mjs';
const { chromium } = await import(PW);
const SITE = process.env.SITE || 'http://localhost:8787/';
const OUT = process.argv[2] || 'icons-audit.json';
// أجزاء بألوانها الخاصة عن قصد (ورق المصحف، سماء الوقت، رسوم الأطفال، شعارات)
const SKIP = ['.ph-art', '.w-sky', '.mp-page', '.mp-lines', '.sky-', '#skyCard', '.kd-art', '.su-icon', '#wSplash', '.brand', '.logo'];

export async function scanIcons(browser, only) {
  const rows = [];
  for (const [skin, mode] of COMBOS) {
    const ctx = await browser.newContext({ viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true });
    await ctx.addInitScript(s => { localStorage.setItem('wird-setup-done', '1'); localStorage.setItem('wird-onboarded', '1'); sessionStorage.setItem('wird-splash', '1'); localStorage.setItem('wird-skin', s) }, skin);
    const p = await ctx.newPage();
    for (const [name, code] of PAGES) {
      if (only && !only.includes(name)) continue;
      await p.goto(SITE); await p.waitForTimeout(1500);
      await p.evaluate(m => { const R = document.documentElement; R.classList.remove('dark', 'sepia'); if (m !== 'light') R.classList.add(m) }, mode);
      await p.evaluate(c => { try { eval(c) } catch (e) { } }, code); await p.waitForTimeout(900);
      const r = await p.evaluate(SKIP => {
        const cv = document.createElement('canvas').getContext('2d');
        const col = s => { if (!s || s === 'none' || /url\(/.test(s)) return null; if (/^color\(srgb/.test(s)) { const n = s.match(/[\d.]+/g).map(Number); return [n[0] * 255, n[1] * 255, n[2] * 255, n[3] ?? 1] } cv.fillStyle = '#0000'; cv.fillStyle = s; const v = cv.fillStyle; if (v[0] === '#') return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16), 1]; const n = v.match(/[\d.]+/g).map(Number); return [n[0], n[1], n[2], n[3] ?? 1] };
        const lum = c => { const f = x => { x /= 255; return x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4 }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]) };
        const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05) };
        const mix = (top, bot) => { const a = top[3]; return [top[0] * a + bot[0] * (1 - a), top[1] * a + bot[1] * (1 - a), top[2] * a + bot[2] * (1 - a), 1] };
        const vis = e => { const b = e.getBoundingClientRect(); if (b.width < 2 || b.height < 2 || b.bottom < 0 || b.top > innerHeight * 3) return false; for (let n = e; n && n.nodeType === 1; n = n.parentElement) { const s = getComputedStyle(n); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < .05) return false } return true };
        // نطابق بداية اسم الكلاس على العنصر وأجداده لحد قبل body (html نفسه عليه كلاسات زي sky-… فما ينفعش يدخل)
        const skip = e => { for (let n = e; n && n !== document.body && n !== document.documentElement; n = n.parentElement) { const cl = n.getAttribute && (n.getAttribute('class') || ''); for (const s of SKIP) { if (s[0] === '#' ? n.id === s.slice(1) : cl.split(/\s+/).some(c => c.startsWith(s.slice(1)))) return true } } return false };
        // الخلفية الفعلية: نجمع طبقات الخلفية من العنصر لفوق؛ التدرّج ناخد منه أول وآخر لون ونحسب الأسوأ
        const bgs = e => { let stack = []; for (let n = e; n; n = n.parentElement) { const s = getComputedStyle(n); const g = s.backgroundImage; if (g && g !== 'none' && /gradient/.test(g)) { const cs = (g.match(/(rgba?\([^)]+\)|#[0-9a-f]{3,8})/gi) || []).map(col).filter(Boolean); if (cs.length) { stack.push(cs); if (cs.every(c => c[3] > .9)) break } } const c = col(s.backgroundColor); if (c && c[3] > 0) { stack.push([c]); if (c[3] > .9) break } } let res = [[255, 255, 255, 1]]; for (let i = stack.length - 1; i >= 0; i--) { const out = []; for (const t of stack[i]) for (const b of res) out.push(mix(t, b)); res = out } return res };
        const sel = e => { const p = e.parentElement; return (p ? p.tagName.toLowerCase() + (p.className && typeof p.className === 'string' ? '.' + p.className.trim().split(/\s+/).slice(0, 2).join('.') : '') : '') + ' > svg' + (e.classList.length ? '.' + [...e.classList].slice(0, 2).join('.') : '') };
        const out = { contrast: [], groups: {}, clip: [], n: 0 };
        for (const sv of document.querySelectorAll('svg')) {
          if (sv.parentElement && sv.parentElement.closest('svg')) continue;
          if (!vis(sv) || skip(sv)) continue;
          // لون الرسم: أول عنصر مرسوم فعلاً
          // أقوى لون في الأيقونة (بعضها فيه مسار خلفية باهت عن قصد، زي مسار حلقة العدّاد)
          const under = bgs(sv.parentElement); let ink = null, worst = 0;
          for (const sh of sv.querySelectorAll('path,circle,rect,line,polyline,polygon,ellipse,text')) {
            const s = getComputedStyle(sh); const st = col(s.stroke), fi = col(s.fill);
            const c = (st && parseFloat(s.strokeWidth) > 0 && st[3] > 0) ? st : (fi && fi[3] > 0 ? fi : null);
            if (!c) continue; const k = [c[0], c[1], c[2], c[3] * (+s.opacity || 1)];
            const w = Math.min(...under.map(b => cr(mix(k, b), b))); if (w > worst) { worst = w; ink = k }
          }
          if (!ink) continue; out.n++;
          const bb = sv.getBoundingClientRect();
          const key = sel(sv);
          if (worst < 3) out.contrast.push({ key, ratio: +worst.toFixed(2), ink: `rgb(${ink.slice(0, 3).map(Math.round)})` });
          // مجموعة = نفس نوع الزرار/المربع جوه نفس الصف — الأيقونات جواها لازم تتطابق مقاسًا ولونًا
          const ST = /^(on|active|sel|is-|mv-primary|cur)/; const c1 = n => { if (!n) return ''; const cl = (n.getAttribute('class') || '').trim().split(/\s+/); return n.tagName.toLowerCase() + '.' + cl[0] + cl.filter(c => ST.test(c)).map(c => '.' + c).join('') + (n.getAttribute('aria-current') || n.getAttribute('aria-selected') === 'true' ? '.cur' : '') }; const gk = c1(sv.parentElement && sv.parentElement.parentElement) + ' > ' + c1(sv.parentElement);
          (out.groups[gk] ||= []).push({ w: Math.round(bb.width), h: Math.round(bb.height), ink: `rgb(${ink.slice(0, 3).map(Math.round)})`, key });
        }
        for (const e of document.querySelectorAll('body *')) {
          if (e.children.length || !e.textContent.trim() || !vis(e) || skip(e)) continue;
          const s = getComputedStyle(e);
          const hid = /hidden|clip/.test(s.overflow + s.overflowX) || s.textOverflow === 'ellipsis';
          if (hid && (e.scrollWidth > e.clientWidth + 2 || e.scrollHeight > e.clientHeight + 4)) out.clip.push({ key: e.tagName.toLowerCase() + '.' + (typeof e.className === 'string' ? e.className.split(' ')[0] : ''), text: e.textContent.trim().slice(0, 30) });
          const b = e.getBoundingClientRect(); if (b.right > innerWidth + 2 || b.left < -2) out.clip.push({ key: 'برّه الشاشة ' + e.tagName.toLowerCase() + '.' + (typeof e.className === 'string' ? e.className.split(' ')[0] : ''), text: e.textContent.trim().slice(0, 30) });
        }
        // مجموعات ألوانها مختلفة عن قصد (كل صف إعدادات له لونه)، بس المقاس لازم يتطابق
        const INK_VARY = ['nt-ic'];
        // المحاذاة: الصفوف اللي من نفس النوع جوه نفس الحاوية — كل ابن بنفس الترتيب والنوع لازم حافته اليمين (بداية السطر العربي) تبقى واحدة
        const align = [];
        for (const box of document.querySelectorAll('ul,ol,div,section')) {
          if (skip(box) || !vis(box)) continue;
          const rows = [...box.children].filter(r => vis(r) && r.children.length >= 3 && getComputedStyle(r).display !== 'inline');
          const groups = {}; for (const r of rows) (groups[r.tagName + '<' + [...r.children].slice(0, 3).map(k => k.tagName).join(',') + '>'] ||= []).push(r); // المجموعة = نوع الصف + أول ٣ عناصر جواه (الكلاس ممكن يختلف: fajr / dhuhr)
          for (const [g, rs] of Object.entries(groups)) {
            if (rs.length < 3) continue;
            const same = rs.filter(r => Math.abs(r.getBoundingClientRect().width - rs[0].getBoundingClientRect().width) < 2 && Math.abs(r.getBoundingClientRect().left - rs[0].getBoundingClientRect().left) < 2); if (same.length < 3) continue;
            const kids = r => [...r.children].filter(k => vis(k) && getComputedStyle(k).position !== 'absolute');
            const key = k => k.tagName + '.' + ((k.getAttribute('class') || '').split(/\s+/)[0]);
            const cols = {}; for (const r of same) { const R = r.getBoundingClientRect(); const seen = {}; for (const k of kids(r)) { const k0 = key(k); seen[k0] = (seen[k0] || 0) + 1; const kk = k0 + '#' + seen[k0]; if (/^(svg|i|b)\./i.test(kk) && k.children.length === 0 && !k.textContent.trim()) continue; const K = k.getBoundingClientRect(); (cols[kk] ||= []).push([Math.round(R.right - K.right), Math.round(K.left - R.left)]) } }
            /* العمود مضبوط لو بدايته (يمين) أو نهايته (شمال) على خط واحد — زرار في آخر السطر بيتحاذى من الشمال */
            for (const [kk, xs] of Object.entries(cols)) { if (xs.length < 3) continue; const spR = Math.max(...xs.map(x => x[0])) - Math.min(...xs.map(x => x[0])), spL = Math.max(...xs.map(x => x[1])) - Math.min(...xs.map(x => x[1])), sp = Math.min(spR, spL); if (sp > 4) align.push({ group: g, col: kk, spread: sp }) }
          }
        }
        const mism = [];
        for (const [g, a] of Object.entries(out.groups)) { if (a.length < 2) continue; const sz = new Set(a.map(x => x.w + 'x' + x.h)), ik = new Set(a.map(x => x.ink)); const many = INK_VARY.some(c => g.includes(c)); if (sz.size > 1 || (ik.size > 1 && !many)) mism.push({ group: g, sizes: [...sz], inks: [...ik], n: a.length }) }
        return { checked: out.n, contrast: out.contrast, mismatch: mism, clip: out.clip, align };
      }, SKIP);
      rows.push({ skin, mode, page: name, ...r });
    }
    await ctx.close();
  }
  return rows;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome' }); const rows = await scanIcons(b, process.env.ONLY && process.env.ONLY.split(',')); await b.close();
  fs.writeFileSync(OUT, JSON.stringify(rows, null, 1));
  const n = k => rows.reduce((s, r) => s + r[k].length, 0);
  console.log(`أيقونات اتفحصت: ${rows.reduce((s, r) => s + r.checked, 0)} | أيقونات تباينها ضعيف: ${n('contrast')} | مجموعات مش متطابقة: ${n('mismatch')} | نص مقصوص/برّه الشاشة: ${n('clip')} | أعمدة مش على خط واحد: ${n('align')}`);
}
