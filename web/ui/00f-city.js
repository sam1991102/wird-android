/* البحث عن مدينة لمواقيت الصلاة: من قائمة المدن المحلية، وأي مدينة في العالم عبر Open-Meteo (بدون حساب).
   window.__wirdCity(done) يفتح النافذة؛ الاختيار يحفظ wird-prayer بنفس شكل «موقعي الحالي» مع pick:1 */
(function(){"use strict";
var N=function(s){return String(s||"").replace(/[ً-ٰٟـ]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").toLowerCase().trim()};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
function T(m){try{toast(m)}catch(e){}}
function apply(c){try{var near=window.__nearMethod&&!P.mUser?{method:c.method||__nearMethod(c.lat,c.lng)}:{};
 P=Object.assign({},P,{city:"geo",name:c.name,lat:+(+c.lat).toFixed(4),lng:+(+c.lng).toFixed(4),tz:c.tz||P.tz,geoT:Date.now(),pick:1},near);savePrayer();T("تم: المواقيت حسب "+c.name+" ✓");return true}catch(e){T("تعذّر حفظ المدينة");return false}}
window.__wirdCityApply=apply;
window.__wirdCity=function(done){
 var o=document.createElement("div");o.className="wd-sheet cp-ov";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","اختيار المدينة");
 o.innerHTML='<div class="wd-card cp-card"><div class="cp-h"><b>اختر مدينتك</b><button type="button" class="cp-x" data-x aria-label="إغلاق">×</button></div>'+
  '<input type="search" class="cp-q" placeholder="اكتب اسم مدينتك… مثال: القاهرة" autocomplete="off" enterkeyhint="search" aria-label="اسم المدينة">'+
  '<button type="button" class="cp-geo">'+(typeof ic==="function"?ic("pin"):"")+' <span>استخدم موقعي الحالي</span></button><ul class="cp-l" role="listbox"></ul><p class="cp-s" aria-live="polite"></p></div>';
 document.body.appendChild(o);
 var q=o.querySelector(".cp-q"),L=o.querySelector(".cp-l"),S=o.querySelector(".cp-s"),seq=0,tm=0,rows=[];
 function close(){o.remove();done&&done()}
 o.querySelector(".cp-x").onclick=close;o.addEventListener("click",function(e){if(e.target===o)close()});
 o.querySelector(".cp-geo").onclick=function(){var b=this;b.lastChild.textContent="جارٍ تحديد موقعك…";__wirdGeo(false).then(function(ok){if(ok)close();else{b.lastChild.textContent="استخدم موقعي الحالي";S.textContent="ما قدرناش نحدد موقعك — اكتب اسم مدينتك فوق"}})};
 function draw(){L.innerHTML=rows.map(function(r,i){return'<li><button type="button" role="option" data-i="'+i+'"><b>'+esc(r.name)+'</b><small>'+esc(r.sub||"")+'</small></button></li>'}).join("")}
 L.addEventListener("click",function(e){var b=e.target.closest("[data-i]");if(!b)return;if(apply(rows[+b.dataset.i]))close()});
 function local(v){var n=N(v);return (window.CITIES||CITIES).filter(function(c){return !n||N(c[1]).indexOf(n)>=0||c[0].indexOf(n)>=0}).map(function(c){return{name:c[1],sub:"",lat:c[2],lng:c[3],tz:c[4],method:c[5]}})}
 function run(){var v=q.value.trim(),my=++seq;rows=local(v);draw();S.textContent="";
  if(v.length<2)return;S.textContent="بنبحث…";
  fetch("https://geocoding-api.open-meteo.com/v1/search?count=15&language=ar&format=json&name="+encodeURIComponent(v)).then(function(r){return r.json()}).then(function(j){if(my!==seq)return;
      (j.results||[]).forEach(function(x){var nm=x.name;if(rows.some(function(r){return Math.hypot(r.lat-x.latitude,(r.lng-x.longitude)*Math.cos(x.latitude*Math.PI/180))<0.14}))return;rows.push({name:nm,sub:[x.admin1,x.country].filter(Boolean).join("، "),lat:x.latitude,lng:x.longitude,tz:x.timezone})});
   draw();S.textContent=rows.length?"":"مفيش نتائج — جرّب كتابة الاسم بطريقة تانية أو بالإنجليزي"},function(){if(my!==seq)return;S.textContent=rows.length?"":"البحث في كل المدن محتاج إنترنت"})}
 q.addEventListener("input",function(){clearTimeout(tm);tm=setTimeout(run,300)});
 run();setTimeout(function(){q.focus()},150);return o};
})();
