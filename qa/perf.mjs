// قياس السرعة على موبايل متوسط (المعالج مبطّأ ٤ مرات): وقت الفتح، أطول مهمّة بتوقف الشاشة، وقت التنقل بين الصفحات،
// وشغل الخلفية وهي واقفة (المؤقّتات والمراقبين). التشغيل: SKIN=ios node qa/perf.mjs
const { chromium } = await import(process.env.PW || '/tmp/node_modules/playwright-core/index.mjs');
const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome'});const ctx=await b.newContext({viewport:{width:393,height:851},isMobile:true,hasTouch:true});
await ctx.addInitScript((skin)=>{localStorage.setItem('wird-setup-done','1');localStorage.setItem('wird-onboarded','1');sessionStorage.setItem('wird-splash','1');localStorage.setItem('wird-skin',skin);
 const P=window.__perf={mo:0,moT:0,moBy:{},iv:0,ivT:0,ivBy:{},lt:[]};
 const MO=window.MutationObserver;window.MutationObserver=class extends MO{constructor(cb){const src=(new Error().stack.split('\n')[2]||'').trim().slice(-40);super((m,o)=>{const t=performance.now();cb(m,o);const d=performance.now()-t;P.mo++;P.moT+=d;const k=src;(P.moBy[k]||=[0,0]);P.moBy[k][0]++;P.moBy[k][1]+=d})}};
 const SI=window.setInterval;window.setInterval=function(f,ms,...a){const src=(new Error().stack.split('\n')[2]||'').trim().slice(-40);return SI(function(){const t=performance.now();typeof f==='function'?f(...a):0;const d=performance.now()-t;P.iv++;P.ivT+=d;(P.ivBy[src+' @'+ms]||=[0,0]);P.ivBy[src+' @'+ms][0]++;P.ivBy[src+' @'+ms][1]+=d},ms)};
 new PerformanceObserver(l=>{for(const e of l.getEntries())P.lt.push(Math.round(e.duration))}).observe({type:'longtask',buffered:true});
},process.env.SKIN||'ios');
const p=await ctx.newPage();const cdp=await ctx.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
const t0=Date.now();await p.goto('http://localhost:8787/');await p.waitForLoadState('load');const load=Date.now()-t0;await p.waitForTimeout(3000);
const r0=await p.evaluate(()=>{const P=__perf;const n=performance.getEntriesByType('navigation')[0];return {dcl:Math.round(n.domContentLoadedEventEnd),lt:P.lt.slice(),mo:P.mo,moT:Math.round(P.moT)}});
await p.evaluate(()=>{__perf.mo=0;__perf.moT=0;__perf.iv=0;__perf.ivT=0;__perf.lt=[];__perf.moBy={};__perf.ivBy={}});
// تنقّل
const nav=[];for(const v of ['library','prayer','mushaf','tasbih','home']){const t=await p.evaluate(v=>{const t=performance.now();__setView(v);return new Promise(r=>requestAnimationFrame(()=>setTimeout(()=>r(performance.now()-t),0)))},v);nav.push(v+':'+Math.round(t))}
await p.waitForTimeout(1000);
const r1=await p.evaluate(()=>{const P=__perf;return {mo:P.mo,moT:Math.round(P.moT),lt:P.lt.slice(),top:Object.entries(P.moBy).sort((a,b)=>b[1][1]-a[1][1]).slice(0,8).map(([k,v])=>k+' n='+v[0]+' '+Math.round(v[1])+'ms')}});
await p.evaluate(()=>{__perf.iv=0;__perf.ivT=0;__perf.mo=0;__perf.moT=0;__perf.ivBy={}});
await p.waitForTimeout(10000);
const r2=await p.evaluate(()=>{const P=__perf;return {iv:P.iv,ivT:Math.round(P.ivT),mo:P.mo,moT:Math.round(P.moT),top:Object.entries(P.ivBy).sort((a,b)=>b[1][0]-a[1][0]).slice(0,10).map(([k,v])=>k+' n='+v[0]+' '+Math.round(v[1])+'ms')}});
console.log('LOAD(4x cpu)',load,'ms',JSON.stringify(r0));console.log('NAV',nav.join(' '),'\nNAV mutation',JSON.stringify(r1,null,1));console.log('IDLE 10s',JSON.stringify(r2,null,1));
await b.close();
