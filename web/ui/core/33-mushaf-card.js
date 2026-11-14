
;(function(){/* v239: بطاقة المصحف الموحّدة — أكمل القراءة + الختمة (الوحدة الأصلية) + التحميل بدون إنترنت؛ تظهر في الرئيسية والمصحف فقط */
var G=function(k,d){try{var v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}},S=function(k,v){try{localStorage.setItem(k,v)}catch(e){}};
var AR=__ar;
try{var ok=JSON.parse(G("wird-khatma","null"));if(ok&&ok.d0==null){localStorage.removeItem("wird-khatma")}localStorage.removeItem("wird-khatma-read")}catch(e){}
var API=function(n){return"https://api.quran.com/api/v4/verses/by_page/"+n+"?words=true&word_fields=code_v2,line_number&fields=verse_key,juz_number&per_page=60&mushaf=1"},FONT=function(n){return"https://static.qurancdn.com/fonts/quran/hafs/v2/woff2/p"+n+".woff2"};
var dl={on:false,n:0};
async function download(){if(dl.on){dl.on=false;return}dl.on=true;dl.n=0;try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}var c=await caches.open("wird-mushaf-v1");var next=1,fail=0;
 async function one(n){try{if(!(await c.match(API(n)))){var r=await fetch(API(n));if(!r.ok)throw 0;await c.put(API(n),r)}if(!(await c.match(FONT(n)))){var f=await fetch(FONT(n),{mode:"cors"});if(!f.ok)throw 0;if(!(await c.match(FONT(n))))await c.put(FONT(n),f)}}catch(e){fail++}dl.n++;if(dl.n%6===0||dl.n===604)top()}
 async function worker(){while(dl.on&&next<=604){var n=next++;await one(n)}}
 top();await Promise.all([worker(),worker(),worker(),worker()]);var ok=dl.on&&fail===0;dl.on=false;if(ok)S("wird-mushaf-offline","1");top();typeof toast==="function"&&toast(ok?"المصحف كله متاح الآن بدون إنترنت":fail?"توقف التحميل لانقطاع الاتصال، اضغط للمتابعة":"أُوقف التحميل")}
var el=null,tp=null;
function ensure(){if(el)return el;el=document.createElement("div");el.className="qk";el.id="quranCard";el.setAttribute("role","region");el.setAttribute("aria-label","المصحف");tp=document.createElement("div");tp.className="qk-top";el.appendChild(tp);
 el.addEventListener("click",function(e){var b=e.target.closest("[data-q]");if(!b)return;if(b.dataset.q==="cont")window.__openPage&&__openPage(+G("wird-mushaf-page",1)||1,b);else if(b.dataset.q==="dl")download()});return el}
function top(){ensure();var last=+G("wird-mushaf-page",0),sura=G("wird-mushaf-sura",""),off=G("wird-mushaf-offline","")==="1";
 var h='<div class="qk-h"><h2>المصحف</h2><button type="button" class="qk-dl'+(off?" ok":"")+'" data-q="dl" '+(off?"disabled":"")+'>'+(dl.on?"جارٍ التحميل "+AR(dl.n)+" من ٦٠٤ · إيقاف":off?"متاح بدون إنترنت ✓":"تحميل للقراءة بدون إنترنت")+'</button></div>';
 if(dl.on)h+='<div class="qk-bar"><i style="width:'+(dl.n/6.04)+'%"></i></div>';
 if(last)h+='<button type="button" class="qk-cont" data-q="cont"><span><b>أكمل القراءة</b><small>'+(sura?"سورة "+sura+" · ":"")+"صفحة "+AR(last)+'</small></span><span class="qk-go" aria-hidden="true">←</span></button>';
 tp.innerHTML=h}
function place(){ensure();var v=document.documentElement.dataset.view||"home",kh=document.getElementById("khatma");if(kh&&kh.parentNode!==el)el.appendChild(kh);
 var mv=document.getElementById("mushafView"),hp=document.getElementById("homePlus")||document.querySelector(".hero");
 if(v==="mushaf"&&mv){var a=mv.querySelector(".vh-head");if(el.parentNode!==mv||el.previousElementSibling!==a)(a?a.after(el):mv.prepend(el));el.classList.remove("container")}
 else if(hp&&el.previousElementSibling!==hp){hp.after(el);el.classList.add("container")}
 el.hidden=!(v==="home"||v==="mushaf")}
function draw(){top();place()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",draw);else draw();
new MutationObserver(place).observe(document.documentElement,{attributes:true,attributeFilter:["data-view"]});
addEventListener("wird-mp-page",top);document.addEventListener("visibilitychange",function(){if(!document.hidden&&!dl.on)top()});addEventListener("storage",top);
})();