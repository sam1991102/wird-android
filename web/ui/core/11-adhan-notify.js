

(()=>{"use strict";
/* v62 — الأذان والإشعارات */
const KEY="BBryBL4-vPUiJfuOZGWBXOEawUBZ6TJfXuEiEyRJ3i-CgfbN7OS_iTfYA_EQgf-EZls4kx4xYiMGbHJe0bYyddU";
const ADHANS={none:{n:"بدون صوت",u:""}};window.__ADHANS=ADHANS;
const PR=["fajr","dhuhr","asr","maghrib","isha"];
const DEF={on:false,pr:{fajr:1,dhuhr:1,asr:1,maghrib:1,isha:1},pre:0,morning:1,evening:1,kahf:1,sleep:0,sound:"none",inapp:1,last:0,sig:""};
const ar=__ar;
const load=()=>{try{const o=Object.assign({},DEF,JSON.parse(localStorage.getItem("wird-push")||"{}"));if(/^(a\d|t\d|e\d|u\d)$/.test(o.sound||""))o.sound="none";return o}catch(e){return {...DEF}}};
const save=s=>{try{localStorage.setItem("wird-push",JSON.stringify(s))}catch(e){}};
let S=load();
const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const standalone=matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
const supported=("serviceWorker"in navigator)&&("PushManager"in window)&&("Notification"in window);
const u8=s=>{s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";const b=atob(s);return Uint8Array.from(b,c=>c.charCodeAt(0))};
const PN=(k,fri)=>k==="dhuhr"&&fri?"الجمعة":(typeof PNAMES!=="undefined"?PNAMES[k]:k);
const fmt=h=>{try{return fmtT(h)}catch(e){const m=Math.round(h*60);return ar(Math.floor(m/60)%24+":"+String(m%60).padStart(2,"0"))}};

/* ---- جدول الأحداث للأيام القادمة ---- */
function buildEvents(days=21){
  const ev=[],now=Date.now();
  for(let k=0;k<days;k++){
    let d;try{d=prayerDay(k)}catch(e){break}
    const {t,L,isFri}=d,base=Date.UTC(L.y,L.m-1,L.d),at=h=>Math.round(base+(h-L.off)*3600e3);
    for(const p of PR){if(!S.pr[p]||!isFinite(t[p]))continue;const name=PN(p,isFri);
      var C=(S.cfg&&S.cfg[p])||{},PRE=C.pre!=null?+C.pre:(+S.pre||0),IQ=+C.iq||0;if(PRE>0)ev.push({t:at(t[p])-PRE*60e3,title:"اقترب وقت "+name,body:"بعد "+ar(PRE)+" دقائق — "+fmt(t[p]),tag:"pre-"+p,url:"/#prayer"});
      ev.push({t:at(t[p]),title:"حان الآن وقت صلاة "+name,body:p==="fajr"?"الصلاة خير من النوم — "+fmt(t[p]):"حيّ على الصلاة — "+fmt(t[p]),tag:"adhan-"+p,url:"/?adhan="+p+"#prayer"});if(IQ>0)ev.push({t:at(t[p])+Math.max(0,IQ-5)*60e3,title:"إقامة صلاة "+name+(IQ>5?" بعد ٥ دقائق":""),body:"الإقامة "+fmt(t[p]+IQ/60)+" — استعدّ للصلاة",tag:"iq-"+p,url:"/#prayer"});}
    if(S.sunrise&&isFinite(t.sunrise))ev.push({t:at(t.sunrise)-15*60e3,title:"الشروق بعد ١٥ دقيقة",body:"أدرك صلاة الفجر قبل خروج وقتها — "+fmt(t.sunrise),tag:"sunrise",url:"/#prayer"});
    if(S.duha&&isFinite(t.sunrise)&&isFinite(t.dhuhr))ev.push({t:at((t.sunrise+t.dhuhr)/2),title:"صلاة الضحى",body:"صلاة الأوّابين، ولو ركعتين",tag:"duha",url:"/#prayer"});
    if(S.lastthird&&isFinite(t.maghrib)&&isFinite(t.fajr)){const ln=(t.fajr+24)-t.maghrib,h3=t.maghrib+ln*2/3;ev.push({t:at(h3),title:"الثلث الأخير من الليل",body:"ينزل ربنا إلى السماء الدنيا: هل من داعٍ فأستجيب له؟",tag:"third",url:"/"})}
    if(S.white&&isFinite(t.isha)){try{const hd=+new Intl.DateTimeFormat("en-u-ca-islamic-umalqura",{day:"numeric"}).format(new Date(base+36*3600e3)).replace(/\D/g,"");if(hd>=13&&hd<=15)ev.push({t:at(t.isha)+60*60e3,title:"غدًا من الأيام البيض",body:"صيام ثلاثة أيام من كل شهر كصيام الدهر — انوِ الصيام",tag:"white",url:"/"})}catch(e){}}
    if(S.morning&&isFinite(t.sunrise))ev.push({t:at(t.sunrise)-35*60e3,title:"أذكار الصباح",body:"ابدأ يومك بذكر الله",tag:"morning",url:"/morning"});
    if(S.evening&&isFinite(t.asr))ev.push({t:at(t.asr)+40*60e3,title:"أذكار المساء",body:"حصّن مساءك بأذكار المساء",tag:"evening",url:"/evening"});
    if(S.sleep&&isFinite(t.isha))ev.push({t:at(t.isha)+150*60e3,title:"أذكار النوم",body:"لا تنم قبل أذكار النوم",tag:"sleep",url:"/sleep"});
    if(S.kahf&&isFri)ev.push({t:base+(10-L.off)*3600e3,title:"سورة الكهف",body:"يوم الجمعة — نور ما بين الجمعتين",tag:"kahf",url:"/#mushaf"});
  }
  try{if(window.__khatmaEvents)ev.push(...window.__khatmaEvents(days))}catch(x){}
  try{if(window.__dhikrEvents)ev.push(...window.__dhikrEvents(days))}catch(x){}
  try{if(window.__hijriEvents)ev.push(...window.__hijriEvents(days))}catch(x){}
  try{if(window.__alarmEvents)ev.push(...window.__alarmEvents(days))}catch(x){}
  const out=ev.filter(e=>e.t>now+30e3).sort((a,b)=>a.t-b.t);
  if(out.length){const last=out[out.length-1].t;out.push({t:last+6*3600e3,title:"وِرد",body:"افتح وِرد لتحديث مواقيت التنبيهات",tag:"refresh",url:"/"})}
  return out.slice(0,380);
}
const sigNow=()=>JSON.stringify([S.pr,S.pre,S.morning,S.evening,S.kahf,S.sleep,typeof P!=="undefined"?[P.lat,P.lng,P.method,P.asr,P.tz]:0]);

async function getSub(create){
  const reg=await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();
  if(!sub&&create)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:u8(KEY)});
  return sub;
}
async function sync(force){
  if(!S.on||!supported||Notification.permission!=="granted")return;
  const sig=sigNow();if(!force&&S.sig===sig&&Date.now()-S.last<12*3600e3)return;
  const sub=await getSub(true);if(!sub)return;
  const r=await fetch("/api/push/sync",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({sub:sub.toJSON(),events:buildEvents()})});
  if(r.ok){S.last=Date.now();S.sig=sig;save(S)}
  return r.ok;
}
async function enable(){
  if(!supported)throw new Error(isIOS&&!standalone?"ios":"unsupported");
  const perm=await Notification.requestPermission();
  if(perm!=="granted")throw new Error("denied");
  S.on=true;save(S);await sync(true);
}
async function disable(){
  S.on=false;save(S);
  try{const sub=await getSub(false);if(sub){await fetch("/api/push/remove",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({endpoint:sub.endpoint})});await sub.unsubscribe()}}catch(e){}
}
window.__wirdPush={sync,enable,disable,buildEvents,state:()=>S};

/* ---- الأذان داخل التطبيق ---- */
let audio=null,adhanBox=null;
let lockY=0;function lockScroll(){if(document.documentElement.classList.contains("adhan-open"))return;lockY=scrollY;const b=document.body.style;b.position="fixed";b.top=-lockY+"px";b.left="0";b.right="0";b.width="100%";document.documentElement.classList.add("adhan-open")}
function unlockScroll(){if(!document.documentElement.classList.contains("adhan-open"))return;const b=document.body.style;b.position=b.top=b.left=b.right=b.width="";document.documentElement.classList.remove("adhan-open");scrollTo(0,lockY)}
function stopAdhan(){if(audio){audio.pause();audio.currentTime=0}adhanBox&&adhanBox.remove();adhanBox=null}
function showAdhan(p,autoplay){
  stopAdhan();const fri=(()=>{try{return prayerDay(0).isFri}catch(e){return false}})();
  adhanBox=document.createElement("div");adhanBox.className="adhan-ov";adhanBox.setAttribute("role","dialog");adhanBox.setAttribute("aria-label","الأذان");
  adhanBox.innerHTML=`<div class="adhan-card"><p class="adhan-k">حان الآن وقت</p><h2>صلاة ${PN(p,fri)}</h2><p class="adhan-sub">${p==="fajr"?"الصلاة خير من النوم":"حيّ على الصلاة، حيّ على الفلاح"}</p><div class="adhan-act"><button type="button" class="btn btn-primary" data-ad="play">تشغيل الأذان</button><button type="button" class="btn btn-ghost" data-ad="x" aria-label="إغلاق">إغلاق</button></div><p class="adhan-dua">بعد الأذان: اللهم ربّ هذه الدعوة التامة، والصلاة القائمة، آتِ محمدًا الوسيلة والفضيلة، وابعثه مقامًا محمودًا الذي وعدته</p></div>`;
  document.body.appendChild(adhanBox);adhanBox.addEventListener("touchmove",e=>{if(!e.target.closest(".adhan-card"))e.preventDefault()},{passive:false});
  const pb=adhanBox.querySelector('[data-ad="play"]');
  const SND=(S.cfg&&S.cfg[p]&&S.cfg[p].sound)||S.sound;const src=(window.__adhanFor&&__adhanFor(p,SND))||(ADHANS[SND]||ADHANS.none).u;
  if(!src)pb.hidden=true;
  const play=()=>{if(!src)return;if(!audio)audio=new Audio();if(audio.src!==src)audio.src=src;audio.play().then(()=>{pb.textContent="إيقاف الأذان";pb.dataset.ad="stop"}).catch(()=>{pb.textContent="تشغيل الأذان";pb.dataset.ad="play"})};
  adhanBox.addEventListener("click",e=>{const b=e.target.closest("[data-ad]");if(!b)return;const a=b.dataset.ad;if(a==="x")stopAdhan();else if(a==="stop"){audio&&audio.pause();b.textContent="تشغيل الأذان";b.dataset.ad="play"}else play()});
  if(autoplay)play();
}
window.__wirdAdhan=showAdhan;
let lastFired="";
function tick(){
  if(!S.inapp||document.hidden)return;let d;try{d=prayerDay(0)}catch(e){return}
  const {t,L}=d;for(const p of PR){if(!S.pr[p])continue;const diff=(L.h-t[p])*60;const key=L.y+"-"+L.m+"-"+L.d+"-"+p;
    if(diff>=0&&diff<1.2&&lastFired!==key){lastFired=key;showAdhan(p,true);break}}
}
setInterval(tick,15000);
/* فتح من إشعار الأذان */
const qp=new URLSearchParams(location.search).get("adhan");
if(qp&&PR.includes(qp)){setTimeout(()=>showAdhan(qp,false),600);try{history.replaceState(history.state,"",location.pathname+location.hash)}catch(e){}}
navigator.serviceWorker&&navigator.serviceWorker.addEventListener("message",e=>{if(e.data&&e.data.type==="adhan"&&PR.includes(e.data.p))showAdhan(e.data.p,false)});

/* ---- واجهة الإعدادات ---- */
const html=()=>`<section class="st-sec" id="st-adhan"><h2>الأذان والتنبيهات</h2>
<div class="az-status" id="azStatus"></div>
<div class="st-row"><div class="st-l"><strong>تنبيهات الصلاة</strong><small>تصلك حتى والتطبيق مغلق</small></div><div class="st-c"><button type="button" class="btn btn-primary btn-sm" id="azMain"></button></div></div>
<div class="az-more" id="azMore">
<div class="st-row"><div class="st-l"><strong>الصلوات</strong></div><div class="st-c az-chips">${PR.map(p=>`<label class="az-chip"><input type="checkbox" data-pr="${p}" ${S.pr[p]?"checked":""}><span>${PN(p,false)}</span></label>`).join("")}</div></div>
<div class="st-row"><div class="st-l"><strong>تنبيه قبل الأذان</strong></div><div class="st-c"><select id="azPre">${[0,5,10,15,20,30].map(m=>`<option value="${m}" ${+S.pre===m?"selected":""}>${m?ar(m)+" دقيقة":"بدون"}</option>`).join("")}</select></div></div>
<div class="st-row"><div class="st-l"><strong>تذكير بالأذكار</strong></div><div class="st-c az-chips">
<label class="az-chip"><input type="checkbox" data-o="morning" ${S.morning?"checked":""}><span>الصباح</span></label>
<label class="az-chip"><input type="checkbox" data-o="evening" ${S.evening?"checked":""}><span>المساء</span></label>
<label class="az-chip"><input type="checkbox" data-o="sleep" ${S.sleep?"checked":""}><span>النوم</span></label>
<label class="az-chip"><input type="checkbox" data-o="kahf" ${S.kahf?"checked":""}><span>الكهف (الجمعة)</span></label></div></div>
<div class="st-row"><div class="st-l"><strong>صوت الأذان</strong><small>يُشغَّل عند دخول الوقت والتطبيق مفتوح، أو عند فتح الإشعار</small></div><div class="st-c az-snd"><select id="azSound">${Object.entries(ADHANS).map(([k,v])=>`<option value="${k}" ${S.sound===k?"selected":""}>${v.n}</option>`).join("")}</select><button type="button" class="btn btn-ghost btn-sm" id="azPrev">استماع</button></div></div>
<div class="st-row"><div class="st-l"><strong>الأذان داخل التطبيق</strong></div><div class="st-c"><label class="az-chip"><input type="checkbox" data-o="inapp" ${S.inapp?"checked":""}><span>شاشة الأذان عند دخول الوقت</span></label></div></div>
<div class="st-row"><div class="st-l"><strong>تجربة</strong></div><div class="st-c"><button type="button" class="btn btn-ghost btn-sm" id="azTest">إرسال تنبيه تجريبي</button></div></div>
<p class="az-note">صوت الإشعار نفسه هو صوت تنبيهات جهازك؛ أما الأذان الكامل فيُشغَّل داخل وِرد. </p>
</div></section>`;
function paint(sec){
  const st=sec.querySelector("#azStatus"),main=sec.querySelector("#azMain"),more=sec.querySelector("#azMore");
  const perm=supported?Notification.permission:"x";
  let msg="",cls="";
  if(!supported){msg=isIOS&&!standalone?"على الآيفون: ثبّت وِرد على الشاشة الرئيسية أولًا (مشاركة ← إضافة إلى الشاشة الرئيسية)، ثم افتحه من الأيقونة وفعّل التنبيهات.":"متصفحك لا يدعم الإشعارات. جرّب Chrome أو ثبّت التطبيق.";cls="warn";main.hidden=true}
  else if(perm==="denied"){msg="الإشعارات محظورة لهذا الموقع. فعّلها من إعدادات المتصفح/الجهاز ثم عُد هنا.";cls="warn";main.hidden=true}
  else if(S.on&&perm==="granted"){msg="التنبيهات مفعّلة ✓"+(S.last?" — آخر تحديث للمواقيت: "+new Date(S.last).toLocaleDateString("ar-EG"):"");cls="ok";main.hidden=false;main.textContent="إيقاف التنبيهات";main.className="btn btn-ghost btn-sm"}
  else{msg="فعّل التنبيهات ليصلك الأذان وتذكير الأذكار في وقتها.";main.hidden=false;main.textContent="تفعيل التنبيهات";main.className="btn btn-primary btn-sm"}
  st.textContent=msg;st.className="az-status "+cls;
  more.classList.toggle("dim",!(S.on&&perm==="granted"));
  sec.querySelector("#azTest").disabled=!(S.on&&perm==="granted");
}
function inject(){
  const ov=document.querySelector(".st");if(!ov||ov.querySelector("#st-adhan"))return;
  const body=ov.querySelector(".st-body");if(!body)return;
  body.insertAdjacentHTML("afterbegin",html());
  const tabs=ov.querySelector(".st-tabs");tabs&&tabs.insertAdjacentHTML("afterbegin",'<a href="#st-adhan">الأذان</a>');
  const sec=body.querySelector("#st-adhan");paint(sec);
  const changed=()=>{save(S);if(S.on)sync(true).catch(()=>{})};
  sec.addEventListener("change",e=>{const el=e.target;
    if(el.dataset.pr){S.pr[el.dataset.pr]=el.checked?1:0;changed()}
    else if(el.dataset.o){S[el.dataset.o]=el.checked?1:0;changed()}
    else if(el.id==="azPre"){S.pre=+el.value;changed()}
    else if(el.id==="azSound"){S.sound=el.value;save(S)}});
  sec.addEventListener("click",async e=>{const b=e.target.closest("button");if(!b)return;
    if(b.id==="azMain"){b.disabled=true;try{if(S.on&&Notification.permission==="granted"){await disable();toast("أُوقفت التنبيهات")}else{await enable();toast("تم تفعيل التنبيهات")}}catch(err){toast(err.message==="denied"?"لم يُسمح بالإشعارات":err.message==="ios"?"ثبّت وِرد على الشاشة الرئيسية أولًا":"تعذّر التفعيل، حاول مجددًا")}b.disabled=false;paint(sec)}
    if(b.id==="azTest"){b.disabled=true;try{await sync(true);const sub=await getSub(false);const r=await fetch("/api/push/test",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({endpoint:sub&&sub.endpoint})}).then(r=>r.json());toast(r.ok?"أُرسل التنبيه — سيصلك خلال ثوانٍ":"تعذّر الإرسال")}catch(err){toast("تعذّر الإرسال")}b.disabled=false}
    if(b.id==="azPrev"){const k=(document.getElementById("azSound")||{}).value||S.sound,src=(ADHANS[k]||{}).u;if(!src){toast("اختر صوتًا أولًا");return}if(!window.__pv){const p=window.__pv=new Audio();p.preload="auto";p.addEventListener("playing",()=>{const x=document.getElementById("azPrev");if(x){x.textContent="إيقاف";x.disabled=false}});p.addEventListener("waiting",()=>{const x=document.getElementById("azPrev");if(x&&!p.paused)x.textContent="جارٍ التحميل…"});const rs=()=>{const x=document.getElementById("azPrev");if(x){x.textContent="استماع";x.disabled=false}};p.addEventListener("pause",rs);p.addEventListener("ended",rs);p.addEventListener("error",()=>{rs();toast("تعذّر التشغيل، تأكد من الاتصال بالإنترنت")})}const p=window.__pv;if(!p.paused&&p.dataset.k===k){p.pause();return}p.pause();p.dataset.k=k;p.src=src;b.textContent="جارٍ التحميل…";p.play().catch(e=>{if(e&&e.name!=="AbortError"){b.textContent="استماع";toast("تعذّر التشغيل")}})}
  });
}
new MutationObserver(()=>inject()).observe(document.body,{childList:true,subtree:false});
const o=window.__openSettings;if(o)window.__openSettings=function(){const r=o.apply(this,arguments);setTimeout(inject,0);return r};

/* مزامنة تلقائية عند الفتح وتغيّر المدينة/الطريقة */
const kick=()=>{sync(false).catch(()=>{})};
setTimeout(kick,4000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)kick()});
document.addEventListener("change",e=>{if(e.target&&/city|method|asr/i.test(e.target.id||""))setTimeout(()=>sync(true).catch(()=>{}),800)});
})();

(()=>{const R=document.documentElement;new MutationObserver(()=>{if(R.dataset.view!=="tasbih"){const b=document.getElementById("fullBtn");if(b&&b.getAttribute("aria-pressed")==="true")b.click()}}).observe(R,{attributes:true,attributeFilter:["data-view"]})})();

(()=>{"use strict";
const $=s=>document.querySelector(s);
const openAdhanSettings=()=>{window.__openSettingsPage&&__openSettingsPage("st-adhan")};
window.__openAdhanSettings=openAdhanSettings;
/* بطاقة التنبيهات في تبويب المواقيت */
const pc=$("#prayer .prayer-card"),acts=$("#prayer .pl-actions");
if(pc&&!$(".ntf-card")){const c=document.createElement("div");c.className="ntf-card";
 c.innerHTML='<span class="ntf-ic" aria-hidden="true">'+(()=>{try{return ic("clock")}catch(e){return""}})()+'</span><div class="ntf-tx"><strong>الأذان والتنبيهات</strong><small id="ntfState"></small></div><button type="button" class="btn btn-primary btn-sm" id="ntfBtn"></button>';
 (acts||pc.lastElementChild).before(c);
 const paint=()=>{const S=window.__wirdPush?__wirdPush.state():{};const ok=S.on&&("Notification"in window)&&Notification.permission==="granted";
  $("#ntfState").textContent=ok?"مفعّلة — يصلك الأذان وتذكير الأذكار في وقتها":"فعّلها ليصلك الأذان حتى والتطبيق مغلق";
  const b=$("#ntfBtn");b.textContent=ok?"الإعدادات":"تفعيل";b.className=ok?"btn btn-ghost btn-sm":"btn btn-primary btn-sm";c.classList.toggle("on",!!ok)};
 paint();document.addEventListener("visibilitychange",paint);
 c.querySelector("#ntfBtn").addEventListener("click",async()=>{const S=window.__wirdPush&&__wirdPush.state();const ok=S&&S.on&&Notification.permission==="granted";
  if(ok||!window.__wirdPush){openAdhanSettings();return}
  try{await __wirdPush.enable();toast("تم تفعيل التنبيهات")}catch(e){if(e.message==="ios"||e.message==="unsupported"||e.message==="denied")openAdhanSettings();else toast("تعذّر التفعيل")}paint()});
 new MutationObserver(paint).observe(document.documentElement,{attributes:true,attributeFilter:["data-view"]});}
/* زر "ذكّرني يوميًا" في الرئيسية يفتح التنبيهات الحديثة */
const rb=$("#remind .remind-open");
if(rb){rb.childNodes.forEach(n=>{if(n.nodeType===3&&/ذكّرني/.test(n.textContent))n.textContent=" تنبيهات الأذان والأذكار"});
 rb.addEventListener("click",e=>{e.stopImmediatePropagation();e.preventDefault();openAdhanSettings()},true);}
/* روابط داخلية (#library ...) على الكمبيوتر تفتح التبويب الصحيح */
document.addEventListener("click",e=>{const a=e.target.closest('a[href^="#"]');if(!a||a.closest(".nav5"))return;const id=a.getAttribute("href").slice(1);const t=id&&document.getElementById(id);const s=t&&t.closest("main>section[data-v]");if(s&&s.dataset.v!==document.documentElement.dataset.view&&window.__wirdGo){e.preventDefault();__wirdGo(s.dataset.v)}},true);
})();