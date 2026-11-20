;(function(){
var ar=__ar;
var J=function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},SV=function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
function T(m){window.toast&&toast(m)}
/* ========== ١) أذكار بعد الصلاة ========== */
var AP=function(){return Object.assign({on:false,min:10},J("wird-after",{}))};
var PN={fajr:"الفجر",dhuhr:"الظهر",asr:"العصر",maghrib:"المغرب",isha:"العشاء"};
var prevH=window.__hijriEvents;
window.__hijriEvents=function(days){var out=[];try{out=prevH?(prevH(days)||[]):[]}catch(e){}var s=AP();if(!s.on)return out;var S={};try{S=__wirdPush.state()}catch(e){}var pr=S.pr||{fajr:1,dhuhr:1,asr:1,maghrib:1,isha:1};
 for(var k=0;k<(days||7);k++){var d;try{d=prayerDay(k)}catch(e){break}var t=d.t,L=d.L,base=Date.UTC(L.y,L.m-1,L.d);for(var p in PN){if(!pr[p]||!isFinite(t[p]))continue;out.push({t:Math.round(base+(t[p]-L.off)*3600e3)+s.min*60e3,title:"أذكار بعد صلاة "+(p==="dhuhr"&&d.isFri?"الجمعة":PN[p]),body:"أَسْتَغْفِرُ اللَّهَ (ثلاثًا)، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ… اضغط لتكمل أذكارك",tag:"after-"+p,url:"/prayer"})}}
 return out};
function apUI(){var sec=document.getElementById("st-adhan");if(!sec||document.getElementById("apOn"))return;var s=AP();var r=document.createElement("div");r.className="st-row";r.innerHTML='<div class="st-l"><strong>تذكير بأذكار بعد الصلاة</strong><small class="st-hint">إشعار بعد كل صلاة يفتح لك أذكار بعد الصلاة مباشرة</small></div><div class="st-c" style="display:flex;gap:8px;align-items:center"><select id="apMin">'+[5,10,15,20,30].map(function(m){return'<option value="'+m+'"'+(m===s.min?" selected":"")+'>بعد '+ar(m)+' د</option>'}).join("")+'</select><label class="st-sw"><input type="checkbox" id="apOn"'+(s.on?" checked":"")+'><span></span></label></div>';var anchor=sec.querySelector(".st-row:last-of-type");(anchor&&anchor.parentElement===sec?anchor.after(r):sec.appendChild(r));
 var sv=function(){var o=AP();o.on=r.querySelector("#apOn").checked;o.min=+r.querySelector("#apMin").value;SV("wird-after",o);try{__wirdPush.sync(true)}catch(e){}T(o.on?"سيصلك تذكير بعد كل صلاة":"أُوقف تذكير ما بعد الصلاة")};r.querySelector("#apOn").onchange=sv;r.querySelector("#apMin").onchange=sv}
/* ========== ٢) نسخة احتياطية ========== */
function dump(){var d={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/^wird/.test(k)&&!/wird-deep|wird-native-perm/.test(k))d[k]=localStorage.getItem(k)}return{app:"wird",v:1,at:new Date().toISOString(),data:d}}
function exportB(){var j=JSON.stringify(dump());var name="wird-backup-"+new Date().toISOString().slice(0,10)+".json";var blob=new Blob([j],{type:"application/json"});var f;try{f=new File([blob],name,{type:"application/json"})}catch(e){}
 if(f&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:"نسخة وِرد الاحتياطية"}).catch(function(){dl(blob,name)})}else dl(blob,name);SV("wird-backup-at",Date.now())}
function dl(b,n){var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=n;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500);T("تم حفظ النسخة الاحتياطية")}
function importB(){var i=document.createElement("input");i.type="file";i.accept=".json,application/json,text/plain";i.onchange=function(){var f=i.files[0];if(!f)return;f.text().then(function(t){var o;try{o=JSON.parse(t)}catch(e){return T("هذا الملف ليس نسخة احتياطية من وِرد")}if(!o||o.app!=="wird"||!o.data)return T("هذا الملف ليس نسخة احتياطية من وِرد");(window.__wConfirm?__wConfirm:function(m){return Promise.resolve(confirm(m))})("استرجاع النسخة الاحتياطية؟\nستُستبدل بتقدّمك وإعداداتك الحالية النسخةُ التي اخترتها.",{ok:"استرجاع",danger:true}).then(function(y){if(!y)return;Object.keys(o.data).forEach(function(k){if(/^wird/.test(k))localStorage.setItem(k,o.data[k])});T("تم استرجاع بياناتك، جارٍ إعادة التحميل…");setTimeout(function(){location.reload()},900)})})};i.click()}
function bkUI(){var sec=document.getElementById("st-data");if(!sec||document.getElementById("bkBox"))return;var at=J("wird-backup-at",0);var b=document.createElement("div");b.id="bkBox";b.className="st-row";b.innerHTML='<div class="st-l"><strong>نسخة احتياطية</strong><small class="st-hint">احفظ تقدّمك ووِردك وإعداداتك في ملف، واسترجعها لو غيّرت هاتفك أو مسحت التطبيق.'+(at?"<br>آخر نسخة: "+new Date(at).toLocaleDateString("ar-EG"):"")+'</small></div><div class="st-c" style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn btn-gold btn-sm" id="bkSave">حفظ نسخة</button><button type="button" class="btn btn-ghost btn-sm" id="bkLoad">استرجاع</button></div>';var h=sec.querySelector("h2");h?h.after(b):sec.prepend(b);b.querySelector("#bkSave").onclick=exportB;b.querySelector("#bkLoad").onclick=importB}
window.__wirdBackup={export:exportB,import:importB};
/* ========== ٣) إعداد أول مرة ========== */
function ready(){var S={};try{S=__wirdPush.state()}catch(e){}var perm=("Notification"in window)?Notification.permission:"x";return{geo:typeof P!=="undefined"&&P.city==="geo",notif:!!S.on&&perm==="granted",sound:!!S.sound&&S.sound!=="none"}}
function setup(force){if(document.getElementById("wsu"))return;var R=ready();if(!force&&(J("wird-setup",0)||(R.geo&&R.notif&&R.sound)))return;if(!force&&(document.querySelector("#onb:not([hidden]),.wd-sheet,#focus:not([hidden]),.wp-page")))return setTimeout(function(){setup(false)},4000);
 var A=window.__ADHANS||{};var opts=Object.keys(A).filter(function(k){return k!=="none"}).map(function(k){return'<option value="'+k+'">'+A[k].n+'</option>'}).join("");
 var o=document.createElement("div");o.id="wsu";o.className="wsu";o.innerHTML='<div class="wsu-c" role="dialog" aria-modal="true" aria-labelledby="wsuT"><div class="wsu-top"><img src="/logo-word.png" alt="" class="wsu-logo"><h2 id="wsuT">جهّز وِرد في دقيقة</h2><p>٣ خطوات ليصلك الأذان في وقته بدقة</p></div>'+
 '<div class="wsu-s" data-s="geo"><span class="wsu-n">١</span><div class="wsu-b"><b>موقعك</b><small>لحساب المواقيت الصحيحة لمنطقتك</small></div><span class="wsu-geo2"><button type="button" class="btn btn-gold btn-sm" data-do="geo">حدّد</button><button type="button" class="btn btn-ghost btn-sm" data-do="city">ابحث</button></span></div>'+
 '<div class="wsu-s" data-s="notif"><span class="wsu-n">٢</span><div class="wsu-b"><b>الإشعارات</b><small>تنبيه الأذان والأذكار حتى والتطبيق مقفول</small></div><button type="button" class="btn btn-gold btn-sm" data-do="notif">فعّل</button></div>'+
 '<div class="wsu-s" data-s="sound"><span class="wsu-n">٣</span><div class="wsu-b"><b>صوت الأذان</b><select id="wsuSnd">'+(opts||'<option value="none">بدون صوت</option>')+'</select></div><button type="button" class="btn btn-gold btn-sm" data-do="sound">اختر</button></div>'+
 '<label class="wsu-ap"><input type="checkbox" id="wsuAp" checked> ذكّرني بأذكار بعد كل صلاة</label>'+
 '<div class="wsu-f"><button type="button" class="btn btn-primary" data-do="done">تمام</button><button type="button" class="btn btn-ghost" data-do="later">لاحقًا</button></div></div>';
 document.body.appendChild(o);document.documentElement.classList.add("wsu-open");
 function paint(){var r=ready();["geo","notif","sound"].forEach(function(k){var s=o.querySelector('[data-s="'+k+'"]');s.classList.toggle("ok",r[k]);var b=s.querySelector("button");b.textContent=r[k]?"✓":(k==="geo"?"حدّد":k==="notif"?"فعّل":"اختر");b.disabled=r[k]&&k!=="sound"})}
 paint();var S0={};try{S0=__wirdPush.state()}catch(e){}if(S0.sound&&A[S0.sound])o.querySelector("#wsuSnd").value=S0.sound;
 o.addEventListener("click",function(e){var b=e.target.closest("[data-do]");if(!b)return;var k=b.dataset.do;
  if(k==="geo"){if(!navigator.geolocation)return T("جهازك لا يدعم تحديد الموقع");b.textContent="…";navigator.geolocation.getCurrentPosition(function(p){var la=+p.coords.latitude.toFixed(4),lo=+p.coords.longitude.toFixed(4),tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone}catch(x){}P=Object.assign({},P,{city:"geo",name:"موقعي الحالي",pick:0,lat:la,lng:lo,tz:tz||P.tz,geoT:Date.now()},(window.__nearMethod&&!P.mUser)?{method:__nearMethod(la,lo)}:{});try{savePrayer()}catch(x){}paint()},function(){paint();if(window.__wirdCity){T("تعذّر تحديد موقعك — اختار مدينتك");__wirdCity(paint)}else T("لم يُسمح بالوصول إلى الموقع — تقدر تختار مدينتك من المواقيت")},{timeout:20000})}
  else if(k==="city"){if(window.__wirdCity)__wirdCity(paint)}
  else if(k==="notif"){try{__wirdPush.enable().then(paint,function(err){T(String(err&&err.message)==="ios"?"على آيفون: ثبّت وِرد على الشاشة الرئيسية الأول":"الإشعارات اترفضت — فعّلها من إعدادات الموبايل");paint()})}catch(x){}}
  else if(k==="sound"){var v=o.querySelector("#wsuSnd").value;var st=J("wird-push",{});st.sound=v;SV("wird-push",st);try{localStorage.removeItem("wird-snd-none")}catch(x){}try{__wirdPush.sync(true)}catch(x){}var sel=document.getElementById("azSound");if(sel)sel.value=v;T("اخترت: "+((A[v]||{}).n||v));paint()}
  else if(k==="done"||k==="later"){if(k==="done"&&o.querySelector("#wsuAp").checked){var a=AP();a.on=true;SV("wird-after",a);try{__wirdPush.sync(true)}catch(x){}}SV("wird-setup",k==="done"?1:0);if(k==="later")SV("wird-setup-later",Date.now());o.remove();document.documentElement.classList.remove("wsu-open")}});}
window.__wirdSetup=function(){setup(true)};
function boot(){apUI();bkUI();var l=J("wird-setup-later",0);if(!J("wird-setup",0)&&Date.now()-l>3*864e5)setTimeout(function(){setup(false)},2500)}
boot();__wOnDom(function(){clearTimeout(boot.t);boot.t=setTimeout(function(){apUI();bkUI()},250)});
})();

;(function(){var ar=__ar;
var J=function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},SV=function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
var PR=["fajr","dhuhr","asr","maghrib","isha"],NM={fajr:"الفجر",dhuhr:"الظهر",asr:"العصر",maghrib:"المغرب",isha:"العشاء"};
function key(d){d=d||new Date();return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()}
var IQ=function(){return Object.assign({fajr:25,dhuhr:20,asr:20,maghrib:10,isha:20},J("wird-iqama",{}))};
/* متابعة الصلوات */
function mark(){var L=document.getElementById("prayerList");if(!L)return;var db=J("wird-salah",{}),day=db[key()]||{};var now=null;try{now=prayerDay(0)}catch(e){}
 PR.forEach(function(p){var li=L.querySelector("li."+p);if(!li)return;var b=li.querySelector(".sl-chk");if(!b){b=document.createElement("button");b.type="button";b.className="sl-chk";b.dataset.p=p;li.appendChild(b)}var past=now&&now.t[p]<=now.L.h;b.classList.toggle("on",!!day[p]);b.disabled=!past&&!day[p];b.setAttribute("aria-label",(day[p]?"صلّيت ":"علّم إنك صلّيت ")+NM[p]);b.textContent=day[p]?"✓":""});
 week()}
function week(){var L=document.getElementById("prayerList");if(!L)return;var w=document.getElementById("slWeek");if(!w){w=document.createElement("div");w.id="slWeek";w.className="sl-week";var x=document.getElementById("pcMore");(x||L).after(w)}
 var db=J("wird-salah",{}),tot=0,dots="";for(var i=6;i>=0;i--){var d=new Date();d.setDate(d.getDate()-i);var day=db[key(d)]||{},n=PR.filter(function(p){return day[p]}).length;tot+=n;dots+='<i class="'+(n===5?"f":n?"h":"")+(i===0?" t":"")+'"></i>'}
 var h='<span><b>'+ar(tot)+' من '+ar(35)+'</b> صلاة هذا الأسبوع</span><span class="sl-dots" aria-hidden="true">'+dots+'</span>';if(w.dataset.h!==h){w.innerHTML=h;w.dataset.h=h}}
document.addEventListener("click",function(e){var b=e.target.closest(".sl-chk");if(!b)return;e.stopPropagation();var db=J("wird-salah",{}),k=key();db[k]=db[k]||{};db[k][b.dataset.p]=!db[k][b.dataset.p];var keys=Object.keys(db).sort(function(a,b){return new Date(b)-new Date(a)});keys.slice(60).forEach(function(x){delete db[x]});SV("wird-salah",db);try{navigator.vibrate&&navigator.vibrate(15)}catch(x){}mark();if(db[k][b.dataset.p])window.toast&&toast("تقبّل الله صلاتك 🤲")},true);
/* عدّاد الإقامة */
function iq(){var el=document.getElementById("iqLine");var d;try{d=prayerDay(0)}catch(e){return}var q=IQ(),h=d.L.h,cur=null;PR.forEach(function(p){var t=d.t[p];if(isFinite(t)&&h>=t&&h<t+q[p]/60)cur=p});
 var card=document.querySelector("#prayer .prayer-head");if(!card)return;if(!cur){if(el)el.remove();tb(null);return}var left=Math.max(0,Math.round((d.t[cur]+q[cur]/60-h)*3600));var mm=Math.floor(left/60),ss=left%60;var txt="إقامة صلاة "+(cur==="dhuhr"&&d.isFri?"الجمعة":NM[cur])+" بعد "+ar(mm)+":"+ar(String(ss).padStart(2,"0"));
 if(!el){el=document.createElement("div");el.id="iqLine";el.className="iq-line";card.after(el)}el.textContent=txt;tb(txt)}
function tb(t){var s=document.querySelector(".tb-strip");if(!s)return;var x=s.querySelector(".tb-iq");if(!t){if(x)x.remove();s.classList.remove("iq-on");return}if(!x){x=document.createElement("span");x.className="tb-iq";s.appendChild(x)}x.textContent=t;s.classList.add("iq-on")}
/* وقت الإقامة بيتعدّل من «إعدادات المواقيت» (40-prayer-page.js) */
window.__iqama={get:IQ,set:function(o){SV("wird-iqama",o);iq()}};
function run(){mark()}run();__wEverySec(function(){if(!document.hidden)iq()});
var L=document.getElementById("prayerList");if(L)new MutationObserver(function(){clearTimeout(run.t);run.t=setTimeout(mark,50)}).observe(L,{childList:true});
})();