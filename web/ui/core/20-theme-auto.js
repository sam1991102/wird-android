

(function(){const go=()=>{window.__wirdGo&&__wirdGo("library");setCategory("quran");scrollTo({top:0,behavior:"instant"})};window.__openDuas=go;
 /* المظهر في مكان واحد: «تلقائي» (فاتح من الشروق للمغرب)، «الجهاز» (يتبع إعداد الموبايل)، أو يدوي (فاتح/ليلي/سيبيا من app.js) */
 const R=document.documentElement,mq=matchMedia("(prefers-color-scheme: dark)");const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);v===null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}};
 if(!ls("wird-theme-v2")){ls("wird-theme-mode","auto");ls("wird-dark",null);ls("wird-sepia",null);ls("wird-theme-v2","1")}if(!ls("wird-theme-mode"))ls("wird-theme-mode","auto");
 const mode=()=>ls("wird-theme-mode")||"auto";
 const meta=()=>{const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=R.classList.contains("dark")?"#0b1310":"#0f3d2e"};
 const devDark=()=>typeof window.__sysDark==="boolean"?window.__sysDark:mq.matches;
 const timeDark=()=>{try{const t=prayerDay(0).t,h=__nowH();if(isFinite(t.sunrise)&&isFinite(t.maghrib))return!(h>=t.sunrise&&h<t.maghrib)}catch(e){}return devDark()};
 const apply=()=>{const m=mode();if(m!=="auto"&&m!=="device")return;R.classList.remove("sepia");R.classList.toggle("dark",m==="auto"?timeDark():devDark());meta()};
 apply();__wEvery(60,apply);try{mq.addEventListener("change",apply)}catch(e){mq.addListener&&mq.addListener(apply)}addEventListener("sysdark",apply);document.addEventListener("visibilitychange",()=>{if(!document.hidden)apply()});addEventListener("pageshow",apply);
 /* أزرار «تلقائي» و«الجهاز» جنب أزرار المظهر اليدوية في الإعدادات */
 const OPT=[["auto","تلقائي","تلقائي: فاتح من الشروق للمغرب، وليلي بعد المغرب"],["device","الجهاز","المظهر يتبع إعداد الموبايل (فاتح أو ليلي)"]];
 const paint=s=>{const m=mode(),man=m!=="auto"&&m!=="device";s.querySelectorAll("button").forEach(x=>{const v=x.dataset.v;const want=v==="auto"||v==="device"?String(v===m):(man?null:"false");if(want!==null&&x.getAttribute("aria-checked")!==want)x.setAttribute("aria-checked",want)})};
 const seg=()=>{const s=document.querySelector("#st-look .st-seg");if(!s||s.dataset.tm)return;s.dataset.tm=1;
  let prev=null;OPT.forEach(([v,t,msg])=>{const b=document.createElement("button");b.type="button";b.setAttribute("role","radio");b.dataset.v=v;b.className="st-auto"+(v==="device"?" st-dev":"");b.textContent=t;
   if(prev)prev.after(b);else s.insertBefore(b,s.firstChild);prev=b;
   b.addEventListener("click",e=>{e.stopPropagation();ls("wird-theme-mode",v);ls("wird-dark",null);ls("wird-sepia",null);apply();paint(s);typeof toast==="function"&&toast(msg)})});
  s.addEventListener("click",e=>{if(e.target.closest('[data-seg="theme"]')){ls("wird-theme-mode","manual");setTimeout(()=>paint(s),0)}},true);
  /* app.js بيرسم اختياره اليدوي: نصحّح العلامات بعده لو الوضع تلقائي/الجهاز */
  new MutationObserver(()=>paint(s)).observe(s,{attributes:true,subtree:true,attributeFilter:["aria-checked"]});paint(s)};
 seg();__wOnDom(seg)})();
