
(()=>{"use strict";
const IOSA=window.__IOSA=(/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1))&&(navigator.standalone===true||matchMedia("(display-mode: standalone)").matches);
const _rs=history.replaceState.bind(history),_ps0=history.pushState.bind(history),_ps=IOSA?_rs:_ps0;
history.pushState=function(s,t,u){if(s&&s.w)return _ps(s,t,u);const h=history.state;if(h&&h.w)return;return _rs(s,t,u)};
history.replaceState=function(s,t,u){const h=history.state;if(s&&!s.w&&h&&h.w)return;return _rs(s,t,u)};

const R=document.documentElement,mq={matches:true,addEventListener(){},addListener(){}},$=s=>document.querySelector(s);
const ar=__ar;
const icon=n=>{try{return ic(n)}catch(e){return ""}};
const main=$("main");if(!main||$(".nav5"))return;
// الشريط السفلي: صفحات (روابط) + الإذاعة والإعدادات (أزرار تفتح صفحات فوقية). السبحة موجودة في القائمة الجانبية.
const TABS=[["home","الرئيسية","home"],["library","الأذكار","list"],["mushaf","المصحف","quran"],["radio","الإذاعة","radio",1],["prayer","المواقيت","clock"],["settings","الإعدادات","settings",1]];
const nav=document.createElement("nav");nav.className="bottom-nav nav5";nav.setAttribute("aria-label","التنقل الرئيسي");
nav.innerHTML=TABS.map(([v,t,i,btn])=>btn?`<button type="button" class="nv-x${v==="radio"?" nv-radio":""}" data-tab="${v}"><span class="ni" aria-hidden="true">${icon(i)}</span><span class="nt">${t}</span></button>`:`<a href="${v==="home"?"/":"/#"+v}" data-tab="${v}"><span class="ni" aria-hidden="true">${icon(i)}</span><span class="nt">${t}</span></a>`).join("");
nav.addEventListener("click",e=>{const b=e.target.closest(".nv-x");if(!b)return;e.preventDefault();
 if(b.dataset.tab==="settings"){window.__openSettings&&__openSettings();return}
 if(document.querySelector(".wp-page.rd-page"))return;window.__closeOverlays&&__closeOverlays();setTimeout(()=>window.__openRadio&&__openRadio(),120)});
(document.querySelector("footer")||main).after(nav);
const mv=document.createElement("section");mv.id="mushafView";mv.className="container mv";mv.dataset.v="mushaf";
/* محتوى صفحة المصحف بيتبني في 42-mushaf-home.js */
main.insertBefore(mv,$("#tasbih")||null);
const lib=$("#library"),grid=$("#catGrid");
if(grid&&!$(".mine-tile")){const t=document.createElement("button");t.type="button";t.className="mine-tile";
 t.innerHTML=`<span class="mt-ic">${icon("mine")}</span><span class="mt-tx"><strong>وِردي</strong><small>أذكارك المحفوظة بترتيبك</small></span><span class="mt-go" aria-hidden="true">‹</span>`;
 t.addEventListener("click",()=>setCategory("mine"));grid.before(t)}
const sub=document.createElement("div");sub.className="subbar";
sub.innerHTML=`<button type="button" class="sb-back" aria-label="رجوع إلى أقسام الأذكار"><span aria-hidden="true">→</span> الأقسام</button><strong class="sb-title"></strong>`;
lib&&lib.prepend(sub);
const sbTitle=sub.querySelector(".sb-title");
const syncTitle=()=>{try{sbTitle.textContent=activeCategory==="mine"?"وِردي":catName(activeCategory)}catch(e){}};
const libBack=$(".lib-back");
let restoring=0,skipPop=0,ovDepth=0,closingByPop=0;
const cur=()=>{const l=R.dataset.lib||"grid";return {w:1,v:R.dataset.view||"home",lib:l,cat:l==="list"&&typeof activeCategory!=="undefined"?activeCategory:""}};
const unrest=()=>setTimeout(()=>{restoring--},0);
const urlFor=s=>s.v==="library"&&s.lib==="list"&&s.cat&&!["all","mine"].includes(s.cat)?"/"+s.cat:(s.v==="home"?"/":"/#"+s.v);
const push=()=>{if(restoring)return;const s=cur();if(s.v==="settings")return;/* الإعدادات طبقة فوقية لها مدخل ov فقط */const h=history.state;if(h&&h.w&&!h.ov&&h.v===s.v&&h.lib===s.lib&&h.cat===s.cat)return;_ps(s,"",urlFor(s))};
const mark=()=>{};/* حالة الزر المنوّر في ui/15-nav2.js وحده */
const toGrid=()=>{if(R.dataset.lib==="list"&&libBack){restoring++;libBack.click();unrest()}};
function go(v){
 if(!mq.matches){const t=v==="home"?$("#top"):v==="mushaf"?mv:document.getElementById(v);t&&t.scrollIntoView({behavior:"smooth"});return}
 if(v==="library"&&R.dataset.view==="library"&&R.dataset.lib==="list"){backFromList();return}
 if(R.dataset.view===v){scrollTo({top:0,behavior:"smooth"});return}
 window.__setView(v);scrollTo({top:0,behavior:"instant"});
}
function backFromList(){const h=history.state;if(!window.__IOSA&&h&&h.w&&!h.ov&&h.v==="library"&&h.lib==="list")history.back();else{toGrid();push()}}
/* composedPath بيحتفظ بمسار الضغطة حتى لو الأيقونة اتبدّلت أثناءها */
nav.addEventListener("click",e=>{const a=(e.composedPath?e.composedPath():[e.target]).find(n=>n&&n.dataset&&n.dataset.tab&&nav.contains(n));if(!a)return;e.preventDefault();go(a.dataset.tab)});
sub.querySelector(".sb-back").addEventListener("click",backFromList);
new MutationObserver(ms=>{mark();if(ms.some(m=>m.attributeName==="data-lib"))syncTitle();
 push()}).observe(R,{attributes:true,attributeFilter:["data-view","data-lib"]});
const OV="#focus,.mp,.reader,.st,.qx,.sheet,.ig-sheet,.install-sheet,.adhan-ov,.wd-sheet,.wp-page,.w-dlg";
const vis=el=>{if(!el.isConnected||el.hidden||!el.getClientRects().length)return false;const s=getComputedStyle(el);return s.visibility!=="hidden"&&s.display!=="none"&&(s.animationName!=="none"||+s.opacity>0.05)&&s.pointerEvents!=="none"};
const openOv=()=>[...document.querySelectorAll(OV)].filter(el=>vis(el)&&!el.parentElement.closest(OV));
const closeOv=el=>{const b=el.querySelector("#fClose,[data-x],.close,[aria-label='إغلاق'],[aria-label='رجوع']");if(b)b.click();else el.hidden=true};
let lockY=0,locked=false;
const lock=()=>{if(locked)return;locked=true;lockY=scrollY;const b=document.body.style;b.position="fixed";b.top=-lockY+"px";b.left="0";b.right="0";b.width="100%";R.classList.add("ov-lock")};
const unlock=()=>{if(!locked)return;locked=false;const b=document.body.style;b.position=b.top=b.left=b.right=b.width="";R.classList.remove("ov-lock");scrollTo(0,lockY)};
const LOCKSEL=OV+",.tasbih-full";
const needLock=()=>[...document.querySelectorAll(LOCKSEL)].some(vis);
let raf=0;const check=()=>{raf=0;const n=openOv().length;(n>0||needLock())?lock():unlock();
 if(n>ovDepth){for(let i=ovDepth;i<n;i++)_ps({...cur(),ov:1,ovd:i+1},"",location.href)}
 else if(n<ovDepth&&!closingByPop){const k=ovDepth-n;if(!IOSA){skipPop+=k;history.go(-k)}}
 ovDepth=n};
const sched=()=>{if(!raf)raf=setTimeout(check,40)};new MutationObserver(sched).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["hidden","class","style","open"]});new MutationObserver(sched).observe(R,{attributes:true,attributeFilter:["class","style","data-view","data-lib"]});document.addEventListener("click",()=>setTimeout(sched,350),true);document.addEventListener("transitionend",sched,true);
addEventListener("popstate",e=>{
 e.stopImmediatePropagation();
 if(skipPop>0){skipPop--;return}
 /* معالج الإعداد شغال: زرار الرجوع = «السابق» */
 if(window.__suBack&&__suBack())return;
 {const E=window.__mpEdge,top=openOv().pop();const __edge=E&&Date.now()-E.t<1500;if(top&&top.matches(".mp")&&(__edge||!(window.__mpBlk&&Date.now()-window.__mpBlk<2500))){if(__edge)window.__mpBlk=0;else window.__mpBlk=Date.now();_ps({...cur(),ov:1,ovd:ovDepth},"",location.href);if(E&&Date.now()-E.t<1500&&window.__mpFlip)__mpFlip(E.d);window.__mpEdge=null;__edge||typeof toast==="function"&&toast("للخروج من المصحف اضغط رجوع مرة أخرى أو زر الإغلاق");return}}
 const s=e.state&&e.state.w?e.state:{v:"home",lib:"grid"};
 const want=s.ov?(s.ovd||1):0;
 let open=openOv();
 if(open.length>want){closingByPop++;let guard=5;while(open.length>want&&guard--){closeOv(open[open.length-1]);open=openOv()}ovDepth=want;setTimeout(()=>{closingByPop--;const n=openOv().length;if(n<ovDepth){const k=ovDepth-n;ovDepth=n;if(!IOSA){skipPop+=k;history.go(-k)}}},150)}
 else ovDepth=Math.min(ovDepth,open.length);
 if(s.ov)return;
 restoring++;
 try{
  if(mq.matches&&R.dataset.view!==s.v){window.__setView(s.v);scrollTo({top:0,behavior:"instant"})}
  if(s.v==="library"){if(s.lib==="list"&&s.cat){if(R.dataset.lib!=="list"||activeCategory!==s.cat)setCategory(s.cat)}else if(s.lib!=="list")toGrid()}
 }finally{unrest()}
 mark();syncTitle();try{_rs(history.state&&history.state.w?history.state:cur(),"",urlFor(s))}catch(x){}
},true);
let booted=0;const _set=window.setCategory;window.setCategory=function(c,p){if(p===false&&booted&&!restoring)return;return _set.apply(this,arguments)};setTimeout(()=>{booted=1},1500);

restoring++;
const h=location.hash.slice(1);if(mq.matches&&["library","mushaf","tasbih","prayer"].includes(h)&&!slugFromPath())window.__setView(h);
restoring--;
_rs(cur(),"",location.href);mark();syncTitle();
window.__wirdGo=go;
})();

(()=>{if(!("serviceWorker"in navigator))return;const had=!!navigator.serviceWorker.controller;let done=0;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(!had||done)return;done=1;if(performance.now()<20000&&!document.querySelector("#focus:not([hidden])"))location.reload();else window.__wirdUpd&&__wirdUpd()})})();

(()=>{"use strict";const nd=document.getElementById("nextd"),tc=document.querySelector(".today-card");if(nd&&tc&&tc.parentElement){tc.after(nd);nd.classList.add("nextd-moved")}const lib=[...document.querySelectorAll(".hero-actions a")].find(a=>/المكتبة/.test(a.textContent));if(lib)lib.classList.add("hero-lib")})();