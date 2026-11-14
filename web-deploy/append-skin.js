
/*skin-ios*/(function(){var K="wird-skin";function get(){try{return localStorage.getItem(K)||"classic"}catch(e){return"classic"}}
function set(v){try{localStorage.setItem(K,v)}catch(e){}document.documentElement.classList.toggle("ios",v==="ios");document.querySelectorAll(".skin-seg button").forEach(function(b){b.setAttribute("aria-checked",b.dataset.skin===v)})}
document.documentElement.classList.toggle("ios",get()==="ios");
function add(){var s=document.getElementById("st-look");if(!s||s.querySelector(".skin-row"))return;var r=document.createElement("div");r.className="st-row skin-row";r.style.display="block";
r.innerHTML='<div class="st-l"><strong>نمط التصميم</strong><small>«إبداعي» بألوان وخطوط الآيفون، فاتح وليلي</small></div><div class="skin-seg"><button type="button" data-skin="classic">كلاسيكي</button><button type="button" data-skin="ios">إبداعي</button></div>';
var h=s.querySelector(".st-row");h?s.insertBefore(r,h):s.appendChild(r);set(get())}
/* الضغط بالتفويض على مستوى الصفحة: يشتغل حتى لو صفحة الإعدادات نسخة من القسم الأصلي */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".skin-seg [data-skin]");if(b){e.preventDefault();set(b.dataset.skin)}});
new MutationObserver(add).observe(document.body,{childList:true,subtree:false});add();
})();
(function(){var R=document.documentElement;function btn(t){var s=document.getElementById("st-look");if(!s)return null;return[].find.call(s.querySelectorAll("button"),function(b){return b.textContent.trim()===t})}
function fix(){var p=btn("ورقي");if(p)p.classList.add("m-sepia");if(R.classList.contains("ios")&&R.classList.contains("sepia")){var l=btn("فاتح");if(l){l.click()}else{R.classList.remove("sepia");try{localStorage.setItem("wird-sepia","false")}catch(e){}}}}
new MutationObserver(fix).observe(document.body,{childList:true});new MutationObserver(fix).observe(R,{attributes:true,attributeFilter:["class"]});fix()})();
