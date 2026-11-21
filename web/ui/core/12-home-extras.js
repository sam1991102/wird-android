

(()=>{"use strict";
const $=s=>document.querySelector(s),ar=n=>String(n).replace(/\d/g,__ar);
const icon=n=>{try{return ic(n)}catch(e){return""}};
/* إزالة النسخة الاحتياطية و«عن المحتوى» من الرئيسية (موجودتان في الإعدادات/صفحة عن الموقع) */
const bk=$("#stats .backup");if(bk)bk.hidden=true;
document.querySelectorAll('main>section[data-v="home"] .note').forEach(n=>{const s=n.closest("main>section");if(s&&s.children.length<=2)s.classList.add("home-hide");else n.hidden=true});
const hero=$("main>section.hero");if(!hero||$("#homePlus"))return;
/* ---- الصلاة القادمة + اختصارات ---- */
const sec=document.createElement("section");sec.id="homePlus";sec.className="container section hp";sec.dataset.v="home";
sec.innerHTML=`<div class="hp-grid">
<button type="button" class="hp-prayer" data-hp="prayer"><span class="hp-k">الصلاة القادمة</span><strong id="hpName">—</strong><span class="hp-time" id="hpTime"></span><span class="hp-cd" id="hpCd"></span></button>
<div class="hp-tiles">
<button type="button" class="hp-tile" data-hp="mushaf"><span class="hp-ic">${icon("quran")}</span><strong>المصحف</strong><small id="hpPage">ابدأ القراءة</small></button>
<button type="button" class="hp-tile" data-hp="qibla"><span class="hp-ic">${icon("pin")}</span><strong>القبلة</strong><small>اتجاه الكعبة</small></button>
<button type="button" class="hp-tile" data-hp="tasbih"><span class="hp-ic">${icon("tasbih")}</span><strong>السبحة</strong><small>سبّح واستغفر</small></button>
<button type="button" class="hp-tile" data-hp="mine"><span class="hp-ic">${icon("mine")}</span><strong>وِردي</strong><small>أذكارك المحفوظة</small></button>
</div></div>`;
hero.after(sec);
const PN={fajr:"الفجر",sunrise:"الشروق",dhuhr:"الظهر",asr:"العصر",maghrib:"المغرب",isha:"العشاء"};
const fmtH=h=>{try{return fmtT(h)}catch(e){const m=Math.round(h*60)%1440;return ar(Math.floor(m/60)+":"+String(m%60).padStart(2,"0"))}};
function upd(){let d;try{d=prayerDay(0)}catch(e){return}const {t,L,isFri}=d;const order=["fajr","dhuhr","asr","maghrib","isha"];
 let k=order.find(p=>t[p]>L.h),tt,name;if(k){tt=t[k]-L.h;name=k==="dhuhr"&&isFri?"الجمعة":PN[k];$("#hpTime").textContent=fmtH(t[k])}
 else{const n=prayerDay(1);tt=24-L.h+n.t.fajr;name="الفجر";$("#hpTime").textContent=fmtH(n.t.fajr)}
 const m=Math.max(0,Math.round(tt*60));$("#hpName").textContent=name;$("#hpCd").textContent="بعد "+(m>=60?ar(Math.floor(m/60))+" س ":"")+ar(m%60)+" د";
 const p=parseInt(String(localStorage.getItem("wird-mushaf-page")||"").replace(/\D/g,""),10);$("#hpPage").textContent=p>1&&p<=604?"تابع من صفحة "+ar(p):"ابدأ القراءة";window.__khTile&&window.__khTile()}
upd();__wEvery(30,upd);document.addEventListener("visibilitychange",()=>{if(!document.hidden)upd()});
sec.addEventListener("click",e=>{const b=e.target.closest("[data-hp]");if(!b)return;const k=b.dataset.hp,go=window.__wirdGo||(()=>{});
 if(k==="prayer")go("prayer");else if(k==="tasbih")go("tasbih");
 else if(k==="mushaf"){const p=parseInt(String(localStorage.getItem("wird-mushaf-page")||"").replace(/\D/g,""),10);window.__openPage&&__openPage(p>=1&&p<=604?p:1)}
 else if(k==="qibla")window.__openQibla();
 else if(k==="mine"){go("library");setCategory("mine")}});
/* ---- آية اليوم ---- */
const AY=[[2,152,"البقرة"],[2,186,"البقرة"],[13,28,"الرعد"],[94,6,"الشرح"],[65,3,"الطلاق"],[3,139,"آل عمران"],[39,53,"الزمر"],[40,60,"غافر"],[33,41,"الأحزاب"],[2,153,"البقرة"],[9,51,"التوبة"],[12,87,"يوسف"],[20,25,"طه"],[21,87,"الأنبياء"],[3,8,"آل عمران"],[2,201,"البقرة"],[14,7,"إبراهيم"],[50,16,"ق"],[8,46,"الأنفال"],[29,69,"العنكبوت"],[30,21,"الروم"],[67,2,"الملك"],[16,128,"النحل"],[2,45,"البقرة"],[7,56,"الأعراف"],[93,5,"الضحى"],[42,19,"الشورى"]];
const day=Math.floor((Date.now()+3*3600e3)/864e5),[s,a,sn]=AY[day%AY.length];
const daily=$(".daily-card");const host=daily?daily.closest("main>section"):sec;
const ay=document.createElement("section");ay.className="container section ayah-day";ay.dataset.v="home";
ay.innerHTML=`<div class="dy-card"><div class="dy-head"><span class="dy-k">آية اليوم</span><span class="dy-ref">سورة ${sn} — الآية ${ar(a)}</span></div><p class="dy-text" id="ayText">…</p><p class="dy-tf" id="ayTf" hidden><b>التفسير الميسر: </b><span></span></p><div class="dy-act"><button type="button" class="btn btn-ghost btn-sm" data-ay="read">اقرأ السورة</button><button type="button" class="btn btn-ghost btn-sm" data-ay="copy">نسخ</button><button type="button" class="btn btn-ghost btn-sm" data-ay="share">مشاركة</button></div></div>`;
host.after(ay);
/* نص الآية من ملفات المصحف اللي جوّه الموقع، والتفسير مرة واحدة في اليوم ويتحفظ — عشان مليون مستخدم مايضربوش quran.com كل فتحة */
let txt="";const TK="wird-ayd-tf",tfKey=s+":"+a;
const showTf=t=>{if(!t)return;const e=$("#ayTf");e.querySelector("span").textContent=t;e.hidden=false};
fetch("/mushaf/"+s+".json").then(r=>r.json()).then(j=>{txt=(j[a-1]||"").replace(/^۞\s*/,"");if(!txt)throw 0;$("#ayText").textContent="﴿"+txt+"﴾";
 let c=null;try{c=JSON.parse(localStorage.getItem(TK)||"null")}catch(e){}
 if(c&&c.k===tfKey){showTf(c.t);return}
 if(!navigator.onLine)return;
 fetch("https://api.quran.com/api/v4/tafsirs/16/by_ayah/"+tfKey).then(r=>r.ok?r.json():null).then(j=>{const t=((j&&j.tafsir&&j.tafsir.text)||"").replace(/<[^>]+>/g,"").trim();if(!t)return;try{localStorage.setItem(TK,JSON.stringify({k:tfKey,t:t}))}catch(e){}showTf(t)}).catch(()=>{})}).catch(()=>{ay.hidden=true});
ay.addEventListener("click",e=>{const b=e.target.closest("[data-ay]");if(!b||!txt)return;const full="﴿"+txt+"﴾ ["+sn+": "+ar(a)+"]";
 if(b.dataset.ay==="read")window.__openSurahN&&__openSurahN(s);
 else if(b.dataset.ay==="copy"){try{copyText(full)}catch(x){navigator.clipboard&&navigator.clipboard.writeText(full);toast("تم النسخ")}}
 else if(navigator.share)navigator.share({text:full+"\n— من وِرد: "+location.origin}).catch(()=>{});else{try{copyText(full)}catch(x){}}});
})();

(()=>{"use strict";
const $=s=>document.querySelector(s),ar=n=>String(n).replace(/\d/g,__ar);
const fmt=h=>{let s;try{s=fmtT(h)}catch(e){const m=Math.round(h*60)%1440;s=ar(Math.floor(m/60)+":"+String(m%60).padStart(2,"0"))}return String(s).replace(/\s*[صم]\s*$/,"")};
const hijri=new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura",{day:"numeric",month:"long",timeZone:"UTC"});
const greg=new Intl.DateTimeFormat("ar-EG",{weekday:"short",day:"numeric",month:"numeric",timeZone:"UTC"});
function open(){
 const rows=[];for(let k=0;k<30;k++){let d;try{d=prayerDay(k)}catch(e){break}const {t,L,isFri}=d,dt=new Date(Date.UTC(L.y,L.m-1,L.d));
  rows.push(`<tr class="${k===0?"today":""} ${isFri?"fri":""}"><th scope="row"><span>${greg.format(dt)}</span><small>${hijri.format(dt)}</small></th><td>${fmt(t.fajr)}</td><td>${fmt(t.sunrise)}</td><td>${fmt(t.dhuhr)}</td><td>${fmt(t.asr)}</td><td>${fmt(t.maghrib)}</td><td>${fmt(t.isha)}</td></tr>`)}
 const place=(typeof P!=="undefined"&&P.name)?P.name:"";
 const ov=document.createElement("div");ov.className="sheet mt-sheet";ov.setAttribute("role","dialog");ov.setAttribute("aria-label","جدول مواقيت الشهر");
 ov.innerHTML=`<div class="mt-box"><header class="mt-head"><div><h2>مواقيت الصلاة — ٣٠ يومًا</h2><p>${place?"حسب توقيت "+place:""}</p></div><div class="mt-act"><button type="button" class="btn btn-ghost btn-sm" data-m="print">طباعة</button><button type="button" class="icon-btn" data-x aria-label="إغلاق">✕</button></div></header>
<div class="mt-scroll"><table class="mt"><thead><tr><th scope="col">اليوم</th><th scope="col">الفجر</th><th scope="col">الشروق</th><th scope="col">الظهر</th><th scope="col">العصر</th><th scope="col">المغرب</th><th scope="col">العشاء</th></tr></thead><tbody>${rows.join("")}</tbody></table></div></div>`;
 document.body.appendChild(ov);
 const close=()=>ov.remove();
 ov.addEventListener("click",e=>{if(e.target===ov||e.target.closest("[data-x]"))close();else if(e.target.closest('[data-m="print"]'))window.print()});
 addEventListener("keydown",function k(e){if(e.key==="Escape"){close();removeEventListener("keydown",k)}});
}
window.__openMonth=open;
})();