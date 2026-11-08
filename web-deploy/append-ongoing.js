
/*w-ongoing*/(function(){if(!window.__WIRD_NATIVE)return;
function pl(){return window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.WirdAdhan}
var K="wird-ongoing";function on(){try{return localStorage.getItem(K)==="1"}catch(e){return false}}
function push(){var p=pl();if(p&&p.setOngoing)try{p.setOngoing({on:on()})}catch(e){}}
setTimeout(push,2500);
function add(pg){if(pg.querySelector(".og-box"))return;var h=pg.querySelector("h1");if(!h||h.textContent.trim()!=="الإشعارات")return;var b=pg.querySelector(".nt-body");if(!b)return;
var d=document.createElement("div");d.className="sh-list og-box";d.style.margin="12px 0";
d.innerHTML='<label class="sh-row" style="cursor:pointer"><span class="nt-ic" style="--c:#41c3b0"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 6h4M9 12h6M12 12v4"/></svg></span><span class="sh-tx"><b>الصلاة القادمة على شاشة القفل</b><small>إشعار ثابت بالصلاة القادمة والوقت المتبقي</small></span><input type="checkbox" class="og-sw" style="width:46px;height:26px;accent-color:#d8b86c"></label>';
var c=d.querySelector("input");c.checked=on();c.onchange=function(){try{localStorage.setItem(K,c.checked?"1":"0")}catch(e){}push();try{toast(c.checked?"سيظهر إشعار الصلاة القادمة":"تم إيقاف الإشعار الثابت")}catch(e){}};
var first=b.firstElementChild;first&&first.nextSibling?b.insertBefore(d,first.nextSibling):b.appendChild(d)}
new MutationObserver(function(){document.querySelectorAll(".nt-page").forEach(add)}).observe(document.body,{childList:true});
})();
