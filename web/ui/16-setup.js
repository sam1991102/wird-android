/*setup*/(function(){
/* معالج الإعداد الأول — ٤ شاشات: الموقع ← الأذان ← خطوات ضمان الأذان (الناقص فقط) ← جاهز.
   كل إذن بيتطلب في لحظته ومعاه سببه، وباقي الإعدادات (القارئ، المظهر، ذكر الساعة…) اختيارية بعدين. */
var R=document.documentElement,K="wird-setup-done",ov=null,cur=0,listPaint=null,stack=[];
var ar=__ar;
function done(){try{return localStorage.getItem(K)==="1"}catch(e){return true}}
function mark(){try{localStorage.setItem(K,"1");localStorage.setItem("wird-onboarded","1")}catch(e){}}
function RD(){return window.__wirdReady}
function dots(k){var h="";for(var j=0;j<4;j++)h+='<i class="'+(j<=k?"on":"")+'"></i>';return'<div class="su-dots" aria-hidden="true">'+h+"</div>"}
function svg(d){return'<svg viewBox="0 0 24 24" aria-hidden="true">'+d+"</svg>"}
var IC={geo:svg('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
 adhan:svg('<path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15z"/><path d="M10 21h4"/>'),ok:svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>')};
function city(){try{return P.name||"—"}catch(e){return"—"}}
function times(){try{var t=prayerDay(0).t;return"الفجر "+fmtT(t.fajr)+" · الظهر "+fmtT(t.dhuhr)+" · العصر "+fmtT(t.asr)}catch(e){return""}}
function snd(){var S=window.__wirdPush?__wirdPush.state():{},A=window.__ADHANS||{};return{S:S,A:A,k:S.sound&&A[S.sound]?S.sound:"none"}}
function show(html,cls){if(listPaint&&RD()){RD().off(listPaint);listPaint=null}ov&&ov.remove();ov=document.createElement("div");ov.className="su-ov "+(cls||"");ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");ov.innerHTML=html;document.body.appendChild(ov);R.classList.add("su-on");var h=ov.querySelector("h1");h&&h.setAttribute("tabindex","-1");h&&h.focus({preventScroll:true})}

function geo(){cur=0;
 show(dots(0)+'<div class="su-ic">'+IC.geo+'</div><h1>أين تصلّي؟</h1><p>نحسب مواقيت الصلاة والقبلة من مدينتك. الموقع يبقى على جهازك.</p>'+
  '<div class="su-card"><div class="su-cr"><div><b class="su-city">'+city()+'</b><small class="su-t">'+times()+'</small></div><button type="button" class="su-chip" data-su="city">تغيير</button></div></div>'+
  '<p class="su-msg" aria-live="polite"></p>'+
  '<div class="su-foot"><button type="button" class="su-main" data-su="locate">تحديد موقعي تلقائيًا</button><button type="button" class="su-link" data-su="next">المدينة صحيحة، التالي</button><button type="button" class="su-link su-sm" data-su="restore">عندي نسخة احتياطية</button></div>')}
function paintGeo(msg){if(!ov||cur!==0)return;ov.querySelector(".su-city").textContent=city();ov.querySelector(".su-t").textContent=times();if(msg!=null)ov.querySelector(".su-msg").textContent=msg}

function adhan(){cur=1;var x=snd();
 var opts=Object.keys(x.A).filter(function(k){return k!=="none"}).map(function(k){return'<option value="'+k+'"'+(k===x.k?" selected":"")+">"+x.A[k].n+"</option>"}).join("");
 var on=RD()&&RD().steps()[0].ok;
 show(dots(1)+'<div class="su-ic">'+IC.adhan+'</div><h1>الأذان في وقته</h1><p>'+(on?"الأذان مفعّل. اختر الصوت الذي تحبّه.":"نُشعرك بالأذان عند كل صلاة. سيسألك هاتفك بعد قليل عن السماح بالإشعارات.")+'</p>'+
  '<div class="su-card"><div class="su-cr"><button type="button" class="su-play" data-su="play" aria-label="استماع">'+svg('<path d="M8 5v14l11-7z"/>')+'</button><div class="su-grow"><b>صوت الأذان</b><select class="su-sel" aria-label="صوت الأذان">'+(opts||'<option value="none">صوت التنبيه المعتاد</option>')+'</select></div></div></div>'+
  '<p class="su-msg" aria-live="polite"></p>'+
  '<div class="su-foot"><button type="button" class="su-main" data-su="enable">'+(on?"التالي":"تفعيل الأذان")+'</button><button type="button" class="su-link" data-su="later">لاحقًا</button></div>')}

function ready(){cur=2;
 show(dots(2)+'<h1>خطوات ليصل الأذان دائمًا</h1><p>هاتفك يوقف التطبيقات لتوفير البطارية. خطوة بخطوة، وكل خطوة تأخذ ثوانٍ.</p><div class="su-card su-steps rdy-list"></div>'+
  '<div class="su-foot"><button type="button" class="su-main" data-su="fin">متابعة</button><button type="button" class="su-link su-skip" data-su="fin">تخطَّ الآن (قد يتأخر الأذان)</button></div>');
 var box=ov.querySelector(".su-steps");listPaint=function(){RD().list(box);var m=RD().missing();var b=ov&&ov.querySelector(".su-main");if(b)b.textContent=m?"متابعة":"تمّ — التالي";var k=ov&&ov.querySelector(".su-skip");if(k)k.hidden=!m};
 RD().on(listPaint);listPaint();RD().bindList(box);RD().refresh()}

function fin(){cur=3;var L=RD()?RD().steps():[],on=L[0]&&L[0].ok,m=RD()?RD().missing():0;
 show(dots(3)+'<div class="su-ic su-okic">'+IC.ok+'</div><h1>وِرد جاهز</h1><p>'+(on?(m?"الأذان مفعّل في "+city()+". تقدر تكمّل الخطوات الناقصة من صفحة الأذان في أي وقت.":"الأذان مفعّل في "+city()+"، وكل شيء تمام."):"تقدر تفعّل الأذان في أي وقت من الإعدادات.")+'</p>'+
  '<div class="su-card su-opt"><b>اختياري، تضبطه بعدين من الإعدادات:</b><ul>'+(window.__WIRD_NATIVE?"<li>منبّه الفجر بالشاشة الكاملة</li>":"")+'<li>ذكر قصير كل ساعة</li><li>القارئ والمظهر وحجم الخط</li></ul></div>'+
  '<div class="su-foot"><button type="button" class="su-main" data-su="end">ابدأ وِردك</button></div>')}

function go(k){stack.push(cur);if(k===2){/* لو الأذان مش مفعّل أو مافيش ناقص، نعدّي شاشة الخطوات */var L=RD()?RD().steps():[];if(!(L[0]&&L[0].ok)||!RD().missing()){fin();return}}[geo,adhan,ready,fin][k]()}
function end(){mark();stopPv();if(listPaint&&RD())RD().off(listPaint);listPaint=null;ov&&ov.remove();ov=null;R.classList.remove("su-on");window.__wirdGo&&__wirdGo("home")}
var pv=null;function stopPv(){if(pv){pv.pause();pv=null}var b=ov&&ov.querySelector(".su-play");b&&b.classList.remove("on")}

document.addEventListener("change",function(e){if(!ov||!e.target.classList.contains("su-sel"))return;stopPv();var S=window.__wirdPush&&__wirdPush.state();if(!S)return;S.sound=e.target.value;try{localStorage.setItem("wird-push",JSON.stringify(S))}catch(x){}if(S.on)__wirdPush.sync(true).catch(function(){})});
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-su]");if(!b||!ov||!ov.contains(b))return;e.preventDefault();var a=b.dataset.su;
 if(a==="next")go(cur+1);
 else if(a==="city"){window.__wirdCity&&__wirdCity(function(){paintGeo("")})}
 else if(a==="locate"){b.disabled=true;paintGeo("جارٍ تحديد موقعك…");setTimeout(function(){if(b.disabled&&cur===0)paintGeo("يأخذ وقتًا داخل المباني… انتظر قليلًا، أو اضغط «تغيير» واختر مدينتك.")},6000);(window.__wirdGeo?__wirdGeo(true):Promise.resolve(false)).then(function(ok){b.disabled=false;if(ok){paintGeo("");setTimeout(function(){cur===0&&go(1)},700)}else paintGeo("تعذّر تحديد موقعك. اضغط «تغيير» واختر مدينتك.")})}
 else if(a==="restore"){mark();ov.remove();ov=null;R.classList.remove("su-on");window.__openSettingsPage&&__openSettingsPage("st-data")}
 else if(a==="play"){var x=snd(),sel=ov.querySelector(".su-sel"),k=sel?sel.value:x.k,u=(x.A[k]||{}).u;if(pv){stopPv();return}if(!u)return;pv=new Audio(u);b.classList.add("on");pv.play().catch(function(){stopPv()});pv.addEventListener("ended",stopPv)}
 else if(a==="enable"){stopPv();var L=RD()?RD().steps():[];if(L[0]&&L[0].ok){go(2);return}
  b.disabled=true;var msg=ov.querySelector(".su-msg");msg.textContent="";
  RD().act("on").then(function(){b.disabled=false;var s=RD().steps()[0];if(s.ok){go(2);return}msg.textContent=s.block||"لم يُسمح بالإشعارات. تقدر تفعّلها لاحقًا من الإعدادات."})}
 else if(a==="later"){stopPv();fin()}
 else if(a==="fin")fin();
 else if(a==="end")end()});
/* زرار الرجوع في الموبايل أثناء المعالج = الشاشة السابقة */
window.__suBack=function(){if(!ov)return false;try{history.pushState(Object.assign({},history.state||{w:1,v:"home"},{w:1,ov:1,ovd:1}),"",location.href)}catch(x){}if(stack.length){stopPv();[geo,adhan,ready,fin][stack.pop()]()}return true};
window.__openSetup=function(){stack=[];geo()};
/* يظهر مرة واحدة للمستخدم الجديد فقط */
function first(){var old=false;try{old=!!(localStorage.getItem("wird-onboarded")||localStorage.getItem("wird-history")||localStorage.getItem("wird-prayer"))}catch(e){}
 if(done())return;if(old){mark();return}setTimeout(geo,600)}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",first):first();
})();
