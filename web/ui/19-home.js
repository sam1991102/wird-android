
/*home*/
/* الرئيسية: كارت اليوم، آية/حديث اليوم، أذكار اليوم، المصحف */
(function(){var R=document.documentElement;var ar=__ar;
var hm=__t12;

/* 3) آية وحديث اليوم في كارت واحد بتبويبين */
function findAy(main){var out=[];
[].forEach.call(main.querySelectorAll('.hadith-day,section.ay,[class*="ayah-day"],[class*="aya-day"],h2,h3,.eyebrow'),function(el){
 if(!el.classList.contains("hadith-day")&&!el.classList.contains("ay")&&!/day/.test(el.className)&&!/^\s*(آية|حديث) اليوم/.test(el.textContent))return;
 var box=/^(H2|H3|P)$/.test(el.tagName)?(el.closest(".card,[class*='-card'],section,aside")||el.parentNode):el;
 if(box===main||box.closest("#homeAlerts,#ayCard,.today-card,#skyCard,#library,#favoritesSection,#prayer,#surahs,#tasbih,#stats,#mushafView,.wp-page"))return;
 if(box.parentNode!==main){var top=box.closest("main>*");if(top&&top!==box&&!top.classList.contains("hero")&&!top.querySelector(".today-card"))box=top;else main.appendChild(box)}
 if(out.indexOf(box)<0&&!out.some(function(o){return o.contains(box)}))out.push(box)});
return out}
function card(list){var c=document.getElementById("ayCard");if(!c){c=document.createElement("section");c.id="ayCard";c.className="container";c.dataset.v="home";c.setAttribute("aria-label","آية وحديث اليوم")}
if(!list.length)return c;
list.sort(function(x,y){return isHd(x)-isHd(y)});
list.forEach(function(x){if(x.parentNode!==c)c.appendChild(x)});
var w=c.querySelector(".ay-tabs");if(list.length>1&&!w){w=document.createElement("div");w.className="ay-tabs";w.setAttribute("role","tablist");
 list.forEach(function(sec,i){var b=document.createElement("button");b.type="button";b.setAttribute("role","tab");b.textContent=isHd(sec)?"حديث اليوم":"آية اليوم";
 b.onclick=function(){list.forEach(function(x,k){x.classList.toggle("ay-hide",k!==i)});[].forEach.call(w.children,function(t,k){t.setAttribute("aria-selected",String(k===i))})};w.appendChild(b)});
 c.insertBefore(w,c.firstChild);w.firstChild.click()}
return c}
function isHd(x){return x.classList.contains("hadith-day")||!!x.querySelector(".hadith-day")||/حديث اليوم/.test((x.querySelector("h2,h3,.eyebrow")||{}).textContent||"")?1:0}
/* 4) ترتيب الرئيسية */
function order(){var main=document.querySelector("main");if(!main)return;
var today=document.querySelector(".today-card"),tsec=today&&today.closest("main>*");
var ac0=document.getElementById("ayCard"),ays=ac0&&ac0.children.length>1?[]:findAy(main);
var ac=card(ays);
var al=document.getElementById("homeAlerts");if(!al){al=document.createElement("section");al.id="homeAlerts";al.className="container";al.dataset.v="home";al.setAttribute("aria-label","أذكار اليوم");window.__renderDayArc&&__renderDayArc(al)}
var prev=tsec&&tsec.parentNode===main?tsec:null;
[al,ac].forEach(function(x){var want=prev?prev.nextSibling:main.firstChild;if(x!==want)main.insertBefore(x,want);prev=x});
R.classList.add("home-v2")}
function run(){order()}
/* يعيد الترتيب كل ما محتوى الرئيسية يتغيّر (الحديث مثلًا بيوصل متأخر) — الترتيب نفسه ما بيحرّكش حاجة لو كل شيء في مكانه */
var q=0;function later(){if(!q)q=requestAnimationFrame(function(){q=0;run()})}
run();var M=document.querySelector("main");M&&new MutationObserver(later).observe(M,{childList:true,subtree:true});if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);

})();

/* ── أذكار اليوم: مسار الشمس ── */(function(){
/* أذكار اليوم «مسار اليوم»: قوس الشمس من الفجر للعشاء وعليه محطات الأذكار */
var R=document.documentElement,DUHA="<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><path d=\"M17 12a5 5 0 1 1-10 0a5 5 0 0 1 10 0Z\"/><path stroke-linecap=\"round\" d=\"M12 2v1.5m0 17V22m7.07-2.929l-1.06-1.06M5.99 5.989L4.928 4.93M22 12h-1.5m-17 0H2m17.071-7.071l-1.06 1.06M5.99 18.011l-1.06 1.06\"/></g>",NS="http://www.w3.org/2000/svg",IC={"sun": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-width=\"1.5\"><path stroke-linejoin=\"round\" d=\"M9.5 6.5C9.992 5.994 11.3 4 12 4m2.5 2.5C14.008 5.994 12.7 4 12 4m0 0v6\"/><path d=\"M18.363 10.636L16.95 12.05M3 17h2m.637-6.364L7.05 12.05M21 17h-2m2 3H3m13-3a4 4 0 0 0-8 0\"/></g>", "moon": "<g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-width=\"1.5\"><path stroke-linejoin=\"round\" d=\"M9.5 7.5c.492.506 1.8 2.5 2.5 2.5m2.5-2.5c-.492.506-1.8 2.5-2.5 2.5m0 0V4\"/><path d=\"M18.363 10.636L16.95 12.05M3 17h2m.637-6.364L7.05 12.05M21 17h-2m2 3H3m13-3a4 4 0 0 0-8 0\"/></g>", "zz": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M21.5 14.078A8.557 8.557 0 0 1 9.922 2.5C5.668 3.497 2.5 7.315 2.5 11.873a9.627 9.627 0 0 0 9.627 9.627c4.558 0 8.376-3.168 9.373-7.422\"/>", "book": "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"m19.648 5.437l-.659-1.043c-.364-.577-.546-.866-.785-.892c-.238-.027-.505.247-1.038.795c-1.722 1.77-3.444 1.508-5.166 4.691c-1.722-3.183-3.444-2.921-5.166-4.691c-.533-.548-.8-.822-1.038-.795c-.239.026-.421.315-.785.892l-.658 1.043c-.255.402-.382.604-.347.816c.034.212.217.357.584.647l6.182 4.898c.591.468.887.702 1.228.702s.637-.234 1.228-.702L19.41 6.9c.367-.29.55-.435.584-.647c.035-.212-.092-.414-.346-.816M22 8.5l-16 12v-4.696M2 8.5l16 12v-4.696\"/>"};
var ar=__ar;
var hm=__t12;
var W=340,H=132,P0=[322,112],C=[170,-26],P2=[18,112];
function pt(t){var u=1-t;return[u*u*P0[0]+2*u*t*C[0]+t*t*P2[0],u*u*P0[1]+2*u*t*C[1]+t*t*P2[1]]}
function arc(a,b){var d="",n=40;for(var i=0;i<=n;i++){var p=pt(a+(b-a)*i/n);d+=(i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)}return d}
function cat(rx){try{return(categories.find(function(c){return rx.test(c.name)})||{}).id}catch(e){return null}}
function hours(){return __nowH()}
function render(box){if(!box)return;var t=null;try{t=prayerDay(0).t}catch(e){}
 if(!t){box.innerHTML="";return}
 var span=t.isha-t.fajr,pos=function(h){return Math.max(0,Math.min(1,(h-t.fajr)/span))},now=hours();
 var st=[{k:"morning",n:"الصباح",at:t.sunrise!=null?t.sunrise:t.fajr+1,from:t.fajr,to:t.asr,ic:"sun",rx:/الصباح/},
  {k:"duha",n:"الضحى",at:(t.sunrise+t.dhuhr)/2,from:t.sunrise+1/3,to:t.dhuhr-1/6,ic:"duha",rx:/الضحى/},
  {k:"evening",n:"المساء",at:t.asr,from:t.asr,to:t.isha,ic:"moon",rx:/المساء/},
  {k:"sleep",n:"النوم",at:t.isha,from:t.isha,to:t.fajr+24,ic:"zz",rx:/النوم/}];
 var night=now<t.fajr||now>=t.isha,cur=night?"sleep":now>=t.asr?"evening":now>=t.sunrise+1/3&&now<t.dhuhr-1/6?"duha":"morning",sun=pos(now);
 var g='<svg class="da-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="مسار اليوم">'
  +'<path class="da-track" d="'+arc(0,1)+'"/>'+(night?"":'<path class="da-done" d="'+arc(0,sun)+'"/>');
 if(!night){var s=pt(sun);g+='<circle class="da-sun" cx="'+s[0].toFixed(1)+'" cy="'+s[1].toFixed(1)+'" r="5"/>'}
 st.forEach(function(x){var p=pt(pos(x.at)),on=x.k===cur,past=!on&&now>=t.fajr&&now<t.isha+24&&(x.k==="morning"?now>=t.sunrise+1/3:x.k==="duha"?now>=t.dhuhr-1/6:x.k==="evening"?now>=t.isha:false),r=on?21:16;
  g+='<g class="da-st'+(on?" is-now":"")+(past?" is-past":"")+'" data-k="'+x.k+'" tabindex="0" role="button" aria-label="أذكار '+x.n+'"><circle class="da-halo" cx="'+p[0]+'" cy="'+p[1]+'" r="'+(r+7)+'"/><circle class="da-dot" cx="'+p[0]+'" cy="'+p[1]+'" r="'+r+'"/><svg x="'+(p[0]-r*.6)+'" y="'+(p[1]-r*.6)+'" width="'+(r*1.2)+'" height="'+(r*1.2)+'" viewBox="0 0 24 24" fill="none" class="da-ic">'+(x.ic==="duha"?DUHA:IC[x.ic])+'</svg></g>'});
 g+="</svg>";
 var labels='<div class="da-labels">'+st.map(function(x){var on=x.k===cur,left=Math.max(13,Math.min(87,pt(pos(x.at))[0]/W*100));return'<button type="button" class="da-lb'+(on?" is-now":"")+'" data-k="'+x.k+'" style="left:'+left.toFixed(1)+'%"><b>'+x.n+'</b>'+(on?'<small>الآن</small>':'')+'</button>'}).join("")+"</div>";
 var curS=st.filter(function(x){return x.k===cur})[0],fri=new Date().getDay()===5;
 var sky=night?"sky-night":now>=t.asr?"sky-sunset":"sky-dawn";
 box.innerHTML='<div class="da-card '+sky+'"><div class="da-hd"><h2>أذكار اليوم</h2>'+(fri?'<button type="button" class="da-kahf" data-sura="18"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">'+IC.book+'</svg>سورة الكهف</button>':"")+'</div>'+g+labels+'<button type="button" class="da-go" data-k="'+cur+'">'+(cur==="duha"?"حان وقت صلاة الضحى":"ابدأ أذكار "+curS.n)+'</button></div>';
 box.dataset.min=Math.floor(now*60);box._st=st}
function open(k){var box=document.getElementById("homeAlerts"),x=(box&&box._st||[]).filter(function(s){return s.k===k})[0];if(!x)return;var id=cat(x.rx);if(!id&&k==='duha'){var g=box.querySelector('.da-go');if(g){g.textContent='صلاة الضحى: من ارتفاع الشمس حتى قبيل الظهر';g.classList.add('is-note')}return}try{openFocus(id||k)}catch(e){}}
document.addEventListener("click",function(e){var el=e.target.closest&&e.target.closest("#homeAlerts [data-k],#homeAlerts [data-sura]");if(!el)return;if(el.dataset.sura){window.__openSurahN&&__openSurahN(+el.dataset.sura);return}open(el.dataset.k)});
document.addEventListener("keydown",function(e){if(e.key!=="Enter"&&e.key!==" ")return;var el=e.target.closest&&e.target.closest("#homeAlerts .da-st");if(el){e.preventDefault();open(el.dataset.k)}});
window.__renderDayArc=render;
function tick(){var b=document.getElementById("homeAlerts");if(!b||document.hidden)return;if((R.dataset.view||"home")!=="home")return;if(b.dataset.min!==String(Math.floor(hours()*60)))render(b)}
render(document.getElementById("homeAlerts"));__wEvery(60,tick);document.addEventListener("visibilitychange",tick);
})();

/* ── كارت اليوم: ميعاد الصلاة القادمة ── */(function(){
/* كارت اليوم: ميعاد الصلاة القادمة نفسه بخط كبير، وتحت اسمها «بعد كذا» */
var P=[["fajr","الفجر"],["dhuhr","الظهر"],["asr","العصر"],["maghrib","المغرب"],["isha","العشاء"]];
var ar=__ar;
function clock(h){var s=__t12(h).split(" ");return{t:s[0],p:s[1]}}
function next(){return __nextPrayer()}
function left(h){var s=Math.max(0,Math.round(h*3600));if(s<60)return"بعد "+ar(s)+" ثانية";var m=Math.ceil(s/60);if(m<60)return"بعد "+ar(m)+" دقيقة";var H=Math.floor(m/60),M=m%60;return"بعد "+ar(H)+" س"+(M?" "+ar(M)+" د":"")}
var last="";
function paint(){var box=document.querySelector("#skyCard .sk-next");if(!box)return;var x=next();if(!x)return;
 var el=box.querySelector(".sk-x");if(!el){el=document.createElement("div");el.className="sk-x";el.innerHTML='<div class="sk-x-n"><b></b><small></small></div><div class="sk-x-t"><span></span><i></i></div>';box.appendChild(el);box.classList.add("sk-x-on")}
 var c=clock(x.at),key=x.n+"|"+c.t+"|"+left(x.left);if(key===last)return;last=key;
 el.querySelector("b").textContent=x.n;el.querySelector("small").textContent=left(x.left);el.querySelector(".sk-x-t span").textContent=c.t;el.querySelector(".sk-x-t i").textContent=c.p;
 box.setAttribute("aria-label",x.n+" الساعة "+c.t+" "+c.p+"، "+left(x.left))}
__wEverySec(function(){if(!document.hidden&&(document.documentElement.dataset.view||"home")==="home")paint()});paint();
})();
