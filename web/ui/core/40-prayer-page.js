;(function(){"use strict";
/* ===== صفحة المواقيت: الترتيب والأدوات + صفحة «إعدادات المواقيت» =====
 الصفحة: الكارت ← اليوم ← القائمة ← أوقات أخرى ← الأسبوع ← «فعّل الأذان» (لو مقفول) ← الأدوات.
 الإعدادات صفحة واحدة بتتفتح من الترس في الكارت ومن «الإعدادات ← مواقيت الصلاة» ومن معالج الإعداد.
 الستايل في css/19-prayer-page.css */
var ar=__ar;
var I=function(d){return'<svg viewBox="0 0 24 24" aria-hidden="true">'+d+'</svg>'};
var IC={qibla:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',month:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
 hijri:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',alarm:'<circle cx="12" cy="13" r="7"/><path d="M12 10v3l2 2M5 4 3 6M19 4l2 2"/>',
 pin:'<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',chev:'<path d="M15 6l-6 6 6 6"/>',bell:'<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4"/>'};
var PR=["fajr","dhuhr","asr","maghrib","isha"],NM={fajr:"الفجر",dhuhr:"الظهر",asr:"العصر",maghrib:"المغرب",isha:"العشاء"};

/* ===== الصفحة ===== */
function tools(){var card=document.querySelector("#prayer .prayer-card");if(!card||document.getElementById("ptTools"))return;
 var T=[["qibla","القبلة",function(){__openQibla()}],["month","جدول الشهر",function(){__openMonth()}],["hijri","الهجري",function(){__openHijri()}]];
 /* منبّه الفجر في تطبيق أندرويد بس */
 if(window.__WIRD_NATIVE)T.push(["alarm","منبّه الفجر",function(){__openAlarm()}]);
 var w=document.createElement("div");w.id="ptTools";w.className="pt-tools";w.style.setProperty("--n",T.length);
 T.forEach(function(t){var b=document.createElement("button");b.type="button";b.className="pt-tool";b.innerHTML='<span class="pt-tool-ic">'+I(IC[t[0]])+'</span>'+t[1];b.onclick=t[2];w.appendChild(b)});
 card.appendChild(w)}
/* ترتيب ثابت للأقسام اللي بتتبني من ملفات مختلفة */
var ORDER=["#pcDay","#prayerList","#pcMore","#slWeek",".ntf-card","#ptTools"];
function order(){var card=document.querySelector("#prayer .prayer-card");if(!card)return;var prev=card.querySelector(".prayer-head");if(!prev)return;
 ORDER.forEach(function(s){var e=card.querySelector(":scope > "+s);if(!e)return;if(prev.nextElementSibling!==e)prev.after(e);prev=e})}
function gear(){var b=document.getElementById("prayerSettingsBtn");if(b&&!b.dataset.pt){b.dataset.pt=1;b.addEventListener("click",function(){window.__openPrayerSettings()})}}
function page(){tools();gear();order()}

/* ===== صفحة الإعدادات ===== */
var pg=null;
function methodOpts(){var auto=__nearMethod(P.lat,P.lng);
 return'<option value="auto"'+(P.mUser?"":" selected")+'>تلقائي حسب موقعك — '+(METHOD_NAMES[auto]||"")+'</option>'+Object.keys(METHOD_NAMES).map(function(k){return'<option value="'+k+'"'+(P.mUser&&P.method===k?" selected":"")+'>'+METHOD_NAMES[k]+'</option>'}).join("")}
function iqOpts(v){return[0,5,10,15,20,25,30,35,40].map(function(m){return'<option value="'+m+'"'+(m===v?" selected":"")+'>'+(m?ar(m)+" د":"بدون")+'</option>'}).join("")}
function adjV(k){var v=+((P.adj||{})[k])||0;return(v>0?"+":v<0?"−":"")+ar(Math.abs(v))}
function html(){var q=window.__iqama?__iqama.get():{},anyAdj=PR.some(function(k){return+((P.adj||{})[k])});
 var where=P.pick?"مدينة اخترتها":P.city==="geo"?"محدّدة من موقعك":"مدينة افتراضية — حدّد موقعك عشان المواقيت تبقى دقيقة";
 return''+
 '<section class="pt-sec"><h2>الموقع</h2><div class="pt-box"><div class="pt-row"><span class="pt-ic">'+I(IC.pin)+'</span><div class="pt-tx"><b data-v="city"></b><small>'+where+'</small></div><button type="button" class="btn btn-primary btn-sm" data-a="city">تغيير</button></div></div></section>'+
 '<section class="pt-sec"><h2>طريقة الحساب</h2><div class="pt-box"><label class="pt-row pt-sel"><select data-a="method" aria-label="طريقة الحساب">'+methodOpts()+'</select></label></div><p class="pt-note">التلقائي بيختار الطريقة المعتمدة في بلدك، وبيتغيّر لوحده لو سافرت.</p></section>'+
 '<section class="pt-sec"><h2>وقت العصر</h2><div class="pt-seg" role="radiogroup" aria-label="وقت العصر">'+[[1,"الجمهور"],[2,"الحنفي"]].map(function(o){return'<button type="button" role="radio" data-a="asr" data-v="'+o[0]+'" aria-checked="'+((+P.asr||1)===o[0])+'">'+o[1]+'</button>'}).join("")+'</div><p class="pt-note">الجمهور: الشافعي والمالكي والحنبلي.</p></section>'+
 '<section class="pt-sec"><h2>الإقامة بعد الأذان</h2><div class="pt-box pt-grid">'+PR.map(function(k){return'<label><span>'+NM[k]+'</span><select data-a="iq" data-p="'+k+'">'+iqOpts(q[k])+'</select></label>'}).join("")+'</div><p class="pt-note">يظهر عدّاد للإقامة بعد كل أذان.</p></section>'+
 '<details class="pt-sec pt-adv"'+(anyAdj?" open":"")+'><summary><h2>متقدم: تعديل يدوي بالدقائق</h2>'+I('<path d="M6 9l6 6 6-6"/>')+'</summary><div class="pt-box">'+PR.map(function(k){return'<div class="pt-row pt-adj" data-k="'+k+'"><span class="pt-tx"><b>'+NM[k]+'</b></span><button type="button" data-a="adj" data-d="-1" aria-label="'+NM[k]+' ناقص دقيقة">−</button><output>'+adjV(k)+'</output><button type="button" data-a="adj" data-d="1" aria-label="'+NM[k]+' زائد دقيقة">+</button></div>'}).join("")+'</div><p class="pt-note">لمطابقة مسجدك أو تقويم بلدك. <button type="button" class="pt-link" data-a="reset">رجّع الكل صفر</button></p></details>'+
 '<section class="pt-sec"><h2>الأذان والتنبيهات</h2><div class="pt-box"><button type="button" class="pt-row pt-go" data-a="notif"><span class="pt-ic">'+I(IC.bell)+'</span><span class="pt-tx"><b>إعدادات الأذان والتنبيه</b><small>الصوت والتنبيه قبل كل صلاة</small></span>'+I(IC.chev)+'</button></div></section>'+
 '<p class="pt-note pt-priv">المواقيت بتتحسب على جهازك. لعرض الجو بس، إحداثيات مدينتك المقرّبة بتتبعت لخدمة الطقس Open-Meteo.</p>'}
function fill(){if(!pg)return;var x=pg.body.querySelector('[data-v="city"]');if(x)x.textContent=P.name||""}
function draw(){if(!pg)return;var open=!!(pg.body.querySelector(".pt-adv")||{}).open,y=pg.el.scrollTop;pg.body.innerHTML=html();fill();if(open)pg.body.querySelector(".pt-adv").open=true;pg.el.scrollTop=y}
function save(){savePrayer();try{window.__wirdPush&&__wirdPush.sync(true)}catch(e){}}
function onClick(e){var b=e.target.closest("[data-a]");if(!b||b.tagName==="SELECT")return;var a=b.dataset.a;
 if(a==="city")window.__wirdCity&&__wirdCity();
 else if(a==="asr"){P.asr=+b.dataset.v;save()}
 else if(a==="adj"){var k=b.closest("[data-k]").dataset.k;P.adj=Object.assign({},P.adj);P.adj[k]=Math.max(-60,Math.min(60,(+P.adj[k]||0)+(+b.dataset.d)));save()}
 else if(a==="reset"){P.adj={};save()}
 else if(a==="notif")window.__openNotif&&__openNotif()}
function onChange(e){var t=e.target,a=t.dataset.a;
 if(a==="method"){if(t.value==="auto"){P.mUser=0;P.method=__nearMethod(P.lat,P.lng)}else{P.mUser=1;P.method=t.value}save()}
 else if(a==="iq"&&window.__iqama){var o=__iqama.get();o[t.dataset.p]=+t.value;__iqama.set(o)}}
window.__openPrayerSettings=function(){if(pg&&pg.el.isConnected)return pg;
 pg=__wPage({title:"إعدادات المواقيت",sub:"الموقع وطريقة الحساب والإقامة",cls:"sh-page pt-set",onClose:function(){pg=null}});
 pg.body.addEventListener("click",onClick);pg.body.addEventListener("change",onChange);draw();return pg};
window.addEventListener("wird-prayer",draw);

/* الشروق مش صلاة: نشيل أي تعديل قديم عليه */
if(P.adj&&+P.adj.sunrise){P.adj=Object.assign({},P.adj);delete P.adj.sunrise;savePrayer()}
/* التلقائي: لو المستخدم ما اختارش طريقة بنفسه، الطريقة تمشي مع الموقع */
window.addEventListener("wird-prayer",function(){if(!P.mUser&&typeof P.lat==="number"){var m=__nearMethod(P.lat,P.lng);if(m!==P.method){P.method=m;savePrayer()}}});

page();__wOnDom(page);
})();
