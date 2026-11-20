/* إبقاء الشاشة منوّرة في المصحف، وأزرار «ذكر اليوم» */
;(function(){var lock=null,want=false;function nat(on){try{var p=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.WirdAdhan;if(p&&p.keepAwake)p.keepAwake({on:on})}catch(e){}}
async function get(){if(!want||document.hidden)return;nat(true);try{if("wakeLock"in navigator&&!lock){lock=await navigator.wakeLock.request("screen");lock.addEventListener("release",function(){lock=null})}}catch(e){}}
function rel(){nat(false);try{lock&&lock.release()}catch(e){}lock=null}
function chk(){var v=document.documentElement.dataset.view||document.body.dataset.view||"";var on=v==="mushaf"||[].some.call(document.querySelectorAll(".mp-page"),function(p){var r=p.getBoundingClientRect();return p.offsetParent&&r.bottom>0&&r.top<innerHeight});if(on!==want){want=on;on?get():rel()}}
__wOnView(chk);document.addEventListener("visibilitychange",function(){if(!document.hidden&&want)get()});var n=0;__wEverySec(function(){if(!document.hidden&&++n%3===0)chk()});setTimeout(chk,800);window.__wakeState=function(){return{want:want,lock:!!lock}}})();
;(function(){
function daily(){var act=document.querySelector(".daily-card .card-actions");if(!act||document.getElementById("imgDaily"))return;
var img=document.createElement("button");img.id="imgDaily";img.className="btn btn-gold btn-sm";img.innerHTML='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg> شارك كصورة';
img.onclick=function(){var t=document.getElementById("dailyText").textContent,s=document.getElementById("dailySource").textContent;if(window.__shareImg)__shareImg(t,s)};
var nx=document.createElement("button");nx.id="nextDaily";nx.className="btn btn-soft btn-sm";nx.innerHTML='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/></svg> ذكر آخر';
var off=0;nx.onclick=function(){try{var OK={morning:1,evening:1,prayer:1,sleep:1,wake:1,kurb:1,quran:1,jawami:1,istighfar:1,fadail:1,family:1,rizq:1,ilm:1,friday:1,sick:1,daily:1};var pool=(typeof dailyPool!=="undefined"?dailyPool:[]).concat(adhkar.filter(function(t){return /^x2-/.test(t.id)})).filter(function(t){return OK[t.cat]&&t.text.length<230&&/^(اللَّهُمَّ|اللهم|رَبِّ|رب|رَبَّنَا|ربنا|سُبْحَانَ|سبحان|لَا|لا|أَسْتَغْفِرُ|أستغفر|الْحَمْدُ|الحمد|بِسْمِ|بسم|حَسْبِيَ|حسبي|حَسْبُنَا|يَا|يا|أَعُوذُ|أعوذ|أُعِيذُ|رَضِيتُ|أَصْبَحْنَا|أَمْسَيْنَا|وَارْزُقْنَا|اللَّهُ|قُلْ|بَارَكَ)/.test(t.text)});off++;var base=Math.floor(Date.now()/864e5);var it=pool[(base*7+off*13)%pool.length];document.getElementById("dailyText").textContent=it.text;document.getElementById("dailySource").textContent=[it.fadl,it.source].filter(Boolean).join(" — ")}catch(e){}};
act.insertBefore(img,act.firstChild);act.appendChild(nx);act.style.flexWrap="wrap"}
daily();setTimeout(daily,800);})();
;
