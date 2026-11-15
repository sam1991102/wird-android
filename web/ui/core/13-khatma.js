

(()=>{"use strict";
const $=s=>document.querySelector(s),ar=n=>String(n).replace(/\d/g,__ar);
const KEY="wird-khatma",TOT=604;
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){return null}};
const save=k=>{try{k?localStorage.setItem(KEY,JSON.stringify(k)):localStorage.removeItem(KEY)}catch(e){}};
const dayIdx=()=>{try{const L=prayerDay(0).L;return Math.floor(Date.UTC(L.y,L.m-1,L.d)/864e5)}catch(e){return Math.floor((Date.now()+3*3600e3)/864e5)}};
const curPage=()=>{const v=parseInt(String(localStorage.getItem("wird-mushaf-page")||"").replace(/\D/g,""),10);return v>=1&&v<=TOT?v:1};
function plan(k){const d=Math.max(0,dayIdx()-k.d0),span=TOT-k.sp+1;
 const endFor=i=>Math.min(TOT,k.sp-1+Math.ceil(span*(i+1)/k.days));
 const target=endFor(Math.min(d,k.days-1));const from=k.pos+1,to=Math.max(from,target);
 return {d,dayNo:Math.min(d+1,k.days),left:Math.max(0,k.days-d),target,from:Math.min(from,TOT),to:Math.min(to,TOT),pct:Math.round((k.pos-k.sp+1)/span*100),ahead:k.pos>=target,endFor,done:k.pos>=TOT}}
window.__khatmaEvents=days=>{const k=load();if(!k||k.pos>=TOT)return[];const out=[],p=plan(k);
 for(let i=0;i<days;i++){let d;try{d=prayerDay(i)}catch(e){break}const {t,L}=d,base=Date.UTC(L.y,L.m-1,L.d);const di=Math.floor(base/864e5)-k.d0;if(di<0||di>=k.days)continue;
  const prevEnd=di===0?k.sp-1:p.endFor(di-1),end=p.endFor(di),from=Math.max(prevEnd+1,i===0?k.pos+1:prevEnd+1);if(from>TOT||from>end)continue;
  out.push({t:Math.round(base+(t.fajr+0.75-L.off)*3600e3),title:"وِرد الختمة اليوم",body:"من صفحة "+ar(from)+" إلى "+ar(Math.max(from,end)),tag:"khatma",url:"/#mushaf"});
  if(t.isha)out.push({t:Math.round(base+(t.isha+0.5-L.off)*3600e3),title:"باقي من وِرد الختمة",body:"لم تُتم وِرد اليوم بعد: "+ar(end-from+1)+" صفحة، من صفحة "+ar(from)+" إلى "+ar(Math.max(from,end)),tag:"khatma-eve",url:"/#mushaf"})}
 return out};
const resync=()=>{try{window.__wirdPush&&__wirdPush.sync(true)}catch(e){}};
/* واجهة */
const mv=$("#mushafView");if(!mv||$("#khatma"))return;
const box=document.createElement("div");box.id="khatma";box.className="kh";
(mv.querySelector(".vh-head")||mv.firstChild).after(box);
function render(){const k=load();
 if(!k){box.innerHTML=`<div class="kh-card kh-new"><div class="kh-top"><span class="kh-k">الختمة</span><strong>ابدأ ختمة جديدة</strong><small>نقسّم لك المصحف وِردًا يوميًا بالصفحات، ونتابع تقدّمك تلقائيًا وأنت تقرأ.</small></div>
 <div class="kh-opts" role="radiogroup" aria-label="مدة الختمة">${[7,10,15,30,60].map((n,i)=>`<button type="button" role="radio" aria-checked="${n===30}" data-days="${n}">${ar(n)} ${n===10?"أيام":n<11?"أيام":"يومًا"}<small>${ar(Math.ceil(TOT/n))} ص/يوم</small></button>`).join("")}</div>
 <label class="kh-from"><input type="checkbox" id="khFromCur"> أكمل من صفحتي الحالية (${ar(curPage())})</label>
 <button type="button" class="btn btn-primary" id="khStart">ابدأ الختمة</button></div>`;return}
 const p=plan(k);
 if(p.done){box.innerHTML=`<div class="kh-card kh-done"><span class="kh-k">الختمة</span><strong>مبارك! أتممت ختم القرآن الكريم</strong><small>تقبّل الله منك. عدد ختماتك في وِرد: ${ar(k.count||1)}</small><div class="kh-act"><button type="button" class="btn btn-primary" data-k="new">ختمة جديدة</button></div></div>`;return}
 box.innerHTML=`<div class="kh-card"><div class="kh-row"><div><span class="kh-k">الختمة · اليوم ${ar(p.dayNo)} من ${ar(k.days)}</span><strong>${p.ahead?"أنجزت وِرد اليوم ✓":"وِرد اليوم: صفحة "+ar(p.from)+" – "+ar(p.to)}</strong><small>${p.ahead?"أنت متقدّم على الخطة، بارك الله فيك":"باقي "+ar(p.to-p.from+1)+" صفحة لإتمام وِرد اليوم"}</small></div><div class="kh-ring" style="--p:${p.pct}"><span>${ar(p.pct)}٪</span></div></div>
 <div class="kh-bar"><i style="width:${p.pct}%"></i></div>
 <div class="kh-meta"><span>وصلت إلى صفحة ${ar(k.pos)}</span><span>${p.left>0?"متبقٍ "+ar(p.left)+" يومًا":"انتهت المدة — أكمل بإذن الله"}</span></div>
 <div class="kh-act"><button type="button" class="btn btn-primary" data-k="read">${p.ahead?"واصل القراءة":"اقرأ وِرد اليوم"}</button>${p.ahead?"":`<button type="button" class="btn btn-ghost" data-k="mark">أتممت وِرد اليوم</button>`}<button type="button" class="btn btn-ghost kh-x" data-k="stop" aria-label="إلغاء الختمة">إلغاء</button></div></div>`}
box.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
 if(b.dataset.days){box.querySelectorAll("[data-days]").forEach(x=>x.setAttribute("aria-checked",x===b));return}
 if(b.id==="khStart"){const sel=box.querySelector('[data-days][aria-checked="true"]');const days=+(sel?sel.dataset.days:30);const fc=box.querySelector("#khFromCur").checked;const sp=fc?curPage():1;const old=load();
  save({d0:dayIdx(),days,sp,pos:sp-1,count:(old&&old.count)||0});render();resync();toast("بدأت الختمة — وِرد يومي "+ar(Math.ceil((TOT-sp+1)/days))+" صفحة");return}
 const k=load();if(!k)return;const p=plan(k);
 if(b.dataset.k==="read"){window.__openPage&&__openPage(Math.min(TOT,k.pos+1))}
 else if(b.dataset.k==="mark"){k.pos=Math.max(k.pos,p.to);if(k.pos>=TOT)k.count=(k.count||0)+1;save(k);render();resync();toast("تقبّل الله")}
 else if(b.dataset.k==="stop"){(window.__wConfirm?__wConfirm:function(m){return Promise.resolve(confirm(m))})("إلغاء الختمة الحالية؟\nهيتمسح تقدّمك في الختمة دي.",{ok:"إلغاء الختمة",cancel:"رجوع",danger:true}).then(y=>{if(y){save(null);render();resync()}})}
 else if(b.dataset.k==="new"){const c=k.count||1;save(null);render();const s=load();}});
/* تتبّع تلقائي: عند إغلاق صفحة المصحف نحدّث آخر صفحة مقروءة */
let wasOpen=false;
new MutationObserver(()=>{const mp=document.querySelector(".mp");const open=!!(mp&&!mp.hidden&&mp.getClientRects().length);
 if(wasOpen&&!open){const k=load();if(k&&k.pos<TOT){const pg=curPage();if(pg>k.pos&&pg<=k.pos+40){k.pos=pg;if(k.pos>=TOT)k.count=(k.count||0)+1;save(k);render();resync();if(k.pos>=plan(k).target)toast("أتممت وِرد الختمة اليوم")}}}
 wasOpen=open}).observe(document.body,{subtree:true,attributes:true,attributeFilter:["hidden","class","style"],childList:true});
render();document.addEventListener("visibilitychange",()=>{if(!document.hidden)render()});
new MutationObserver(()=>{if(document.documentElement.dataset.view==="mushaf")render()}).observe(document.documentElement,{attributes:true,attributeFilter:["data-view"]});
/* تتبّع حيّ: كل صفحة تالية مباشرةً تُحسب فور ظهورها */
let rsT;addEventListener("wird-mp-page",e=>{const k=load();if(!k||k.pos>=TOT)return;const pg=+e.detail;if(pg===k.pos+1){const before=k.pos>=plan(k).target;k.pos=pg;if(k.pos>=TOT)k.count=(k.count||0)+1;save(k);render();clearTimeout(rsT);rsT=setTimeout(resync,4000);if(!before&&k.pos>=plan(k).target)toast("أتممت وِرد الختمة اليوم، تقبّل الله")}});
/* بلاطة المصحف في الرئيسية */
const hp=$("#hpPage");const upd=window.__khTile=()=>{const k=load();if(hp&&k&&k.pos<TOT)hp.textContent="الختمة "+ar(plan(k).pct)+"٪"};upd();setInterval(upd,30000);
})();