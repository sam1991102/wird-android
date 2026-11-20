
(()=>{"use strict";
/* ===== بحث في آيات المصحف ===== */
const IDX=window.__MUSHAF_IDX||[];let ALL=null,loading=null;
const nq=t=>t.replace(/\u0648\u0670/g,"ا").replace(/\u06E5|\u06E6/g,"").replace(/\u06E7/g,"ي").replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g,"").replace(/[ٱأإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/ؤ/g,"و").replace(/ئ/g,"ي").replace(/\s+/g," ").trim().replace(/[اء\s]/g,"");
const AR=__ar;
function loadAll(){if(ALL)return Promise.resolve(ALL);if(loading)return loading;
 loading=Promise.all(IDX.map((_,i)=>fetch("/mushaf/"+(i+1)+".json").then(r=>r.json()))).then(arr=>{ALL=arr.map((a,i)=>a.map((t,j)=>({s:i+1,a:j+1,t,n:nq(t)})));return ALL});return loading}
function setup(){const ix=document.querySelector(".mushaf-index");if(!ix||ix.dataset.q)return;ix.dataset.q=1;
 const inp=ix.querySelector(".mi-search input"),body=ix.querySelector(".mi-body");inp.placeholder="ابحث باسم السورة أو بكلمة من آية";
 const res=document.createElement("div");res.className="mi-ayat";res.hidden=true;body.prepend(res);let tm;
 inp.addEventListener("input",()=>{clearTimeout(tm);const q=nq(inp.value);if(q.length<3||/^[0-9٠-٩]+$/.test(q)){res.hidden=true;return}
  tm=setTimeout(async()=>{res.hidden=false;if(!ALL)res.innerHTML='<p class="mi-note">جارٍ تحميل نص المصحف للبحث…</p>';
   try{await loadAll()}catch(e){res.innerHTML='<p class="mi-note">تعذّر تحميل المصحف للبحث. تأكد من الاتصال بالإنترنت.</p>';return}
   if(nq(inp.value)!==q)return;const hits=[];outer:for(const s of ALL)for(const v of s)if(v.n.includes(q)){hits.push(v);if(hits.length>=60)break outer}
   const total=hits.length;
   res.innerHTML='<h3 class="mi-h">في الآيات <small>'+(total>=60?"أول 60 نتيجة":total+" نتيجة")+'</small></h3>'+(total?'<ol class="mi-hits"></ol>':'<p class="mi-note">لا توجد آية بهذه الكلمة. جرّب كتابتها بطريقة أخرى، فالرسم العثماني يكتب بعض الكلمات بشكل مختلف (مثل: الصلوة، الزكوة).</p>');
   const ol=res.querySelector(".mi-hits");if(ol)hits.forEach(v=>{const li=document.createElement("li"),b=document.createElement("button");b.type="button";b.dataset.s=v.s;b.dataset.a=v.a;
    const m=document.createElement("span");m.className="mi-hm";m.textContent=IDX[v.s-1][0].replace(/^سُورَةُ\s*/,"")+" · آية "+v.a;const t=document.createElement("span");t.className="mi-ht";t.textContent=v.t;b.append(m,t);li.append(b);ol.append(li)})},300)});
 res.addEventListener("click",async e=>{const b=e.target.closest("[data-s]");if(!b)return;e.stopPropagation();await window.__openSurahN(+b.dataset.s,b);
  const ay=document.querySelectorAll(".reader:not(.mushaf-index) .ayah")[+b.dataset.a-1];if(ay){ay.scrollIntoView({block:"center"});ay.classList.add("ayah-hit");setTimeout(()=>ay.classList.remove("ayah-hit"),2600)}})}
document.addEventListener("click",e=>{if(e.target.closest("[data-mushaf]"))setTimeout(setup,50)});

/* ===== تثبيت التطبيق ===== */
const ib=document.getElementById("installBtn"),standalone=matchMedia("(display-mode: standalone)").matches||navigator.standalone;
const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
let dlg;
function guide(){if(!dlg){dlg=document.createElement("div");dlg.className="sheet";dlg.setAttribute("role","dialog");dlg.setAttribute("aria-modal","true");dlg.setAttribute("aria-labelledby","instT");dlg.hidden=true;
 const steps=ios?["افتح الموقع من متصفح Safari.","اضغط زر المشاركة <b>⬆︎</b> أسفل الشاشة.","اختر «إضافة إلى الشاشة الرئيسية».","اضغط «إضافة»، وسيظهر وِرد بين تطبيقاتك."]:["افتح قائمة المتصفح <b>⋮</b> أعلى الشاشة.","اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».","وافق على التثبيت، وسيظهر وِرد بين تطبيقاتك."];
 dlg.innerHTML='<div class="sheet-card"><h2 id="instT">ثبّت وِرد على هاتفك</h2><p class="muted">يفتح بلمسة من الشاشة الرئيسية، بلا شريط متصفح، ويعمل دون إنترنت.</p><ol class="steps">'+steps.map(s=>"<li>"+s+"</li>").join("")+'</ol><button type="button" class="btn btn-primary sheet-close">فهمت</button></div>';
 document.body.append(dlg);dlg.addEventListener("click",e=>{if(e.target===dlg||e.target.closest(".sheet-close"))close()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!dlg.hidden)close()})}
 dlg.hidden=false;dlg.querySelector(".sheet-close").focus()}
function close(){dlg.hidden=true;ib&&ib.focus()}
if(ib&&!standalone){let native=false;window.addEventListener("beforeinstallprompt",()=>{native=true});
 ib.addEventListener("click",e=>{if(!native){e.stopImmediatePropagation();guide()}},true);
 if(ios||matchMedia("(max-width:760px)").matches)ib.hidden=false}

/* ===== نسخة احتياطية ===== */
const st=document.getElementById("stats");
if(st){const w=document.createElement("div");w.className="backup";w.innerHTML='<div><strong>نسخة احتياطية</strong><p class="muted small">احفظ وِردك وتقدّمك وإعداداتك في ملف، واسترجعها على أي جهاز. لا يُرفع شيء إلى أي خادم.</p></div><div class="backup-btns"><button type="button" class="btn btn-ghost" id="bkOut">تنزيل النسخة</button><button type="button" class="btn btn-ghost" id="bkIn">استرجاع من ملف</button><input type="file" accept="application/json,.json" id="bkFile" hidden></div>';st.append(w);
 const msg=m=>typeof toast==="function"?toast(m):alert(m);
 document.getElementById("bkOut").onclick=()=>{const data={app:"wird",v:1,date:new Date().toISOString(),data:{}};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith("wird-"))data.data[k]=localStorage.getItem(k)}
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:"application/json"}));a.download="wird-backup-"+new Date().toISOString().slice(0,10)+".json";document.body.append(a);a.click();a.remove();msg("تم تنزيل النسخة الاحتياطية")};
 const fi=document.getElementById("bkFile");document.getElementById("bkIn").onclick=()=>fi.click();
 fi.onchange=async()=>{const f=fi.files[0];fi.value="";if(!f)return;try{const j=JSON.parse(await f.text());if(j.app!=="wird"||!j.data)throw 0;
  if(!(await (window.__wConfirm?__wConfirm:function(m){return Promise.resolve(confirm(m))})("استرجاع النسخة الاحتياطية؟\nسيُستبدل تقدّمك الحالي بما في الملف.",{ok:"استرجاع",danger:true})))return;
  Object.keys(localStorage).filter(k=>k.startsWith("wird-")).forEach(k=>localStorage.removeItem(k));for(const k in j.data)if(k.startsWith("wird-"))localStorage.setItem(k,j.data[k]);
  msg("تم الاسترجاع، جارٍ إعادة التحميل…");setTimeout(()=>location.reload(),900)}catch(e){msg("الملف غير صالح. اختر ملف نسخة وِرد الاحتياطية.")}}}
})();