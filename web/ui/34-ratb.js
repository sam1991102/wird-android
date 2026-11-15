/*ratb*/(function(){"use strict";
/* «اجعل لسانك رطبًا»: بطاقة في الرئيسية لذكر خفيف بالضغط، من أذكار الفضائل الموجودة في التطبيق بمصادرها.
   العدّ يومي ويُحفظ على الجهاز (wird-ratb). */
var L=[
 {t:"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",f:"كلمتان خفيفتان على اللسان، ثقيلتان في الميزان",s:"متفق عليه",g:100},
 {t:"سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",f:"أحبّ الكلام إلى الله",s:"رواه مسلم",g:100},
 {t:"لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",f:"كنزٌ من كنوز الجنة",s:"متفق عليه",g:100},
 {t:"لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",f:"من قالها مائة مرة كانت له عدل عشر رقاب",s:"متفق عليه",g:100},
 {t:"أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",f:"الاستغفار في كل وقت",s:"",g:100}
];
var AR=function(n){return String(n).replace(/\d/g,function(d){return"٠١٢٣٤٥٦٧٨٩"[d]})};
var K="wird-ratb";
function day(){var d=new Date();return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()}
function load(){var o={};try{o=JSON.parse(localStorage.getItem(K))||{}}catch(e){}if(o.d!==day())o={d:day(),c:{},i:o.i||0};o.c=o.c||{};return o}
function save(o){try{localStorage.setItem(K,JSON.stringify(o))}catch(e){}}
var S=load(),el=null;
function total(){var t=0;for(var k in S.c)t+=S.c[k];return t}
function ring(p){var r=34,c=2*Math.PI*r;return'<svg class="rt-ring" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="'+r+'" class="rt-tr"/><circle cx="40" cy="40" r="'+r+'" class="rt-pr" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+(c*(1-Math.min(p,1))).toFixed(1)+'"/></svg>'}
function draw(){if(!el)return;S=load();var i=S.i%L.length,x=L[i],n=S.c[i]||0;
 el.innerHTML='<div class="rt-h"><h2 class="rt-k">اجعل لسانك رطبًا بذكر الله</h2><span class="rt-day">اليوم <b>'+AR(total())+'</b></span></div>'+
 '<p class="rt-t" aria-live="polite">'+x.t+'</p><p class="rt-f">'+x.f+(x.s?' <span>· '+x.s+'</span>':'')+'</p>'+
 '<div class="rt-row"><button type="button" class="rt-nav" data-r="prev" aria-label="الذكر السابق"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>'+
 '<button type="button" class="rt-tap" data-r="tap" aria-label="سبّح، العدد '+AR(n)+' من '+AR(x.g)+'">'+ring(n/x.g)+'<span class="rt-n">'+AR(n)+'</span><small>من '+AR(x.g)+'</small></button>'+
 '<button type="button" class="rt-nav" data-r="next" aria-label="الذكر التالي"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button></div>'+
 '<div class="rt-dots" aria-hidden="true">'+L.map(function(_,k){return'<i'+(k===i?' class="on"':'')+'></i>'}).join("")+'</div>'+
 '<p class="rt-src">«لا يزالُ لسانُك رطبًا من ذكرِ الله» · الترمذي وابن ماجه</p>'}
function ensure(){if(el&&el.isConnected)return;var sky=document.getElementById("skyCard");if(!sky)return;
 el=document.getElementById("ratbCard");if(!el){el=document.createElement("section");el.id="ratbCard";el.className="rt container";el.dataset.v="home";el.setAttribute("aria-label","اجعل لسانك رطبًا بذكر الله");
  el.addEventListener("click",function(e){var b=e.target.closest("[data-r]");if(!b)return;var r=b.dataset.r;S=load();var i=S.i%L.length;
   if(r==="tap"){S.c[i]=(S.c[i]||0)+1;try{navigator.vibrate&&navigator.vibrate(S.c[i]%L[i].g===0?[30,60,30]:8)}catch(x){}}
   else S.i=(i+(r==="next"?1:L.length-1))%L.length;save(S);draw()})}
 sky.insertAdjacentElement("afterend",el);document.documentElement.classList.add("rt-on");draw()}
(window.__wOnDom||function(f){document.addEventListener("DOMContentLoaded",f)})(function(){ensure();setInterval(function(){if(el&&load().d!==S.d)draw()},60000);new MutationObserver(ensure).observe(document.body,{childList:true})});
})();
