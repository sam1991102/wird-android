


;(function(){/* ===== وضع «الجهاز»: يتبع إعداد الموبايل (فاتح/ليلي) ===== */
var R=document.documentElement,mq=matchMedia("(prefers-color-scheme: dark)");
var ls=function(k,v){try{if(v===undefined)return localStorage.getItem(k);v===null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}};
function dev(){return typeof window.__sysDark==="boolean"?window.__sysDark:mq.matches}
function meta(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=R.classList.contains("dark")?"#0b1310":"#0f3d2e"}
function apply(){if(ls("wird-theme-mode")!=="device")return;R.classList.remove("sepia");R.classList.toggle("dark",dev());meta()}
apply();try{mq.addEventListener("change",apply)}catch(e){mq.addListener&&mq.addListener(apply)}addEventListener("sysdark",apply);document.addEventListener("visibilitychange",function(){if(!document.hidden)apply()});setInterval(apply,60000);
function seg(){var s=document.querySelector("#st-look .st-seg");if(!s)return;var a=s.querySelector('[data-v="auto"]');if(!a)return;var d=s.querySelector('[data-v="device"]');
 if(!d){d=document.createElement("button");d.type="button";d.setAttribute("role","radio");d.dataset.v="device";d.className="st-auto st-dev";d.textContent="الجهاز";a.after(d);
  d.addEventListener("click",function(e){e.stopPropagation();ls("wird-theme-mode","device");ls("wird-dark",null);ls("wird-sepia",null);apply();mark();try{toast("المظهر يتبع إعداد الموبايل (فاتح أو ليلي)")}catch(x){}});
  a.addEventListener("click",function(){setTimeout(mark,0)});
  s.addEventListener("click",function(e){if(e.target.closest('[data-seg="theme"]'))setTimeout(mark,0)},true);
  new MutationObserver(function(){if(ls("wird-theme-mode")==="device")mark()}).observe(s,{attributes:true,subtree:true,attributeFilter:["aria-checked"]})}
 mark()}
function mark(){var s=document.querySelector("#st-look .st-seg");if(!s)return;var d=s.querySelector('[data-v="device"]');if(!d)return;var on=ls("wird-theme-mode")==="device";
 if(d.getAttribute("aria-checked")!==String(on))d.setAttribute("aria-checked",String(on));
 if(on)s.querySelectorAll("button").forEach(function(x){if(x!==d&&x.getAttribute("aria-checked")!=="false")x.setAttribute("aria-checked","false")})}
new MutationObserver(function(){clearTimeout(seg.t);seg.t=setTimeout(seg,150)}).observe(document.body,{childList:true,subtree:true});setTimeout(seg,800);
})();

;(function(){/* v234: اسم المدينة الحقيقي بدل «موقعي الحالي» */
function km(a,b,c,d){var r=Math.PI/180,x=Math.sin((c-a)*r/2),y=Math.sin((d-b)*r/2);return 12742*Math.asin(Math.sqrt(x*x+Math.cos(a*r)*Math.cos(c*r)*y*y))}
var busy=0;function set(n,k){P.name=n;P.geoKey=k;try{savePrayer()}catch(e){}}
function fix(){try{if(busy||typeof P==="undefined"||P.city!=="geo"||P.lat==null)return;var k=(+P.lat).toFixed(2)+","+(+P.lng).toFixed(2);if(P.geoKey===k&&P.name&&P.name!=="موقعي الحالي")return;var best=null,bd=1e9;(typeof CITIES!=="undefined"?CITIES:[]).forEach(function(c){var d=km(+P.lat,+P.lng,c[2],c[3]);if(d<bd){bd=d;best=c}});if(best&&bd<35)return set(best[1],k);if(!navigator.onLine)return;busy=1;fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude="+(+P.lat).toFixed(1)+"&longitude="+(+P.lng).toFixed(1)+"&localityLanguage=ar").then(function(r){return r.json()}).then(function(j){var n=j.city||j.locality||j.principalSubdivision;if(n)set(n,k);else P.geoKey=k}).catch(function(){}).then(function(){busy=0})}catch(e){}}
fix();setInterval(fix,5000)})();