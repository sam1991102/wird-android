
/*laps*/(function(){var R=document.documentElement;
var AR="٠١٢٣٤٥٦٧٨٩";function toEn(s){return String(s).replace(/[٠-٩]/g,function(d){return AR.indexOf(d)})}function ar(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
/* 1) الضغط على عدّاد الأشواط لا يرجع الصفحة لأولها */
var keep=null;
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".wp-lap,.wp-lr,.wp-chk,.wp-page [data-tab],.wp-page .tl-b");if(!b)return;var p=b.closest(".wp-page");if(!p)return;
var h=p.querySelector(".wp-h h1");keep={t:h?h.textContent:"",y:p.scrollTop,at:Date.now()}},true);
new MutationObserver(function(ms){if(!keep||Date.now()-keep.at>1500)return;ms.forEach(function(m){[].forEach.call(m.addedNodes,function(n){if(!n.classList||!n.classList.contains("wp-page"))return;var h=n.querySelector(".wp-h h1");if(keep&&h&&h.textContent===keep.t){n.classList.add("in","wp-noanim");var y=keep.y;n.scrollTop=y;requestAnimationFrame(function(){n.scrollTop=y;setTimeout(function(){n.scrollTop=y;n.classList.remove("wp-noanim")},60)});keep=null}})})}).observe(document.body,{childList:true});
/* 2) وضع العدّ بملء الشاشة */
function info(box){var lab=[].find.call(box.querySelectorAll("*"),function(e){return!e.children.length&&/[0-9٠-٩]+\s*\/\s*[0-9٠-٩]+/.test(e.textContent)});var m=lab?toEn(lab.textContent).match(/(\d+)\s*\/\s*(\d+)/):null;var li=box.closest("li")||box.parentElement;var t=li?(li.querySelector("strong,b,h3,h4")||{}).textContent||"":"";var all=li?li.textContent:"";return{n:m?+m[1]:0,tot:m?+m[2]:7,title:(t||"الأشواط").trim(),sai:/سعي|الصفا|المروة/.test(t+" "+all)&&!/طواف/.test(t)}}
var ov,wake,cur;
function findBox(){var p=[].slice.call(document.querySelectorAll(".wp-page")).pop();if(!p)return null;var bs=[].slice.call(p.querySelectorAll(".wp-laps"));return bs[cur.i]||null}
function render(){var box=findBox();if(!box){close();return}var I=info(box);cur.n=I.n;cur.tot=I.tot;var done=I.n>=I.tot,lap=Math.min(I.n+1,I.tot);
ov.querySelector(".lp-t").textContent=I.title;
ov.querySelector(".lp-n").textContent=ar(I.n);ov.querySelector(".lp-of").textContent="من "+ar(I.tot);
var C=2*Math.PI*118;ov.querySelector(".lp-arc").style.strokeDashoffset=C*(1-I.n/I.tot);
ov.querySelector(".lp-s").textContent=done?"أتممت "+ar(I.tot)+" أشواط، تقبّل الله":(I.sai?("الشوط "+ar(lap)+": "+(lap%2?"من الصفا إلى المروة":"من المروة إلى الصفا")):("أنت في الشوط "+ar(lap)));
ov.querySelector(".lp-tap").disabled=done;ov.querySelector(".lp-undo").disabled=I.n<=0;
ov.querySelector(".lp-dots").innerHTML=Array.from({length:I.tot},function(_,k){return'<i class="'+(k<I.n?"on":"")+'"></i>'}).join("")}
function press(sel){var box=findBox();var b=box&&box.querySelector(sel);if(b)b.click()}
function tap(){if(cur.n>=cur.tot)return;press(".wp-lap");setTimeout(render,120)}
function undo(){var n=cur.n;if(n<=0)return;press(".wp-lr");var k=0;(function step(){if(k>=n-1){setTimeout(render,120);return}k++;setTimeout(function(){press(".wp-lap");step()},90)})()}
function reset(){press(".wp-lr");setTimeout(render,120)}
async function lock(){try{if(navigator.wakeLock)wake=await navigator.wakeLock.request("screen")}catch(e){}}
function close(){if(ov)ov.hidden=true;R.classList.remove("lp-open");try{wake&&wake.release()}catch(e){}wake=null}
function open(i){cur={i:i,n:0,tot:7};if(!ov){ov=document.createElement("div");ov.className="lp-ov";ov.setAttribute("role","dialog");ov.setAttribute("aria-label","عدّاد الأشواط");
ov.innerHTML='<div class="lp-top"><button type="button" class="lp-x" aria-label="إغلاق">✕</button><b class="lp-t"></b><button type="button" class="lp-reset">إعادة</button></div>'+
'<button type="button" class="lp-tap" aria-label="اضغط لعدّ شوط"><svg viewBox="0 0 260 260" aria-hidden="true"><circle cx="130" cy="130" r="118" class="lp-bg"/><circle cx="130" cy="130" r="118" class="lp-arc" transform="rotate(-90 130 130)" stroke-dasharray="741.4" stroke-dashoffset="741.4"/></svg><span class="lp-in"><span class="lp-n">٠</span><span class="lp-of">من ٧</span></span></button>'+
'<div class="lp-dots"></div><p class="lp-s"></p><p class="lp-hint">اضغط في أي مكان على الدائرة بعد كل شوط</p><button type="button" class="lp-undo">تراجع عن آخر شوط</button>';
document.body.appendChild(ov);
ov.querySelector(".lp-x").onclick=close;ov.querySelector(".lp-tap").onclick=tap;ov.querySelector(".lp-undo").onclick=undo;ov.querySelector(".lp-reset").onclick=function(){if(confirm("إعادة العدّ من الصفر؟"))reset()}}
ov.hidden=false;R.classList.add("lp-open");lock();render()}
document.addEventListener("visibilitychange",function(){if(!document.hidden&&ov&&!ov.hidden)lock()});
function addBtns(){[].forEach.call(document.querySelectorAll(".wp-page .wp-laps"),function(box,i){if(box.querySelector(".lp-open-b"))return;var b=document.createElement("button");b.type="button";b.className="lp-open-b";b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>وضع العدّ بملء الشاشة';
b.onclick=function(e){e.stopPropagation();var all=[].slice.call(box.closest(".wp-page").querySelectorAll(".wp-laps"));open(all.indexOf(box))};box.appendChild(b)})}
new MutationObserver(function(){addBtns()}).observe(document.body,{childList:true,subtree:true});
})();
