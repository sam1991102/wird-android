
(()=>{"use strict";
const AR=__ar;
let rd,cur,audio;const POS="wird-surah-pos";
const loadData=()=>window.SURAHS?Promise.resolve():new Promise((res,rej)=>{const s=document.createElement("script");s.src="/quran.js";s.onload=()=>{window.SURAHS=SURAHS;res()};s.onerror=rej;document.head.append(s)});
function build(){rd=document.createElement("div");rd.className="reader";rd.setAttribute("role","dialog");rd.setAttribute("aria-modal","true");rd.hidden=true;
 rd.innerHTML='<header class="reader-bar"><button type="button" class="r-btn" data-a="close" aria-label="إغلاق"><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="reader-title"><strong></strong><small></small></div><button type="button" class="r-btn" data-a="font" aria-label="تكبير الخط">أ</button><button type="button" class="r-btn r-play" data-a="play" aria-label="استماع"><svg class="ic" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button></header><div class="reader-progress"><span></span></div><div class="reader-body" tabindex="0"><p class="basmala">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p><div class="mushaf"></div><p class="reader-end">صدق الله العظيم</p></div>';
 document.body.append(rd);const body=rd.querySelector(".reader-body"),bar=rd.querySelector(".reader-progress span");
 rd.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const a=b.dataset.a;
  if(a==="close")close();
  if(a==="font"){const s=[1,1.15,1.3,1.5],i=(s.indexOf(+(rd.style.getPropertyValue("--qs")||1))+1)%s.length;rd.style.setProperty("--qs",s[i]);try{localStorage.setItem("wird-qs",s[i])}catch(e){}}
  if(a==="play"){if(!audio){audio=new Audio();audio.addEventListener("ended",()=>setPlay(false));audio.addEventListener("error",()=>{setPlay(false);toast&&toast("تعذّر تشغيل التلاوة، تأكد من الاتصال بالإنترنت")})}
   if(audio.dataset.s!==cur){audio.src="https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/"+SURAHS[cur].n+".mp3";audio.dataset.s=cur}
   if(audio.paused){audio.play().then(()=>setPlay(true)).catch(()=>setPlay(false))}else{audio.pause();setPlay(false)}}});
 body.addEventListener("scroll",()=>{const p=body.scrollTop/Math.max(1,body.scrollHeight-body.clientHeight);bar.style.width=(p*100).toFixed(1)+"%";clearTimeout(body._t);body._t=setTimeout(()=>{try{const o=JSON.parse(localStorage.getItem(POS)||"{}");o[cur]=p;localStorage.setItem(POS,JSON.stringify(o))}catch(e){}},300)},{passive:true});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!rd.hidden)close()});
 try{const q=localStorage.getItem("wird-qs");if(q)rd.style.setProperty("--qs",q)}catch(e){}}
function setPlay(on){const b=rd.querySelector(".r-play");b.classList.toggle("on",on);b.setAttribute("aria-label",on?"إيقاف التلاوة":"استماع");b.querySelector("path").setAttribute("d",on?"M7 5h4v14H7zM13 5h4v14h-4z":"M8 5v14l11-7z")}
let last;
async function open(k,from){last=from;try{await loadData()}catch(e){toast&&toast("تعذّر تحميل السورة، أعد المحاولة");return}if(!rd)build();cur=k;const S=SURAHS[k];
 rd.querySelector(".reader-title strong").textContent=S.name;rd.querySelector(".reader-title small").textContent=S.when+" · "+(n=>n+(n>=3&&n<=10?" آيات":" آية"))(S.a.length);rd.setAttribute("aria-label",S.name);
 rd.querySelector(".mushaf").innerHTML=S.a.map((t,i)=>'<span class="ayah">'+t.replace(/[<>&]/g,"")+' <span class="ayah-n" aria-label="آية '+(i+1)+'">\uFD3F'+AR(i+1)+'\uFD3E</span></span> ').join("");
 if(audio&&!audio.paused&&audio.dataset.s!==k){audio.pause();setPlay(false)}else if(audio)setPlay(!audio.paused);
 rd.hidden=false;document.documentElement.classList.add("reader-open");const body=rd.querySelector(".reader-body");
 let p=0;try{p=JSON.parse(localStorage.getItem(POS)||"{}")[k]||0}catch(e){}
 requestAnimationFrame(()=>{body.scrollTop=p*(body.scrollHeight-body.clientHeight);body.dispatchEvent(new Event("scroll"));rd.querySelector('[data-a="close"]').focus()})}
function close(){rd.hidden=true;document.documentElement.classList.remove("reader-open");last&&last.focus&&last.focus()}
document.addEventListener("click",e=>{const b=e.target.closest("[data-surah]");if(b)open(b.dataset.surah,b)});
window.__openSurah=open;
const s=document.getElementById("season");if(s&&!s.hidden&&new Date().getDay()===5&&!s.querySelector("[data-surah]")){const b=document.createElement("button");b.type="button";b.className="btn btn-ghost season-btn";b.dataset.surah="kahf";b.textContent="اقرأ الكهف";s.append(b)}
})();
window.__MUSHAF_IDX=[["سُورَةُ ٱلْفَاتِحَةِ","m",7],["سُورَةُ البَقَرَةِ","d",286],["سُورَةُ آلِ عِمۡرَانَ","d",200],["سُورَةُ النِّسَاءِ","d",176],["سُورَةُ المَائـِدَةِ","d",120],["سُورَةُ الأَنۡعَامِ","m",165],["سُورَةُ الأَعۡرَافِ","m",206],["سُورَةُ الأَنفَالِ","d",75],["سُورَةُ التَّوۡبَةِ","d",129],["سُورَةُ يُونُسَ","m",109],["سُورَةُ هُودٍ","m",123],["سُورَةُ يُوسُفَ","m",111],["سُورَةُ الرَّعۡدِ","d",43],["سُورَةُ إِبۡرَاهِيمَ","m",52],["سُورَةُ الحِجۡرِ","m",99],["سُورَةُ النَّحۡلِ","m",128],["سُورَةُ الإِسۡرَاءِ","m",111],["سُورَةُ الكَهۡفِ","m",110],["سُورَةُ مَرۡيَمَ","m",98],["سُورَةُ طه","m",135],["سُورَةُ الأَنبِيَاءِ","m",112],["سُورَةُ الحَجِّ","d",78],["سُورَةُ المُؤۡمِنُونَ","m",118],["سُورَةُ النُّورِ","d",64],["سُورَةُ الفُرۡقَانِ","m",77],["سُورَةُ الشُّعَرَاءِ","m",227],["سُورَةُ النَّمۡلِ","m",93],["سُورَةُ القَصَصِ","m",88],["سُورَةُ العَنكَبُوتِ","m",69],["سُورَةُ الرُّومِ","m",60],["سُورَةُ لُقۡمَانَ","m",34],["سُورَةُ السَّجۡدَةِ","m",30],["سُورَةُ الأَحۡزَابِ","d",73],["سُورَةُ سَبَإٍ","m",54],["سُورَةُ فَاطِرٍ","m",45],["سُورَةُ يسٓ","m",83],["سُورَةُ الصَّافَّاتِ","m",182],["سُورَةُ صٓ","m",88],["سُورَةُ الزُّمَرِ","m",75],["سُورَةُ غَافِرٍ","m",85],["سُورَةُ فُصِّلَتۡ","m",54],["سُورَةُ الشُّورَىٰ","m",53],["سُورَةُ الزُّخۡرُفِ","m",89],["سُورَةُ الدُّخَانِ","m",59],["سُورَةُ الجَاثِيَةِ","m",37],["سُورَةُ الأَحۡقَافِ","m",35],["سُورَةُ مُحَمَّدٍ","d",38],["سُورَةُ الفَتۡحِ","d",29],["سُورَةُ الحُجُرَاتِ","d",18],["سُورَةُ قٓ","m",45],["سُورَةُ الذَّارِيَاتِ","m",60],["سُورَةُ الطُّورِ","m",49],["سُورَةُ النَّجۡمِ","m",62],["سُورَةُ القَمَرِ","m",55],["سُورَةُ الرَّحۡمَٰن","d",78],["سُورَةُ الوَاقِعَةِ","m",96],["سُورَةُ الحَدِيدِ","d",29],["سُورَةُ المُجَادلَةِ","d",22],["سُورَةُ الحَشۡرِ","d",24],["سُورَةُ المُمۡتَحنَةِ","d",13],["سُورَةُ الصَّفِّ","d",14],["سُورَةُ الجُمُعَةِ","d",11],["سُورَةُ المُنَافِقُونَ","d",11],["سُورَةُ التَّغَابُنِ","d",18],["سُورَةُ الطَّلَاقِ","d",12],["سُورَةُ التَّحۡرِيمِ","d",12],["سُورَةُ المُلۡكِ","m",30],["سُورَةُ القَلَمِ","m",52],["سُورَةُ الحَاقَّةِ","m",52],["سُورَةُ المَعَارِجِ","m",44],["سُورَةُ نُوحٍ","m",28],["سُورَةُ الجِنِّ","m",28],["سُورَةُ المُزَّمِّلِ","m",20],["سُورَةُ المُدَّثِّرِ","m",56],["سُورَةُ القِيَامَةِ","m",40],["سُورَةُ الإِنسَانِ","d",31],["سُورَةُ المُرۡسَلَاتِ","m",50],["سُورَةُ النَّبَإِ","m",40],["سُورَةُ النَّازِعَاتِ","m",46],["سُورَةُ عَبَسَ","m",42],["سُورَةُ التَّكۡوِيرِ","m",29],["سُورَةُ الانفِطَارِ","m",19],["سُورَةُ المُطَفِّفِينَ","m",36],["سُورَةُ الانشِقَاقِ","m",25],["سُورَةُ البُرُوجِ","m",22],["سُورَةُ الطَّارِقِ","m",17],["سُورَةُ الأَعۡلَىٰ","m",19],["سُورَةُ الغَاشِيَةِ","m",26],["سُورَةُ الفَجۡرِ","m",30],["سُورَةُ البَلَدِ","m",20],["سُورَةُ الشَّمۡسِ","m",15],["سُورَةُ اللَّيۡلِ","m",21],["سُورَةُ الضُّحَىٰ","m",11],["سُورَةُ الشَّرۡحِ","m",8],["سُورَةُ التِّينِ","m",8],["سُورَةُ العَلَقِ","m",19],["سُورَةُ القَدۡرِ","m",5],["سُورَةُ البَيِّنَةِ","d",8],["سُورَةُ الزَّلۡزَلَةِ","d",8],["سُورَةُ العَادِيَاتِ","m",11],["سُورَةُ القَارِعَةِ","m",11],["سُورَةُ التَّكَاثُرِ","m",8],["سُورَةُ العَصۡرِ","m",3],["سُورَةُ الهُمَزَةِ","m",9],["سُورَةُ الفِيلِ","m",5],["سُورَةُ قُرَيۡشٍ","m",4],["سُورَةُ المَاعُونِ","m",7],["سُورَةُ الكَوۡثَرِ","m",3],["سُورَةُ الكَافِرُونَ","m",6],["سُورَةُ النَّصۡرِ","d",3],["سُورَةُ المَسَدِ","m",5],["سُورَةُ الإِخۡلَاصِ","m",4],["سُورَةُ الفَلَقِ","m",5],["سُورَةُ النَّاسِ","m",6]];
(()=>{"use strict";
const AR=__ar;
const IDX=window.__MUSHAF_IDX||[];
const norm=t=>t.replace(/[ً-ٰٟۖ-ۭـ]/g,"").replace(/[ٱأإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/^سوره\s*/,"");
const ensure=()=>window.SURAHS?Promise.resolve():new Promise((res,rej)=>{const s=document.createElement("script");s.src="/quran.js";s.onload=()=>{window.SURAHS=SURAHS;res()};s.onerror=rej;document.head.append(s)});
function basm(show){const b=document.querySelector(".reader .basmala");if(b)b.hidden=!show}
document.addEventListener("click",e=>{if(e.target.closest("[data-surah]"))setTimeout(()=>basm(true),0)},true);
async function openSurahN(n,from){
 const k="q"+n;try{await ensure();if(!SURAHS[k]){const r=await fetch("/mushaf/"+n+".json");if(!r.ok)throw 0;const d=await r.json();const m=IDX[n-1];SURAHS[k]={n,name:m[0],when:(m[1]==="m"?"مكية":"مدنية"),a:d}}}catch(e){typeof toast==="function"&&toast("تعذّر تحميل السورة، أعد المحاولة");return}
 try{localStorage.setItem("wird-last-surah",n)}catch(e){}
 await window.__openSurah(k,from);basm(n!==1&&n!==9);updateLast()}
let ix;
function buildIndex(){ix=document.createElement("div");ix.className="reader mushaf-index";ix.setAttribute("role","dialog");ix.setAttribute("aria-modal","true");ix.setAttribute("aria-label","فهرس المصحف");ix.hidden=true;
 ix.innerHTML='<header class="reader-bar"><button type="button" class="r-btn" data-x="close" aria-label="إغلاق"><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="reader-title"><strong>المصحف الشريف</strong><small>114 سورة · برواية حفص عن عاصم</small></div><span style="width:42px"></span></header><div class="mi-search"><input type="search" placeholder="ابحث باسم السورة أو رقمها" aria-label="ابحث عن سورة"></div><div class="reader-body mi-body"><button type="button" class="mi-last" hidden></button><ol class="mi-list"></ol></div>';
 document.body.append(ix);
 ix.querySelector(".mi-list").innerHTML=IDX.map((m,i)=>'<li><button type="button" data-n="'+(i+1)+'"><span class="mi-num">'+(i+1)+'</span><span class="mi-name">'+m[0]+'</span><span class="mi-meta">'+(m[1]==="m"?"مكية":"مدنية")+" · "+(n=>n+(n>=3&&n<=10?" آيات":" آية"))(m[2])+'</span></button></li>').join("");
 const inp=ix.querySelector("input");inp.addEventListener("input",()=>{const q=norm(inp.value.trim());ix.querySelectorAll(".mi-list li").forEach((li,i)=>{li.hidden=!!q&&!(norm(IDX[i][0]).includes(q)||String(i+1)===q.replace(/[٠-٩]/g,__en))})});
 ix.addEventListener("click",e=>{if(e.target.closest('[data-x="close"]'))return closeIdx();const b=e.target.closest("[data-n]");if(b)openSurahN(+b.dataset.n,b)});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!ix.hidden&&document.querySelector(".reader:not(.mushaf-index):not([hidden])")==null)closeIdx()})}
function updateLast(){if(!ix)return;let n=0;try{n=+localStorage.getItem("wird-last-surah")}catch(e){}const b=ix.querySelector(".mi-last");if(n&&IDX[n-1]){b.hidden=false;b.dataset.n=n;b.textContent="تابع القراءة: "+IDX[n-1][0]}}
let lastFocus;
function openIdx(from){lastFocus=from;if(!ix)buildIndex();updateLast();ix.hidden=false;document.documentElement.classList.add("reader-open");ix.querySelector("input").focus({preventScroll:true})}
function closeIdx(){ix.hidden=true;if(!document.querySelector(".reader:not(.mushaf-index):not([hidden])"))document.documentElement.classList.remove("reader-open");lastFocus&&lastFocus.focus&&lastFocus.focus()}
new MutationObserver(()=>{if(ix&&!ix.hidden&&!document.documentElement.classList.contains("reader-open"))document.documentElement.classList.add("reader-open")}).observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
document.addEventListener("click",e=>{const b=e.target.closest("[data-mushaf]");if(b)openIdx(b)});
window.__openMushaf=openIdx;window.__openSurahN=openSurahN;
if(location.hash==="#mushaf")setTimeout(()=>openIdx(),300);
})();