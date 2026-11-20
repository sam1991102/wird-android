;(function(){/* ===== صفحة المواقيت: كارت الصلاة القادمة + قائمة اليوم =====
 الكارت: السما الحيّة (38-sky-live.js) + قوس الشمس من الشرق للغرب وعليه علامات الصلوات + كثبان رملية بلون النور.
 القائمة: تنقّل بين الأيام، و«أوقات أخرى» (الإمساك والضحى والثلث الأخير) مطوية تحتها مع سطر التوقيت.
 الستايل في css/18-prayer-card.css */
var ar=__ar,NS="http://www.w3.org/2000/svg";
var W=360,H=300,CX=180,CY=252,RX=150,RY=196;
function hm(h){h=((h%24)+24)%24;var H=Math.floor(h),M=Math.round((h-H)*60);if(M===60){H=(H+1)%24;M=0}var pm=H>=12,h12=H%12||12;return ar(h12+":"+("0"+M).slice(-2))+" "+(pm?"م":"ص")}
function pt(f){var a=Math.PI*f;return[CX+RX*Math.cos(a),CY-RY*Math.sin(a)]}
function arcD(f){var e=pt(f);return"M"+(CX+RX)+" "+CY+" A"+RX+" "+RY+" 0 0 0 "+e[0].toFixed(1)+" "+e[1].toFixed(1)}

/* ===== الكارت ===== */
function head(){return document.querySelector("#prayer .pc2 .prayer-head")}
function build(h){if(h.querySelector(".pc-arc"))return;var L=h.querySelector(".w-skyl");if(!L)return;
 var s=document.createElementNS(NS,"svg");s.setAttribute("class","pc-arc");s.setAttribute("viewBox","0 0 "+W+" "+H);s.setAttribute("preserveAspectRatio","xMidYMax slice");s.setAttribute("aria-hidden","true");
 s.innerHTML='<defs><radialGradient id="pcSunG"><stop offset="0" stop-color="#fff6d8" stop-opacity=".85"/><stop offset=".35" stop-color="#ffd27a" stop-opacity=".35"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>'+
  '<path class="pc-track" d="'+arcD(1)+'"/><path class="pc-done" d=""/><g class="pc-marks"></g><g class="pc-sun"><circle r="46" fill="url(#pcSunG)"/><circle class="pc-disc" r="13"/></g>'+
  '<path class="pc-dune pc-far" d="M0 238 C60 222 110 232 170 226 S290 214 360 230 L360 300 L0 300Z"/><path class="pc-dune pc-near" d="M0 262 C70 246 130 262 200 252 S310 246 360 258 L360 300 L0 300Z"/>';
 L.insertBefore(s,L.querySelector(".sk-clouds"));h.classList.add("pc-v2");
 var t=h.querySelector("#prayerTitle");if(t&&t.parentElement!==h)t.parentElement.classList.add("pc-main");
 /* المدينة فوق على اليمين: تضغط عليها تغيّرها */
 if(!h.querySelector(".pc-city")){var c=document.createElement("button");c.type="button";c.className="pc-city";c.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg><span></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';c.onclick=function(){window.__wirdCity&&__wirdCity()};h.appendChild(c)}}
var lastKey="";
function paint(){var h=head();if(!h)return;build(h);var s=h.querySelector(".pc-arc");if(!s)return;var t,now;try{t=prayerDay(0).t;now=__nowH()}catch(e){return}
 var key=Math.round(now*30)+"|"+t.sunrise.toFixed(3);if(key===lastKey)return;lastKey=key;
 var span=t.maghrib-t.sunrise,f=(now-t.sunrise)/span,up=f>-.04&&f<1.04;
 /* علامات الظهر والعصر على القوس (الشروق والمغرب عند الأفق) */
 var mk="";[(t.dhuhr-t.sunrise)/span,(t.asr-t.sunrise)/span].forEach(function(x){var p=pt(x);mk+='<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="3"/>'});s.querySelector(".pc-marks").innerHTML=mk;
 s.querySelector(".pc-done").setAttribute("d",f>0&&f<1?arcD(f):"");
 var g=s.querySelector(".pc-sun");g.style.display=up?"":"none";
 if(up){var ff=Math.max(-.04,Math.min(1.04,f)),p=pt(Math.max(0,Math.min(1,ff)));g.setAttribute("transform","translate("+p[0].toFixed(1)+" "+(p[1]+(ff<0||ff>1?14:0)).toFixed(1)+")");g.classList.toggle("low",ff<.08||ff>.92)}
 var c=h.querySelector(".pc-city span");try{var n=(typeof P!=="undefined"&&P.name)?P.name:"";if(c&&c.textContent!==n){c.textContent=n;c.parentNode.setAttribute("aria-label","المدينة: "+n+" — تغيير")}}catch(e){}}

/* ===== القائمة: التنقّل بين الأيام ===== */
var off=0,KEYS=["fajr","sunrise","dhuhr","asr","maghrib","isha"];
var dayF=null,hijF=null;
function fmtDay(o){try{var z=P.tz,d=new Date(Date.now()+864e5*o);dayF=dayF||new Intl.DateTimeFormat("ar-EG",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:z});hijF=hijF||new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura",{day:"numeric",month:"long",year:"numeric",timeZone:z});return[dayF.format(d),hijF.format(d)]}catch(e){return["",""]}}
function nav(){var list=document.getElementById("prayerList");if(!list)return;var bar=document.getElementById("pcDay");
 if(!bar){bar=document.createElement("div");bar.id="pcDay";bar.className="pc-day";
  bar.innerHTML='<button type="button" data-d="-1" aria-label="اليوم السابق"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button><div class="pc-dt"><b></b><small></small></div><button type="button" data-d="1" aria-label="اليوم التالي"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>';
  list.parentNode.insertBefore(bar,list);
  bar.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;off=Math.max(-30,Math.min(30,off+(+b.dataset.d)));day()});
  bar.querySelector(".pc-dt").addEventListener("click",function(){if(off){off=0;day()}})}
 day()}
function day(){var bar=document.getElementById("pcDay"),list=document.getElementById("prayerList");if(!bar||!list)return;
 var d=fmtDay(off),b=bar.querySelector("b"),s=bar.querySelector("small");if(b.textContent!==d[0])b.textContent=d[0];if(s.textContent!==d[1])s.textContent=d[1];
 bar.querySelector(".pc-dt").setAttribute("aria-label",off?"رجوع لليوم":"");bar.classList.toggle("is-other",!!off);list.classList.toggle("pc-other",!!off);
 /* يوم مرة أخرى: نكتب مواقيته في نفس الصفوف (والحالة والعلامات بتختفي)، واليوم: app.js بيكتب الأصلي */
 var t;try{t=prayerDay(off).t}catch(e){return}
 KEYS.forEach(function(k){var li=list.querySelector("li."+k),st=li&&li.querySelector("strong");if(!st)return;if(off){if(!st.dataset.o)st.dataset.o=st.textContent;var v=hm(t[k]);if(st.textContent!==v)st.textContent=v}});
 if(!off&&list.querySelector("strong[data-o]")&&typeof renderPrayer==="function")try{renderPrayer()}catch(e){}
 extras(t)}

/* ===== أوقات أخرى + سطر التوقيت ===== */
var offF=null;
function tzLine(){try{if(!offF)offF=new Intl.DateTimeFormat("en",{timeZone:P.tz,timeZoneName:"shortOffset"});var z=(offF.formatToParts(new Date()).find(function(x){return x.type==="timeZoneName"})||{}).value||"";z=z.replace("GMT","UTC");var c=P.name||"",m=document.getElementById("prayerPlace"),meth=m?(m.textContent.split("بطريقة")[1]||"").trim():"";return"بتوقيت "+c+" ("+ar(z||"UTC")+")"+(meth?" · "+meth:"")}catch(e){return""}}
function extras(t){var list=document.getElementById("prayerList");if(!list)return;var x=document.getElementById("pcMore");
 if(!x){x=document.createElement("details");x.id="pcMore";x.className="pc-more";x.innerHTML='<summary>أوقات أخرى<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary><div class="pc-more-b"></div>';list.parentNode.insertBefore(x,list.nextSibling)}
 var t1;try{t1=prayerDay(off+1).t}catch(e){t1=t}
 var night=(t1.fajr+24)-t.maghrib,last=t.maghrib+night*2/3;
 /* الإمساك: ١٠ دقايق قبل الفجر (المعتاد في التقاويم)، الضحى: ٢٠ دقيقة بعد الشروق، الثلث الأخير: من تقسيم الليل (المغرب ← فجر اليوم اللي بعده) */
 var html='<div class="pc-more-g"><div><span>الإمساك</span><b>'+hm(t.fajr-1/6)+'</b></div><div><span>الضحى</span><b>'+hm(t.sunrise+1/3)+'</b></div><div><span>الثلث الأخير</span><b>'+hm(last)+'</b></div></div><p>'+tzLine()+'</p>';
 var b=x.querySelector(".pc-more-b");if(b.dataset.h!==html){b.innerHTML=html;b.dataset.h=html}}

function run(){if(!head())return;paint();nav()}
__wOnDom(function(){var h=head();if(h&&h.querySelector(".w-skyl")&&!h.querySelector(".pc-arc"))run();var L=document.getElementById("prayerList");if(L&&!document.getElementById("pcDay"))nav();
 /* app.js بيعيد رسم القائمة بمواقيت اليوم؛ لو المستخدم على يوم مرة أخرى نرجّع مواقيت اليوم ده */
 else if(L&&off){var s0=L.querySelector("strong");if(s0&&!s0.dataset.o)day()}});
var n=0;__wEverySec(function(){if((document.documentElement.dataset.view||"")!=="prayer")return;paint();if(++n%60===0&&!off)day()});
__wOnView(function(){if(document.documentElement.dataset.view==="prayer"){if(off){off=0}run()}});
window.addEventListener("storage",function(e){if(e.key==="wird-prayer"){lastKey="";dayF=hijF=offF=null;run()}});
run();
})();
