;(function(){/* تحديث تطبيق الأندرويد: التطبيق شايل ملفات الموقع جواه، فالتحديث مش بييجي من الموقع زي الآيفون،
  بييجي مع APK جديد. هنا بنقارن رقم النسخة المتسجل جوه التطبيق (app-version.json من app-bundle.mjs)
  برقم آخر إصدار على GitHub (v1.0.N)، ولو فيه أحدث بنعرض تنزيله. بيشتغل جوه التطبيق بس. */
var C=window.Capacitor;if(!C||!C.isNativePlatform||!C.isNativePlatform())return;
var REPO="sam1991102/wird-android",APK="https://github.com/"+REPO+"/releases/latest/download/wird.apk",KEY="wird-apk-seen";
var T=function(m){typeof toast==="function"&&toast(m)},ar=function(n){return String(n).replace(/\d/g,function(d){return"٠١٢٣٤٥٦٧٨٩"[+d]})};
var mine=function(){return fetch("/app-version.json",{cache:"no-store"}).then(function(r){return r.json()}).then(function(j){return +j.code||0}).catch(function(){return 0})};
var latest=function(){return fetch("https://api.github.com/repos/"+REPO+"/releases/latest",{cache:"no-store",headers:{Accept:"application/vnd.github+json"}}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){return +((String(j.tag_name).match(/(\d+)$/)||[])[1]||0)}).catch(function(){return 0})};
/* Capacitor بيفتح أي رابط برّه التطبيق في المتصفح، والمتصفح بينزّل الـAPK */
var get=function(){location.href=APK};
function bar(n){if(document.querySelector(".upd-bar.apk-bar"))return;var b=document.createElement("div");b.className="upd-bar apk-bar";b.setAttribute("role","status");
 b.innerHTML='<span>نسخة جديدة من التطبيق ('+ar("1.0."+n)+')</span><button type="button" class="btn btn-sm">نزّلها</button><button type="button" class="upd-x" aria-label="لاحقًا">×</button>';
 b.querySelector(".btn").onclick=function(){get();b.remove()};b.querySelector(".upd-x").onclick=function(){try{localStorage.setItem(KEY,String(n))}catch(e){}b.remove()};document.body.appendChild(b)}
async function check(loud){var r=await Promise.all([mine(),latest()]),m=r[0],l=r[1];
 if(!l){loud&&T("تعذّر التحقق، تأكد من الاتصال بالإنترنت");return}
 if(m&&l>m){if(loud||String(l)!==localStorage.getItem(KEY))bar(l);loud&&T("فيه نسخة جديدة ("+ar("1.0."+l)+")");return}
 loud&&T("أنت على أحدث نسخة"+(m?" ("+ar("1.0."+m)+")":""))}
/* القائمة الجانبية وزرار الإعدادات بيستخدموا نفس الفحص */
window.__wirdCheck=function(){T("جارٍ التحقق من التحديث…");check(true)};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#updChk");if(!b)return;e.preventDefault();e.stopImmediatePropagation();window.__wirdCheck()},true);
/* فحص هادي مرة كل يوم لما التطبيق يتفتح */
setTimeout(function(){var d=new Date().toDateString();try{if(localStorage.getItem("wird-apk-chk")===d)return;localStorage.setItem("wird-apk-chk",d)}catch(e){}check(false)},6000);
})();
