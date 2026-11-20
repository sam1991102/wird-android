(()=>{"use strict";
/* قائمة مواقيت اليوم: أيقونة لكل صلاة، وحالة «الآن / القادمة». الكارت في 39-prayer-card.js والإعدادات في 40-prayer-page.js */
const card=document.querySelector(".prayer-card");if(!card)return;card.classList.add("pc2");
const list=document.getElementById("prayerList");
const IC={fajr:"M3 18h18M6 18a6 6 0 0 1 12 0M12 6V3M4.9 9.5 3.5 8M19.1 9.5 20.5 8",sunrise:"M3 18h18M7 18a5 5 0 0 1 10 0M12 9V4M9.5 6.5 12 4l2.5 2.5",dhuhr:"M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",asr:"M12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 4v2M5 7l1.4 1.4M19 7l-1.4 1.4M3 21h18",maghrib:"M3 18h18M7 18a5 5 0 0 1 10 0M12 4v5M9.5 6.5 12 9l2.5-2.5",isha:"M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"};
const svg=d=>'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="'+d+'"/></svg>';
const eb=card.querySelector(".prayer-head .eyebrow");if(eb)eb.textContent="الصلاة القادمة";
const ORDER=["fajr","sunrise","dhuhr","asr","maghrib","isha"],PR=["fajr","dhuhr","asr","maghrib","isha"];
function cur(){if(typeof prayerCache==="undefined"||!prayerCache)return null;const t=prayerCache.t,now=localParts(P.tz,new Date).h;let c=null;for(const k of PR)if(t[k]<=now)c=k;return c||"isha"}
function decorate(){const c=cur();list.querySelectorAll("li").forEach((li,i)=>{const k=ORDER[i];if(!k)return;
 if(!li.querySelector(".pl-ic")){const s=document.createElement("span");s.className="pl-ic";s.innerHTML=svg(IC[k]);li.prepend(s);const st=document.createElement("em");st.className="pl-st";li.append(st)}
 li.classList.toggle("cur",k===c);const st=li.querySelector(".pl-st"),v=k==="sunrise"?"علامة وقت":li.classList.contains("next")?"القادمة":k===c?"الآن":"";if(st.textContent!==v)st.textContent=v})}
new MutationObserver(decorate).observe(list,{childList:true});decorate();__wEverySec(function(){if(!document.hidden&&document.documentElement.dataset.view==="prayer")decorate()});
})();
(()=>{"use strict";
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
window.__openQibla=open;
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