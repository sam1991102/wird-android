
/*skin-ios*/(function(){var K="wird-skin";function get(){try{return localStorage.getItem(K)||"classic"}catch(e){return"classic"}}
document.documentElement.classList.toggle("ios",get()==="ios");
/* صف «نمط التصميم» اتنقل لصفحة تخصيص المظهر (ui/core/47-look.js) */
})();
(function(){var R=document.documentElement;function btn(t){var s=document.getElementById("st-look");if(!s)return null;return[].find.call(s.querySelectorAll("button"),function(b){return b.textContent.trim()===t})}
function fix(){var p=btn("ورقي");if(p)p.classList.add("m-sepia");if(R.classList.contains("ios")&&R.classList.contains("sepia")){var l=btn("فاتح");if(l){l.click()}else{R.classList.remove("sepia");try{localStorage.setItem("wird-sepia","false")}catch(e){}}}}
__wOnDom(fix);new MutationObserver(fix).observe(R,{attributes:true,attributeFilter:["class"]});fix()})();