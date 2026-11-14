
/*skynext*/(function(){
/* كارت اليوم: ميعاد الصلاة القادمة نفسه بخط كبير، وتحت اسمها «بعد كذا» */
var AR="٠١٢٣٤٥٦٧٨٩",P=[["fajr","الفجر"],["dhuhr","الظهر"],["asr","العصر"],["maghrib","المغرب"],["isha","العشاء"]];
function ar(x){return String(x).replace(/\d/g,function(d){return AR[d]})}
function clock(h){h=((h%24)+24)%24;var H=Math.floor(h),M=Math.round((h-H)*60);if(M===60){H=(H+1)%24;M=0}return{t:ar((H%12||12)+":"+(M<10?"0":"")+M),p:H<12?"ص":"م"}}
function next(){var t,tm;try{t=prayerDay(0).t}catch(e){return null}if(!t)return null;var d=new Date(),now=d.getHours()+d.getMinutes()/60+d.getSeconds()/3600;
 for(var i=0;i<P.length;i++)if(t[P[i][0]]!=null&&t[P[i][0]]>now)return{n:P[i][1],at:t[P[i][0]],left:t[P[i][0]]-now};
 try{tm=prayerDay(1).t}catch(e){}if(!tm)return null;return{n:"الفجر",at:tm.fajr,left:tm.fajr+24-now}}
function left(h){var s=Math.max(0,Math.round(h*3600));if(s<60)return"بعد "+ar(s)+" ثانية";var m=Math.ceil(s/60);if(m<60)return"بعد "+ar(m)+" دقيقة";var H=Math.floor(m/60),M=m%60;return"بعد "+ar(H)+" س"+(M?" "+ar(M)+" د":"")}
var last="";
function paint(){var box=document.querySelector("#skyCard .sk-next");if(!box)return;var x=next();if(!x)return;
 var el=box.querySelector(".sk-x");if(!el){el=document.createElement("div");el.className="sk-x";el.innerHTML='<div class="sk-x-n"><b></b><small></small></div><div class="sk-x-t"><span></span><i></i></div>';box.appendChild(el);box.classList.add("sk-x-on")}
 var c=clock(x.at),key=x.n+"|"+c.t+"|"+left(x.left);if(key===last)return;last=key;
 el.querySelector("b").textContent=x.n;el.querySelector("small").textContent=left(x.left);el.querySelector(".sk-x-t span").textContent=c.t;el.querySelector(".sk-x-t i").textContent=c.p;
 box.setAttribute("aria-label",x.n+" الساعة "+c.t+" "+c.p+"، "+left(x.left))}
setInterval(function(){if(!document.hidden)paint()},1000);paint();
new MutationObserver(function(){if(!document.querySelector("#skyCard .sk-x"))paint()}).observe(document.body,{childList:true});
})();
