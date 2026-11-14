
/*home*/
/* الرئيسية: كارت اليوم، آية/حديث اليوم، أذكار اليوم، المصحف */
(function(){var R=document.documentElement,AR="٠١٢٣٤٥٦٧٨٩";function ar(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
function hm(h){h=((h%24)+24)%24;var H=Math.floor(h),M=Math.round((h-H)*60);if(M===60){H++;M=0}var pm=H>=12,h12=H%12||12;return ar(h12)+":"+ar(String(M).padStart(2,"0"))+(pm?" م":" ص")}

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
run();if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);(function(){var n=0,t=setInterval(function(){run();if(R.classList.contains("home-v2")||++n>40)clearInterval(t)},50)})();setTimeout(run,1200);setTimeout(run,3500);

})();