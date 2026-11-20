
(()=>{"use strict";
const card=document.querySelector(".prayer-card");if(!card)return;card.classList.add("pc2");
const head=card.querySelector(".prayer-head"),list=document.getElementById("prayerList");
const IC={fajr:"M3 18h18M6 18a6 6 0 0 1 12 0M12 6V3M4.9 9.5 3.5 8M19.1 9.5 20.5 8",sunrise:"M3 18h18M7 18a5 5 0 0 1 10 0M12 9V4M9.5 6.5 12 4l2.5 2.5",dhuhr:"M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",asr:"M12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 4v2M5 7l1.4 1.4M19 7l-1.4 1.4M3 21h18",maghrib:"M3 18h18M7 18a5 5 0 0 1 10 0M12 4v5M9.5 6.5 12 9l2.5-2.5",isha:"M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"};
const svg=d=>'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="'+d+'"/></svg>';
const extra=document.createElement("div");extra.className="ph-extra";extra.innerHTML='<div class="ph-bar" role="progressbar" aria-label="الوقت المنقضي حتى الصلاة القادمة" aria-valuemin="0" aria-valuemax="100"><span></span></div><p class="ph-now"></p><p class="ph-date"></p>';
head.querySelector("div").append(extra);
const eb=head.querySelector(".eyebrow");if(eb)eb.textContent="الصلاة القادمة";
const ORDER=["fajr","sunrise","dhuhr","asr","maghrib","isha"],PR=["fajr","dhuhr","asr","maghrib","isha"];
const hm=x=>{const m=Math.max(0,Math.round(x*60));const h=Math.floor(m/60),mm=m%60;return(h?h+" س ":"")+mm+" د"};
function state(){if(typeof prayerCache==="undefined"||!prayerCache)return null;const pc=prayerCache;const t=pc.t,now=localParts(P.tz,new Date).h;
 let cur=null;for(const k of ORDER)if(t[k]<=now)cur=k;let next=PR.find(k=>t[k]>now),nt=next?t[next]:t.fajr+24;if(!next)next="fajr";
 let prevT=cur?t[cur]:t.isha-24;if(!cur)cur="isha";return{t,now,cur,next,nt,prevT}}
let tick=function(){const s=state();if(!s)return;const f=Math.min(1,Math.max(0,(s.now-s.prevT)/(s.nt-s.prevT)));
 const bar=extra.querySelector(".ph-bar");bar.firstChild.style.width=(f*100).toFixed(1)+"%";bar.setAttribute("aria-valuenow",Math.round(f*100));
 const curName=s.cur==="sunrise"?"وقت الضحى":"وقت "+PNAMES[s.cur];extra.querySelector(".ph-now").textContent=curName+" · مضى "+hm(s.now-s.prevT);
 list.querySelectorAll("li").forEach((li,i)=>{const k=ORDER[i];li.classList.toggle("cur",k===s.cur&&s.cur!=="sunrise")})};
function dates(){let h="",g="";try{h=new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura-nu-latn",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date)}catch(e){}
 try{g=new Intl.DateTimeFormat("ar-EG-u-nu-latn",{day:"numeric",month:"long",year:"numeric"}).format(new Date)}catch(e){}extra.querySelector(".ph-date").textContent=[h,g].filter(Boolean).join(" · ")}
function decorate(){list.querySelectorAll("li").forEach((li,i)=>{const k=ORDER[i];if(!k||li.querySelector(".pl-ic"))return;
 const ic=document.createElement("span");ic.className="pl-ic";ic.innerHTML=svg(IC[k]);li.prepend(ic);
 const st=document.createElement("em");st.className="pl-st";li.append(st)});
 list.querySelectorAll("li").forEach(li=>{const st=li.querySelector(".pl-st");if(!st)return;st.textContent=li.classList.contains("next")?"القادمة":li.classList.contains("cur")?"الآن":li.classList.contains("past")?"✓":""});tick()}
new MutationObserver(decorate).observe(list,{childList:true});
const act=document.createElement("div");act.className="pl-actions";
act.innerHTML='<button type="button" class="btn btn-ghost" data-go="prayer">'+svg("M4 6h16M4 12h16M4 18h10")+' أذكار بعد الصلاة</button><button type="button" class="btn btn-ghost" data-go="adhan">'+svg("M12 3v3M8 21h8M12 6c-3 0-5 2.5-5 6v5h10v-5c0-3.5-2-6-5-6z")+' أذكار الأذان</button><button type="button" class="btn btn-ghost" id="qiblaBtn" aria-expanded="false">'+svg("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6l3 7-3-1.5L9 13z")+' اتجاه القبلة</button>';
list.after(act);
act.addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(b){setCategory(b.dataset.go);document.getElementById("library").scrollIntoView({behavior:"smooth"})}});
const qb=document.createElement("div");qb.className="qibla";qb.hidden=true;
qb.innerHTML='<div class="q-dial"><div class="q-rose"><span class="q-n">ش</span><div class="q-needle" aria-hidden="true"><svg viewBox="0 0 100 100"><line x1="50" y1="54" x2="50" y2="22" stroke-width="4" stroke-linecap="round"/><rect x="42" y="8" width="16" height="16" rx="2.5"/><circle cx="50" cy="50" r="5"/></svg></div></div></div><div class="q-info"><strong class="q-deg"></strong><p class="q-msg"></p><button type="button" class="btn btn-primary q-start">تفعيل البوصلة</button></div>';
act.after(qb);
const K={lat:21.4225,lng:39.8262};
function bearing(){const r=Math.PI/180,f1=P.lat*r,f2=K.lat*r,dl=(K.lng-P.lng)*r;const y=Math.sin(dl)*Math.cos(f2),x=Math.cos(f1)*Math.sin(f2)-Math.sin(f1)*Math.cos(f2)*Math.cos(dl);return(Math.atan2(y,x)/r+360)%360}
function dist(){const r=Math.PI/180,R=6371,dφ=(K.lat-P.lat)*r,dλ=(K.lng-P.lng)*r,a=Math.sin(dφ/2)**2+Math.cos(P.lat*r)*Math.cos(K.lat*r)*Math.sin(dλ/2)**2;return Math.round(2*R*Math.asin(Math.sqrt(a)))}
let heading=null,live=false,hit=false;const needle=qb.querySelector(".q-needle"),rose=qb.querySelector(".q-rose"),msg=qb.querySelector(".q-msg");
function draw(){const b=bearing();qb.querySelector(".q-deg").textContent=Math.round(b)+"° من الشمال · "+dist().toLocaleString("en")+" كم إلى مكة";
 if(heading==null){rose.style.transform="";needle.style.transform="rotate("+b+"deg)";msg.textContent=live?"حرّك الهاتف على شكل 8 لمعايرة البوصلة.":"السهم يوضح الاتجاه بالنسبة للشمال. فعّل البوصلة ليتحرك مع هاتفك.";return}
 rose.style.transform="rotate("+(-heading)+"deg)";needle.style.transform="rotate("+b+"deg)";const diff=Math.abs(((b-heading+540)%360)-180);
 const ok=diff<6;qb.classList.toggle("aligned",ok);msg.textContent=ok?"أنت الآن باتجاه القبلة ✓":"أدر الهاتف حتى يتجه السهم إلى الأعلى.";if(ok&&!hit){hit=true;navigator.vibrate&&navigator.vibrate(30)}if(!ok)hit=false}
function onOri(e){let h=null;if(typeof e.webkitCompassHeading==="number")h=e.webkitCompassHeading;else if(e.absolute&&e.alpha!=null)h=360-e.alpha;if(h==null)return;heading=(h+(screen.orientation?screen.orientation.angle:0)+360)%360;draw()}
qb.querySelector(".q-start").addEventListener("click",async()=>{try{if(typeof DeviceOrientationEvent!=="undefined"&&DeviceOrientationEvent.requestPermission){const r=await DeviceOrientationEvent.requestPermission();if(r!=="granted"){msg.textContent="لم يُسمح بالوصول إلى البوصلة.";return}}
 if("ondeviceorientationabsolute" in window)addEventListener("deviceorientationabsolute",onOri);else addEventListener("deviceorientation",onOri);live=true;qb.querySelector(".q-start").hidden=true;draw();
 setTimeout(()=>{if(heading==null)msg.textContent="البوصلة غير متاحة على هذا الجهاز. استخدم الدرجة الموضحة مع بوصلة الهاتف."},3000)}catch(e){msg.textContent="البوصلة غير متاحة على هذا الجهاز."}});
document.getElementById("qiblaBtn").addEventListener("click",function(){qb.hidden=!qb.hidden;this.setAttribute("aria-expanded",!qb.hidden);if(!qb.hidden){draw();if(!("DeviceOrientationEvent" in window)||!matchMedia("(pointer:coarse)").matches)qb.querySelector(".q-start").hidden=true}});
decorate();dates();tick();setInterval(tick,15000);
document.getElementById("citySelect")?.addEventListener("change",()=>setTimeout(()=>{decorate();if(!qb.hidden)draw()},50));
})();
(()=>{"use strict";
const card=document.querySelector(".pc2"),head=card&&card.querySelector(".prayer-head"),set=document.getElementById("prayerSettings"),sb=document.getElementById("prayerSettingsBtn");
if(head&&set){head.after(set);sb.addEventListener("click",()=>setTimeout(()=>{if(!set.hidden){set.scrollIntoView({behavior:"smooth",block:"nearest"});const f=set.querySelector("select");f&&f.focus({preventScroll:true})}},30))}
const old=document.querySelector(".qibla");if(old)old.remove();
const qBtn=document.getElementById("qiblaBtn");if(!qBtn)return;
const nq=qBtn.cloneNode(true);qBtn.replaceWith(nq);
const K={lat:21.4225,lng:39.8262},R=Math.PI/180;
const bearing=()=>{const f1=P.lat*R,f2=K.lat*R,dl=(K.lng-P.lng)*R;return(Math.atan2(Math.sin(dl)*Math.cos(f2),Math.cos(f1)*Math.sin(f2)-Math.sin(f1)*Math.cos(f2)*Math.cos(dl))/R+360)%360};
const dist=()=>{const dp=(K.lat-P.lat)*R,dl=(K.lng-P.lng)*R,a=Math.sin(dp/2)**2+Math.cos(P.lat*R)*Math.cos(K.lat*R)*Math.sin(dl/2)**2;return Math.round(12742*Math.asin(Math.sqrt(a)))};
function dial(){let s='<svg class="qx-svg" viewBox="0 0 300 300" aria-hidden="true"><defs><radialGradient id="qxg" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#123a2d"/><stop offset="1" stop-color="#0a241b"/></radialGradient></defs><circle cx="150" cy="150" r="146" fill="url(#qxg)" stroke="#e2c27f55" stroke-width="2"/><g class="qx-rose">';
 for(let i=0;i<360;i+=5){const L=i%30===0?16:i%15===0?10:6,w=i%30===0?2:1,a=i*R,x1=150+Math.sin(a)*136,y1=150-Math.cos(a)*136,x2=150+Math.sin(a)*(136-L),y2=150-Math.cos(a)*(136-L);s+='<line x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" stroke="#e2c27f88" stroke-width="'+w+'" stroke-linecap="round"/>'}
 [[0,"ش","n"],[90,"شر",""],[180,"ج",""],[270,"غ",""]].forEach(([d,t,c])=>{const a=d*R,x=150+Math.sin(a)*104,y=150-Math.cos(a)*104;s+='<text x="'+x.toFixed(1)+'" y="'+(y+7).toFixed(1)+'" text-anchor="middle" class="qx-card '+c+'" transform="rotate('+d+' '+x.toFixed(1)+' '+y.toFixed(1)+')">'+t+'</text>'});
 for(let d=30;d<360;d+=30){if(d%90===0)continue;const a=d*R,x=150+Math.sin(a)*106,y=150-Math.cos(a)*106;s+='<text x="'+x.toFixed(1)+'" y="'+(y+4).toFixed(1)+'" text-anchor="middle" class="qx-deg-l" transform="rotate('+d+' '+x.toFixed(1)+' '+y.toFixed(1)+')">'+d+'</text>'}
 s+='<g class="qx-target"><line x1="150" y1="150" x2="150" y2="44" stroke="#e2c27f" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 7"/><g transform="translate(150 30)"><rect x="-15" y="-15" width="30" height="30" rx="4" fill="#1b1b1b" stroke="#e2c27f" stroke-width="2"/><rect x="-15" y="-7" width="30" height="5" fill="#e2c27f"/></g></g></g>';
 s+='<circle cx="150" cy="150" r="7" fill="#e2c27f"/><path class="qx-me" d="M150 2 l9 14 h-18z" fill="#ffffff"/></svg>';return s}
let ov,heading=null,live=false,hit=false,raf=0,shown=0;
function build(){ov=document.createElement("div");ov.className="qx";ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");ov.setAttribute("aria-labelledby","qxT");ov.hidden=true;
 ov.innerHTML='<header class="qx-top"><button type="button" class="r-btn qx-close" aria-label="إغلاق"><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="qx-title"><strong id="qxT">اتجاه القبلة</strong><small class="qx-city"></small></div><span style="width:42px"></span></header>'+
 '<div class="qx-body"><div class="qx-state" aria-live="polite"></div><div class="qx-wrap">'+dial()+'</div><div class="qx-num"><b class="qx-b"></b><span>درجة من الشمال</span></div><div class="qx-facts"><div><b class="qx-km"></b><span>إلى مكة المكرمة</span></div><div><b class="qx-hd">—</b><span>اتجاه هاتفك</span></div></div>'+
 '<button type="button" class="btn btn-gold qx-start">تفعيل البوصلة</button><p class="qx-tip"></p></div>';
 document.body.append(ov);ov.querySelector(".qx-close").onclick=close;document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!ov.hidden)close()});
 ov.querySelector(".qx-start").onclick=start}
function render(){const b=bearing(),rose=ov.querySelector(".qx-rose"),tgt=ov.querySelector(".qx-target");
 ov.querySelector(".qx-b").textContent=Math.round(b)+"°";ov.querySelector(".qx-km").textContent=dist().toLocaleString("en")+" كم";ov.querySelector(".qx-city").textContent="حسب موقع: "+P.name;
 tgt.setAttribute("transform","rotate("+b.toFixed(1)+" 150 150)");
 const st=ov.querySelector(".qx-state"),tip=ov.querySelector(".qx-tip");
 if(heading==null){rose.setAttribute("transform","");ov.classList.remove("ok");st.textContent=live?"جارٍ قراءة البوصلة…":"الكعبة على الدائرة بالنسبة للشمال";
  tip.textContent=live?"إن لم يتحرك القرص، حرّك الهاتف في الهواء على شكل رقم 8 لمعايرته.":"ضع الهاتف مستويًا، ثم فعّل البوصلة ليدور القرص مع هاتفك.";return}
 shown+=(((heading-shown+540)%360)-180)*.25;shown=(shown+360)%360;rose.setAttribute("transform","rotate("+(-shown).toFixed(2)+" 150 150)");ov.querySelector(".qx-hd").textContent=Math.round(heading)+"°";
 const diff=((b-heading+540)%360)-180,ok=Math.abs(diff)<5;ov.classList.toggle("ok",ok);
 st.textContent=ok?"أنت باتجاه القبلة":Math.abs(diff)<25?(diff>0?"قليلًا إلى اليمين":"قليلًا إلى اليسار"):(diff>0?"استدر إلى اليمين":"استدر إلى اليسار");
 tip.textContent=ok?"ثبّت الهاتف على هذا الاتجاه.":"أدر جسمك حتى تصبح الكعبة تحت المؤشر الذهبي أعلى القرص.";
 if(ok&&!hit){hit=true;navigator.vibrate&&navigator.vibrate([20,40,20])}if(!ok)hit=false}
function onOri(e){let h=null;if(typeof e.webkitCompassHeading==="number")h=e.webkitCompassHeading;else if(e.absolute&&e.alpha!=null)h=360-e.alpha;if(h==null)return;heading=(h+(screen.orientation?screen.orientation.angle:0)+360)%360;if(!raf)raf=requestAnimationFrame(()=>{raf=0;render()})}
async function start(){const btn=ov.querySelector(".qx-start");let perm="granted";
 try{if(typeof DeviceOrientationEvent!=="undefined"&&typeof DeviceOrientationEvent.requestPermission==="function")perm=await DeviceOrientationEvent.requestPermission()}catch(e){perm="error"}
 addEventListener("deviceorientationabsolute",onOri);addEventListener("deviceorientation",onOri);live=true;btn.hidden=true;render();
 setTimeout(()=>{if(heading==null){btn.hidden=false;ov.querySelector(".qx-state").textContent="البوصلة غير متاحة";ov.querySelector(".qx-tip").textContent=perm==="denied"?"لم يُسمح بالوصول إلى حساس الاتجاه. اسمح به من إعدادات المتصفح ثم أعد المحاولة.":"هذا الجهاز لا يوفّر بوصلة للمتصفح. استخدم الدرجة الموضحة مع تطبيق البوصلة في هاتفك."}},3500)}
let lastF;function open(){lastF=document.activeElement;if(!ov)build();ov.hidden=false;document.documentElement.classList.add("reader-open");if(!matchMedia("(pointer:coarse)").matches)ov.querySelector(".qx-start").hidden=true;render();ov.querySelector(".qx-close").focus()}
function close(){ov.hidden=true;document.documentElement.classList.remove("reader-open");lastF&&lastF.focus&&lastF.focus()}
nq.removeAttribute("aria-expanded");nq.addEventListener("click",open);
})();
(()=>{"use strict";
if((()=>{try{return localStorage.getItem("wird-digits")==="latin"}catch(e){return false}})())return;
const MAP="٠١٢٣٤٥٦٧٨٩",SKIP=/^(SCRIPT|STYLE|TEXTAREA|INPUT|NOSCRIPT|CODE)$/;
const cv=s=>s.replace(/[0-9]/g,d=>MAP[d]);
function walk(root){if(root.nodeType===3){fix(root);return}if(root.nodeType!==1||SKIP.test(root.nodeName)||root.closest&&root.closest("[data-latin]"))return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;return !p||SKIP.test(p.nodeName)||p.closest("[data-latin]")?2:1}});let n;while(n=w.nextNode())fix(n)}
function fix(n){const v=n.nodeValue;if(v&&/[0-9]/.test(v)){const p=n.parentElement;if(p&&(SKIP.test(p.nodeName)||p.closest("[data-latin]")))return;n.nodeValue=cv(v)}}
walk(document.body);
new MutationObserver(ms=>{for(const m of ms){if(m.type==="characterData")fix(m.target);else m.addedNodes.forEach(walk)}}).observe(document.body,{subtree:true,childList:true,characterData:true});
document.title=cv(document.title);
})();