/*oem*/(function(){"use strict";
/* شاومي وأوبو وفيفو وهواوي وغيرهم بيقفلوا التطبيق لما يتشال من «التطبيقات الأخيرة»، فيختفي إشعار الصلاة القادمة من شاشة القفل
   ويتأخر الأذان. على الأجهزة دي بس: بطاقة في صفحة الإشعارات تفتح صفحة «التشغيل التلقائي». */
var W=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.WirdAdhan;
if(!window.__WIRD_NATIVE||!W)return;
var OEM=/xiaomi|redmi|poco|oppo|realme|oneplus|vivo|iqoo|huawei|honor|letv|asus/,K="wird-oem-ok",st=null;
function done(){try{return localStorage.getItem(K)==="1"}catch(e){return false}}
function add(){if(done()||!st)return;var pg=[].slice.call(document.querySelectorAll(".wp-page.nt-page")).filter(function(p){var h=p.querySelector("h1");return h&&/الإشعارات/.test(h.textContent)}).pop();
 if(!pg||pg.querySelector(".oem-card"))return;var b=pg.querySelector(".nt-body");if(!b)return;
 var c=document.createElement("div");c.className="oem-card";c.setAttribute("role","note");
 var brand=/xiaomi|redmi|poco/.test(st.oem)?"شاومي":/huawei|honor/.test(st.oem)?"هواوي":/oppo|realme|oneplus/.test(st.oem)?"أوبو":/vivo|iqoo/.test(st.oem)?"فيفو":"موبايلك";
 c.innerHTML='<b>خلّي وِرد يشتغل في الخلفية</b><p>موبايلات '+brand+' بتقفل التطبيق لما تشيله من التطبيقات الأخيرة، فيختفي إشعار الصلاة القادمة من شاشة القفل وممكن يتأخر الأذان. فعّل «التشغيل التلقائي» لـ«وِرد» مرة واحدة وخلاص.</p><div class="oem-b"><button type="button" class="oem-go">افتح التشغيل التلقائي</button><button type="button" class="oem-done">فعّلته</button></div>';
 c.querySelector(".oem-go").onclick=function(){W.openAutostart().catch(function(){})};
 c.querySelector(".oem-done").onclick=function(){try{localStorage.setItem(K,"1")}catch(e){}c.remove()};
 b.insertBefore(c,b.firstChild)}
W.status().then(function(s){if(s&&s.oem&&OEM.test(s.oem)){st=s;(window.__wOnDom||function(f){new MutationObserver(f).observe(document.body,{childList:true,subtree:true})})(add);add()}}).catch(function(){});
})();
