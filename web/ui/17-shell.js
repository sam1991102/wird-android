
/*shell*/
/* الإطار: الإذاعة في القائمة الجانبية، مدير الصفحات الفوقية، فتح صفحات الإعدادات مباشرة */
(function(){
var RAD='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="3"/><path d="M7 8l9-5"/><circle cx="15.5" cy="14" r="2.5"/><path d="M6.5 12.5h4M6.5 15.5h4"/></svg>';
function drawer(){var d=document.querySelector(".dr2 .dr-p");if(!d||d.querySelector('[data-n="radio"]'))return;var k=d.querySelector('[data-n="kids"]');if(!k)return;var r=document.createElement("button");r.type="button";r.className="dr-i2";r.dataset.n="radio";r.innerHTML='<span class="dr-ic">'+RAD+'</span><span class="dr-l">إذاعة القرآن الكريم</span>';r.onclick=function(e){e.stopPropagation();var x=document.querySelector(".dr2 [data-x]");x&&x.click();setTimeout(function(){window.__openRadio&&__openRadio()},200)};k.parentNode.insertBefore(r,k)}
__wOnDom(drawer);
})();
/* «الإعدادات» صفحة فوقية وليست view: لو اتضبطت كـ view نرجع للرئيسية */
(function(){var R=document.documentElement;function g(){if(R.dataset.view==="settings"&&window.__setView)__setView("home",false)}new MutationObserver(g).observe(R,{attributes:true,attributeFilter:["data-view"]});g()})();
(function(){var R=document.documentElement;
var SEL='.wp-page,.st,.wd-sheet:not(.dr2),#focus,.reader';
function openOv(){return[].slice.call(document.querySelectorAll(SEL)).filter(function(o){if(o.hidden)return false;var c=getComputedStyle(o);return c.display!=="none"&&c.visibility!=="hidden"})}
function closeAll(){openOv().forEach(function(o){var b=o.querySelector("[data-x],.wp-back,.wd-x,#fClose,[data-m=close]");if(b)b.click();if(o.classList.contains("wp-page")){o.remove()}else if(!o.hidden&&getComputedStyle(o).display!=="none"){o.hidden=true}});R.classList.remove("ov-lock","reader-open","wp-open")}
window.__closeOverlays=closeAll;
function mushafOpen(){var m=document.querySelector(".mp:not([hidden]),#focus:not([hidden]),.lp-ov:not([hidden])");return!!(m&&getComputedStyle(m).display!=="none")}
function sp(k,v){if(R.style.getPropertyValue(k)!==v)R.style.setProperty(k,v)}function sync(){R.classList.toggle("nav-off",mushafOpen());var n=document.querySelector(".bottom-nav.nav5");if(n&&n.offsetHeight)sp("--nav-h",n.offsetHeight+"px");if(n){var so=[].some.call(document.querySelectorAll(".st"),function(x){return!x.hidden&&x.offsetHeight>200});R.classList.toggle("st-open",so);if(so){var t0=document.querySelector(".topbar");if(t0&&t0.offsetHeight)sp("--tb-h",t0.offsetHeight+"px")}var tb=document.querySelector(".topbar");if(tb&&tb.offsetHeight)sp("--tb-h",tb.offsetHeight+"px")}}
var q=0;function later(){if(!q)q=requestAnimationFrame(function(){q=0;sync()})}new MutationObserver(later).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["hidden"]});addEventListener("resize",later);sync();})();
(function(){function W(ms){return new Promise(function(r){setTimeout(r,ms)})}
async function page(id){if(!window.__openSettings)return null;__openSettings();await W(250);var st=[].find.call(document.querySelectorAll(".st"),function(x){return!x.hidden});var r=st&&st.querySelector('.sh-row[data-id="'+id+'"]');if(!r)return null;r.click();await W(450);return[].slice.call(document.querySelectorAll(".wp-page.sh-page")).pop()||null}
window.__openSettingsPage=page;
var MAP={update:async function(){var p=await page("st-about");var b=p&&p.querySelector("#updChk");if(b){b.scrollIntoView({block:"center"});b.click()}},adhan:function(){page("notif")},alarm:function(){page("st-alarm")}};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".dr2 [data-n]");if(!b||!MAP[b.dataset.n])return;e.preventDefault();e.stopImmediatePropagation();var x=document.querySelector(".dr2 [data-x],.dr2 .wd-x");x&&x.click();setTimeout(MAP[b.dataset.n],250)},true)})();
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".dr2 .dr-p [data-n]");if(!b||b.dataset.n==="set")return;[].forEach.call(document.querySelectorAll(".st"),function(s){if(!s.hidden){var x=s.querySelector(".st-bar [data-x]");x?x.click():s.hidden=true}});[].forEach.call(document.querySelectorAll(".wp-page.sh-page"),function(p){p.remove()})},true);
/* إخفاء شارة «إسناده ضعيف» الحمراء فقط (يبقى سطر التخريج كما هو) */
(function(){var q=0;function hide(){q=0;[].forEach.call(document.querySelectorAll("#focus span,#focus b,#focus em,#focus div,.wp-page span,.wp-page b,.wp-page div"),function(e){if(e.children.length===0&&e.dataset.wNoGrade!=="1"&&/^\s*إسناده\s+ضعيف\s*$/.test(e.textContent)){e.dataset.wNoGrade="1";e.style.display="none"}})}
__wOnDom(hide)})();/* صفحة الأذكار بتتبني على دفعتين: نحجز مكان صف المربعات بآخر ارتفاع ليه، فالقوايم اللي تحته ما تتحركش وقت البناء — من غير أي إخفاء أو وميض */
(function(){var lib=document.getElementById("library");if(!lib)return;function keep(){var sh=lib.querySelector(".l2-sh");if(sh&&sh.offsetHeight>40){var h=sh.offsetHeight+"px";if(lib.style.getPropertyValue("--l2sh")!==h)lib.style.setProperty("--l2sh",h)}}window.__wOnDom&&__wOnDom(keep);addEventListener("resize",keep)})();
