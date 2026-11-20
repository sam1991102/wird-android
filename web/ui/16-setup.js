
/*setup*/(function(){
/* معالج الإعداد الأول: يمرّ على صفحات الإعدادات الحقيقية بالترتيب */
var R=document.documentElement,K="wird-setup-done";
var STEPS=[
 {id:"st-prayer",t:"الموقع وطريقة الحساب",s:"اختر مدينتك وطريقة حساب المواقيت ووقت الإقامة"},
 {id:"notif",t:"الأذان والتنبيهات",s:"فعّل الأذان لكل صلاة، والتنبيه قبل الأذان"},
 {id:"st-adhan",t:"صوت الأذان",s:"اختر المؤذن واستمع له قبل اعتماده"},
 {id:"st-alarm",t:"منبّه الفجر",s:"منبّه مستمر مع غفوة حتى تستيقظ"},
 {id:"st-dr",t:"تذكير بالذكر",s:"كم مرة يذكّرك وِرد بالذكر خلال اليوم"},
 {id:"st-qari",t:"القرآن والقارئ",s:"اختر صوت التلاوة واتجاه تقليب الصفحات"},
 {id:"st-look",t:"المظهر",s:"النمط والوضع الليلي وحجم الخط والأرقام"}];
/* منبّه الفجر في تطبيق أندرويد بس؛ على الموقع ما يتعدّش خطوة */
STEPS=STEPS.filter(function(x){return window.__WIRD_NATIVE||x.id!=="st-alarm"});
var N=STEPS.length+2,ov=null,bar=null,i=-1;
var ar=__ar;
function done(){try{return localStorage.getItem(K)==="1"}catch(e){return true}}
function mark(){try{localStorage.setItem(K,"1");localStorage.setItem("wird-onboarded","1")}catch(e){}}
function el(h,c){var d=document.createElement("div");d.className=c;d.innerHTML=h;return d}
function close(){var p=document.querySelectorAll(".wp-page.sh-page,.wp-page.nt-page");[].forEach.call(p,function(x){x.remove()});window.__closeOverlays&&__closeOverlays()}
function dots(k){var h="";for(var j=0;j<N;j++)h+='<i class="'+(j<=k?"on":"")+'"></i>';return'<div class="su-dots" aria-hidden="true">'+h+"</div>"}
function screen(html){ov&&ov.remove();ov=el(html,"su-ov");ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");document.body.appendChild(ov);R.classList.add("su-on")}
function welcome(){var onb=document.getElementById("onb");if(onb)onb.hidden=true;
 /* الترحيب: الشعار، ثم الحديث، ثم أول ذكر يقوله المستخدم بنفسه */
 screen(dots(0)+'<img class="su-icon" src="/icon-512.png" alt="وِرد" width="120" height="120">'+
  '<blockquote class="su-hd"><p>«لا يزالُ لسانُك رطبًا من ذكرِ الله»</p><cite>رواه الترمذي (٣٣٧٥) وابن ماجه (٣٧٩٣)، وصحّحه الألباني</cite></blockquote>'+
  '<p class="su-say" aria-live="polite">ابدأ بأول ذكر: اضغط على الدائرة</p>'+
  '<button type="button" class="su-tb" data-su="tasbih" aria-label="اضغط واذكر: سبحان الله وبحمده"><svg viewBox="0 0 244 244" aria-hidden="true"><circle class="t" cx="122" cy="122" r="112"/><circle class="f" cx="122" cy="122" r="112"/></svg><span>سبحان الله<br>وبحمده</span></button>'+
  '<p class="su-ok" aria-live="polite"></p>'+
  '<button type="button" class="su-main" data-su="go">ابدأ الإعداد</button><button type="button" class="su-link" data-su="restore">عندي نسخة احتياطية</button><button type="button" class="su-link" data-su="skip">تخطَّ الآن</button>');
 ov.classList.add("su-welcome");ov.setAttribute("aria-label","أهلًا بك في وِرد")}
function finish(){bar&&bar.remove();bar=null;close();
 var A=!!window.__WIRD_NATIVE;
 screen(dots(N-1)+'<div class="su-check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><h1>جاهز</h1><p>'+(A?"لضمان وصول الأذان في وقته على أندرويد، اسمح بالإشعارات والمنبّهات الدقيقة، وأوقف توفير البطارية لوِرد من صفحة الأذان.":"تم حفظ إعداداتك. تقبّل الله منك.")+'</p><button type="button" class="su-main" data-su="end">ابدأ وِردك</button>')}
function step(k){i=k;if(k>=STEPS.length){finish();return}ov&&ov.remove();ov=null;[].forEach.call(document.querySelectorAll(".wp-page.sh-page,.wp-page.nt-page"),function(x){x.remove()});
 var s=STEPS[k];if(!bar){bar=el("","su-bar");document.body.appendChild(bar)}
 bar.innerHTML=dots(k+1)+'<div class="su-row"><div class="su-tx"><small>الخطوة '+ar(k+1)+" من "+ar(STEPS.length)+"</small><b>"+s.t+"</b><span>"+s.s+'</span></div></div><div class="su-btns"><button type="button" class="su-link" data-su="all">إنهاء</button><button type="button" class="su-prev" data-su="prev">السابق</button><button type="button" class="su-main" data-su="next">'+(k===STEPS.length-1?"إنهاء الإعداد":"التالي")+"</button></div>";
 go(s.id)}
/* يفتح صفحة الخطوة من الإعدادات؛ لو الصفحة مش موجودة على الجهاز ده (منبّه الفجر على أندرويد بس مثلًا) يعدّيها */
function go(id){var tries=0;(function t(){var hub=[].find.call(document.querySelectorAll(".st"),function(x){return!x.hidden&&x.offsetHeight}),row=hub&&hub.querySelector('.sh-row[data-id="'+id+'"]');
 if(row){row.click();return}if(!hub&&tries===0&&window.__openSettings){tries++;__openSettings();setTimeout(t,350);return}step(i+1)})()}
function end(){mark();ov&&ov.remove();ov=null;bar&&bar.remove();bar=null;close();R.classList.remove("su-on");window.__wirdGo&&__wirdGo("home")}
/* أثناء المعالج: سهم الرجوع مخفي، وزرار الرجوع في الموبايل (اللي بيضغط السهم) بيبقى «السابق» بدل ما يقفل الصفحة ويلخبط الخطوات */
function prev(){if(i<=0){bar&&bar.remove();bar=null;close();welcome()}else step(i-1)}
/* زرار الرجوع في الموبايل أثناء خطوات المعالج = «السابق» (قبل ما الصفحة تتعامل معاه) */
window.__suBack=function(){if(!bar||i<0)return false;/* نرجّع المدخل اللي اتسحب، لكي الرجوع ما يخرجش من التطبيق وسط المعالج */try{history.pushState(Object.assign({},history.state||{w:1,v:"home"},{w:1,ov:1,ovd:1}),"",location.href)}catch(x){}prev();return true};
document.addEventListener("click",function(e){if(!bar||i<0||!e.target.closest||!e.target.closest(".wp-back"))return;e.preventDefault();e.stopImmediatePropagation();prev()},true);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-su]");if(!b)return;e.preventDefault();var a=b.dataset.su;
 if(a==="go")step(0);else if(a==="next")step(i+1);else if(a==="prev")prev();else if(a==="all")finish();else if(a==="skip"||a==="end")end();
 else if(a==="tasbih"){if(ov.classList.contains("su-did"))return;ov.classList.add("su-did");try{navigator.vibrate&&navigator.vibrate(18)}catch(x){}
  ov.querySelector(".su-say").textContent="بدأتَ وِردك";setTimeout(function(){var o=ov&&ov.querySelector(".su-ok");if(o)o.textContent="تقبّل الله منك"},450)}
 else if(a==="restore"){mark();ov&&ov.remove();ov=null;R.classList.remove("su-on");window.__openSettingsPage&&__openSettingsPage("st-data")}});
/* شاشة «جهّز وِرد في دقيقة» القديمة: المعالج حلّ محلها */
function oldSheet(){[].forEach.call(document.querySelectorAll('[role="dialog"],.wd-sheet,.onb,.sheet,.modal,div'),function(d){if(d.dataset.suOld||d.children.length>40)return;var h=d.querySelector&&d.querySelector("h1,h2,h3,strong");if(!h||!/جهّز وِرد في دقيقة/.test(h.textContent))return;var box=d.closest('[role="dialog"],.wd-sheet,.onb')||d;if(box.dataset.suOld)return;box.dataset.suOld=1;var later=[].find.call(box.querySelectorAll("button"),function(b){return b.textContent.trim()==="لاحقًا"});later&&later.click();setTimeout(function(){box.remove();document.querySelectorAll(".wd-scrim,.scrim,.backdrop").forEach(function(x){x.remove()});R.classList.remove("ov-lock")},50)})}
__wOnDom(oldSheet);
window.__openSetup=function(){i=-1;welcome()};
/* زر معالج الإعداد بقى صف في صفحة الإعدادات الرئيسية (05-st-hub) */
/* يظهر مرة واحدة للمستخدم الجديد فقط */
function first(){var old=false;try{old=!!(localStorage.getItem("wird-onboarded")||localStorage.getItem("wird-history")||localStorage.getItem("wird-prayer"))}catch(e){}
 if(done())return;if(old){mark();return}setTimeout(welcome,600)}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",first):first();
})();
