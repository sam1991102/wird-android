

;(function(){/* ===== السماء في شريط الصلاة القادمة: شمس على قوس النهار / قمر بطوره الحقيقي — حسب توقيت المدينة ===== */
function tz(){try{return (typeof P!=="undefined"&&P.tz)||undefined}catch(e){return undefined}}

function hijriDay(){try{var h=window.__cityH(),t=prayerDay(0).t;var d=new Date();var day=+new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn",{day:"numeric",timeZone:tz()}).format(d);if(h>=t.maghrib)day+=1;return Math.min(30,Math.max(1,day))}catch(e){return 15}}
function sunSVG(f,state){var cx=17,cy=17,R=13;var a=Math.PI*Math.max(0,Math.min(1,f));var x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);if(state!=="day"){y=cy+1.5}
 var glow=state==="fajr"?"#9cc3e0":state==="dusk"?"#f0a070":"#f3cf74";
 return'<svg viewBox="0 0 34 20" width="34" height="20" aria-hidden="true"><path d="M4 17A13 13 0 0 1 30 17" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="1.5 2.2"/><line x1="2" y1="17.5" x2="32" y2="17.5" stroke="currentColor" stroke-opacity=".45" stroke-width="1"/>'+(state==="day"?'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="4.6" fill="'+glow+'" fill-opacity=".25"/><circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="2.9" fill="'+glow+'"/>':'<path d="M'+(state==="fajr"?24:4)+' 17.5a6 4 0 0 1 '+(6)+' 0" fill="'+glow+'" fill-opacity=".9"/>')+'</svg>'}
function moonSVG(d){var k=(1-Math.cos(2*Math.PI*d/29.53))/2;var r=7,cx=17,cy=10;var wax=d<=15;var rx=Math.abs(1-2*k)*r;var lit=wax?1:0;
 /* الجزء المضيء: نصف دائرة + قوس داخلي */
 var outer='M'+cx+' '+(cy-r)+' A'+r+' '+r+' 0 0 '+(wax?1:0)+' '+cx+' '+(cy+r);
 var inner=' A'+rx.toFixed(2)+' '+r+' 0 0 '+((k>0.5)===wax?1:0)+' '+cx+' '+(cy-r);
 return'<svg viewBox="0 0 34 20" width="34" height="20" aria-hidden="true"><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="currentColor" fill-opacity=".14"/><path d="'+outer+inner+'Z" fill="#f4ecd8"/><circle cx="6" cy="5" r=".7" fill="currentColor" fill-opacity=".7"/><circle cx="28" cy="15" r=".6" fill="currentColor" fill-opacity=".6"/><circle cx="29" cy="4" r=".5" fill="currentColor" fill-opacity=".5"/></svg>'}
var PH=["هلال","تربيع أول","أحدب متزايد","بدر","أحدب متناقص","تربيع ثانٍ","هلال آخر الشهر"];
function phaseName(d){return d<=1||d>=29?"محاق تقريبًا":d<7?"هلال":d<9?"تربيع أول":d<14?"أحدب متزايد":d<=16?"بدر":d<22?"أحدب متناقص":d<24?"تربيع ثانٍ":"هلال آخر الشهر"}
function draw(){var s=document.querySelector(".tb-strip");if(!s)return;var el=s.querySelector(".sky");if(!el){el=document.createElement("span");el.className="sky";s.insertBefore(el,s.firstChild);var clk=el.nextElementSibling;if(clk&&clk.tagName==="svg")clk.classList.add("sky-old")}
 var html,label;try{var t=prayerDay(0).t,h=window.__cityH();
  if(h>=t.sunrise&&h<t.maghrib){var f=(h-t.sunrise)/(t.maghrib-t.sunrise);html=sunSVG(f,"day");label="الشمس الآن: "+(f<.33?"في أول النهار":f<.66?"في وسط السماء":"تميل إلى الغروب")}
  else if(h>=t.fajr&&h<t.sunrise){html=sunSVG(0,"fajr");label="وقت الفجر — قبيل الشروق"}
  else if(h>=t.maghrib&&h<t.maghrib+0.5){html=sunSVG(1,"dusk");label="وقت الغروب"}
  else{var d=hijriDay();html=moonSVG(d);label="القمر الليلة: "+phaseName(d)}}catch(e){return}
 if(el.dataset.h!==html){el.innerHTML=html;el.dataset.h=html}el.setAttribute("title",label);el.setAttribute("aria-label",label);el.setAttribute("role","img")}
setTimeout(draw,1200);setInterval(draw,60000);document.addEventListener("visibilitychange",function(){if(!document.hidden)draw()});
__wOnDom(function(){if(!document.querySelector(".tb-strip .sky"))draw()});
window.__skyDraw=draw;})();

;(function(){/* ===== بطاقة السماء (v225): شمس وقمر حقيقيان حسب مدينة المستخدم ===== */
var ar=__ar;
function tz(){try{return(typeof P!=="undefined"&&P.tz)||undefined}catch(e){return undefined}}
function cityH(){return __nowH()}
function cityHs(){try{var p=new Intl.DateTimeFormat("en-GB",{timeZone:tz(),hour:"numeric",minute:"numeric",second:"numeric",hourCycle:"h23"}).formatToParts(new Date());var g=function(k){return+((p.find(function(x){return x.type===k})||{}).value||0)};return g("hour")+g("minute")/60+g("second")/3600}catch(e){return cityH()}}
var PN={fajr:"الفجر",dhuhr:"الظهر",asr:"العصر",maghrib:"المغرب",isha:"العشاء"};
function next(){return __nextPrayer()}
function fmt(x){var s=Math.max(0,Math.round(x*3600));var hh=Math.floor(s/3600),mm=Math.floor(s%3600/60),ss=s%60;return ar(hh+":"+String(mm).padStart(2,"0")+":"+String(ss).padStart(2,"0"))}
function hijriDay(){try{var d=+new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn",{day:"numeric",timeZone:tz()}).format(new Date());if(cityH()>=prayerDay(0).t.maghrib)d+=1;return Math.min(30,Math.max(1,d))}catch(e){return 15}}
function state(){try{var t=prayerDay(0).t,h=cityH();if(h>=t.fajr&&h<t.sunrise)return{s:"dawn",f:0};if(h>=t.sunrise&&h<t.maghrib){var f=(h-t.sunrise)/(t.maghrib-t.sunrise);return{s:f>0.86?"dusk":"day",f:f}}if(h>=t.maghrib&&h<t.maghrib+0.6)return{s:"twilight",f:1};return{s:"night",f:0}}catch(e){return{s:"day",f:.4}}}
/* الشمس بمكانها الحقيقي: بتطلع من الأفق تحت، تعلى لحد الظهر، وتنزل للأفق عند المغرب (ارتفاعها = جيب زاوية النهار) */
function sunEl(f,s){f=Math.max(0,Math.min(1,f));var x=86-74*f,y=96-74*Math.sin(Math.PI*f);if(s==="dawn"){x=86;y=125}if(s==="twilight"){x=12;y=125}
 return'<div class="sk-sun sk-'+s+'" style="left:'+x.toFixed(1)+'%;top:'+y.toFixed(1)+'%"><i></i></div>'}
function moonSVG(d){var k=(1-Math.cos(2*Math.PI*d/29.53))/2,wax=d<=15,r=40,c=44;var rx=(Math.abs(1-2*k)*r).toFixed(2);
 var lit="M"+c+" "+(c-r)+" A"+r+" "+r+" 0 0 "+(wax?1:0)+" "+c+" "+(c+r)+" A"+rx+" "+r+" 0 0 "+((k>0.5)===wax?1:0)+" "+c+" "+(c-r)+"Z";
 return'<svg class="sk-moon" viewBox="0 0 88 88" aria-hidden="true"><defs><radialGradient id="skMg" cx="40%" cy="38%" r="70%"><stop offset="0" stop-color="#fffdf2"/><stop offset=".55" stop-color="#ece6cf"/><stop offset="1" stop-color="#c9c2a8"/></radialGradient><mask id="skMm"><rect width="88" height="88" fill="#000"/><path d="'+lit+'" fill="#fff"/></mask><filter id="skMb"><feGaussianBlur stdDeviation="1.2"/></filter></defs>'+
 '<circle cx="'+c+'" cy="'+c+'" r="'+r+'" fill="#c9cfe0" fill-opacity=".13"/>'+
 '<g mask="url(#skMm)"><circle cx="'+c+'" cy="'+c+'" r="'+r+'" fill="url(#skMg)"/><g fill="#a9a28a" fill-opacity=".35" filter="url(#skMb)"><circle cx="30" cy="30" r="7"/><circle cx="55" cy="26" r="4.5"/><circle cx="58" cy="52" r="9"/><circle cx="33" cy="58" r="5"/><circle cx="46" cy="70" r="3.5"/><circle cx="68" cy="38" r="3"/></g></g></svg>'}
var PHN=function(d){return d<=1||d>=29?"محاق":d<7?"هلال":d<9?"تربيع أول":d<14?"أحدب متزايد":d<=16?"بدر":d<22?"أحدب متناقص":d<24?"تربيع ثانٍ":"هلال آخر الشهر"};
function stars(){var h="";for(var i=0;i<26;i++){var x=(i*37%97)+1.5,y=(i*53%70)+3,s=(i%3)*.5+1;h+='<b style="left:'+x+'%;top:'+y+'%;width:'+s+'px;height:'+s+'px;animation-delay:'+(i%7)*.6+'s"></b>'}return'<div class="sk-stars">'+h+'</div>'}
function build(){var hero=document.querySelector("section.hero");if(!hero)return null;var el=document.getElementById("skyCard");if(el)return el;
 el=document.createElement("section");el.className="container sky-card";el.id="skyCard";el.dataset.v="home";el.setAttribute("aria-label","حالة السماء والصلاة القادمة");
 el.innerHTML='<div class="sk-bg"></div><div class="sk-scene"></div><div class="sk-clouds" aria-hidden="true"></div><div class="sk-info"><div class="sk-day"><b class="sk-wd"></b><small class="sk-city"></small></div><div class="sk-dates"><div><b class="sk-hj"></b><small class="sk-hy"></small></div><div><b class="sk-gr"></b><small class="sk-gy"></small></div></div><a class="sk-next" href="#prayer"><span class="sk-np"></span><b class="sk-cd"></b></a><div class="sk-meta"><span class="sk-label"></span><span class="sk-period"></span></div></div>';
 hero.parentNode.insertBefore(el,hero);return el}
var last="",dKey="",FM={};
/* بنكتب النص بس لو اتغيّر (الكتابة بتعيد رسم الكارت) */
function put(el,sel,v){var e=el.querySelector(sel);if(e&&e.textContent!==v)e.textContent=v}
function fmts(z){var k=z||"";return FM[k]||(FM[k]={wd:new Intl.DateTimeFormat("ar",{weekday:"long",timeZone:z}),hj:new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura",{day:"numeric",month:"long",year:"numeric",timeZone:z}),gr:new Intl.DateTimeFormat("ar-EG",{day:"numeric",month:"long",year:"numeric",timeZone:z})})}
/* المشهد (شمس بمكانها الحقيقي / قمر بطوره / نجوم) — بيستخدمه كارت اليوم وكارت المواقيت */
function scene(){var st=state(),d=hDay();return{key:st.s+"|"+(st.s==="night"?d:Math.round(st.f*60)),html:(st.s==="night"||st.s==="twilight"?stars():"")+(st.s==="night"?moonSVG(((Date.now()/864e5-10962.76)%29.530589+29.530589)%29.530589):sunEl(st.f,st.s))}}
window.__skyScene=function(){return scene()};
var hd={k:"",v:15};function hDay(){var k=Math.floor(Date.now()/6e4);if(hd.k!==k){hd.k=k;hd.v=hijriDay()}return hd.v}
function paint(){var el=build();if(!el)return;var st=state(),d=hDay();if(el.dataset.sky!==st.s)el.dataset.sky=st.s;
 var sn=scene();if(sn.key!==last){last=sn.key;var sc=el.querySelector(".sk-scene");sc.innerHTML=sn.html;
  put(el,".sk-label",st.s==="night"?"القمر الليلة: "+PHN(d):st.s==="dawn"?"قبيل الشروق":st.s==="twilight"?"بعد الغروب":st.s==="dusk"?"الشمس تميل إلى الغروب":"الشمس "+(st.f<.3?"في أول النهار":st.f<.7?"في كبد السماء":"بعد الزوال"))}
 /* التواريخ بتتغيّر مرة في اليوم: بنحسبها مرة في الدقيقة بس، والمنسّقات بتتعمل مرة لكل منطقة زمنية */
 var mk=Math.floor(Date.now()/6e4)+"|"+tz();if(mk!==dKey){dKey=mk;try{var z=tz(),now=new Date(),F=fmts(z),gv=function(p,k){return(p.find(function(x){return x.type===k})||{}).value||""};
  put(el,".sk-wd",F.wd.format(now));put(el,".sk-city",(typeof P!=="undefined"&&P.name)?P.name:"");
  var hp=F.hj.formatToParts(now);put(el,".sk-hj",gv(hp,"day")+" "+gv(hp,"month"));put(el,".sk-hy",gv(hp,"year")+" هـ");
  var gp=F.gr.formatToParts(now);put(el,".sk-gr",gv(gp,"day")+" "+gv(gp,"month"));put(el,".sk-gy",gv(gp,"year"))}catch(e){}}
 var ch=document.querySelector(".tb-strip .tp-chip b");put(el,".sk-period",ch?ch.textContent:"");
 var n=next();if(n){put(el,".sk-np",PN[n.k]+" بعد");put(el,".sk-cd",fmt(n.left))}}
paint();if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",paint);/* كارت السماء في الرئيسية بس: مفيش داعي يتحسب كل ثانية وهو مش ظاهر */__wEverySec(function(){if(!document.hidden&&(document.documentElement.dataset.view||"home")==="home")paint()});document.addEventListener("visibilitychange",function(){if(!document.hidden){last="";paint()}});
window.__skyCard=paint;})();


;(function(){/* ===== ترتيب الرئيسية (v227): بلا تكرار ===== */
var ar=__ar;
/* ١) العبارة داخل بطاقة السماء */
function phrase(){var c=document.getElementById("skyCard");if(!c)return;var m=c.querySelector(".sk-meta");if(!m||m.querySelector(".sk-dhikr"))return;var lb=m.querySelector(".sk-label");var p=document.createElement("span");p.className="sk-dhikr";p.textContent="اجعل لسانك رطبًا بذكر الله";if(lb){var sc=c.querySelector(".sk-scene");lb.hidden=true;new MutationObserver(function(){sc&&sc.setAttribute("title",lb.textContent);c.setAttribute("aria-description",lb.textContent)}).observe(lb,{childList:true,characterData:true,subtree:true})}m.insertBefore(p,m.firstChild)}
/* ٢) عنوان «وِردك اليوم»: التقدّم بدل التاريخ */
var NM={morning:"أذكار الصباح",evening:"أذكار المساء",sleep:"أذكار النوم"};
function today(){var h=document.getElementById("todayDate");if(!h)return;var ks=["morning","evening","sleep"],done=0,nextK=null;try{ks.forEach(function(k){if(catPct(k)>=100)done++;else if(!nextK)nextK=k});var tc=null;try{tc=timeCategory()}catch(e){}if(tc&&ks.indexOf(tc)>-1&&catPct(tc)<100)nextK=tc}catch(e){return}
 var t=done===3?"أتممت وِرد اليوم كاملًا، تقبّل الله":"أتممت "+ar(done)+" من ٣"+(nextK?" — التالي: "+NM[nextK]:"");if(h.textContent!==t){h.textContent=t;h.classList.add("td-prog")}}
/* ٣) إخفاء شريط الصلاة القادمة في الرئيسية طالما بطاقة السماء ظاهرة */
function watch(){var c=document.getElementById("skyCard"),H=document.documentElement;if(!c)return;var on=c.offsetParent!==null;var r=c.getBoundingClientRect();var tb=document.querySelector(".topbar");var top=tb?tb.getBoundingClientRect().bottom:0;H.classList.toggle("sky-vis",on&&r.bottom>top+70&&r.top<innerHeight)}addEventListener("scroll",function(){watch()},{passive:true});addEventListener("hashchange",function(){setTimeout(watch,50)});
function tick(){phrase();today();watch()}
tick();__wEverySec(function(){if(!document.hidden&&(document.documentElement.dataset.view||"home")==="home")tick()});document.addEventListener("visibilitychange",function(){if(!document.hidden)tick()});
})();