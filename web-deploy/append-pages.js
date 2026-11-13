
/*pages*/(function(){
/* المصحف: «أكمل القراءة» أولًا. المواقيت: مواقيت الغد تحت جدول اليوم */
var R=document.documentElement,AR="٠١٢٣٤٥٦٧٨٩";
function ar(x){return String(x).replace(/\d/g,function(d){return AR[d]})}
function t12(h){h=((h%24)+24)%24;var H=Math.floor(h),M=Math.round((h-H)*60);if(M===60){H++;M=0}var p=H<12?"ص":"م",h12=H%12||12;return ar(h12+":"+(M<10?"0":"")+M)+" "+p}
function byText(root,rx,sel){return[].find.call(root.querySelectorAll(sel||"button,a,[role=button],.card,div"),function(e){return e.children.length<8&&rx.test(e.textContent)})}
function mushaf(){var v=document.getElementById("mushafView");if(!v||v.dataset.wPg)return;
 var start=byText(v,/ابدأ القراءة/,"button,a,[role=button]");if(!start)return;var row=start;while(row.parentElement&&row.parentElement!==v&&row.parentElement.children.length===1)row=row.parentElement;
 var q=document.getElementById("quranCard"),m=q&&q.textContent.match(/صفحة\s*([٠-٩\d]+)/);
 if(m){var b=start.querySelector("b,strong,h3,.t,span");if(b&&/ابدأ القراءة/.test(b.textContent))b.textContent="أكمل القراءة";var sub=[].find.call(start.querySelectorAll("small,p,span"),function(x){return/المصحف المدني/.test(x.textContent)});if(sub)sub.textContent="من صفحة "+ar(m[1].replace(/[٠-٩]/g,function(d){return AR.indexOf(d)}))}
 var head=v.querySelector("h1,h2");var anchor=head&&head.closest("#mushafView>*")||v.firstElementChild;var top=row.closest("#mushafView>*")||row;
 if(top!==anchor&&anchor&&anchor.nextSibling!==top)v.insertBefore(top,anchor.nextSibling);v.dataset.wPg=1}
var NAMES=[["fajr","الفجر"],["sunrise","الشروق"],["dhuhr","الظهر"],["asr","العصر"],["maghrib","المغرب"],["isha","العشاء"]];
function tomorrow(){var p=document.getElementById("prayer");if(!p)return;var t;try{t=prayerDay(1).t}catch(e){return}if(!t)return;
 var box=document.getElementById("ptTomorrow");if(!box){var isha=byText(p,/^\s*العشاء/,"div,li,button");if(!isha)return;var list=isha.parentElement;while(list&&list.parentElement!==p&&list.children.length<5)list=list.parentElement;if(!list)return;box=document.createElement("div");box.id="ptTomorrow";box.className="pt-tm";list.after(box)}
 var o='<h3>مواقيت الغد</h3><div class="pt-tm-g">';NAMES.forEach(function(n){if(t[n[0]]!=null)o+='<div><span>'+n[1]+'</span><b>'+t12(t[n[0]])+'</b></div>'});box.innerHTML=o+"</div>"}
function run(){mushaf();var v=R.dataset.view;if(v==="prayer")tomorrow()}
new MutationObserver(run).observe(R,{attributes:true,attributeFilter:["data-view"]});run();setTimeout(run,1500);
})();
