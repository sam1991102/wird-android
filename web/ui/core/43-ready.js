/*ready*/(function(){
/* «جاهزية الأذان»: قائمة واحدة بالخطوات اللي لازم تتعمل عشان الأذان يوصل في وقته، بالترتيب،
   ومافيهاش غير الناقص. نفس القائمة بتظهر في معالج الإعداد، وفي صفحة الأذان، وفي التذكير اللطيف بعد كده. */
var N=!!window.__WIRD_NATIVE,st=null,subs=[];
var ar=function(n){return String(n).replace(/\d/g,function(d){return"٠١٢٣٤٥٦٧٨٩"[d]})};
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}}
function plug(){return window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.WirdAdhan}
function push(){return window.__wirdPush?__wirdPush.state():{}}
function alarmOn(){try{return!!(JSON.parse(ls("wird-alarm")||"{}")||{}).on}catch(e){return false}}
var IOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);

/* الخطوات بالترتيب. ok = تمت، note = سطر بيوضح ليه */
function steps(){var s=push(),perm=("Notification"in window)?Notification.permission:"x",L=[];
 L.push({id:"on",t:"تفعيل الأذان",d:"إشعار عند دخول وقت كل صلاة، حتى والتطبيق مغلق.",ok:!!(s.on&&perm==="granted"),act:"تفعيل",
  block:perm==="denied"?"الإشعارات محظورة. افتح إعدادات الهاتف ← التطبيقات ← وِرد ← الإشعارات وفعّلها، ثم ارجع.":(!("Notification"in window)?(IOS?"على الآيفون: ثبّت وِرد على الشاشة الرئيسية أولًا (مشاركة ← إضافة إلى الشاشة الرئيسية)، ثم افتحه من الأيقونة.":"متصفحك لا يدعم الإشعارات. جرّب Chrome أو ثبّت التطبيق."):"")});
 if(N&&st){
  L.push({id:"exact",t:"المواعيد الدقيقة",d:"ليؤذَّن في الدقيقة نفسها، لا متأخرًا. ستُفتح صفحة في الإعدادات: فعّل الخيار ثم ارجع.",ok:!!st.exact,act:"فتح الإعدادات"});
  L.push({id:"battery",t:"استثناء من توفير البطارية",d:st.sdk>=31?"حتى لا يوقف الهاتف الأذان أثناء النوم. في الصفحة التي ستُفتح: «البطارية» ← «غير مقيّد»، ثم ارجع.":"حتى لا يوقف الهاتف الأذان أثناء النوم. اختر «كل التطبيقات» ثم «وِرد» ← «عدم التحسين»، ثم ارجع.",ok:!!st.battery,act:"فتح الإعدادات"});
  if(st.autostart)L.push({id:"auto",t:"التشغيل التلقائي",d:"هاتفك يغلق التطبيقات في الخلفية. فعّل «وِرد» في القائمة التي ستُفتح، ثم ارجع.",ok:ls("wird-auto-done")==="1",act:"فتح الإعدادات"});
  if(alarmOn()&&st.fullScreen===false)L.push({id:"fs",t:"منبّه الفجر على الشاشة كاملة",d:"ليوقظك المنبّه حتى والهاتف مقفل. فعّل الخيار ثم ارجع.",ok:false,act:"فتح الإعدادات"});
 }
 return L}
function missing(){return steps().filter(function(x){return!x.ok}).length}
function emit(){subs.forEach(function(f){try{f()}catch(e){}})}
function refresh(){var p=N&&plug();return(p?p.status().then(function(x){st=x},function(){}):Promise.resolve()).then(function(){emit();return steps()})}

var pending=0;
function act(id){var p=plug();
 if(id==="on"){if(!window.__wirdPush)return Promise.resolve();return __wirdPush.enable().then(refresh,function(e){var m=e&&e.message;if(m!=="denied"&&window.toast)toast("تعذّر التفعيل — حاول مرة أخرى");return refresh()})}
 if(!p)return Promise.resolve();pending=1;
 if(id==="exact")p.openExactSettings();else if(id==="battery")p.openBatterySettings();
 else if(id==="auto"){ls("wird-auto-done","1");p.openAutostart()}else if(id==="fs")p.openFullScreenSettings&&p.openFullScreenSettings();
 return Promise.resolve()}
/* بعد ما المستخدم يرجع من صفحة إعدادات الهاتف، نحدّث القائمة على طول */
document.addEventListener("visibilitychange",function(){if(!document.hidden&&(pending||subs.length)){pending=0;refresh()}});

/* القائمة المرقّمة: الخطوة الحالية فقط عليها زرار، واللي بعدها باهتة */
function list(el){var L=steps(),cur=-1;L.forEach(function(x,i){if(cur<0&&!x.ok)cur=i});
 el.innerHTML=L.map(function(x,i){var now=i===cur,later=cur>=0&&i>cur;
  return'<div class="rdy-st'+(x.ok?" ok":"")+(now?" now":"")+(later?" later":"")+'"><span class="rdy-n" aria-hidden="true">'+(x.ok?"✓":ar(i+1))+'</span><div class="rdy-b"><b>'+x.t+'</b>'+
   (x.ok?'<small>تم</small>':'<small>'+(now&&x.block?x.block:x.d)+'</small>')+(now&&!x.block?'<button type="button" class="rdy-go" data-rdy="'+x.id+'">'+x.act+'</button>':"")+'</div></div>'}).join("")}
function bindList(el,after){el.addEventListener("click",function(e){var b=e.target.closest("[data-rdy]");if(!b)return;b.disabled=true;act(b.dataset.rdy).then(function(){b.disabled=false;after&&after()})})}

/* بطاقة الحالة (صفحة الأذان وصفحة الإشعارات وصفحة المواقيت) */
function card(el,opt){opt=opt||{};var L=steps(),m=L.filter(function(x){return!x.ok}).length,on=L[0].ok;
 el.className="rdy-card"+(m?"":" ok");
 if(!m){el.innerHTML='<span class="rdy-i" aria-hidden="true">✓</span><div class="rdy-tx"><b>الأذان جاهز</b><small>يصلك في وقته حتى والتطبيق مغلق</small></div>'+(opt.off?'<button type="button" class="rdy-off" data-rdyc="off">إيقاف</button>':"");el.hidden=!!opt.hideOk;return}
 el.hidden=false;
 el.innerHTML='<span class="rdy-i" aria-hidden="true">!</span><div class="rdy-tx"><b>'+(on?"ناقص "+(m===1?"خطوة واحدة":ar(m)+" خطوات")+" ليصل الأذان دائمًا":"الأذان متوقف")+'</b><small>'+(on?"بدونها قد يتأخر الأذان أو لا يصل":"فعّله ليصلك الأذان عند كل صلاة")+'</small></div><button type="button" class="rdy-go" data-rdyc="fix">'+(on?"أكمل":"تفعيل")+'</button>'}
function bindCard(el,opt){var paint=function(){if(!el.isConnected&&el.dataset.rdyOn){var i=subs.indexOf(paint);i>=0&&subs.splice(i,1);return}card(el,opt)};el.dataset.rdyOn=1;subs.push(paint);paint();refresh();
 el.addEventListener("click",function(e){var b=e.target.closest("[data-rdyc]");if(!b)return;
  if(b.dataset.rdyc==="off"){window.__wirdPush&&__wirdPush.disable().then(function(){window.toast&&toast("أُوقف الأذان");refresh()});return}
  var L=steps();if(!L[0].ok&&missing()===1){b.disabled=true;act("on").then(function(){b.disabled=false});return}sheet()})}

/* ورقة الخطوات (من البطاقة أو التذكير) */
function sheet(){if(document.querySelector(".rdy-sheet"))return;
 var s=document.createElement("div");s.className="wd-sheet rdy-sheet";s.setAttribute("role","dialog");s.setAttribute("aria-modal","true");s.setAttribute("aria-label","خطوات ليصل الأذان دائمًا");
 s.innerHTML='<div class="wd-card"><button type="button" class="wd-x" data-x aria-label="إغلاق">×</button><h2 class="rdy-h">خطوات ليصل الأذان دائمًا</h2><p class="rdy-p">هاتفك يوقف التطبيقات لتوفير البطارية. خطوة بخطوة، وكل خطوة تأخذ ثوانٍ.</p><div class="rdy-list"></div><button type="button" class="rdy-done" data-x>تم</button></div>';
 var box=s.querySelector(".rdy-list"),paint=function(){list(box);if(!missing()){var d=s.querySelector(".rdy-done");d.textContent="الأذان جاهز ✓"}};
 subs.push(paint);paint();bindList(box);
 s.addEventListener("click",function(e){if(e.target===s||e.target.closest("[data-x]")){subs.splice(subs.indexOf(paint),1);s.remove()}});
 document.body.appendChild(s);refresh()}

/* تذكير لطيف: لو الإعداد خلص والأذان مفعّل بس فيه خطوة ناقصة — مرة كل يومين بالكتير، ومش فوق أي نافذة */
function nudge(){if(ls("wird-setup-done")!=="1"||document.querySelector(".su-ov,.wd-sheet,#focus:not([hidden]),.wp-page"))return;
 var last=+(ls("wird-rdy-nudge")||0);if(Date.now()-last<2*864e5)return;
 refresh().then(function(L){if(!L[0].ok||!missing())return;ls("wird-rdy-nudge",String(Date.now()));sheet()})}

window.__wirdReady={steps:steps,refresh:refresh,act:act,list:list,bindList:bindList,card:bindCard,sheet:sheet,nudge:nudge,missing:missing,on:function(f){subs.push(f)},off:function(f){var i=subs.indexOf(f);i>=0&&subs.splice(i,1)}};
})();
