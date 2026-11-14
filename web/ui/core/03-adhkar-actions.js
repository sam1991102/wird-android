
(()=>{"use strict";
const MORE='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/></svg>';
function decorate(root){root.querySelectorAll(".dhikr-actions").forEach(a=>{const ex=a.querySelector(".act-extra");if(ex){a.querySelectorAll(":scope>[data-copy],:scope>[data-share],:scope>[data-img]").forEach(b=>ex.append(b));return}
 const sec=[...a.querySelectorAll("[data-copy],[data-share],[data-img]")];if(!sec.length)return;
 const wrap=document.createElement("div");wrap.className="act-extra";sec.forEach(b=>wrap.append(b));
 const m=document.createElement("button");m.type="button";m.className="act-more";m.setAttribute("aria-label","خيارات أخرى");m.setAttribute("aria-expanded","false");m.title="المزيد";m.innerHTML=MORE;
 a.prepend(m);a.prepend(wrap)})}
const list=document.getElementById("adhkarList");if(list){decorate(list);new MutationObserver(()=>decorate(list)).observe(list,{childList:true,subtree:true})}
document.addEventListener("click",e=>{const m=e.target.closest(".act-more");
 document.querySelectorAll(".dhikr-actions.open").forEach(a=>{if(!m||a!==m.parentElement){a.classList.remove("open");a.querySelector(".act-more").setAttribute("aria-expanded","false")}});
 if(m){const a=m.parentElement,o=a.classList.toggle("open");m.setAttribute("aria-expanded",o)}
 else if(e.target.closest(".act-extra button"))setTimeout(()=>document.querySelectorAll(".dhikr-actions.open").forEach(a=>a.classList.remove("open")),150)});
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".dhikr-actions.open").forEach(a=>a.classList.remove("open"))});
})();
(()=>{"use strict";
const R=document.documentElement,mq={matches:true,addEventListener(){},addListener(){}};
const secs=[...document.querySelectorAll("main>section")];
secs.forEach(s=>{const id=s.id;s.dataset.v=id==="library"||id==="favoritesSection"?"library":id==="prayer"?"prayer":id==="tasbih"?"tasbih":"home"});
function setView(v,top=true){if(R.dataset.view===v)return;R.dataset.view=v;if(top&&mq.matches)scrollTo({top:0,behavior:"instant"})}
window.__setView=setView;R.dataset.view="home";
const orig=Element.prototype.scrollIntoView;
Element.prototype.scrollIntoView=function(...a){if(mq.matches){const s=this.closest&&this.closest("main>section[data-v]");if(s&&s.dataset.v!==R.dataset.view){setView(s.dataset.v,false);s.hidden=s.id==="favoritesSection"?s.hidden:false}}return orig.apply(this,a)};
document.addEventListener("click",e=>{if(!mq.matches)return;const l=e.target.closest('a[href^="#"]');if(l&&!l.closest(".bottom-nav")){const t=document.querySelector(l.getAttribute("href"));const s=t&&t.closest("main>section[data-v]");if(s&&s.dataset.v!==R.dataset.view){e.preventDefault();setView(s.dataset.v,false);orig.call(t,{behavior:"smooth"})}}},true);
if(mq.matches&&slugFromPath())setView("library",false);
})();
document.addEventListener("click",async e=>{const b=e.target.closest("[data-share]");if(!b)return;const d=adhkar.find(x=>x.id===+b.dataset.share);if(!d)return;e.stopImmediatePropagation();e.preventDefault();
 const url=location.origin+"/d/"+d.id,text=d.text+(d.source?"\n\n— "+d.source:"");
 if(navigator.share){try{await navigator.share({title:"وِرد",text,url})}catch(err){if(err.name!=="AbortError")copyText(text+"\n"+url)}}else copyText(text+"\n"+url)},true);