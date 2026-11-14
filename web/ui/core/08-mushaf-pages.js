
(()=>{"use strict";
/* ===== المصحف المدني: نفس صفحات مصحف المدينة سطرًا بسطر (خطوط مجمع الملك فهد QCF) ===== */
const IDX=window.__MUSHAF_IDX||[];if(!IDX.length)return;
const AR=__ar;
const API=n=>"https://api.quran.com/api/v4/verses/by_page/"+n+"?words=true&word_fields=code_v2,line_number&fields=verse_key,juz_number&per_page=60&mushaf=1";
const FONT=n=>"https://static.qurancdn.com/fonts/quran/hafs/v2/woff2/p"+n+".woff2";
let META=null;const CACHE={},FONTS={};
async function meta(){if(META)return;META=await (await fetch("/mushaf/meta.json")).json()}
async function data(n){if(CACHE[n])return CACHE[n];let j=null;
 try{const c=await caches.open("wird-mushaf-v1"),hit=await c.match(API(n));if(hit)j=await hit.json();else{const r=await fetch(API(n));if(!r.ok)throw 0;c.put(API(n),r.clone());j=await r.json()}}catch(e){const r=await fetch(API(n));j=await r.json()}
 return CACHE[n]=j}
async function font(n){if(FONTS[n])return FONTS[n];const f=new FontFace("qcf"+n,"url("+FONT(n)+")",{display:"block"});FONTS[n]=f.load().then(x=>{document.fonts.add(x);return x});return FONTS[n]}
const LAST="wird-mushaf-page";let cur=1,ov,busy=false,audio,curSura=1;
const nm=s=>IDX[s-1][0].replace(/^سُورَةُ\s*/,"");
function build(){ov=document.createElement("div");ov.className="mp";ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");ov.setAttribute("aria-label","المصحف");ov.hidden=true;
 ov.innerHTML='<header class="mp-bar"><button type="button" class="r-btn" data-m="close" aria-label="إغلاق"><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button><button type="button" class="mp-title" data-m="index" aria-label="فهرس السور"><strong></strong><small></small></button><button type="button" class="r-btn r-play" data-m="play" aria-label="استماع"><svg class="ic" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button><button type="button" class="mp-rep" data-m="rep" aria-label="تكرار الآية"></button></header>'+
 '<div class="mp-stage"><div class="mp-book"></div><button type="button" class="mp-edge mp-next" data-m="next" aria-label="الصفحة التالية"></button><button type="button" class="mp-edge mp-prev" data-m="prev" aria-label="الصفحة السابقة"></button></div>'+
 '<footer class="mp-foot"><button type="button" class="r-btn" data-m="prev" aria-label="الصفحة السابقة"><svg class="ic" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button><button type="button" class="r-btn mp-z" data-m="zout" aria-label="تصغير الخط">أ−</button><label class="mp-jump"><span>صفحة</span><input type="text" inputmode="numeric" maxlength="3" aria-label="رقم الصفحة" onfocus="this.select()"><span class="mp-of">من ٦٠٤</span></label><button type="button" class="r-btn" data-m="next" aria-label="الصفحة التالية"><svg class="ic" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button><button type="button" class="r-btn mp-z" data-m="zin" aria-label="تكبير الخط">أ+</button></footer>';
 document.body.append(ov);
 ov.addEventListener("click",e=>{const b=e.target.closest("[data-m]");if(!b)return;const m=b.dataset.m;
  if(m==="close")close();else if(m==="next")go(cur+1,1);else if(m==="prev")go(cur-1,-1);else if(m==="index"){close();window.__openMushaf&&window.__openMushaf()}else if(m==="play")play();else if(m==="rep"){const L=[1,2,3,5,7,10],v=+(localStorage.getItem("wird-mp-rep")||1);const nx=L[(L.indexOf(v)+1)%L.length];try{localStorage.setItem("wird-mp-rep",nx)}catch(_){}pl.c=1;repLbl();typeof toast==="function"&&toast(nx>1?"تكرار كل آية "+AR(nx)+" مرات":"بدون تكرار")}else if(m==="zin"||m==="zout")setZ(getZ()+(m==="zin"?.2:-.2))});
 const inp=ov.querySelector(".mp-jump input");inp.addEventListener("change",()=>{const v=+String(inp.value).replace(/[٠-٩]/g,__en);if(v>=1&&v<=604)go(v,v>cur?1:-1)});
 let sx=null,sy=0;const st=ov.querySelector(".mp-stage");
 st.addEventListener("touchstart",e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;const W=innerWidth;window.__mpEdge=(sx<32||sx>W-32)?{t:Date.now(),d:(sx<32?1:-1)*(localStorage.getItem("wird-swipe")==="ltr"?-1:1)}:null},{passive:true});
 st.addEventListener("touchend",e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;sx=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3){let lt=false;try{lt=localStorage.getItem("wird-swipe")==="ltr"}catch(e){}const fw=lt?dx<0:dx>0;go(fw?cur+1:cur-1,fw?1:-1)}});
 document.addEventListener("keydown",e=>{if(ov.hidden)return;if(e.key==="Escape")close();else if(e.key==="ArrowLeft")go(cur+1,1);else if(e.key==="ArrowRight")go(cur-1,-1)});
 window.__mpFlip=d=>go(cur+d,d);
 let pd=0,pz=1;st.addEventListener("touchstart",e=>{if(e.touches.length===2){pd=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);pz=getZ();sx=null}},{passive:true});
 ["gesturestart","gesturechange","gestureend"].forEach(t=>ov.addEventListener(t,e=>e.preventDefault(),{passive:false}));ov.addEventListener("touchmove",e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});
 st.addEventListener("touchmove",e=>{if(e.touches.length===2&&pd){sx=null;const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);const z=Math.min(2.4,Math.max(1,pz*d/pd));if(Math.abs(z-getZ())>=.1){try{localStorage.setItem("wird-mp-zoom",Math.round(z*10)/10)}catch(_){}layout(ov.querySelector(".mp-page:not(.mp-out)"))}}},{passive:true});
 st.addEventListener("touchend",e=>{if(pd&&e.touches.length<2){pd=0;setZ(getZ())}});
 addEventListener("resize",()=>{if(!ov.hidden)layout(ov.querySelector(".mp-page:not(.mp-out)"))})}
async function pageEl(n){const [j]=await Promise.all([data(n),font(n)]);const vs=j.verses;
 const L={};let first=null;for(const v of vs){const [s,a]=v.verse_key.split(":").map(Number);if(!first)first=[s,a,v.juz_number];
  for(const w of v.words){(L[w.line_number]=L[w.line_number]||[]).push({c:w.code_v2,s,a,end:w.char_type_name==="end"})}}
 const H={};for(const v of vs){const [s,a]=v.verse_key.split(":").map(Number);if(a!==1)continue;const ln=v.words[0].line_number;
  if(s===1||s===9){H[ln-1]={t:"h",s}}else{H[ln-1]={t:"b",s};H[ln-2]={t:"h",s}}}
 const div=document.createElement("article");div.className="mp-page"+(n<=2?" mp-open":"");div.dataset.p=n;curSura=first[0];
 let h='<div class="mp-head"><span>'+nm(first[0])+'</span><span>الجزء '+AR(first[2])+'</span></div><div class="mp-lines" style="font-family:qcf'+n+'">';
 for(let i=1;i<=15;i++){if(L[i]){h+='<div class="mp-line">'+L[i].map(w=>'<span class="mp-w'+(w.end?' mp-e':'')+'" data-s="'+w.s+'" data-a="'+w.a+'">'+w.c+'</span>').join("")+'</div>'}
  else if(H[i]&&H[i].t==="h"){h+='<div class="mp-line mp-sura"><span>سورة '+nm(H[i].s)+'</span></div>'}
  else if(H[i]&&H[i].t==="b"){h+='<div class="mp-line mp-basm">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</div>'}
  else if(n>2)h+='<div class="mp-line mp-empty"></div>'}
 h+='</div><div class="mp-num">'+AR(n)+'</div>';div.innerHTML=h;return div}
function layout(p){if(!p)return;const box=p.querySelector(".mp-lines"),lines=[...box.querySelectorAll(".mp-line")];const W=box.clientWidth;
 const test=18;box.style.fontSize=test+"px";let maxw=1;lines.forEach(l=>{if(l.classList.contains("mp-sura")||l.classList.contains("mp-basm")||l.classList.contains("mp-empty"))return;l.style.justifyContent="center";const w=[...l.children].reduce((a,c)=>a+c.getBoundingClientRect().width,0);l._w=w;maxw=Math.max(maxw,w)});
 const head=p.querySelector(".mp-head").offsetHeight+p.querySelector(".mp-num").offsetHeight;const H=(p.classList.contains("mp-zoom")?ov.querySelector(".mp-stage").clientHeight-20:p.clientHeight)-head-26;const LH=1.85,rows=p.classList.contains("mp-open")?lines.length:15;
 let fs=Math.min(test*W*.985/maxw,H/(rows*LH));fs=Math.max(12,fs);box.style.fontSize=fs+"px";box.style.lineHeight=LH;
 lines.forEach(l=>{if(l._w==null)return;const natural=l._w*fs/test;l.style.justifyContent=(p.classList.contains("mp-open")||natural<W*.82)?"center":"space-between";l.style.gap=natural<W*.82?(fs*.25)+"px":"0"});mpZoom(p,fs)}
function getZ(){var z=1;try{z=+localStorage.getItem("wird-mp-zoom")||1}catch(e){}return Math.min(2.4,Math.max(1,z))}
function mpZoom(p,fs){var z=getZ(),on=z>1.01,box=p.querySelector(".mp-lines");p.classList.toggle("mp-zoom",on);ov.querySelector(".mp-stage").classList.toggle("mp-zs",on);if(!on)return;box.style.fontSize=(fs*z)+"px";box.querySelectorAll(".mp-line").forEach(function(l){l.style.justifyContent="center";l.style.gap=(fs*z*.2)+"px"});ov.querySelectorAll("[data-m=zout]").forEach(function(b){b.disabled=!on})}
function setZ(z){z=Math.round(Math.min(2.4,Math.max(1,z))*10)/10;var st=ov.querySelector(".mp-stage"),r=st.scrollHeight>st.clientHeight?st.scrollTop/(st.scrollHeight-st.clientHeight):0;try{localStorage.setItem("wird-mp-zoom",z)}catch(e){}var p=ov.querySelector(".mp-page:not(.mp-out)");layout(p);st.scrollTop=r*(st.scrollHeight-st.clientHeight);ov.querySelectorAll("[data-m=zout]").forEach(function(b){b.disabled=z<=1});ov.querySelectorAll("[data-m=zin]").forEach(function(b){b.disabled=z>=2.4});typeof toast==="function"&&toast(z<=1?"حجم الصفحة الأصلي":"حجم الخط "+AR(Math.round(z*100))+"٪")}
function label(){const it=CACHE[cur].verses[0];const [s]=it.verse_key.split(":").map(Number);ov.querySelector(".mp-title strong").textContent="سورة "+nm(s);ov.querySelector(".mp-title small").textContent="صفحة "+AR(cur)+" · الجزء "+AR(it.juz_number);ov.querySelector(".mp-jump input").value=String(cur).replace(/\d/g,__ar);
 try{localStorage.setItem(LAST,cur);localStorage.setItem("wird-mushaf-sura",nm(s));dispatchEvent(new CustomEvent("wird-mp-page",{detail:cur}))}catch(_){}
 ov.querySelectorAll(".mp-edge.mp-prev,[data-m=prev]").forEach(b=>b.disabled=cur<=1);ov.querySelectorAll("[data-m=next]").forEach(b=>b.disabled=cur>=604)}
async function go(n,dir){if(busy||n<1||n>604||n===cur&&ov.querySelector(".mp-page"))return;busy=true;const book=ov.querySelector(".mp-book"),old=book.querySelector(".mp-page");
 ov.classList.add("mp-loading");let el;try{el=await pageEl(n)}catch(e){busy=false;ov.classList.remove("mp-loading");typeof toast==="function"&&toast("تعذّر تحميل الصفحة. المصحف يحتاج اتصالًا بالإنترنت أول مرة.");return}
 ov.classList.remove("mp-loading");cur=n;book.prepend(el);layout(el);label();setTimeout(()=>{[n+1,n+2,n-1].forEach(x=>{if(x>=1&&x<=604){data(x).catch(()=>{});font(x).catch(()=>{})}})},800);if(pl.on)startPage();
 if(old&&dir&&!matchMedia("(prefers-reduced-motion:reduce)").matches){old.classList.add("mp-out",dir>0?"mp-turn-next":"mp-turn-prev");old.style.zIndex=2;await new Promise(r=>setTimeout(r,520))}
 if(old)old.remove();busy=false;
 [n+1,n-1].forEach(k=>{if(k>=1&&k<=604){data(k).catch(()=>{});font(k).catch(()=>{})}})}
let pl={on:false,list:[],i:0};const AU=id=>window.__qariUrl?__qariUrl(id):"https://cdn.islamic.network/quran/audio/128/ar.alafasy/"+id+".mp3";
function setBtn(on){const b=ov&&ov.querySelector(".r-play");if(!b)return;b.classList.toggle("on",on);b.querySelector("path").setAttribute("d",on?"M7 5h4v14H7zM13 5h4v14h-4z":"M8 5v14l11-7z");b.setAttribute("aria-label",on?"إيقاف التلاوة":"استماع")}
function unmark(){ov&&ov.querySelectorAll(".ayah-play").forEach(e=>e.classList.remove("ayah-play"))}
function mark(v){unmark();const[s,a]=v.verse_key.split(":");const ws=ov.querySelectorAll('.mp-w[data-s="'+s+'"][data-a="'+a+'"]');ws.forEach(e=>e.classList.add("ayah-play"));if(ws[0]&&ws[0].scrollIntoView)ws[0].scrollIntoView({block:"nearest",behavior:"smooth"})}
function ensureAudio(){if(audio)return;audio=new Audio();audio.preload="auto";audio.onended=()=>{if(!pl.on)return;const RP=+(localStorage.getItem("wird-mp-rep")||1);pl.c=(pl.c||1)+1;if(RP>1&&pl.c<=RP){audio.currentTime=0;audio.play().catch(()=>stopPlay());repLbl();return}pl.c=1;pl.i++;playI();repLbl()};audio.onerror=()=>{if(!pl.on)return;stopPlay();typeof toast==="function"&&toast("تعذّر تشغيل التلاوة، تأكد من الاتصال بالإنترنت")}}
let pre;function playI(){if(!pl.on)return;const v=pl.list[pl.i];if(!v){if(cur<604)go(cur+1,1);else stopPlay();return}ensureAudio();audio.src=AU(v.id);audio.play().then(()=>setBtn(true)).catch(()=>{stopPlay()});mark(v);const nx=pl.list[pl.i+1];if(nx){pre=pre||new Audio();pre.preload="auto";pre.src=AU(nx.id)}}
function startPage(){const c=CACHE[cur];if(!c||!c.verses){return}pl.list=c.verses;pl.i=0;playI()}
function repLbl(){const b=ov&&ov.querySelector(".mp-rep");if(!b)return;const v=+(localStorage.getItem("wird-mp-rep")||1);b.classList.toggle("on",v>1);b.innerHTML='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/></svg><span>'+(v>1?(pl.on&&pl.c>1?AR(pl.c)+"/":"")+AR(v):"")+'</span>';b.setAttribute("aria-label",v>1?"تكرار الآية "+v+" مرات":"تكرار الآية: متوقف")}
function stopPlay(){pl.on=false;pl.c=1;repLbl&&repLbl();if(audio)audio.pause();setBtn(false);unmark()}
function play(){if(pl.on){stopPlay();return}pl.on=true;setBtn(true);startPage()}
window.__mpReplay=()=>{if(pl.on)playI()};
let lf;async function open(n,from){lf=from||document.activeElement;if(!ov)build();repLbl();ov.hidden=false;document.documentElement.classList.add("reader-open");ov.querySelector(".mp-book").innerHTML="";cur=0;await go(n||1,0);ov.querySelector("[data-m=close]").focus()}
function close(){ov.hidden=true;stopPlay();if(!document.querySelector(".reader:not([hidden]),.mushaf-index:not([hidden])"))document.documentElement.classList.remove("reader-open");lf&&lf.focus&&lf.focus()}
window.__openPage=open;
document.addEventListener("click",async e=>{const ix=e.target.closest(".mushaf-index");if(!ix)return;const b=e.target.closest(".mi-list [data-n],.mi-last");if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 await meta();const n=b.classList.contains("mi-last")?(+localStorage.getItem(LAST)||META.p[+b.dataset.n-1][0]):META.p[+b.dataset.n-1][0];ix.hidden=true;open(n,b)},true);
document.addEventListener("click",async e=>{const r=e.target.closest(".mi-hits [data-s]");if(!r)return;e.preventDefault();e.stopImmediatePropagation();await meta();const s=+r.dataset.s,a=+r.dataset.a;
 document.querySelector(".mushaf-index").hidden=true;await open(META.p[s-1][a-1],r);ov.querySelectorAll('.mp-page:not(.mp-out) .mp-w[data-s="'+s+'"][data-a="'+a+'"]').forEach(el=>{el.classList.add("ayah-hit");setTimeout(()=>el.classList.remove("ayah-hit"),2800)})},true);
new MutationObserver(()=>{const b=document.querySelector(".mi-last");let p=0;try{p=+localStorage.getItem(LAST)}catch(_){}if(b&&p&&!b.dataset.pg){b.dataset.pg=1;b.hidden=false;b.textContent="تابع القراءة من صفحة "+AR(p)}}).observe(document.body,{childList:true});
})();