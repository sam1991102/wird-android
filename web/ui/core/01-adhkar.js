(()=>{
/* أيقونات أقسام لم تكن في ICONS الأصلية (الجنازة، جوامع الدعاء، الاستغفار، الفضائل، الرزق، العلم) — تُضاف قبل أول رسم */
Object.assign(ICONS,{"janaza": "M7 21V9.5a5 5 0 0 1 10 0V21M4 21h16M10 12.5h4M10 15.5h4", "jawami": "M7 11V7.5a1.5 1.5 0 0 1 3 0V11M14 11V7.5a1.5 1.5 0 0 1 3 0V13a6 6 0 0 1-6 6h-.5A5.5 5.5 0 0 1 5 13.5V11M12 2.5v2M8.5 3.5l.8 1.6M15.5 3.5l-.8 1.6", "istighfar": "M12 3c2.8 3.4 5 6.3 5 9.2A5 5 0 0 1 12 17a5 5 0 0 1-5-4.8C7 9.3 9.2 6.4 12 3zM5 20.5h14M10 13.2a2.2 2.2 0 0 0 2 1.8", "fadail": "M10.4 4.5a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0M5.4 7a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0M15.4 7a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0M3.9 12a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0M16.9 12a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0M5.9 16.5a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0M14.9 16.5a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0M12 18v4M10.5 22h3", "rizq": "M12 21V9M12 9c0-3 2-5 4-5 0 3-2 5-4 5zM12 9c0-3-2-5-4-5 0 3 2 5 4 5zM12 14c0-2.4 2-4 4-4 0 2.4-2 4-4 4zM12 14c0-2.4-2-4-4-4 0 2.4 2 4 4 4zM12 19c0-2.4 2-4 4-4 0 2.4-2 4-4 4zM12 19c0-2.4-2-4-4-4 0 2.4 2 4 4 4z", "ilm": "M3 5.5c3-1 6-1 9 1v13c-3-2-6-2-9-1zM21 5.5c-3-1-6-1-9 1v13c3-2 6-2 9-1z"});
const nav=document.getElementById("categories"),more=document.getElementById("chipsMore");
more.addEventListener("click",()=>{const o=nav.classList.toggle("open");more.setAttribute("aria-expanded",String(o));more.textContent=o?"عرض الأقسام الأساسية":"عرض كل الأقسام"});
const stats=document.getElementById("stats"),empty=document.getElementById("statsEmpty");
function check(){let h={};try{h=JSON.parse(localStorage.getItem("wird-history"))||{}}catch(e){}const any=Object.values(h).some(d=>d&&d.n>0);stats.classList.toggle("fresh",!any);empty.hidden=any}
check();document.addEventListener("click",()=>setTimeout(check,50));
empty.querySelector("[data-focus]").addEventListener("click",()=>document.querySelector('.mini-ring[data-focus="morning"]').click());
})();
(()=>{"use strict";
const root=document.documentElement,reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const byName={};try{categories.forEach(c=>byName[c.name]=c.id)}catch(e){}
const THEMED={morning:1,evening:1,sleep:1,wake:1,prayer:1,wudu:1,masjid:1,food:1,home:1,kurb:1,travel:1,quran:1,istikhara:1,sick:1,weather:1,adhan:1,daily:1,general:1,friday:1,ramadan:1,hajj:1,family:1,grief:1,market:1,mine:1};
function setLib(){const a=document.querySelector("#categories .chip.active");const id=a&&a.dataset.cat;root.dataset.cat=THEMED[id]?id:""}
new MutationObserver(setLib).observe(document.getElementById("categories"),{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});setLib();
const focus=document.getElementById("focus"),fCat=document.getElementById("fCat"),fPos=document.getElementById("fPos"),fText=document.getElementById("fText"),stage=document.getElementById("fStage"),done=document.getElementById("fDone");
function setFocus(){const id=byName[fCat.textContent]||"";focus.dataset.theme=THEMED[id]?id:""}
new MutationObserver(setFocus).observe(fCat,{childList:true,characterData:true,subtree:true});
let last=0;new MutationObserver(()=>{const n=parseInt(fPos.textContent.replace(/[٠-٩]/g,__en))||0;if(!reduce&&last&&n!==last){fText.classList.remove("in-next","in-prev");void fText.offsetWidth;fText.classList.add(n>last?"in-next":"in-prev")}last=n}).observe(fPos,{childList:true,characterData:true,subtree:true});
stage.addEventListener("pointerdown",e=>{if(reduce)return;const r=stage.getBoundingClientRect(),s=document.createElement("span");s.className="tap";s.style.left=(e.clientX-r.left)+"px";s.style.top=(e.clientY-r.top)+"px";stage.appendChild(s);setTimeout(()=>s.remove(),650)});
function celebrate(){if(reduce)return;const c=document.createElement("canvas");c.className="fd-burst";done.prepend(c);const x=c.getContext("2d"),W=c.width=done.clientWidth*devicePixelRatio,H=c.height=done.clientHeight*devicePixelRatio;
 const P=Array.from({length:70},()=>{const a=Math.random()*Math.PI*2,v=(4+Math.random()*7)*devicePixelRatio;return{x:W/2,y:H*.36,vx:Math.cos(a)*v,vy:Math.sin(a)*v-3*devicePixelRatio,r:(2+Math.random()*4)*devicePixelRatio,s:Math.random()<.5,rot:Math.random()*6,c:["#e2c27f","#c49a4b","#f3e2b3","#ffffff"][Math.random()*4|0]}});
 let t=0;(function f(){x.clearRect(0,0,W,H);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.18*devicePixelRatio;p.vx*=.985;p.rot+=.1;x.globalAlpha=Math.max(0,1-t/90);x.fillStyle=p.c;x.save();x.translate(p.x,p.y);x.rotate(p.rot);if(p.s){x.beginPath();for(let i=0;i<8;i++){const rr=i%2?p.r*.45:p.r;x.lineTo(Math.cos(i*Math.PI/4)*rr,Math.sin(i*Math.PI/4)*rr)}x.fill()}else x.fillRect(-p.r/2,-p.r/2,p.r,p.r);x.restore()});if(++t<95)requestAnimationFrame(f);else c.remove()})()}
new MutationObserver(()=>{if(!done.hidden)celebrate()}).observe(done,{attributes:true,attributeFilter:["hidden"]});
})();
(()=>{"use strict";
const root=document.documentElement,btn=document.getElementById("themeBtn"),meta=document.querySelector('meta[name="theme-color"]');
const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
function apply(m){root.classList.toggle("dark",m==="dark");root.classList.toggle("sepia",m==="sepia");set("wird-dark",m==="dark");set("wird-sepia",m==="sepia");meta.content=m==="dark"?"#0a110e":m==="sepia"?"#efe3c7":"#0d2a21";btn.setAttribute("aria-label",m==="light"?"المظهر: فاتح":m==="dark"?"المظهر: داكن":"المظهر: ورقي مريح للعين")}
btn.addEventListener("click",e=>{e.stopImmediatePropagation();const cur=root.classList.contains("dark")?"dark":root.classList.contains("sepia")?"sepia":"light";const next={light:"dark",dark:"sepia",sepia:"light"}[cur];apply(next);const t=document.getElementById("toast");t.textContent={light:"المظهر الفاتح",dark:"المظهر الداكن",sepia:"المظهر الورقي، مريح للقراءة ليلًا"}[next];t.classList.add("show");clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove("show"),1800)},true);
})();
(()=>{"use strict";
const IMG='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM4 15l4.5-4.5 4 4 2.5-2.5L20 17M15.5 9.5h.01"/></svg>';
function addBtns(root){root.querySelectorAll(".dhikr-card").forEach(c=>{const a=c.querySelector(".dhikr-actions");if(!a||a.querySelector("[data-img]"))return;const b=document.createElement("button");b.dataset.img=c.dataset.card;b.title="مشاركة كصورة";b.setAttribute("aria-label","مشاركة الذكر كصورة");b.innerHTML=IMG;a.prepend(b)})}
["adhkarList","favoritesList"].forEach(id=>{const el=document.getElementById(id);if(!el)return;addBtns(el);new MutationObserver(()=>addBtns(el)).observe(el,{childList:true,subtree:true})});
function lines(x,text,max){const w=text.split(/\s+/),out=[];let cur="";for(const word of w){const t=cur?cur+" "+word:word;if(x.measureText(t).width>max&&cur){out.push(cur);cur=word}else cur=t}if(cur)out.push(cur);return out}
async function render(a){await Promise.all([document.fonts.load('700 60px Amiri'),document.fonts.load('400 60px Amiri'),document.fonts.load('700 30px Tajawal'),document.fonts.load('400 30px Tajawal')]);
 const W=1080,H=1350,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
 const theme={morning:["#1e4466","#9a6232","#ffd38a"],wake:["#1e4466","#9a6232","#ffd38a"],evening:["#2b2347","#5a2a2a","#ffc2a3"],sleep:["#0a1028","#151e3f","#c9d3ff"]}[a.cat]||["#145039","#071f17","#e2c27f"];
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,theme[0]);g.addColorStop(1,theme[1]);x.fillStyle=g;x.fillRect(0,0,W,H);
 x.save();x.strokeStyle="rgba(255,255,255,.06)";x.lineWidth=1.5;for(let py=0;py<H+120;py+=120)for(let px=0;px<W+120;px+=120){x.save();x.translate(px,py);x.strokeRect(-26,-26,52,52);x.rotate(Math.PI/4);x.strokeRect(-26,-26,52,52);x.restore()}x.restore();
 x.strokeStyle=theme[2]+"88";x.lineWidth=2;x.strokeRect(40,40,W-80,H-80);
 x.direction="rtl";x.textAlign="center";x.fillStyle=theme[2];x.font="700 34px Tajawal";x.fillText(a.catName,W/2,130);
 let size=92,ls;const maxW=W-200,top=200,bottom=H-330;do{x.font="400 "+size+"px Amiri";ls=lines(x,a.text,maxW);if(ls.length*size*1.9<=bottom-top)break;size-=3}while(size>26);
 const lh=size*1.9,blockH=ls.length*lh;let y=top+(bottom-top-blockH)/2+size;x.fillStyle="#ffffff";ls.forEach(l=>{x.fillText(l,W/2,y);y+=lh});
 x.font="700 30px Tajawal";x.fillStyle=theme[2];const fl=a.fadl?lines(x,a.fadl,maxW).slice(0,2):[];let fy=H-280;fl.forEach(l=>{x.fillText(l,W/2,fy);fy+=44});
 if(a.source){x.font="400 26px Tajawal";x.fillStyle="rgba(255,255,255,.7)";x.fillText(a.source,W/2,fy+8)}
 x.font="700 40px Amiri";x.fillStyle="#ffffff";x.fillText("وِرد",W/2,H-96);x.font="400 22px Tajawal";x.fillStyle="rgba(255,255,255,.6)";x.direction="ltr";x.fillText(location.host,W/2,H-62);
 return new Promise(r=>c.toBlob(r,"image/png"))}
document.addEventListener("click",async e=>{const b=e.target.closest("[data-img]");if(!b)return;e.stopPropagation();const id=+b.dataset.img;let a;try{a=adhkar.find(z=>z.id===id)}catch(_){}if(!a)return;
 const cn=(categories.find(c=>c.id===a.cat)||{}).name||"";const t=document.getElementById("toast");t.textContent="جارٍ تجهيز الصورة…";t.classList.add("show");
 try{const blob=await render({...a,catName:cn});const file=new File([blob],"wird-"+id+".png",{type:"image/png"});
  if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:"وِرد"});t.classList.remove("show")}
  else{const u=URL.createObjectURL(blob),l=document.createElement("a");l.href=u;l.download=file.name;document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);t.textContent="تم حفظ الصورة";setTimeout(()=>t.classList.remove("show"),1800)}}
 catch(err){if(err&&err.name==="AbortError")t.classList.remove("show");else{t.textContent="تعذّر تجهيز الصورة";setTimeout(()=>t.classList.remove("show"),1800)}}},true);
window.__wirdRender=render;
})();
(()=>{"use strict";
const KEY="wird-mine-order";let order=[];try{order=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){}
const saveOrder=()=>{try{localStorage.setItem(KEY,JSON.stringify(order))}catch(e){}};
const mineList=()=>{const fav=[...favorites];order=order.filter(id=>fav.includes(id));fav.forEach(id=>{if(!order.includes(id))order.push(id)});return order.map(id=>adhkar.find(a=>a.id===id)).filter(Boolean)};
const MINE={id:"mine",name:"وِردي الخاص",icon:"",desc:"أذكار اخترتها"};
categories.splice(1,0,MINE);catById.mine=MINE;
const orig=catItems;
// @ts-expect-error مقصود: بنلفّ دالة app.js عشان نضيف قسم «وِردي»
catItems=function(c){return c==="mine"?mineList():orig(c)};
document.getElementById("jumpFavorites").addEventListener("click",e=>{e.stopImmediatePropagation();setCategory("mine");document.getElementById("library").scrollIntoView({behavior:"smooth"})},true);
const list=document.getElementById("adhkarList"),empty=document.getElementById("emptyState");
const UP='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',DN='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
function decorate(){const mine=activeCategory==="mine"&&!document.getElementById("searchInput").value.trim();list.classList.toggle("is-mine",mine);
 if(mine){list.querySelectorAll(".dhikr-card").forEach((c,i,all)=>{const a=c.querySelector(".dhikr-actions");if(!a||a.querySelector("[data-mv]"))return;const u=document.createElement("button");u.dataset.mv="-1";u.dataset.id=c.dataset.card;u.title="تقديم";u.setAttribute("aria-label","تقديم الذكر");u.innerHTML=UP;u.disabled=i===0;const d=document.createElement("button");d.dataset.mv="1";d.dataset.id=c.dataset.card;d.title="تأخير";d.setAttribute("aria-label","تأخير الذكر");d.innerHTML=DN;d.disabled=i===all.length-1;a.append(u,d)});
  if(!list.children.length){empty.querySelector("strong").textContent="وِردك الخاص فارغ";empty.querySelector("p").textContent="اضغط ♡ على أي ذكر في المكتبة ليُضاف هنا، ثم رتّبه واقرأه بالقراءة المتتابعة.";empty.querySelector("button").textContent="تصفّح كل الأذكار"}}
 else{empty.querySelector("strong").textContent="لا توجد نتائج";empty.querySelector("p").textContent="جرّب كلمة أخرى أو قسمًا مختلفًا.";empty.querySelector("button").textContent="عرض كل الأذكار"}}
new MutationObserver(decorate).observe(list,{childList:true});
list.addEventListener("click",e=>{const b=e.target.closest("[data-mv]");if(!b)return;e.stopPropagation();mineList();const id=+b.dataset.id,i=order.indexOf(id),j=i+(+b.dataset.mv);if(i<0||j<0||j>=order.length)return;[order[i],order[j]]=[order[j],order[i]];saveOrder();renderList();const el=list.querySelector('[data-card="'+id+'"]');el&&el.scrollIntoView({block:"nearest",behavior:"smooth"})},true);
renderChips();decorate();
})();
(()=>{"use strict";
const tc=document.getElementById("trustCount");if(tc)tc.textContent=adhkar.length+" ذكرًا من القرآن والسنة";
let m=0,d=0;try{const p=new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn",{day:"numeric",month:"numeric"}).formatToParts(new Date);m=+p.find(x=>x.type==="month").value;d=+p.find(x=>x.type==="day").value}catch(e){}
const wd=new Date().getDay(),S=[];
if(m===10&&d<=3)S.push(["hajj","عيد مبارك","تكبير العيد وأذكار الفرح"]);
if(m===12&&d<=13)S.push(["hajj",d===9?"يوم عرفة":d>=10?"أيام العيد والتشريق":"العشر الأوائل من ذي الحجة",d===9?"خير الدعاء دعاء يوم عرفة":"أكثِر من التكبير والتهليل"]);
if(m===9)S.push(["ramadan","رمضان مبارك","أذكار الصيام والإفطار وليلة القدر"]);
if(wd===5)S.push(["friday","يوم الجمعة","أكثِر من الصلاة على النبي ﷺ، واقرأ سورة الكهف"]);
const el=document.getElementById("season");if(!el||!S.length)return;const [cat,t,s]=S[0];
el.innerHTML='<span class="season-ico"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="'+(ICONS[cat]||ICONS.friday)+'"/></svg></span><span class="season-txt"><strong></strong><small></small></span><button class="btn btn-ghost season-btn" type="button">افتح الأذكار</button>';
el.querySelector("strong").textContent=t;el.querySelector("small").textContent=s;el.hidden=false;
el.querySelector("button").addEventListener("click",()=>{setCategory(cat);document.getElementById("library").scrollIntoView({behavior:"smooth"})});
})();
(()=>{"use strict";
const box=document.getElementById("remind");if(!box)return;const open=box.querySelector(".remind-open"),panel=box.querySelector(".remind-panel");
try{const s=JSON.parse(localStorage.getItem("wird-remind")||"null");if(s)for(const k in s){box.querySelector('[data-r="'+k+'"]').checked=s[k].on;box.querySelector('[data-t="'+k+'"]').value=s[k].t}}catch(e){}
open.addEventListener("click",()=>{panel.hidden=!panel.hidden;open.setAttribute("aria-expanded",!panel.hidden)});
const N={morning:"أذكار الصباح",evening:"أذكار المساء",sleep:"أذكار النوم"};
box.querySelector(".remind-add").addEventListener("click",()=>{
 const p=n=>String(n).padStart(2,"0"),d=new Date(),day=d.getFullYear()+p(d.getMonth()+1)+p(d.getDate()),st={};
 const ev=Object.keys(N).map(k=>{const on=box.querySelector('[data-r="'+k+'"]').checked,t=box.querySelector('[data-t="'+k+'"]').value||"06:00";st[k]={on,t};if(!on)return"";const [h,m]=t.split(":");
  return["BEGIN:VEVENT","UID:wird-"+k+"-"+day+"@"+location.host,"DTSTAMP:"+new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z","DTSTART:"+day+"T"+p(h)+p(m)+"00","DURATION:PT10M","RRULE:FREQ=DAILY","SUMMARY:"+N[k]+" — وِرد","DESCRIPTION:"+location.origin+"/"+k,"URL:"+location.origin+"/"+k,"BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+N[k],"TRIGGER:PT0M","END:VALARM","END:VEVENT"].join("\r\n")}).filter(Boolean);
 try{localStorage.setItem("wird-remind",JSON.stringify(st))}catch(e){}
 if(!ev.length){alertMsg("اختر ذكرًا واحدًا على الأقل");return}
 const ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//wird//ar","CALSCALE:GREGORIAN"].concat(ev,["END:VCALENDAR"]).join("\r\n");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([ics],{type:"text/calendar;charset=utf-8"}));a.download="wird-reminders.ics";document.body.append(a);a.click();a.remove();
 alertMsg("افتح الملف ليُضاف التذكير إلى تقويمك");panel.hidden=true;open.setAttribute("aria-expanded","false")});
function alertMsg(m){if(typeof toast==="function")toast(m);else{const t=document.createElement("div");t.className="remind-toast";t.textContent=m;t.setAttribute("role","status");document.body.append(t);setTimeout(()=>t.remove(),3200)}}
})();