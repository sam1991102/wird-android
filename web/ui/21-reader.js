
/*reader*/(function(){
/* شاشة القراءة: لمسة على مكان فاضي تخفي/تظهر الشريطين، وزر للوضع الليلي */
var K="wird-mp-night";
function night(){try{return localStorage.getItem(K)==="1"}catch(e){return false}}
var MOON='<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M233.54 142.23a8 8 0 0 0-8-2 88.08 88.08 0 0 1-109.8-109.8 8 8 0 0 0-10-10 104.84 104.84 0 0 0-52.91 37A104 104 0 0 0 136 224a103.09 103.09 0 0 0 62.52-20.88 104.84 104.84 0 0 0 37-52.91 8 8 0 0 0-1.98-7.98Z"/></svg>';
function setup(mp){if(mp.dataset.wRd)return;mp.dataset.wRd=1;mp.classList.toggle("mp-night",night());
 var bar=mp.querySelector(".mp-foot"),rep=bar&&bar.querySelector(".mp-z");
 if(bar&&!bar.querySelector(".mp-nt")){var b=document.createElement("button");b.type="button";b.className="r-btn mp-nt";b.innerHTML=MOON;b.setAttribute("aria-pressed",String(night()));b.setAttribute("aria-label","الوضع الليلي للقراءة");
  b.onclick=function(e){e.stopPropagation();var on=!mp.classList.contains("mp-night");mp.classList.toggle("mp-night",on);b.setAttribute("aria-pressed",String(on));try{localStorage.setItem(K,on?"1":"0")}catch(x){}};
  rep?bar.insertBefore(b,rep):bar.appendChild(b)}
 mp.addEventListener("click",function(e){var t=e.target;if(t.closest("button,input,label,a,.mp-bar,.mp-foot,[role=button]"))return;var line=t.closest(".mp-lines");if(line&&t!==line&&t.textContent.trim())return;mp.classList.toggle("mp-imm")});}
function scan(){var mp=document.querySelector(".mp");if(mp)setup(mp)}
new MutationObserver(scan).observe(document.body,{childList:true});scan();
})();