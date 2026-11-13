
/*ios2*/(function(){
var SET='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';
var RAD='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M7 8l9-5"/><circle cx="15.5" cy="14" r="2.5"/><path d="M6.5 12.5h4M6.5 15.5h4"/></svg>';
function nav(){var n=document.querySelector(".bottom-nav.nav5");if(!n||n.querySelector(".nv-x"))return;var b=document.createElement("button");b.type="button";b.className="nv-x";b.dataset.tab="settings";b.innerHTML='<span class="ni" aria-hidden="true">'+SET+'</span><span class="nt">الإعدادات</span>';b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();window.__openSettings&&__openSettings()});n.appendChild(b)}
function drawer(){var d=document.querySelector(".dr2 .dr-p");if(!d||d.querySelector('[data-n="radio"]'))return;var k=d.querySelector('[data-n="kids"]');if(!k)return;var r=document.createElement("button");r.type="button";r.className="dr-i2";r.dataset.n="radio";r.innerHTML='<span class="dr-ic">'+RAD+'</span><span class="dr-l">إذاعة القرآن الكريم</span>';r.onclick=function(e){e.stopPropagation();var x=document.querySelector(".dr2 [data-x]");x&&x.click();setTimeout(function(){window.__openRadio&&__openRadio()},200)};k.parentNode.insertBefore(r,k)}
new MutationObserver(function(){nav();drawer()}).observe(document.body,{childList:true});document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("#menuBtn,[data-n],.dr-x"))[0,60,300,800].forEach(function(t){setTimeout(drawer,t)})},true);setInterval(function(){var d=document.querySelector(".dr2");if(d&&d.offsetParent!==null)drawer()},1000);nav();drawer();setTimeout(nav,1500);
})();

(function(){setInterval(function(){var R=document.documentElement;if(R.dataset.view==='settings'&&window.__setView)__setView('home',false)},700)})();
(function(){var R=document.documentElement;
var SEL='.wp-page,.st,.wd-sheet:not(.dr2),#focus,.reader';
function openOv(){return[].slice.call(document.querySelectorAll(SEL)).filter(function(o){if(o.hidden)return false;var c=getComputedStyle(o);return c.display!=="none"&&c.visibility!=="hidden"})}
function closeAll(){openOv().forEach(function(o){var b=o.querySelector("[data-x],.wp-back,.wd-x,#fClose,[data-m=close]");if(b)b.click();if(o.classList.contains("wp-page")){o.remove()}else if(!o.hidden&&getComputedStyle(o).display!=="none"){o.hidden=true}});R.classList.remove("ov-lock","reader-open","wp-open")}
window.__closeOverlays=closeAll;
function mushafOpen(){var m=document.querySelector(".mp:not([hidden]),#focus:not([hidden]),.lp-ov:not([hidden])");return!!(m&&getComputedStyle(m).display!=="none")}
function sync(){R.classList.toggle("nav-off",mushafOpen());var n=document.querySelector(".bottom-nav.nav5");if(n&&n.offsetHeight)R.style.setProperty("--nav-h",n.offsetHeight+"px");if(n){var so=[].some.call(document.querySelectorAll(".st"),function(x){return!x.hidden&&x.offsetHeight>200});n.classList.toggle("st-on",so);R.classList.toggle("st-open",so);var tb=document.querySelector(".topbar");if(tb&&tb.offsetHeight)R.style.setProperty("--tb-h",tb.offsetHeight+"px")}}
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest(".bottom-nav.nav5>a,.bottom-nav.nav5>.nv-x");if(!a)return;if(a.classList.contains("nv-radio")&&document.querySelector(".wp-page.rd-page"))return;if(a.__re){a.__re=0;setTimeout(sync,60);return}if(openOv().length){e.preventDefault();e.stopPropagation();closeAll();a.__re=1;setTimeout(function(){a.click()},300);return}setTimeout(sync,60)},true);
setInterval(sync,700);addEventListener("resize",sync);})();
(function(){function W(ms){return new Promise(function(r){setTimeout(r,ms)})}
async function page(id){if(!window.__openSettings)return null;__openSettings();await W(250);var st=[].find.call(document.querySelectorAll(".st"),function(x){return!x.hidden});var r=st&&st.querySelector('.sh-row[data-id="'+id+'"]');if(!r)return null;r.click();await W(450);return[].slice.call(document.querySelectorAll(".wp-page.sh-page")).pop()||null}
window.__openSettingsPage=page;
var MAP={update:async function(){var p=await page("st-about");var b=p&&p.querySelector("#updChk");if(b){b.scrollIntoView({block:"center"});b.click()}},adhan:function(){page("notif")},alarm:function(){page("st-alarm")}};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".dr2 [data-n]");if(!b||!MAP[b.dataset.n])return;e.preventDefault();e.stopImmediatePropagation();var x=document.querySelector(".dr2 [data-x],.dr2 .wd-x");x&&x.click();setTimeout(MAP[b.dataset.n],250)},true)})();
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".dr2 .dr-p [data-n]");if(!b||b.dataset.n==="set")return;[].forEach.call(document.querySelectorAll(".st"),function(s){if(!s.hidden){var x=s.querySelector(".st-bar [data-x]");x?x.click():s.hidden=true}});[].forEach.call(document.querySelectorAll(".wp-page.sh-page"),function(p){p.remove()})},true);
/* إصلاح تلقائي لتباين النص على الكروت الغامقة في الإبداعي */
(function(){var R=document.documentElement;
function rgb(s){var m=String(s).match(/[\d.]+/g);if(!m)return null;var a=m.map(Number);if(/color\(srgb/.test(s)){a[0]*=255;a[1]*=255;a[2]*=255}return{r:a[0],g:a[1],b:a[2],a:a.length>3?a[3]:1}}
function L(c){function f(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)}
function bgOf(e){while(e&&e!==R){var cs=getComputedStyle(e),bi=cs.backgroundImage;if(bi&&bi!=="none"&&/gradient/.test(bi)){var m=bi.match(/rgba?\([^)]+\)|color\([^)]+\)|#[0-9a-f]{3,8}/i);if(m){var c=rgb(m[0]);if(c&&c.a>.5)return c}}var b=rgb(cs.backgroundColor);if(b&&b.a>.6)return b;var er=e.getBoundingClientRect();for(var i=0;i<e.children.length;i++){var k=e.children[i],kc=getComputedStyle(k);if(kc.position!=="absolute"&&kc.position!=="fixed")continue;var kr=k.getBoundingClientRect();if(kr.width<er.width*.8||kr.height<er.height*.8)continue;var kb=kc.backgroundImage,km=kb&&kb!=="none"&&kb.match(/rgba?\([^)]+\)|color\([^)]+\)|#[0-9a-f]{3,8}/i);var kcol=km?rgb(km[0]):rgb(kc.backgroundColor);if(kcol&&kcol.a>.5)return kcol}e=e.parentElement}return null}
function cr(a,b){var x=L(a),y=L(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
var last="",seen=new WeakSet();function clr(){seen=new WeakSet();[].forEach.call(document.querySelectorAll("[data-cfix]"),function(e){e.style.removeProperty("color");e.style.removeProperty("stroke");e.removeAttribute("data-cfix")})}
function fix(){var k=R.className;if(k!==last){last=k;clr()}if(!R.classList.contains("ios")){[].forEach.call(document.querySelectorAll("[data-cfix]"),function(e){e.style.removeProperty("color");e.style.removeProperty("stroke");e.removeAttribute("data-cfix")});return}
var roots=[].slice.call(document.querySelectorAll("main,.wp-page,.st,.wd-sheet,#focus"));roots.forEach(function(rt){if(rt.hidden||!rt.offsetParent&&getComputedStyle(rt).position!=="fixed")return;[].forEach.call(rt.querySelectorAll("*"),function(e){if(seen.has(e)||!e.getClientRects().length)return;seen.add(e);var isSvg=e.tagName.toLowerCase()==="svg";var txt=isSvg||[].some.call(e.childNodes,function(n){return n.nodeType===3&&n.textContent.trim()});if(!txt)return;var cs=getComputedStyle(e);var fg=rgb(isSvg?(cs.stroke!=="none"?cs.stroke:cs.fill):cs.color);if(!fg)return;var bg=bgOf(e);if(!bg||L(bg)>.25)return;if(cr(fg,bg)<3){e.style.setProperty("color","#fff","important");if(isSvg&&cs.stroke!=="none")e.style.setProperty("stroke","#fff","important");e.setAttribute("data-cfix","1")}})})}
var t,lastRun=0;new MutationObserver(function(){if(t)return;var w=Math.max(250,1500-(Date.now()-lastRun));t=setTimeout(function(){t=0;lastRun=Date.now();fix()},w)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["class","hidden"]});setTimeout(fix,800)})();
/* رئيسية أقصر: صف اختصارات + «المزيد» */
(function(){var R=document.documentElement,K="wird-home-more";
var I={tasbih:'<circle cx="12" cy="5" r="2"/><circle cx="18" cy="9" r="2"/><circle cx="18" cy="15" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="6" cy="15" r="2"/><circle cx="6" cy="9" r="2"/>',radio:'<rect x="3" y="8" width="18" height="12" rx="3"/><path d="M7 8l9-5"/><circle cx="15.5" cy="14" r="2.5"/>',qibla:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',kids:'<circle cx="12" cy="12" r="9"/><path d="M9 14.5c1.6 1.6 4.4 1.6 6 0M9 10h.01M15 10h.01"/>',tools:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>'};
function more(){try{return localStorage.getItem(K)==="1"}catch(e){return false}}
function setMore(v){try{localStorage.setItem(K,v?"1":"0")}catch(e){}R.classList.toggle("home-more",v);var b=document.querySelector('#homeQuick [data-q="tools"] .hq-t');if(b)b.textContent=v?"أقل":"المزيد";var m=document.querySelector('#homeQuick [data-q="tools"]');m&&m.setAttribute("aria-expanded",v?"true":"false")}
function build(){if(document.getElementById("homeQuick"))return;var a=document.getElementById("rdTile")||document.getElementById("kidsTile")||document.getElementById("quranCard");if(!a||!a.parentNode)return;
var d=document.createElement("div");d.id="homeQuick";
[["tasbih","السبحة"],["qibla","القبلة"],["kids","الأطفال"],["tools","المزيد"]].forEach(function(x){var b=document.createElement("button");b.type="button";b.dataset.q=x[0];b.innerHTML='<span class="hq-ic"><svg viewBox="0 0 24 24" aria-hidden="true">'+I[x[0]]+'</svg></span><span class="hq-t">'+x[1]+'</span>';d.appendChild(b)});
d.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;var q=b.dataset.q;
if(q==="tasbih"){window.__wirdGo&&__wirdGo("tasbih")}else if(q==="radio"){window.__openRadio&&__openRadio()}
else if(q==="qibla"){window.__openQibla&&__openQibla()}
else if(q==="kids"){var k=document.getElementById("kidsTile");k&&k.click();setTimeout(function(){if(document.querySelector(".wp-page.kd-page"))return;var m=document.querySelector('[aria-label="القائمة"]');m&&m.click();setTimeout(function(){var it=document.querySelector('.dr2 .dr-p [data-n="kids"]');it&&it.click()},350)},450)}
else{var m=document.querySelector('[aria-label="القائمة"]');m&&m.click()}});
a.parentNode.insertBefore(d,a.nextSibling);R.classList.add("home-short");R.classList.remove("home-more")}
function keep(){build();var d=document.getElementById("homeQuick"),r=document.getElementById("rdTile");if(d&&r&&(d.compareDocumentPosition(r)&Node.DOCUMENT_POSITION_FOLLOWING))r.parentNode.insertBefore(d,r.nextSibling)}
keep();setTimeout(keep,1200);setTimeout(keep,3500)})();

/* رئيسية جديدة: وِردك اليوم + حديث/آية اليوم + مواعيد الأذكار فوق، والإذاعة في الشريط السفلي بدل السبحة */
(function(){var R=document.documentElement,AR="٠١٢٣٤٥٦٧٨٩";function ar(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
function hm(h){h=((h%24)+24)%24;var H=Math.floor(h),M=Math.round((h-H)*60);if(M===60){H++;M=0}var pm=H>=12,h12=H%12||12;return ar(h12)+":"+ar(String(M).padStart(2,"0"))+(pm?" م":" ص")}
/* 1) الشريط السفلي */
function nav(){var n=document.querySelector(".bottom-nav.nav5");if(!n)return;var t=n.querySelector('[data-nav="tasbih"],[href$="#tasbih"],[data-tab="tasbih"]');if(!t)[].forEach.call(n.children,function(c){if(!t&&!c.classList.contains("nv-x")&&(c.textContent||"").trim()==="السبحة")t=c});if(t)t.style.setProperty("display","none","important");if(n.querySelector('.nv-x[data-tab="radio"]'))return;
var b=document.createElement("button");b.type="button";b.className="nv-x nv-radio";b.dataset.tab="radio";b.innerHTML='<span class="ni" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M7 8l9-5"/><circle cx="15.5" cy="14" r="2.5"/></svg></span><span class="nt">الإذاعة</span>';
b.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();if(document.querySelector(".wp-page.rd-page"))return;window.__closeOverlays&&__closeOverlays();setTimeout(function(){window.__openRadio&&__openRadio()},120)});
var anchor=t||n.querySelector('a[data-nav="prayer"],a[href$="#prayer"]');anchor?n.insertBefore(b,anchor.nextSibling):n.appendChild(b)}
function navState(){var b=document.querySelector(".bottom-nav.nav5 .nv-radio");if(!b)return;var on=!!document.querySelector(".wp-page.rd-page");b.classList.toggle("rd-on",on);var n=b.parentNode;n.classList.toggle("rd-open",on)}
/* 2) مواعيد أذكار اليوم */
function cat(rx){try{return(categories.find(function(c){return rx.test(c.name)})||{}).id}catch(e){return null}}
function alerts(){if(document.getElementById("homeAlerts"))return null;var d=document.createElement("section");d.id="homeAlerts";d.className="container";d.dataset.v="home";d.setAttribute("aria-label","أذكار اليوم ومواعيدها");return d}
function fillAlerts(d){var t=null;try{t=prayerDay(0).t}catch(e){}var fri=new Date().getDay()===5;
var rows=[["morning","أذكار الصباح",t?"بعد الفجر · "+hm(t.fajr):"بعد الفجر","sun",/الصباح/],["evening","أذكار المساء",t?"بعد العصر · "+hm(t.asr):"بعد العصر","moon",/المساء/],["sleep","أذكار النوم","قبل النوم","zz",/النوم/]];
var ic={sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',zz:'<path d="M4 7h6l-6 8h6M14 4h6l-6 7h6"/>',book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>'};
var h='<div class="ha-hd">أذكار اليوم</div>';rows.forEach(function(r){var id=cat(r[4])||r[0];h+='<button type="button" class="ha-row" data-cat="'+id+'"><span class="ha-ic ha-'+r[3]+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+ic[r[3]]+'</svg></span><span class="ha-tx"><b>'+r[1]+'</b><small>'+r[2]+'</small></span><span class="ha-go" aria-hidden="true">‹</span></button>'});
if(fri)h+='<button type="button" class="ha-row" data-sura="18"><span class="ha-ic ha-book"><svg viewBox="0 0 24 24" aria-hidden="true">'+ic.book+'</svg></span><span class="ha-tx"><b>سورة الكهف</b><small>يوم الجمعة</small></span><span class="ha-go" aria-hidden="true">‹</span></button>';
d.innerHTML=h}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#homeAlerts .ha-row");if(!b)return;if(b.dataset.sura){window.__openSurahN&&__openSurahN(+b.dataset.sura)}else{try{openFocus(b.dataset.cat)}catch(x){}}});
/* 3) ترتيب الرئيسية */
function tabs(list){if(list.length<2||document.getElementById("ayTabs"))return;var w=document.createElement("div");w.id="ayTabs";w.className="container ay-tabs";w.setAttribute("role","tablist");
list.forEach(function(sec,i){var hh=sec.querySelector("h2,h3,.sec-title,strong");var name=(hh?hh.textContent:"").trim().slice(0,22)||(i?"آية اليوم":"حديث اليوم");var b=document.createElement("button");b.type="button";b.setAttribute("role","tab");b.textContent=name;b.onclick=function(){list.forEach(function(x,k){x.classList.toggle("ay-hide",k!==i)});[].forEach.call(w.children,function(c,k){c.setAttribute("aria-selected",k===i)})};w.appendChild(b)});
list[0].parentNode.insertBefore(w,list[0]);w.firstChild.click()}
function order(){var hq=document.getElementById("homeQuick");if(!hq)return;var main=hq.parentNode;
var today=document.querySelector(".today-card");var tsec=today&&(today.closest("main>section")||today);
var ays=[].slice.call(document.querySelectorAll("main>section.ay")).filter(function(x){return x.dataset.v==="home"||!x.dataset.v});
var al=document.getElementById("homeAlerts")||alerts();if(al&&!al.dataset.f){fillAlerts(al);al.dataset.f=1}
var before=document.getElementById("quranCard")||hq;
[tsec].concat(ays).concat([al]).forEach(function(x){if(x&&x.parentNode===main&&before.parentNode===main&&x!==before)main.insertBefore(x,before);else if(x&&!x.parentNode)main.insertBefore(x,before)});
tabs(ays);R.classList.add("home-v2")}
function run(){nav();navState();order()}
run();if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);(function(){var n=0,t=setInterval(function(){run();if(R.classList.contains("home-v2")||++n>40)clearInterval(t)},50)})();setTimeout(run,1200);setTimeout(run,3500);setInterval(function(){navState();nav()},600);
setInterval(function(){var a=document.getElementById("homeAlerts");if(a){a.removeAttribute("data-f");fillAlerts(a);a.dataset.f=1}},600000);
})();
