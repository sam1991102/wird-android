
/*pages*/(function(){
/* المصحف: «أكمل القراءة» أولًا. المواقيت: مواقيت الغد تحت جدول اليوم */
var R=document.documentElement,AR="٠١٢٣٤٥٦٧٨٩";
function ar(x){return String(x).replace(/\d/g,function(d){return AR[d]})}
function t12(h){h=((h%24)+24)%24;var H=Math.floor(h),M=Math.round((h-H)*60);if(M===60){H++;M=0}var p=H<12?"ص":"م",h12=H%12||12;return ar(h12+":"+(M<10?"0":"")+M)+" "+p}
function byText(root,rx,sel){return[].find.call(root.querySelectorAll(sel||"button,a,[role=button],.card,div"),function(e){return e.children.length<8&&rx.test(e.textContent)})}
function mushaf(){var v=document.getElementById("mushafView");if(!v)return;
 var start=v.querySelector(".mv-card.mv-primary"),acts=start&&start.closest(".mv-actions");if(!acts)return;
 var q=document.getElementById("quranCard"),m=q&&q.textContent.match(/صفحة\s*([٠-٩\d]+)/),tx=start.querySelector(".mv-tx");
 if(m&&tx){var st=tx.querySelector("strong");if(st&&st.textContent!=="أكمل القراءة")st.textContent="أكمل القراءة";var sub=[].find.call(tx.children,function(x){return x!==st});var want="من صفحة "+m[1];if(sub&&sub.textContent!==want)sub.textContent=want}
 var top=acts;while(top.parentElement&&top.parentElement!==v)top=top.parentElement;
 var head=v.querySelector("h1,h2"),first=head?head.closest("#mushafView>*"):null;var ref=first?first.nextElementSibling:v.firstElementChild;
 if(top!==ref&&top!==first)v.insertBefore(top,ref)}
var NAMES=[["fajr","الفجر"],["sunrise","الشروق"],["dhuhr","الظهر"],["asr","العصر"],["maghrib","المغرب"],["isha","العشاء"]];
function tomorrow(){var p=document.getElementById("prayer");if(!p)return;var t;try{t=prayerDay(1).t}catch(e){return}if(!t)return;
 var box=document.getElementById("ptTomorrow");if(!box){var isha=p.querySelector(".isha:not(.adj-row)");if(!isha)return;var list=isha.parentElement;if(!list)return;box=document.createElement("div");box.id="ptTomorrow";box.className="pt-tm";list.after(box)}
 var o='<h3>مواقيت الغد</h3><div class="pt-tm-g">';NAMES.forEach(function(n){if(t[n[0]]!=null)o+='<div><span>'+n[1]+'</span><b>'+t12(t[n[0]])+'</b></div>'});box.innerHTML=o+"</div>"}
function run(){mushaf();var v=R.dataset.view;if(v==="prayer")tomorrow()}
/* يشتغل قبل ما الصفحة تترسم (مش بعدها) عشان ما يحرّكش الكروت قدام المستخدم */
function soon(){run();var v=document.getElementById("mushafView");if(v&&!v.dataset.wObs){v.dataset.wObs=1;new MutationObserver(run).observe(v,{childList:true})}requestAnimationFrame(run)}
new MutationObserver(soon).observe(R,{attributes:true,attributeFilter:["data-view"]});soon();
window.__wPagesDiag=function(){var o={};try{o.pd1=!!prayerDay(1).t}catch(e){o.pd1="err:"+e.message}["mushafView","prayer"].forEach(function(id){var v=document.getElementById(id);o[id]=v?[].map.call(v.querySelectorAll("*"),function(e){return e.children.length<4&&e.textContent.trim().length<40&&/القراءة|العشاء/.test(e.textContent)?e.tagName+"."+e.className+"<"+(e.parentElement.className||e.parentElement.tagName):null}).filter(Boolean).slice(0,6).join(" ; "):"none"});return JSON.stringify(o)};
})();