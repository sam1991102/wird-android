
/*nav2*/(function(){
/* الشريط السفلي: مصدر واحد لحالة الزر المنوّر، وفتح الصفحات بدون رعشة */
var R=document.documentElement;
function bar(){return document.querySelector(".bottom-nav.nav5")}
function key(c){if(c.dataset.tab)return c.dataset.tab;var h=(c.getAttribute("href")||"").split("#")[1]||c.dataset.nav||"";return h==="top"?"home":h}
function settingsOpen(){return[].some.call(document.querySelectorAll(".st"),function(x){return!x.hidden&&x.offsetHeight>200})}
function current(){if(document.querySelector(".wp-page.rd-page"))return"radio";if(settingsOpen())return"settings";return R.dataset.view||"home"}
function paint(k){var n=bar();if(!n)return;if(n.dataset.lit===k&&n.querySelector(".is-lit"))return;n.dataset.lit=k;[].forEach.call(n.children,function(c){var on=key(c)===k;c.classList.toggle("is-lit",on);c.classList.toggle("active",on);on?c.setAttribute("aria-current","page"):c.removeAttribute("aria-current")})}
var q=0;function update(){if(q)return;q=requestAnimationFrame(function(){q=0;paint(current())})}
/* data-view للتبويبات، و class عشان st-open/wp-open لما الإعدادات أو صفحة فوقية تتفتح */
new MutationObserver(update).observe(R,{attributes:true,attributeFilter:["data-view","class"]});
__wOnDom(update);
document.addEventListener("click",function(e){var c=e.target.closest&&e.target.closest(".bottom-nav.nav5>*");if(!c)return;var k=key(c);
 if(k==="radio"&&document.querySelector(".wp-page.rd-page"))return;if(k==="settings"&&settingsOpen()&&!document.querySelector(".wp-page"))return;
 /* أي صفحة مفتوحة تُقفل فورًا بدون حركة، ثم يكمل الضغط طبيعي */
 R.classList.add("nav-fast");window.__closeOverlays&&__closeOverlays(true);setTimeout(function(){R.classList.remove("nav-fast")},350);
 paint(k)},true);
paint(current());
})();