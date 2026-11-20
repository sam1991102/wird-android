
/*pages*/(function(){
/* المصحف: «أكمل القراءة» أولًا */
var R=document.documentElement;
function mushaf(){var v=document.getElementById("mushafView");if(!v)return;
 var start=v.querySelector(".mv-card.mv-primary"),acts=start&&start.closest(".mv-actions");if(!acts)return;
 var q=document.getElementById("quranCard"),m=q&&q.textContent.match(/صفحة\s*([٠-٩\d]+)/),tx=start.querySelector(".mv-tx");
 if(m&&tx){var st=tx.querySelector("strong");if(st&&st.textContent!=="أكمل القراءة")st.textContent="أكمل القراءة";var sub=[].find.call(tx.children,function(x){return x!==st});var want="من صفحة "+m[1];if(sub&&sub.textContent!==want)sub.textContent=want}
 var top=acts;while(top.parentElement&&top.parentElement!==v)top=top.parentElement;
 var head=v.querySelector("h1,h2"),first=head?head.closest("#mushafView>*"):null;var ref=first?first.nextElementSibling:v.firstElementChild;
 if(top!==ref&&top!==first)v.insertBefore(top,ref)}
function run(){mushaf()}
/* يشتغل قبل ما الصفحة تترسم (مش بعدها) عشان ما يحرّكش الكروت قدام المستخدم */
function soon(){run();var v=document.getElementById("mushafView");if(v&&!v.dataset.wObs){v.dataset.wObs=1;new MutationObserver(run).observe(v,{childList:true})}requestAnimationFrame(run)}
new MutationObserver(soon).observe(R,{attributes:true,attributeFilter:["data-view"]});soon();
window.__wPagesDiag=function(){var o={};["mushafView"].forEach(function(id){var v=document.getElementById(id);o[id]=v?[].map.call(v.querySelectorAll("*"),function(e){return e.children.length<4&&e.textContent.trim().length<40&&/القراءة|العشاء/.test(e.textContent)?e.tagName+"."+e.className+"<"+(e.parentElement.className||e.parentElement.tagName):null}).filter(Boolean).slice(0,6).join(" ; "):"none"});return JSON.stringify(o)};
})();