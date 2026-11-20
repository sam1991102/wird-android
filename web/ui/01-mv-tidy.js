
/*mv-tidy*/(function(){
function dl(){if(window.__WIRD_NATIVE){document.documentElement.classList.add("mv-offline");return}/* التطبيق فيه المصحف كامل */var b=document.querySelector("#quranCard .qk-dl");if(!b||b.dataset.ck)return;b.dataset.ck=1;try{caches.open("wird-mushaf-v1").then(function(c){return c.keys()}).then(function(k){if(k.length>=600)document.documentElement.classList.add("mv-offline")})}catch(e){}}
function run(){dl()}
__wOnDom(run);
})();
