/*dom*/
/* المراقب الواحد للصفحة كلها. أي وحدة محتاجة تعرف إن الصفحة اتغيّرت بتسجّل هنا بدل ما تعمل مراقب لنفسها:
   __wOnDom(fn)        fn تتنادى مرة واحدة في الفريم بعد أي إضافة/حذف عناصر (ولازم تكون آمنة لو اتنادت كذا مرة).
   __wOnView(fn)       fn تتنادى لما الصفحة الظاهرة تتغيّر (data-view على html).
   __wEverySec(fn)     ساعة واحدة كل ثانية لكل العدّادات، بتقف والتطبيق في الخلفية.
   __wEvery(sec,fn)    مؤقّت أبطأ (كل كذا ثانية) على نفس الساعة، وبيقف في الخلفية.
   __wWait(test,fn,ms) يستنى عنصر يظهر وينادي fn بيه مرة واحدة (بدل التكرار بمؤقّت).
   ليه: كان فيه أكتر من ٨٠ مراقب ومؤقّت مستقلّين، كل تغيير صغير بيصحّيهم كلهم — ده كان سبب التقطيع. */
(function(){
var fns=[],q=0,streak=0,quiet=0;
/* أجزاء بتتحدّث كل ثانية (العدّادات وبطاقة السما): تغييرها مش محتاج يصحّي باقي الوحدات */
var TICKING="#skyCard,.tb-strip,#countdown,#nextPillText,#nextName,#settingsBtn,#installBtn,#iqLine";
function run(){q=0;if(++streak>120){streak=0;quiet=Date.now()+500}for(var i=0;i<fns.length;i++){try{fns[i]()}catch(e){console.error(e)}}}
function inTicking(n){var e=n.nodeType===1?n:n.parentElement;return !!(e&&e.closest&&e.closest(TICKING))}
/* بنصحّي الوحدات بس لو اتضاف/اتشال عنصر فعلاً، وبرّه الأجزاء اللي بتعدّ */
function matters(rs){for(var i=0;i<rs.length;i++){var r=rs[i],j;if(inTicking(r.target))continue;for(j=0;j<r.addedNodes.length;j++)if(r.addedNodes[j].nodeType===1)return true;for(j=0;j<r.removedNodes.length;j++)if(r.removedNodes[j].nodeType===1)return true}return false}
new MutationObserver(function(rs){if(q||Date.now()<quiet||!matters(rs))return;q=requestAnimationFrame(run)}).observe(document.documentElement,{childList:true,subtree:true});
window.__wOnDom=function(fn){fns.push(fn);try{fn()}catch(e){console.error(e)}};

var views=[],lastView;
new MutationObserver(function(){var v=document.documentElement.dataset.view;if(v===lastView)return;lastView=v;for(var i=0;i<views.length;i++){try{views[i]()}catch(e){console.error(e)}}}).observe(document.documentElement,{attributes:true,attributeFilter:["data-view"]});
window.__wOnView=function(fn){views.push(fn)};

var secs=[];
function sec(){streak=0;if(document.hidden)return;for(var i=0;i<secs.length;i++){try{secs[i]()}catch(e){console.error(e)}}}
/* نبدأ على أول الثانية عشان كل العدّادات تتغيّر مع بعض */
setTimeout(function(){sec();setInterval(sec,1000)},1000-Date.now()%1000);
document.addEventListener("visibilitychange",function(){if(!document.hidden)sec()});
window.__wEverySec=function(fn){secs.push(fn)};
/* __wEvery(ثواني, fn): مؤقّت أبطأ على نفس الساعة؛ بيقف في الخلفية، وأول ما الصفحة ترجع ينادي اللي فات ميعاده */
var slow=[];secs.push(function(){var t=Date.now();for(var i=0;i<slow.length;i++){var o=slow[i];if(t>=o.due){o.due=t+o.ms;try{o.fn()}catch(e){console.error(e)}}}});
window.__wEvery=function(s,fn){slow.push({ms:s*1000,due:Date.now()+s*1000,fn:fn})};

window.__wWait=function(test,fn,ms){var done=0,v;function chk(){if(done)return;try{v=test()}catch(e){v=null}if(!v)return;done=1;var i=fns.indexOf(chk);if(i>-1)fns.splice(i,1);fn(v)}
 chk();if(done)return;fns.push(chk);setTimeout(function(){if(done)return;done=1;var i=fns.indexOf(chk);if(i>-1)fns.splice(i,1)},ms||6000)};
})();
