
/*radio*/(function(){
var ST=[
 {id:"makkah",name:"إذاعة القرآن الكريم — مكة المكرمة",sub:"بث مباشر من مكة المكرمة",flag:"🕋",g:0,u:["https://stream.radiojar.com/4wqre23fytzuv","https://edge.mixlr.com/channel/rwumx"]},
 {id:"cairo",name:"إذاعة القرآن الكريم من القاهرة",sub:"مصر — بث مباشر",flag:"🇪🇬",g:0,u:["https://stream.radiojar.com/8s5u5tpdtwzuv"]},
 {id:"saudi",name:"إذاعة القرآن الكريم السعودية",sub:"هيئة الإذاعة والتلفزيون · الرياض",flag:"🇸🇦",g:0,u:["https://stream.radiojar.com/0tpy1h0kxtzuv"]},
 {id:"minsh",name:"محمد صديق المنشاوي",sub:"مرتّل",flag:"🎙️",g:1,u:["https://backup.qurango.net/radio/mohammed_siddiq_alminshawi"]},
 {id:"minshm",name:"محمد صديق المنشاوي",sub:"مجوّد",flag:"🎙️",g:1,u:["https://backup.qurango.net/radio/mohammed_siddiq_alminshawi_mojawwad"]},
 {id:"husr",name:"محمود خليل الحصري",sub:"مرتّل",flag:"🎙️",g:1,u:["https://backup.qurango.net/radio/mahmoud_khalil_alhussary"]},
 {id:"husrm",name:"محمود خليل الحصري",sub:"مجوّد",flag:"🎙️",g:1,u:["https://backup.qurango.net/radio/mahmoud_khalil_alhussary_mojawwad"]},
 {id:"basit",name:"عبد الباسط عبد الصمد",sub:"مرتّل",flag:"🎙️",g:1,u:["https://backup.qurango.net/radio/abdulbasit_abdulsamad"]},
 {id:"basitm",name:"عبد الباسط عبد الصمد",sub:"مجوّد",flag:"🎙️",g:1,u:["https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad"]},
 {id:"afasy",name:"مشاري العفاسي",sub:"مرتّل",flag:"🎙️",g:1,u:["https://backup.qurango.net/radio/mishary_alafasi"]},
 {id:"sudais",name:"عبد الرحمن السديس",sub:"إمام الحرم المكي",flag:"🎙️",g:1,u:["https://backup.qurango.net/radio/abdulrahman_alsudaes"]},
 {id:"shuraim",name:"سعود الشريم",sub:"إمام الحرم المكي",flag:"🎙️",g:1,u:["https://backup.qurango.net/radio/saud_alshuraim"]},
 {id:"maher",name:"ماهر المعيقلي",sub:"إمام الحرم المكي",flag:"🎙️",g:1,u:["https://backup.qurango.net/radio/maher"]},
 {id:"huthq",name:"علي الحذيفي",sub:"رواية قالون عن نافع",flag:"🎙️",g:1,u:["https://backup.qurango.net/radio/ali_alhuthaifi_qalon"]},
 {id:"tarateel",name:"تراتيل قصيرة متميزة",sub:"تلاوات متنوعة هادئة",flag:"🌙",g:1,u:["https://backup.qurango.net/radio/tarateel"]},
 {id:"mukh",name:"المختصر في السيرة النبوية",sub:"سيرة",flag:"📜",g:2,u:["https://backup.qurango.net/radio/almukhtasar_fi_alsiyra"]},
 {id:"zilal",name:"في ظلال السيرة النبوية",sub:"٤٠٠ حلقة",flag:"📜",g:2,u:["https://backup.qurango.net/radio/fi_zilal_alsiyra"]},
 {id:"sahaba",name:"صور من حياة الصحابة والتابعين",sub:"قصص",flag:"📜",g:2,u:["https://backup.qurango.net/radio/sahabah"]}];
var GN=["بث مباشر","القرّاء","السيرة والقصص"];
var FK="wird-radio-fav";function favs(){try{return JSON.parse(localStorage.getItem(FK)||"[]")}catch(e){return[]}}function togFav(id){var f=favs(),i=f.indexOf(id);i<0?f.push(id):f.splice(i,1);try{localStorage.setItem(FK,JSON.stringify(f))}catch(e){}}
var A=null,cur=null,ui=0,tries=0,sleepT=null,sleepAt=0,state="idle";
function st(id){return ST.filter(function(s){return s.id===id})[0]}
function toastx(m){try{toast(m)}catch(e){}}
function play(id){var s=st(id);if(!s)return;if(cur===id&&A&&!A.paused){stop();return}
 stopAudio();cur=id;ui=0;tries=0;start();}
function start(){var s=st(cur);if(!A){A=new Audio();A.addEventListener("playing",function(){state="live";tries=0;clearTimeout(A._w);render()});A.addEventListener("waiting",function(){if(state!=="live")return;state="buf";render();clearTimeout(A._w);A._w=setTimeout(function(){if(state==="buf")retry()},20000)});A.addEventListener("error",retry);A.preload="auto"}
 state="load";render();A.src=s.u[ui]+(s.u[ui].indexOf("?")<0?"?":"&")+"t="+Date.now();A.play().catch(function(){retry()});
 if("mediaSession" in navigator)try{navigator.mediaSession.metadata=new MediaMetadata({title:s.name,artist:"وِرد — بث مباشر",artwork:[{src:"/icon-512.png",sizes:"512x512",type:"image/png"}]});navigator.mediaSession.setActionHandler("pause",stop);navigator.mediaSession.setActionHandler("stop",stop);navigator.mediaSession.setActionHandler("play",function(){start()})}catch(e){}}
function retry(){if(state==="idle"||!cur)return;var s=st(cur);tries++;if(tries>6){state="err";render();toastx("تعذّر الاتصال بالبث، حاول لاحقًا");return}ui=(ui+1)%s.u.length;setTimeout(function(){if(state!=="idle")start()},1500)}
function stopAudio(){if(A){try{A.pause();A.removeAttribute("src");A.load()}catch(e){}}}
function stop(){stopAudio();state="idle";cur=null;setSleep(0);render()}
function setSleep(m){clearTimeout(sleepT);sleepAt=0;if(m>0){sleepAt=Date.now()+m*60000;sleepT=setTimeout(function(){stop();toastx("توقفت الإذاعة (مؤقت النوم)")},m*60000)}render()}
var AR=function(n){return String(n).replace(/\d/g,function(d){return"٠١٢٣٤٥٦٧٨٩"[d]})};
/* شريط التشغيل المصغّر */
var bar=document.createElement("div");bar.className="rd-bar";bar.hidden=true;bar.innerHTML='<button type="button" class="rd-bp" aria-label="إيقاف">■</button><div class="rd-bt"><b></b><small></small></div><button type="button" class="rd-bo" aria-label="فتح الإذاعة">‹</button>';
bar.querySelector(".rd-bp").onclick=stop;bar.querySelector(".rd-bo").onclick=function(){openPage()};
function mount(){if(!bar.isConnected&&document.body)document.body.appendChild(bar)}
var page=null;
function render(){mount();var lbl=function(){return state==="live"?"مباشر":state==="buf"?"جارٍ التحميل…":state==="err"?"تعذّر الاتصال":"جارٍ الاتصال…"};bar.hidden=!cur;if(cur){var s=st(cur);bar.querySelector("b").textContent=s.name;bar.querySelector("small").textContent=lbl()+(sleepAt?" · يتوقف بعد "+AR(Math.max(1,Math.round((sleepAt-Date.now())/60000)))+" د":"");bar.classList.toggle("live",state==="live")}
 if(page&&page.isConnected){page.querySelectorAll(".rd-card").forEach(function(c){var on=c.dataset.id===cur;c.classList.toggle("on",on);c.querySelector(".rd-st").textContent=on?lbl():"";c.classList.toggle("live",on&&state==="live")});
  page.querySelectorAll("[data-sl]").forEach(function(b){var m=+b.dataset.sl;b.setAttribute("aria-checked",m===0?!sleepAt:Math.abs((sleepAt-Date.now())/60000-m)<1&&!!sleepAt)})}}
function openPage(){var el=document.createElement("div");el.className="wp-page tl-page nt-page rd-page";el.innerHTML='<header class="wp-h"><button type="button" class="wp-back" aria-label="رجوع">→</button><div><h1>الإذاعة</h1><p>إذاعات القرآن الكريم بث مباشر</p></div></header><div class="wp-body nt-body"></div>';
 var b=el.querySelector(".nt-body");var card=function(s){var f=favs().indexOf(s.id)>=0;return'<div class="rd-card" data-id="'+s.id+'"><span class="rd-fl">'+s.flag+'</span><div class="rd-tx"><b>'+s.name+'</b><small>'+s.sub+'</small><span class="rd-st"></span></div><button type="button" class="rd-fav'+(f?' on':'')+'" data-fav="'+s.id+'" aria-label="مفضلة">'+(f?'★':'☆')+'</button><span class="rd-play" aria-hidden="true"><i class="rd-pl">▶</i><i class="rd-eq"><b></b><b></b><b></b></i></span></div>'};
 var fv=favs(),html=fv.length?'<h3 class="rd-h">⭐ المفضلة</h3><div class="rd-grp">'+ST.filter(function(s){return fv.indexOf(s.id)>=0}).map(card).join("")+'</div>':"";
 GN.forEach(function(n,gi){html+=(gi===0?"":"")+'<h3 class="rd-h">'+n+'</h3><div class="rd-grp">'+ST.filter(function(s){return s.g===gi}).map(card).join("")+'</div>'});b.innerHTML=html+'<div class="rd-sl"><b>مؤقت النوم</b><div class="skin-seg">'+[[0,"بدون"],[15,"١٥ د"],[30,"٣٠ د"],[60,"٦٠ د"]].map(function(x){return'<button type="button" data-sl="'+x[0]+'">'+x[1]+'</button>'}).join("")+'</div></div>'+
 '<p class="rd-note">البث المباشر من الإذاعات الرسمية (misrquran.gov.eg — aloula.sa)، وإذاعات القرّاء والسيرة من موقع mp3quran.net. قد يتوقف الصوت على الآيفون عند قفل الشاشة.</p>';
 b.addEventListener("click",function(e){var fb=e.target.closest("[data-fav]");if(fb){togFav(fb.dataset.fav);var y=b.scrollTop;el.remove();page=null;openPage();var np=document.querySelector(".rd-page .nt-body");if(np)np.scrollTop=y;return}var c=e.target.closest(".rd-card");if(c){play(c.dataset.id);return}var s=e.target.closest("[data-sl]");if(s)setSleep(+s.dataset.sl)});
 el.querySelector(".wp-back").onclick=function(){el.classList.remove("in");setTimeout(function(){el.remove();page=null;if(!document.querySelector(".wp-page"))document.documentElement.classList.remove("wp-open")},180)};
 document.body.appendChild(el);document.documentElement.classList.add("wp-open");page=el;requestAnimationFrame(function(){el.classList.add("in")});setTimeout(function(){el.classList.add("in")},60);render()}
window.__openRadio=openPage;
/* مداخل: كارت في الرئيسية بعد بطاقة القرآن، وزر في تبويب المصحف */
function entries(){if(document.getElementById("rdTile"))return;var k=document.getElementById("kidsTile")||document.getElementById("quranCard");if(!k)return;var t=document.createElement("button");t.type="button";t.id="rdTile";t.className="kd-tile container rd-home";t.innerHTML='<span class="kd-art rd-art"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M7 8l9-5"/><circle cx="15.5" cy="14" r="2.5"/><path d="M6.5 12.5h4M6.5 15.5h4"/></svg></span><span><b>إذاعة القرآن الكريم</b><small>مكة · القاهرة · السعودية · القرّاء · السيرة</small></span>';t.onclick=openPage;k.after(t)}
new MutationObserver(entries).observe(document.body,{childList:true});entries();setTimeout(entries,1500);
setInterval(function(){if(sleepAt)render()},30000);
})();
