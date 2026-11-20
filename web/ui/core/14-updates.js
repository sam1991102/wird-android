

(function(){
 if(!("serviceWorker" in navigator))return;
 window.__wirdUpd=function(){if(document.querySelector(".upd-bar"))return;const b=document.createElement("div");b.className="upd-bar";b.setAttribute("role","status");b.innerHTML='<span>يوجد تحديث جديد للتطبيق</span><button type="button" class="btn btn-sm">تحديث الآن</button><button type="button" class="upd-x" aria-label="لاحقًا">×</button>';b.querySelector(".btn").onclick=()=>location.reload();b.querySelector(".upd-x").onclick=()=>b.remove();document.body.appendChild(b)};
 const chk=()=>navigator.serviceWorker.getRegistration().then(r=>{if(!r)return;r.update().catch(()=>{});if(r.waiting&&navigator.serviceWorker.controller)r.waiting.postMessage&&r.waiting.postMessage("skip")}).catch(()=>{});
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")chk()});
 window.addEventListener("focus",chk);__wEvery(1800,chk);setTimeout(chk,8000);
 /* حديث اليوم */
 const ar=__ar;
 const now=new Date(),doy=Math.floor((now-new Date(now.getFullYear(),0,0))/864e5),n=(doy%42)+1;
 const mk=()=>{const ay=document.querySelector(".ayah-day");if(!ay||document.querySelector(".hadith-day"))return!!ay;
  const h=document.createElement("section");h.className="container section ayah-day hadith-day";h.dataset.v="home";
  h.innerHTML='<div class="dy-card"><div class="dy-head"><span class="dy-k">حديث اليوم</span><span class="dy-ref">الأربعون النووية — الحديث '+ar(n)+'</span></div><p class="dy-text hd-text" id="hdText">…</p><div class="dy-act"><button type="button" class="btn btn-ghost btn-sm" data-hd="more" hidden>اقرأ كاملًا</button><button type="button" class="btn btn-ghost btn-sm" data-hd="copy">نسخ</button><button type="button" class="btn btn-ghost btn-sm" data-hd="share">مشاركة</button></div></div>';
  ay.after(h);let full="";const key="wird-hd-"+n;
  const show=t=>{full=t.replace(/<br\s*\/?>/gi,"\n").replace(/<[^>]+>/g,"").replace(/\n\s*(\[[^\]\n]*\]\s*[،,]?\s*)+$/,"").replace(/\n{2,}/g,"\n").trim();const el=h.querySelector("#hdText"),mb=h.querySelector('[data-hd="more"]');if(full.length>320){el.textContent=full.slice(0,300).replace(/\s\S*$/,"")+"…";mb.hidden=false}else el.textContent=full};
  let c=null;try{c=localStorage.getItem(key)}catch(e){}
  if(c)show(c);else fetch("https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-nawawi/"+n+".json").then(r=>r.json()).then(j=>{const t=(j.hadiths&&j.hadiths[0]&&j.hadiths[0].text)||"";if(!t)throw 0;try{localStorage.setItem(key,t)}catch(e){}show(t)}).catch(()=>{h.hidden=true});
  h.addEventListener("click",e=>{const b=e.target.closest("[data-hd]");if(!b||!full)return;const msg=full+"\n[الأربعون النووية: "+ar(n)+"]";
   if(b.dataset.hd==="more"){h.querySelector("#hdText").textContent=full;b.hidden=true}
   else if(b.dataset.hd==="copy"){typeof copyText==="function"?copyText(msg):navigator.clipboard&&navigator.clipboard.writeText(msg);typeof toast==="function"&&toast("تم النسخ")}
   else{if(navigator.share)navigator.share({text:msg+"\n"+location.origin}).catch(()=>{});else{navigator.clipboard&&navigator.clipboard.writeText(msg);typeof toast==="function"&&toast("تم النسخ")}}});
  return true};
 if(!mk())__wWait(mk,()=>{})
})();

(function(){
 if(!("serviceWorker" in navigator))return;const ar=n=>__ar(String(n).replace(/\./g,"٫"));
 const ver=()=>caches.keys().then(k=>{const v=k.map(x=>(x.match(/^wird-v(\d+)$/)||[])[1]).filter(Boolean).map(Number);return v.length?Math.max(...v):0}).catch(()=>0);
 const ready=r=>new Promise(res=>{const w=r.installing||r.waiting;if(!w)return res(false);if(w.state==="installed"||w.state==="activated")return res(true);w.addEventListener("statechange",()=>{if(w.state==="installed"||w.state==="activated")res(true);if(w.state==="redundant")res(false)});setTimeout(()=>res(!!r.waiting),20000)});
 navigator.serviceWorker.getRegistration().then(r=>{if(r&&r.waiting&&navigator.serviceWorker.controller&&window.__wirdUpd)__wirdUpd()});
 const add=()=>{const ab=document.querySelector(".st .sh-hub");if(!ab||ab.querySelector(".st-upd"))return;
  /* «تحديث التطبيق» صف زي باقي صفوف الإعدادات (أيقونة + عنوان + حالة)، في آخر «البيانات والتطبيق» */
  const lists=[...ab.querySelectorAll(".sh-g")];const g=lists.find(x=>/البيانات/.test((x.querySelector("h2")||{}).textContent||""))||lists[lists.length-1];if(!g)return;
  const row=document.createElement("button");row.type="button";row.className="sh-row st-upd";row.id="updChk";
  row.innerHTML='<span class="nt-ic" style="--c:#3fa7d6"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/></svg></span><span class="sh-tx"><b>تحديث التطبيق</b><small class="upd-s">اضغط للتحقق من وجود إصدار أحدث</small></span><span class="sh-ch upd-k" aria-hidden="true">‹</span>';
  g.querySelector(".sh-list").appendChild(row);
  const vp=ab.querySelector(".sh-ver");
  const VT=v=>"الإصدار "+ar((1+Math.floor(Math.max(0,v-131)/10))+"."+(Math.max(0,v-131)%10));
  ver().then(v=>{if(!v)return;const t=VT(v);if(vp)vp.textContent=t;document.querySelectorAll("#st-about .st-ver").forEach(x=>x.textContent=t)});
  /* الضغط بيتعامل معاه 17-perms-install (فحص الإصدار من الخادم) */};
 add();__wOnDom(add);
})();