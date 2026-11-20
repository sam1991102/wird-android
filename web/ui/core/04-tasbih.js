
(()=>{"use strict";
/* السبحة بملء الشاشة */
const sec=document.getElementById("tasbih"),dial=document.getElementById("dial"),fb=document.getElementById("fullBtn");let lock=null;
async function wake(on){try{if(on&&navigator.wakeLock)lock=await navigator.wakeLock.request("screen");else if(lock){await lock.release();lock=null}}catch(e){}}
function full(on){sec.classList.toggle("tasbih-full",on);document.documentElement.classList.toggle("reader-open",on);fb.setAttribute("aria-pressed",on);fb.setAttribute("aria-label",on?"خروج من ملء الشاشة":"ملء الشاشة");wake(on);if(on)dial.focus({preventScroll:true})}
fb.addEventListener("click",()=>full(!sec.classList.contains("tasbih-full")));
sec.addEventListener("click",e=>{if(!sec.classList.contains("tasbih-full"))return;if(e.target.closest("button,.phrase-chips,.seg"))return;dial.click()});
document.addEventListener("keydown",e=>{if(!sec.classList.contains("tasbih-full"))return;if(e.key==="Escape")full(false);else if((e.key===" "||e.key==="Enter")&&e.target===document.body){e.preventDefault();dial.click()}});
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&sec.classList.contains("tasbih-full"))wake(true)});
/* الذكر التالي */
const box=document.getElementById("nextd");
function render(){if(!box)return;const c=timeCategory(),items=catItems(c);if(!items.length){box.hidden=true;return}
 const done=items.filter(a=>(progress[a.id]||0)>=a.repeat).length,nx=items.find(a=>(progress[a.id]||0)<a.repeat),name=catName(c);
 box.hidden=false;
 if(!nx){box.innerHTML='<div class="nextd-head"><span>'+name+'</span><span class="nextd-ok">اكتملت ✓</span></div><p class="nextd-txt nextd-done">تقبّل الله منك. أتممت '+items.length+' ذكرًا.</p>';return}
 const left=nx.repeat-(progress[nx.id]||0);
 box.innerHTML='<div class="nextd-head"><span>التالي في '+name+'</span><span>'+(done)+' من '+items.length+'</span></div><p class="nextd-txt"></p><div class="nextd-foot"><span class="nextd-rep">'+(nx.repeat>1?"متبقٍّ "+left+" من "+nx.repeat:"مرة واحدة")+'</span><button type="button" class="btn btn-primary nextd-go">'+(done?'أكمل القراءة':'ابدأ الآن')+'</button></div><div class="nextd-bar"><span style="width:'+Math.round(done/items.length*100)+'%"></span></div>';
 box.querySelector(".nextd-txt").textContent=nx.text;box.querySelector(".nextd-go").onclick=()=>openFocus(c)}
render();document.addEventListener("visibilitychange",()=>{if(!document.hidden)render()});
const f=document.getElementById("focus");if(f)new MutationObserver(()=>{if(f.hidden)render()}).observe(f,{attributes:true,attributeFilter:["hidden"]});
__wEvery(60,render);
})();