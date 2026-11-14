
/*focus*/(function(){
/* قارئ الأذكار: النص الطويل يبدأ من أوله، حواف ناعمة مع «باقي النص»، والأزرار تتلم في «⋯» */
var q=0;
function els(){var f=document.getElementById("focus");return f&&{f:f,st:document.getElementById("fStage"),acts:document.getElementById("fActs"),bot:f.querySelector(".focus-bottom")}}
function ensure(e){
 if(!e.f.querySelector(".f-more")){var m=document.createElement("button");m.type="button";m.className="f-more";m.setAttribute("aria-label","باقي النص");m.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg><span>باقي النص</span>';
  m.addEventListener("click",function(ev){ev.stopPropagation();e.st.scrollBy({top:e.st.clientHeight*.7,behavior:"smooth"})});e.st.after(m);
  e.st.addEventListener("scroll",function(){paint(e)},{passive:true})}
 if(e.bot&&!e.bot.querySelector(".f-dots")){var d=document.createElement("button");d.type="button";d.className="icon-btn lg f-dots";d.setAttribute("aria-label","المزيد");d.setAttribute("aria-expanded","false");d.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>';
  d.addEventListener("click",function(ev){ev.stopPropagation();var o=!e.f.classList.contains("f-acts-open");e.f.classList.toggle("f-acts-open",o);d.setAttribute("aria-expanded",String(o))});e.bot.appendChild(d);
  e.acts.addEventListener("click",function(){e.f.classList.remove("f-acts-open");d.setAttribute("aria-expanded","false")})}}
function paint(e){var st=e.st,over=st.scrollHeight-st.clientHeight>4,top=st.scrollTop>4,end=st.scrollTop+st.clientHeight>=st.scrollHeight-4;
 e.f.classList.toggle("f-long",over);st.classList.toggle("f-fade-t",over&&top);st.classList.toggle("f-fade-b",over&&!end);e.f.classList.toggle("f-has-more",over&&!end)}
function run(){q=0;var e=els();if(!e||!e.st||!e.acts)return;ensure(e);paint(e)}
function later(){if(!q)q=requestAnimationFrame(run)}
function bind(){var e=els();if(!e||e.f.dataset.wFx)return;e.f.dataset.wFx=1;
 new MutationObserver(later).observe(e.f,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["class","style","hidden"]});
 document.addEventListener("click",function(ev){if(!ev.target.closest("#fActs,.f-dots"))e.f.classList.remove("f-acts-open")});
 addEventListener("resize",later);later()}
__wOnDom(bind);
})();
