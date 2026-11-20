

(function(){
 const T=m=>typeof toast==="function"&&toast(m);const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}};
 const sa=matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
 const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
 const sheet=(html)=>{const s=document.createElement("div");s.className="wd-sheet pm-sheet";s.setAttribute("role","dialog");s.setAttribute("aria-modal","true");s.innerHTML='<div class="wd-card"><button type="button" class="wd-x" data-x aria-label="إغلاق">×</button>'+html+'</div>';s.addEventListener("click",e=>{if(e.target===s||e.target.closest("[data-x]"))s.remove()});document.body.appendChild(s);return s};
 /* ===== الصلاحيات بعد التثبيت ===== */
 const perms=()=>{if(document.querySelector(".pm-perm"))return;
  const nOK=()=>"Notification" in window&&Notification.permission==="granted";
  const s=sheet('<div class="pm-perm"><div class="wd-word" style="font-size:1.6rem">أهلًا بك في وِرد</div><p class="wd-meta" style="margin-bottom:1rem">فعّل هذه الصلاحيات ليعمل التطبيق بكامل مزاياه. يمكنك تغييرها لاحقًا من الإعدادات.</p>'+
   '<div class="pm-row"><div><b>الإشعارات</b><small>تنبيه الأذان والأذكار وورد الختمة</small></div><button type="button" class="btn btn-sm" data-p="n">تفعيل</button></div>'+
   '<div class="pm-row"><div><b>الموقع</b><small>لحساب مواقيت الصلاة بدقة لمدينتك</small></div><button type="button" class="btn btn-sm" data-p="g">السماح</button></div>'+
   '<div style="text-align:center;margin-top:1.1rem"><button type="button" class="btn btn-ghost" data-x>تم</button></div></div>');
  const mark=(b,ok,t)=>{b.textContent=ok?"✓ تم":t;b.disabled=!!ok;b.classList.toggle("btn-ghost",!!ok)};
  if(!("Notification" in window)||!window.__wirdPush)s.querySelector('[data-p="n"]').closest(".pm-row").hidden=true;else if(nOK())mark(s.querySelector('[data-p="n"]'),1);
  if(!navigator.geolocation)s.querySelector('[data-p="g"]').closest(".pm-row").hidden=true;
  s.addEventListener("click",async e=>{const b=e.target.closest("[data-p]");if(!b)return;b.disabled=true;
   if(b.dataset.p==="n"){try{await __wirdPush.enable();mark(b,1);T("تم تفعيل الإشعارات")}catch(x){mark(b,0,"تفعيل");T(x&&x.message==="denied"?"تم رفض الإذن، يمكنك تفعيله من إعدادات الجهاز":"الإشعارات غير مدعومة على هذا الجهاز")}}
   else __wirdGeo(false).then(ok=>mark(b,ok,"السماح"))});
  ls("wird-perm","1")};
 window.__wirdPerms=perms;
 window.addEventListener("appinstalled",()=>ls("wird-installed","1"));
 if(sa&&!ls("wird-perm"))setTimeout(()=>{if(!document.querySelector("#onb:not([hidden])"))perms();else{const o=document.querySelector("#onb");new MutationObserver((r,mo)=>{if(o.hidden){mo.disconnect();perms()}}).observe(o,{attributes:true,attributeFilter:["hidden"]})}},1800);
 /* ===== دعوة التثبيت (آيفون وأندرويد) ===== */
 if(sa)return;let bip=null;window.addEventListener("beforeinstallprompt",e=>{bip=e});
 const snooze=+(ls("wird-inst-snz")||0);const visits=(+(ls("wird-visits")||0))+1;ls("wird-visits",String(visits));
 const iosGuide=()=>{sheet('<div class="wd-word" style="font-size:1.5rem">ثبّت وِرد على الآيفون</div><ol class="pm-ol"><li>اضغط زر <b>المشاركة</b> <svg viewBox="0 0 24 24" width="20" height="20" style="vertical-align:-4px" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg> في أسفل سفاري.</li><li>اختر <b>«إضافة إلى الشاشة الرئيسية»</b>.</li><li>اضغط <b>«إضافة»</b>، ثم افتح وِرد من أيقونته.</li></ol><p class="wd-meta">بعد التثبيت ستعمل الإشعارات وتنبيه الأذان، ويفتح كتطبيق مستقل.</p>'+(/crios|fxios|edgios/i.test(navigator.userAgent)?'<p class="wd-meta" style="color:var(--gold)">ملاحظة: افتح الموقع من متصفح سفاري أولًا.</p>':'')+'<div style="text-align:center;margin-top:1rem"><button type="button" class="btn" data-x>فهمت</button></div>')};
 window.__wirdInstall=async()=>{if(bip){bip.prompt();const r=await bip.userChoice.catch(()=>({}));bip=null;document.querySelector(".inst-bar")&&document.querySelector(".inst-bar").remove();if(r&&r.outcome==="accepted")T("جارٍ التثبيت…")}else if(ios)iosGuide();else sheet('<div class="wd-word" style="font-size:1.4rem">ثبّت وِرد</div><p class="wd-meta">من قائمة المتصفح ⋮ اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</p><div style="text-align:center;margin-top:1rem"><button type="button" class="btn" data-x>فهمت</button></div>')};
 const bar=()=>{if(document.querySelector(".inst-bar")||document.querySelector(".upd-bar"))return;const b=document.createElement("div");b.className="upd-bar inst-bar";b.innerHTML='<img src="/icon-192.png" alt="" width="36" height="36" style="border-radius:9px"><span>ثبّت وِرد على شاشتك ليصلك تنبيه الأذان والأذكار</span><button type="button" class="btn btn-sm">تثبيت</button><button type="button" class="upd-x" aria-label="لاحقًا">×</button>';b.querySelector(".btn").onclick=()=>{b.remove();__wirdInstall()};b.querySelector(".upd-x").onclick=()=>{b.remove();ls("wird-inst-snz",String(Date.now()+7*864e5))};document.body.appendChild(b)};
 if(Date.now()>snooze&&(visits>=2||ios))setTimeout(()=>{if(ios||bip)bar()},ios?12000:6000);
 document.addEventListener("click",e=>{const ib=e.target.closest("#installBtn");if(ib&&ios&&!bip){e.stopImmediatePropagation();e.preventDefault();iosGuide()}},true);
})();

(function(){
 if(!("serviceWorker" in navigator))return;const T=m=>typeof toast==="function"&&toast(m);const ar=n=>__ar(String(n).replace(/\./g,"٫"));const lbl=v=>ar((1+Math.floor(Math.max(0,v-131)/10))+"."+(Math.max(0,v-131)%10)).replace("٢٫١٠","٣٫٠");
 const localV=()=>caches.keys().then(k=>Math.max(0,...k.map(x=>+((x.match(/^wird-v(\d+)$/)||[])[1]||0)))).catch(()=>0);
 const serverV=()=>fetch("/sw.js?_="+Date.now(),{cache:"no-store"}).then(r=>r.text()).then(t=>+((t.match(/wird-v(\d+)/)||[])[1]||0)).catch(()=>0);
 const hard=async()=>{T("جارٍ تنزيل التحديث…");try{const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()));const ks=await caches.keys();await Promise.all(ks.filter(k=>!/mushaf/.test(k)).map(k=>caches.delete(k)))}catch(e){}const u=new URL(location.href);u.searchParams.set("u",Date.now());location.replace(u.href)};
 window.__wirdHardUpdate=hard;
 const banner=()=>{if(document.querySelector(".upd-bar:not(.inst-bar)"))return;const b=document.createElement("div");b.className="upd-bar";b.setAttribute("role","status");b.innerHTML='<span>يوجد تحديث جديد للتطبيق</span><button type="button" class="btn btn-sm">تحديث الآن</button><button type="button" class="upd-x" aria-label="لاحقًا">×</button>';b.querySelector(".btn").onclick=hard;b.querySelector(".upd-x").onclick=()=>b.remove();document.querySelector(".inst-bar")&&document.querySelector(".inst-bar").remove();document.body.appendChild(b)};
 window.__wirdUpd=banner;
 let busy=0;const check=async()=>{if(busy)return;busy=1;try{const[s,l]=await Promise.all([serverV(),localV()]);if(s&&l&&s>l)banner()}finally{busy=0}};
 /* نظّف رابط ?u= بعد التحديث */
 try{const u=new URL(location.href);if(u.searchParams.has("u")){u.searchParams.delete("u");history.replaceState(history.state,"",u.pathname+u.search+u.hash);setTimeout(()=>T("تم تحديث التطبيق"),1200)}}catch(e){}
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")check()});setTimeout(check,4000);__wEvery(1200,check);
 /* زر الإعدادات: فحص حقيقي من الخادم */
 document.addEventListener("click",async e=>{const b=e.target.closest("#updChk");if(!b)return;e.stopImmediatePropagation();e.preventDefault();const s=b.closest(".st-upd")&&b.closest(".st-upd").querySelector(".upd-s");b.disabled=true;b.classList.add("is-busy");s&&(s.textContent="جارٍ التحقق…");
  const[sv,lv]=await Promise.all([serverV(),localV()]);b.disabled=false;b.classList.remove("is-busy");
  if(!sv){s&&(s.textContent="تعذّر التحقق، تأكد من الاتصال بالإنترنت");return}
  if(sv>lv||!lv){s&&(s.textContent="فيه إصدار جديد ("+lbl(sv)+")، اضغط للتحديث");const k=b.querySelector(".upd-k");if(k){k.textContent="حدّث";b.classList.add("is-ready")}else b.textContent="تحديث الآن";b.onclick=null;b.addEventListener("click",ev=>{ev.stopImmediatePropagation();hard()},{once:true,capture:true});banner()}
  else{s&&(s.textContent="أنت على أحدث إصدار ("+lbl(lv)+")");T("التطبيق محدّث لآخر إصدار")}},true);
})();