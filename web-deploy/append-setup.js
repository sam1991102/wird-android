
/*setup*/(function(){
/* معالج الإعداد الأول: يمرّ على صفحات الإعدادات الحقيقية بالترتيب */
var R=document.documentElement,K="wird-setup-done";
var STEPS=[
 {id:"st-prayer",t:"الموقع وطريقة الحساب",s:"اختر مدينتك وطريقة حساب المواقيت ووقت الإقامة"},
 {id:"notif",t:"الأذان والتنبيهات",s:"فعّل الأذان لكل صلاة، والتنبيه قبل الأذان"},
 {id:"st-alarm",t:"منبّه الفجر",s:"منبّه مستمر مع غفوة حتى تستيقظ"},
 {id:"st-dr",t:"تذكير بالذكر",s:"كم مرة يذكّرك وِرد بالذكر خلال اليوم"},
 {id:"st-qari",t:"القرآن والقارئ",s:"اختر صوت التلاوة واتجاه تقليب الصفحات"},
 {id:"st-look",t:"المظهر",s:"النمط والوضع الليلي وحجم الخط والأرقام"}];
var N=STEPS.length+2,ov=null,bar=null,i=-1;
function ar(n){return String(n).replace(/\d/g,function(d){return"٠١٢٣٤٥٦٧٨٩"[d]})}
function done(){try{return localStorage.getItem(K)==="1"}catch(e){return true}}
function mark(){try{localStorage.setItem(K,"1");localStorage.setItem("wird-onboarded","1")}catch(e){}}
function el(h,c){var d=document.createElement("div");d.className=c;d.innerHTML=h;return d}
function close(){var p=document.querySelectorAll(".wp-page.sh-page,.wp-page.nt-page");[].forEach.call(p,function(x){x.remove()});window.__closeOverlays&&__closeOverlays()}
function dots(k){var h="";for(var j=0;j<N;j++)h+='<i class="'+(j<=k?"on":"")+'"></i>';return'<div class="su-dots" aria-hidden="true">'+h+"</div>"}
function screen(html){ov&&ov.remove();ov=el(html,"su-ov");ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");document.body.appendChild(ov);R.classList.add("su-on")}
function welcome(){var onb=document.getElementById("onb");if(onb)onb.hidden=true;
 screen(dots(0)+'<div class="su-logo">وِرد</div><h1>أهلًا بك في وِرد</h1><p>دقيقة واحدة نجهّز فيها المواقيت والأذان والتذكيرات على مقاسك. كل اختيار يمكنك تغييره لاحقًا من الإعدادات.</p><button type="button" class="su-main" data-su="go">ابدأ الإعداد</button><button type="button" class="su-link" data-su="restore">عندي نسخة احتياطية</button><button type="button" class="su-link" data-su="skip">تخطَّ الآن</button>')}
function finish(){bar&&bar.remove();bar=null;close();
 var A=!!window.__WIRD_NATIVE;
 screen(dots(N-1)+'<div class="su-check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><h1>جاهز</h1><p>'+(A?"لضمان وصول الأذان في وقته على أندرويد، اسمح بالإشعارات والمنبّهات الدقيقة، وأوقف توفير البطارية لوِرد من صفحة الأذان.":"تم حفظ إعداداتك. تقبّل الله منك.")+'</p><button type="button" class="su-main" data-su="end">ابدأ وِردك</button>')}
function step(k){i=k;if(k>=STEPS.length){finish();return}ov&&ov.remove();ov=null;[].forEach.call(document.querySelectorAll(".wp-page.sh-page,.wp-page.nt-page"),function(x){x.remove()});
 var s=STEPS[k];if(!bar){bar=el("","su-bar");document.body.appendChild(bar)}
 bar.innerHTML=dots(k+1)+'<div class="su-row"><div class="su-tx"><small>الخطوة '+ar(k+1)+" من "+ar(STEPS.length)+"</small><b>"+s.t+"</b><span>"+s.s+'</span></div></div><div class="su-btns"><button type="button" class="su-link" data-su="all">إنهاء</button><button type="button" class="su-main" data-su="next">'+(k===STEPS.length-1?"إنهاء الإعداد":"التالي")+"</button></div>";
 go(s.id)}
function go(id){var hub=[].find.call(document.querySelectorAll(".st"),function(x){return!x.hidden}),row=hub&&hub.querySelector('.sh-row[data-id="'+id+'"]');if(row){row.click();return}window.__openSettingsPage&&__openSettingsPage(id)}
function end(){mark();ov&&ov.remove();ov=null;bar&&bar.remove();bar=null;close();R.classList.remove("su-on");window.__wirdGo&&__wirdGo("home")}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-su]");if(!b)return;e.preventDefault();var a=b.dataset.su;
 if(a==="go")step(0);else if(a==="next")step(i+1);else if(a==="all")finish();else if(a==="skip"||a==="end")end();
 else if(a==="restore"){mark();ov&&ov.remove();ov=null;R.classList.remove("su-on");window.__openSettingsPage&&__openSettingsPage("st-data")}});
/* شاشة «جهّز وِرد في دقيقة» القديمة: المعالج حلّ محلها */
function oldSheet(){[].forEach.call(document.querySelectorAll('[role="dialog"],.wd-sheet,.onb,.sheet,.modal,div'),function(d){if(d.dataset.suOld||d.children.length>40)return;var h=d.querySelector&&d.querySelector("h1,h2,h3,strong");if(!h||!/جهّز وِرد في دقيقة/.test(h.textContent))return;var box=d.closest('[role="dialog"],.wd-sheet,.onb')||d;if(box.dataset.suOld)return;box.dataset.suOld=1;var later=[].find.call(box.querySelectorAll("button"),function(b){return b.textContent.trim()==="بعدين"});later&&later.click();setTimeout(function(){box.remove();document.querySelectorAll(".wd-scrim,.scrim,.backdrop").forEach(function(x){x.remove()});R.classList.remove("ov-lock")},50)})}
new MutationObserver(function(m){if(m.some(function(r){return r.addedNodes.length}))oldSheet()}).observe(document.body,{childList:true,subtree:false});setTimeout(oldSheet,800);setTimeout(oldSheet,2500);
window.__openSetup=function(){i=-1;welcome()};
/* زر لإعادة المعالج من «عن وِرد» */
new MutationObserver(function(){var p=document.querySelector(".wp-page.sh-page");if(!p||p.querySelector(".su-again")||!p.querySelector("#updChk"))return;var b=document.createElement("button");b.type="button";b.className="su-again";b.textContent="إعادة معالج الإعداد";b.onclick=function(){close();setTimeout(__openSetup,300)};p.querySelector("#updChk").after(b)}).observe(document.body,{childList:true});
/* يظهر مرة واحدة للمستخدم الجديد فقط */
function first(){var old=false;try{old=!!(localStorage.getItem("wird-onboarded")||localStorage.getItem("wird-history")||localStorage.getItem("wird-prayer"))}catch(e){}
 if(done())return;if(old){mark();return}setTimeout(welcome,600)}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",first):first();
})();
