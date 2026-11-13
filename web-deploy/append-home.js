
/*home*/
/* الرئيسية: كارت اليوم، آية/حديث اليوم، أذكار اليوم، المصحف — والإذاعة بدل السبحة في الشريط السفلي */
(function(){var R=document.documentElement,AR="٠١٢٣٤٥٦٧٨٩";function ar(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
function hm(h){h=((h%24)+24)%24;var H=Math.floor(h),M=Math.round((h-H)*60);if(M===60){H++;M=0}var pm=H>=12,h12=H%12||12;return ar(h12)+":"+ar(String(M).padStart(2,"0"))+(pm?" م":" ص")}
/* 1) الشريط السفلي */
function nav(){var n=document.querySelector(".bottom-nav.nav5");if(!n)return;var t=n.querySelector('[data-nav="tasbih"],[href$="#tasbih"],[data-tab="tasbih"]');if(!t)[].forEach.call(n.children,function(c){if(!t&&!c.classList.contains("nv-x")&&(c.textContent||"").trim()==="السبحة")t=c});if(t&&t.style.display!=="none")t.style.setProperty("display","none","important");if(n.querySelector('.nv-x[data-tab="radio"]'))return;
var b=document.createElement("button");b.type="button";b.className="nv-x nv-radio";b.dataset.tab="radio";b.innerHTML='<span class="ni" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M7 8l9-5"/><circle cx="15.5" cy="14" r="2.5"/></svg></span><span class="nt">الإذاعة</span>';
b.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();if(document.querySelector(".wp-page.rd-page"))return;window.__closeOverlays&&__closeOverlays();setTimeout(function(){window.__openRadio&&__openRadio()},120)});
var anchor=t||n.querySelector('a[data-nav="prayer"],a[href$="#prayer"]');anchor?n.insertBefore(b,anchor.nextSibling):n.appendChild(b)}
/* 2) أذكار اليوم: مربعات */
function cat(rx){try{return(categories.find(function(c){return rx.test(c.name)})||{}).id}catch(e){return null}}
var IC={"sun": "<path d=\"M192,144a64.33,64.33,0,0,1-2,16H66a64,64,0,1,1,126-16Z\" opacity=\"0.2\"/><path d=\"M240,152H199.55a73.54,73.54,0,0,0,.45-8,72,72,0,0,0-144,0,73.54,73.54,0,0,0,.45,8H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM72,144a56,56,0,1,1,111.41,8H72.59A56.13,56.13,0,0,1,72,144Zm144,56a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,200ZM72.84,43.58a8,8,0,0,1,14.32-7.16l8,16a8,8,0,0,1-14.32,7.16Zm-56,48.84a8,8,0,0,1,10.74-3.57l16,8a8,8,0,0,1-7.16,14.31l-16-8A8,8,0,0,1,16.84,92.42Zm192,15.16a8,8,0,0,1,3.58-10.73l16-8a8,8,0,1,1,7.16,14.31l-16,8a8,8,0,0,1-10.74-3.58Zm-48-55.16,8-16a8,8,0,0,1,14.32,7.16l-8,16a8,8,0,1,1-14.32-7.16Z\"/>", "moon": "<path d=\"M210.69,158.18A88,88,0,1,1,97.82,45.31,96.08,96.08,0,0,0,192,160,96.78,96.78,0,0,0,210.69,158.18Z\" opacity=\"0.2\"/><path d=\"M240,96a8,8,0,0,1-8,8H216v16a8,8,0,0,1-16,0V104H184a8,8,0,0,1,0-16h16V72a8,8,0,0,1,16,0V88h16A8,8,0,0,1,240,96ZM144,56h8v8a8,8,0,0,0,16,0V56h8a8,8,0,0,0,0-16h-8V32a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16Zm72.77,97a8,8,0,0,1,1.43,8A96,96,0,1,1,95.07,37.8a8,8,0,0,1,10.6,9.06A88.07,88.07,0,0,0,209.14,150.33,8,8,0,0,1,216.77,153Zm-19.39,14.88c-1.79.09-3.59.14-5.38.14A104.11,104.11,0,0,1,88,64c0-1.79,0-3.59.14-5.38A80,80,0,1,0,197.38,167.86Z\"/>", "zz": "<path d=\"M248,112v56H112V80H216A32,32,0,0,1,248,112Z\" opacity=\"0.2\"/><path d=\"M216,72H32V48a8,8,0,0,0-16,0V208a8,8,0,0,0,16,0V176H240v32a8,8,0,0,0,16,0V112A40,40,0,0,0,216,72ZM32,88h72v72H32Zm88,72V88h96a24,24,0,0,1,24,24v48Z\"/>", "book": "<path d=\"M232,56V200H160a32,32,0,0,0-32,32V88a32,32,0,0,1,32-32Z\" opacity=\"0.2\"/><path d=\"M232,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V56A8,8,0,0,0,232,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64ZM160,88h40a8,8,0,0,1,0,16H160a8,8,0,0,1,0-16Zm48,40a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,128Zm0,32a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,160Z\"/>"};
function now(){var d=new Date();return d.getHours()+d.getMinutes()/60}
function fillAlerts(d){var t=null;try{t=prayerDay(0).t}catch(e){}var h=now(),cur="";
if(t){if(h>=t.fajr&&h<t.asr)cur="morning";else if(h>=t.asr&&h<t.isha)cur="evening";else cur="sleep"}
var items=[["morning","الصباح",t?"بعد الفجر "+hm(t.fajr):"بعد الفجر","sun",/الصباح/],["evening","المساء",t?"بعد العصر "+hm(t.asr):"بعد العصر","moon",/المساء/],["sleep","النوم","قبل النوم","zz",/النوم/]];
if(new Date().getDay()===5)items.push(["kahf","الكهف","يوم الجمعة","book",null,18]);
var o='<h2 class="ha-hd">أذكار اليوم</h2><div class="ha-grid">';
items.forEach(function(r){o+='<button type="button" class="ha-t ha-'+r[3]+(r[0]===cur?' is-now':'')+'"'+(r[5]?' data-sura="'+r[5]+'"':' data-cat="'+(cat(r[4])||r[0])+'"')+'><span class="ha-ic"><svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">'+IC[r[3]]+'</svg></span><span class="ha-tx"><b>'+r[1]+'</b><small>'+(r[0]===cur?"وقتها الآن":r[2])+'</small></span></button>'});
d.innerHTML=o+'</div>'}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#homeAlerts .ha-t");if(!b)return;if(b.dataset.sura){window.__openSurahN&&__openSurahN(+b.dataset.sura)}else{try{openFocus(b.dataset.cat)}catch(x){}}});
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
var al=document.getElementById("homeAlerts");if(!al){al=document.createElement("section");al.id="homeAlerts";al.className="container";al.dataset.v="home";al.setAttribute("aria-label","أذكار اليوم");fillAlerts(al)}
var prev=tsec&&tsec.parentNode===main?tsec:null;
[ac,al].forEach(function(x){var want=prev?prev.nextSibling:main.firstChild;if(x!==want)main.insertBefore(x,want);prev=x});
R.classList.add("home-v2")}
function run(){nav();order()}
run();if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);(function(){var n=0,t=setInterval(function(){run();if(R.classList.contains("home-v2")||++n>40)clearInterval(t)},50)})();setTimeout(run,1200);setTimeout(run,3500);new MutationObserver(nav).observe(document.body,{childList:true});
setInterval(function(){var a=document.getElementById("homeAlerts");a&&fillAlerts(a)},300000);
})();
