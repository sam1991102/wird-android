(function(){
 const T=m=>typeof toast==="function"&&toast(m);const esc=t=>String(t).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[m]);
 const PG={"hj-sheet":"تقويم أم القرى وأيامه المميزة","nm-sheet":"تسعة وتسعون اسمًا ومعانيها","bm-sheet":"الآيات التي حفظتها من المصحف"};
 /* المحتوى اللي بيتقري بيفتح صفحة كاملة بنفس شكل باقي الصفحات؛ البحث يفضل لوحة سريعة */
 const open=(cls,html)=>{if(PG[cls]&&window.__wPage){document.querySelectorAll(".wp-page."+cls).forEach(x=>x.remove());
   const m=html.match(/^<div class="tl-h">([^<]*)<\/div>/);const title=m?m[1]:"";const body=m?html.slice(m[0].length):html;let s=null;
   const pg=__wPage({title:title,sub:PG[cls],cls:"tl-pg "+cls,html:'<div class="tl-pg-b">'+body+'</div>',onClose:()=>{s&&s.dispatchEvent(new Event("tlclose"))}});s=pg.el;return s}
  document.querySelectorAll(".wd-sheet."+cls).forEach(x=>x.remove());const s=document.createElement("div");s.className="wd-sheet tl-sheet "+cls;s.setAttribute("role","dialog");s.setAttribute("aria-modal","true");s.innerHTML='<div class="wd-card tl-card"><button type="button" class="wd-x" data-x aria-label="إغلاق">×</button>'+html+'</div>';s.addEventListener("click",e=>{if(e.target===s||e.target.closest("[data-x]")){s.hidden=true;setTimeout(()=>s.remove(),50)}});document.body.appendChild(s);return s};
 const closeAll=()=>document.querySelectorAll(".wd-sheet").forEach(s=>{s.hidden=true;setTimeout(()=>s.remove(),50)});
 /* ===== الحج والعمرة ===== */
 
 
 
 /* أضف خانة الحج والعمرة لبطاقة الأدوات */
 const addTile=()=>{const g=document.querySelector(".tools-day .tl-grid");if(!g||g.querySelector('[data-t="u"]'))return;g.insertAdjacentHTML("beforeend",'<button type="button" class="tl-tile" data-t="u"><span class="tl-ic">🕋</span><b>الحج والعمرة</b><small>خطوة بخطوة</small></button>');g.querySelector('[data-t="u"]').addEventListener("click",e=>{e.stopPropagation();window.__openHajj()})};
 /* ===== البحث الشامل ===== */
 const norm=t=>String(t||"").replace(/[ً-ٰٟۖ-ۭـ]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/ؤ/g,"و").replace(/ئ/g,"ي").toLowerCase();
 const searchSheet=()=>{const s=open("se-sheet",'<div class="tl-h">بحث</div><input type="search" class="se-in" placeholder="ابحث في الأذكار والسور والأدعية…" aria-label="بحث" enterkeyhint="search"><div class="se-res"><p class="wd-meta">اكتب كلمة للبحث.</p></div>');const inp=s.querySelector(".se-in"),res=s.querySelector(".se-res");setTimeout(()=>inp.focus(),60);
  let tm;inp.addEventListener("input",()=>{clearTimeout(tm);tm=setTimeout(run,150)});inp.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();run()}});
  function run(){const q=norm(inp.value.trim());if(q.length<2){res.innerHTML='<p class="wd-meta">اكتب كلمة للبحث.</p>';return}let h="";
   const sur=(window.__MUSHAF_IDX||[]).map((x,i)=>[i+1,String(x[0]||"")]).filter(([n,nm])=>norm(nm).includes(q)||String(n)===inp.value.trim()).slice(0,6);
   if(sur.length)h+='<div class="se-g">السور</div>'+sur.map(([n,nm])=>'<button type="button" class="se-r" data-sura="'+n+'"><b>'+esc(nm)+'</b></button>').join("");
   let ad=[];try{ad=(typeof adhkar!=="undefined"?adhkar:[]).filter(d=>norm(d.text+" "+(d.fadl||"")+" "+(d.source||"")).includes(q)).slice(0,25)}catch(e){}
   if(ad.length)h+='<div class="se-g">الأذكار ('+ad.length+(ad.length===25?"+":"")+')</div>'+ad.map(d=>{const t=String(d.text),k=norm(t).indexOf(q);return'<button type="button" class="se-r" data-dh="'+d.id+'"><span>'+esc(t.slice(0,140))+(t.length>140?"…":"")+'</span><small>'+esc(typeof catName==="function"?catName(d.cat):d.cat)+'</small></button>'}).join("");
   const pages=[["التقويم الهجري","hijri"],["اتجاه القبلة","qibla"],["الأدعية","duas"],["الحج والعمرة","hajj"],["الإعدادات","set"],["السبحة","tasbih"],["مواقيت الصلاة","prayer"],["المصحف","mushaf"]].filter(([n])=>norm(n).includes(q));
   if(pages.length)h+='<div class="se-g">الأقسام</div>'+pages.map(([n,k])=>'<button type="button" class="se-r" data-go="'+k+'"><b>'+n+'</b></button>').join("");
   h+='<button type="button" class="btn btn-ghost se-q" data-quran="1">ابحث عن «'+esc(inp.value.trim())+'» في آيات القرآن</button>';
   res.innerHTML=h}
  /* نتائج «الأقسام» في البحث: كل مفتاح بيفتح صفحته (كانت بتنادي go غير معرّفة فالضغط مكانش بيعمل حاجة) */
  const openSection=k=>{const O={hijri:window.__openHijri,qibla:window.__openQibla,duas:window.__openDuas,hajj:window.__openHajj,set:window.__openSettings,mushaf:window.__openMushaf};
   if(O[k])O[k]();else window.__wirdGo&&__wirdGo(k)};
  res.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
   if(b.dataset.sura){closeAll();window.__openSurahN&&__openSurahN(+b.dataset.sura)}
   else if(b.dataset.dh){const id=+b.dataset.dh,d=adhkar.find(x=>x.id===id);closeAll();if(d)setTimeout(()=>{try{openFocus(d.cat);const k=F.list.findIndex(x=>x.id===id);if(k>=0){F.i=k;renderFocus()}}catch(x){}},80)}
   else if(b.dataset.go){closeAll();setTimeout(()=>openSection(b.dataset.go),80)}
   else if(b.dataset.quran){const q=inp.value.trim();closeAll();setTimeout(()=>{window.__openMushaf&&__openMushaf();__wWait(()=>{const i=document.querySelector(".mi-search input");return i&&i.offsetParent!==null&&i},i=>{i.value=q;i.dispatchEvent(new Event("input",{bubbles:true}))})},80)}})};
 window.__openSearch=searchSheet;
 /* ===== القائمة الجانبية ===== */
 
 
 
 const SV=p=>'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>';
 const addTop=()=>{const ta=document.querySelector(".topbar .top-actions");if(!ta||document.getElementById("menuBtn"))return!!ta;ta.insertAdjacentHTML("afterbegin",'<button class="icon-btn" id="searchBtn" type="button" title="بحث" aria-label="بحث">'+SV('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')+'</button>');ta.insertAdjacentHTML("beforeend",'<button class="icon-btn" id="menuBtn" type="button" title="القائمة" aria-label="القائمة">'+SV('<path d="M4 6h16M4 12h16M4 18h16"/>')+'</button>');ta.querySelector("#searchBtn").onclick=searchSheet;ta.querySelector("#menuBtn").onclick=()=>window.__openDrawer();return true};
 const tick=()=>{addTop();addTile()};tick();__wOnDom(()=>{clearTimeout(tick.t);tick.t=setTimeout(tick,150)});
})();
