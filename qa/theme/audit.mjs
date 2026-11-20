// فحص الألوان: يفتح كل صفحة ونافذة في المظاهر الخمسة، ويقارن كل لون ظاهر بقائمة ألوان المظهر (الرموز --bg و--ink ...)
// ويقول على أي لون مش من القائمة، والقاعدة اللي في ملفات التنسيق اللي حطّته، وأي نص صعب يتقري.
// التشغيل: SITE=http://localhost:8787/ node qa/theme/audit.mjs [out.json]
import fs from 'node:fs';
const PW = process.env.PW || '/tmp/node_modules/playwright-core/index.mjs';
const { chromium } = await import(PW);
const SITE = process.env.SITE || 'http://localhost:8787/';
const OUT = process.argv[2] || 'theme-audit.json';

export const COMBOS = [['classic', 'light'], ['classic', 'dark'], ['classic', 'sepia'], ['ios', 'light'], ['ios', 'dark']];
export const PAGES = [
  ['الرئيسية', "__setView('home')"], ['الأذكار', "__setView('library')"], ['المواقيت', "__setView('prayer')"],
  ['السبحة', "__setView('tasbih')"], ['المصحف', "__setView('mushaf')"], ['الإعدادات', '__openSettings()'],
  ['الإشعارات', '__openNotif()'], ['صوت الأذان', '__openAdhanSettings()'], ['المواقيت (إعدادات)', '__openSettingsPage("st-prayer")'],
  ['المظهر', '__openSettingsPage("st-look")'], ['عن وِرد', '__openSettingsPage("st-about")'], ['الحج', '__openHajj()'],
  ['الأحاديث', '__openHadith()'], ['الرقية', '__openRuqya()'], ['ركن الطفل', '__openKids()'], ['تعليم العبادات', '__openLearn()'],
  ['الأدوات', '__openTools()'], ['الهجري', '__openHijri()'], ['القبلة', '__openQibla()'], ['أسماء الله', '__openNames()'],
  ['الإذاعة', '__openRadio()'], ['البحث', '__openSearch()'], ['اختيار المدينة', '__wirdCity()'],
];
// الأجزاء المستثناة عن قصد: ليها ألوانها الخاصة (ورق المصحف، بطاقات السماء والصلاة اللي بتتغيّر مع وقت اليوم، المنبّه، ركن الطفل، أيقونات الإعدادات...)
export const EXEMPT = ['.da-', '.sky-', '.ph-', '.mp-page', '.mp-lines', '#skyCard', '.w-sky', '.sk-', '.al-ov', '.adhan-ov', '.kd-', '.nt-ic', '.ph-hero', '.su-icon', '#wSplash', 'img', 'svg', 'canvas', 'video'];

export async function scan(browser, onlyPages) {
  const rows = [];
  for (const [skin, mode] of COMBOS) {
    const ctx = await browser.newContext({ viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true });
    await ctx.addInitScript(s => { localStorage.setItem('wird-setup-done', '1'); localStorage.setItem('wird-onboarded', '1'); sessionStorage.setItem('wird-splash', '1'); localStorage.setItem('wird-skin', s) }, skin);
    const p = await ctx.newPage();
    for (const [name, code] of PAGES) {
      if (onlyPages && !onlyPages.includes(name)) continue;
      await p.goto(SITE); await p.waitForTimeout(1600);
      await p.evaluate(m => { const R = document.documentElement; R.classList.remove('dark', 'sepia'); if (m !== 'light') R.classList.add(m) }, mode);
      await p.evaluate(c => { try { eval(c) } catch (e) { } }, code); await p.waitForTimeout(1000);
      const r = await p.evaluate(EXEMPT => {
        const T = ['--bg', '--paper', '--paper-2', '--ink', '--ink-2', '--muted', '--line', '--line-2', '--primary', '--primary-2', '--gold', '--gold-2', '--gold-3', '--gold-50', '--gold-ink', '--danger', '--accent', '--emerald-50', '--emerald-100', '--emerald-600', '--emerald-700', '--emerald-800', '--emerald-900', '--on-dark', '--on-dark-1', '--on-dark-2', '--brand', '--deep', '--hero-a', '--hero-b', '--on-hero-acc', '--on-primary', '--on-gold', '--primary-ink', '--danger-ink', '--switch-off', '--scrim'];
        const cv = document.createElement('canvas').getContext('2d');
        const rgba = s => { cv.fillStyle = '#000'; cv.fillStyle = s; const v = cv.fillStyle; if (v[0] === '#') return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16), 1]; const n = v.match(/[\d.]+/g).map(Number); return [n[0], n[1], n[2], n[3] ?? 1] };
        const parse = s => { const n = (s.match(/[\d.]+/g) || []).map(Number); if (/^color\(srgb/.test(s)) return [n[0] * 255, n[1] * 255, n[2] * 255, n[3] ?? 1]; return [n[0], n[1], n[2], n[3] ?? 1] };
        const RS = getComputedStyle(document.documentElement);
        const tok = T.map(t => [t, RS.getPropertyValue(t).trim()]).filter(x => x[1] && !/gradient|url/.test(x[1])).map(([t, v]) => [t, rgba(v)]);
        const same = (a, b) => Math.abs(a[0] - b[0]) < 3 && Math.abs(a[1] - b[1]) < 3 && Math.abs(a[2] - b[2]) < 3;
        const tokenOf = c => { const e = tok.find(([, v]) => same(v, c) && Math.abs((v[3] ?? 1) - c[3]) < .03); if (e) return e[0]; const t = tok.find(([, v]) => same(v, c)); return t ? t[0] + '@' + Math.round(c[3] * 100) + '%' : (c[3] < .02 ? 'transparent' : (same(c, [255, 255, 255]) ? '#fff' : same(c, [0, 0, 0]) ? '#000' : null)) };
        const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && r.top < innerHeight * 3 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > .05 };
        /* الاستثناء بيطابق أول اسم الكلاس (مش أي جزء منه)، ومن العنصر لحد الصفحة/النافذة بس — مش html/body */
        let TOP = null;
        const ex = e => { for (let x = e; x && x !== TOP && x !== document.body; x = x.parentElement) { const cls = typeof x.className === 'string' ? x.className.split(/\s+/) : []; for (const p of EXEMPT) { if (p[0] === '.' && cls.some(c => c === p.slice(1) || (p.endsWith('-') && c.startsWith(p.slice(1))))) return true; if (p[0] === '#' && x.id === p.slice(1)) return true; if (/^[a-z]+$/.test(p) && x.tagName.toLowerCase() === p) return true } } return false };
        const sel = e => (e.id ? '#' + e.id : e.tagName.toLowerCase()) + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
        // اللون الحقيقي ورا العنصر: نجمع الطبقات الشفافة، ولو فيه صورة/تدرّج نعتبره مجهول
        // الخلفيات الحقيقية ورا العنصر: نجمع الطبقات الشفافة؛ ولو فيه تدرّج بنرجّع كل ألوانه وبنقيس على أسوأهم
        const backdrop = (e, x_ex) => { const layers = []; let grad = null; for (let x = e; x; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.backgroundImage && /gradient/.test(cs.backgroundImage)) { const top1 = (() => { const t = cs.backgroundImage; let d = 0; for (let i = 0; i < t.length; i++) { if (t[i] === '(') d++; else if (t[i] === ')') d--; else if (t[i] === ',' && !d) return t.slice(0, i) } return t })(); /* الطبقة اللي فوق بس (زي حلقة العدّاد: دايرة فوق تدرّج) */ const st = (top1.match(/(rgba?\([^)]+\)|color\(srgb[^)]+\)|#[0-9a-f]{3,8})/gi) || []).map(parse).filter(c => c[3] > .5); if (st.length) { grad = st; break } } else if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; const c = parse(cs.backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] >= .99) break } } if (grad && x_ex) return null; /* رسومات الأجزاء المتصمّمة (السما والأطفال) فيها لمعة وسحاب: التدرّج مش خلفية الكلام فعلًا */ const bases = grad ? grad.map(g => [g[0], g[1], g[2]]) : [[255, 255, 255]]; return bases.map(b0 => { let base = b0; for (let i = layers.length - 1; i >= 0; i--) { const [r, g, b, a] = layers[i]; base = [r * a + base[0] * (1 - a), g * a + base[1] * (1 - a), b * a + base[2] * (1 - a)] } return base }) };
        const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4 }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b) };
        // القاعدة اللي حطّت الخاصية دي على العنصر
        const rules = []; const walk = (L, f) => { for (const r of L) { if (r.cssRules && !(r instanceof CSSStyleRule)) { if (!(r instanceof CSSMediaRule) || matchMedia(r.conditionText).matches) walk(r.cssRules, f) } else if (r instanceof CSSStyleRule) rules.push([r, f]) } };
        for (const s of document.styleSheets) { try { walk(s.cssRules, s.href ? s.href.split('/').pop() : 'inline') } catch (e) { } }
        const who = (e, prop) => { let last = null; const sh = prop.startsWith('border') ? ['border', 'border-top', 'border-color'] : prop.startsWith('background') ? ['background'] : []; for (const [r] of rules) { let v = r.style.getPropertyValue(prop); if (!v) for (const x of sh) { v = r.style.getPropertyValue(x); if (v) { prop = prop; break } } if (!v) continue; try { if (e.matches(r.selectorText)) last = r.selectorText.slice(0, 90) + ' { ' + prop + ': ' + v.slice(0, 50) + ' }' } catch (x) { } } if (!last && e.getAttribute('style') && e.getAttribute('style').includes(prop)) last = 'style=""'; return last };
        const top = [...document.querySelectorAll('.wp-page,.wd-sheet,.st')].filter(vis).pop() || document.querySelector('main');
        TOP = top.parentElement;
        const out = [];
        for (const e of [top, ...top.querySelectorAll('*')]) {
          if (!vis(e)) continue; const exm = ex(e); const cs = getComputedStyle(e), r = e.getBoundingClientRect(); // الأجزاء المستثناة: نسيب ألوانها، بس الكلام لازم يتقري
          const check = (prop, val, role) => { if (exm) return; const c = parse(val); if (c[3] < .02) return; const t = tokenOf(c); if (t) return; const rule = who(e, prop); /* خلطة رموز بس (color-mix من var) مقبولة */ if (rule && /color-mix/.test(rule) && !/#[0-9a-f]{3,8}|rgba?\(/i.test(rule.split('{')[1] || '')) return; out.push({ k: 'off', role, prop, val, sel: sel(e), rule }) };
          const own = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
          if (own) {
            check('color', cs.color, 'text');
            const b = exm ? null : backdrop(e, exm); /* الأجزاء المتصمّمة (السما والأطفال والمصحف) فيها طبقات رسم منفصلة، فتباينها بيتراجع بالعين في صور المقارنة */
            if (b) { const fg = parse(cs.color), a = fg[3]; const cr = Math.min(...b.map(bb => { const mix = [0, 1, 2].map(i => fg[i] * a + bb[i] * (1 - a)); const l1 = lum(mix), l2 = lum(bb); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05) })); const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.6 && +cs.fontWeight >= 700); if (cr < (big ? 3 : 4.5)) out.push({ k: 'contrast', cr: +cr.toFixed(2), sel: sel(e), txt: e.textContent.trim().slice(0, 24), rule: who(e, 'color') }) }
          }
          if (r.width > 40 && r.height > 20) check('background-color', cs.backgroundColor, 'bg');
          if (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none' && r.width > 40) check('border-top-color', cs.borderTopColor, 'border');
        }
        return out;
      }, EXEMPT);
      for (const x of r) rows.push({ combo: skin + '/' + mode, page: name, ...x });
    }
    await ctx.close();
  }
  return rows;
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome' });
  const rows = await scan(b);
  await b.close();
  fs.writeFileSync(OUT, JSON.stringify(rows));
  const off = rows.filter(r => r.k === 'off'), con = rows.filter(r => r.k === 'contrast');
  const by = (a, f) => Object.entries(a.reduce((m, x) => { const k = f(x); m[k] = (m[k] || 0) + 1; return m }, {})).sort((a, b) => b[1] - a[1]);
  console.log('ألوان مش من القائمة:', off.length, '| قواعد مختلفة:', new Set(off.map(r => r.rule)).size, '| نص ضعيف التباين:', con.length);
  console.log('\nأكتر القواعد اللي بتحط ألوان برّه القائمة:');
  for (const [k, n] of by(off, x => x.rule || '(بدون قاعدة) ' + x.sel).slice(0, 40)) console.log(String(n).padStart(4), k);
  console.log('\nأكتر الصفحات ضعف تباين:'); for (const [k, n] of by(con, x => x.combo + ' ' + x.page).slice(0, 12)) console.log(String(n).padStart(4), k);
}
