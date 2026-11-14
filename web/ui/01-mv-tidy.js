
/*mv-tidy*/(function(){
function dl(){var b=document.querySelector("#quranCard .qk-dl");if(!b||b.dataset.ck)return;b.dataset.ck=1;try{caches.open("wird-mushaf-v1").then(function(c){return c.keys()}).then(function(k){if(k.length>=600)document.documentElement.classList.add("mv-offline")})}catch(e){}}
function kh(){var s=document.getElementById("khStart");if(!s||s.dataset.tidy)return;s.dataset.tidy=1;var card=s.closest(".kh-new");if(!card)return;s.addEventListener("click",function(e){if(!card.classList.contains("open")){e.preventDefault();e.stopImmediatePropagation();card.classList.add("open");s.textContent="ابدأ الختمة"}},true);s.textContent="ختمة جديدة";var k=card.querySelector(".kh-k");if(k)k.textContent="ختمة القرآن"}
function run(){dl();kh()}
__wOnDom(run);
})();
