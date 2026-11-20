

(function(){
 const ar=__ar;const T=m=>typeof toast==="function"&&toast(m);
 const ls=(k,v)=>{try{if(v===undefined)return JSON.parse(localStorage.getItem(k)||"null");localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}};
 /* ===== القرّاء ===== */
 const QARI={"ar.alafasy":["مشاري العفاسي",128],"ar.husary":["محمود خليل الحصري",128],"ar.husarymujawwad":["الحصري (مجوّد)",128],"ar.minshawi":["محمد صديق المنشاوي",128],"ar.minshawimujawwad":["المنشاوي (مجوّد)",64],"ar.abdulbasitmurattal":["عبد الباسط عبد الصمد",64],"ar.abdurrahmaansudais":["عبد الرحمن السديس",64],"ar.saoodshuraym":["سعود الشريم",64],"ar.mahermuaiqly":["ماهر المعيقلي",128],"ar.hudhaify":["علي الحذيفي",128],"ar.muhammadayyoub":["محمد أيوب",128],"ar.shaatree":["أبو بكر الشاطري",128],"ar.ahmedajamy":["أحمد العجمي",128]};
 const qk=()=>{const k=ls("wird-qari");return QARI[k]?k:"ar.alafasy"};window.__QARI=QARI;window.__qk=qk;
 window.__qariUrl=id=>{const k=qk();return "https://cdn.islamic.network/quran/audio/"+QARI[k][1]+"/"+k+"/"+id+".mp3"};
 /* ===== مشاركة كصورة ===== */
 window.__shareImg=async(text,ref)=>{try{if(document.fonts&&document.fonts.load)await document.fonts.load("40px Amiri").catch(()=>{});const W=1080,H=1350,cv=document.createElement("canvas");cv.width=W;cv.height=H;const x=cv.getContext("2d");
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#0f2a24");g.addColorStop(1,"#08201b");x.fillStyle=g;x.fillRect(0,0,W,H);
  x.strokeStyle="rgba(212,175,95,.55)";x.lineWidth=3;x.strokeRect(50,50,W-100,H-100);x.strokeStyle="rgba(212,175,95,.25)";x.strokeRect(66,66,W-132,H-132);
  x.direction="rtl";x.textAlign="center";x.fillStyle="#d4af5f";x.font="700 56px Amiri, 'Noto Naskh Arabic', serif";x.fillText("وِرد",W/2,170);
  let fs=text.length>420?40:text.length>250?46:text.length>120?54:62;const wrap=(t,f)=>{x.font=f;const words=t.split(/\s+/),lines=[];let l="";for(const w of words){const tt=l?l+" "+w:w;if(x.measureText(tt).width>W-220&&l){lines.push(l);l=w}else l=tt}l&&lines.push(l);return lines};
  let lines,lh;for(;;){const f="500 "+fs+"px Amiri, 'Noto Naskh Arabic', serif";lines=[];text.split("\n").forEach(p=>lines.push(...wrap(p,f)));lh=fs*1.75;if(lines.length*lh<H-560||fs<=28)break;fs-=4}
  x.font="500 "+fs+"px Amiri, 'Noto Naskh Arabic', serif";x.fillStyle="#f4ecd8";let y=(H-lines.length*lh)/2+fs*.6+20;lines.forEach(l=>{x.fillText(l,W/2,y);y+=lh});
  if(ref){x.font="500 34px Amiri, serif";x.fillStyle="#d4af5f";x.fillText(ref,W/2,H-230)}
  x.font="500 30px system-ui, sans-serif";x.fillStyle="rgba(244,236,216,.8)";x.fillText("wird-azkar.pages.dev",W/2,H-130);
  const blob=await new Promise(r=>cv.toBlob(r,"image/png"));const file=new File([blob],"wird.png",{type:"image/png"});
  if(navigator.canShare&&navigator.canShare({files:[file]}))await navigator.share({files:[file],text:"من تطبيق وِرد — ثبّته من هنا: https://wird-azkar.pages.dev/?i=1"}).catch(()=>{});
  else{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="wird.png";a.click();T("تم حفظ الصورة")}}catch(e){T("تعذّر إنشاء الصورة")}};
 const addImgBtn=()=>{[["#ayText",".ayah-day:not(.hadith-day)"],["#hdText",".hadith-day"]].forEach(([tx,sec])=>{const s=document.querySelector(sec);if(!s||s.querySelector(".img-sh"))return;const act=s.querySelector(".dy-act");if(!act)return;const b=document.createElement("button");b.type="button";b.className="btn btn-ghost btn-sm img-sh";b.textContent="صورة";b.onclick=()=>{const t=(s.querySelector(tx)||{}).textContent||"";const ref=(s.querySelector(".dy-ref")||{}).textContent||"";if(t.length>3)__shareImg(t.trim(),ref)};act.appendChild(b)});
  const wd=document.querySelector(".wd-sheet:not([hidden]) .wd-act");if(wd&&!wd.querySelector(".img-sh")){const b=document.createElement("button");b.type="button";b.className="btn btn-ghost btn-sm img-sh";b.textContent="صورة";b.onclick=()=>{const c=wd.closest(".wd-card");__shareImg((c.querySelector(".wd-ayah")||{}).textContent||"",(c.querySelector(".wd-meta")||{}).textContent.replace(/^.*·\s*/,""))};wd.appendChild(b)}
  const fc=document.querySelector("#focus:not([hidden])");if(fc&&!fc.querySelector(".img-sh")){const tx=fc.querySelector(".f-text,.focus-text,.dh-text,[class*=text]");const host=fc.querySelector(".f-actions,.focus-actions,.f-tools,footer")||null;if(tx&&host){const b=document.createElement("button");b.type="button";b.className="btn btn-ghost btn-sm img-sh";b.textContent="مشاركة كصورة";b.onclick=()=>__shareImg(tx.textContent.trim(),"");host.appendChild(b)}}};
 /* ===== الإعدادات ===== */
 const addSet=()=>{const st=document.querySelector(".st");if(!st)return;
  const look=st.querySelector("#st-look");if(look&&!document.getElementById("st-qari")){const sec=document.createElement("section");sec.className="st-sec";sec.id="st-qari";sec.innerHTML='<h2>القارئ</h2><div class="st-row"><div class="st-l"><strong>صوت التلاوة في المصحف</strong><small>يُستخدم عند الضغط على «استماع»</small></div><div class="st-c"><select id="qariSel">'+Object.entries(QARI).map(([k,v])=>'<option value="'+k+'"'+(k===qk()?" selected":"")+'>'+v[0]+'</option>').join("")+'</select></div></div>';look.after(sec);
   sec.insertAdjacentHTML("beforeend",'<div class="st-row"><div class="st-l"><strong>تقليب صفحات المصحف</strong><small>اتجاه السحب للانتقال للصفحة التالية</small></div><div class="st-c"><select id="swipeSel"><option value="rtl">كالمصحف الورقي: اسحب لليمين →</option><option value="ltr">اسحب لليسار ←</option></select></div></div>');{const sw=sec.querySelector("#swipeSel");try{sw.value=localStorage.getItem("wird-swipe")==="ltr"?"ltr":"rtl"}catch(e){}sw.onchange=e=>{try{localStorage.setItem("wird-swipe",e.target.value)}catch(x){}T("تم حفظ اتجاه التقليب")}}
   sec.querySelector("#qariSel").onchange=e=>{ls("wird-qari",e.target.value);T("القارئ: "+QARI[e.target.value][0])}}};
 const tick=()=>{addSet();addImgBtn()};tick();__wOnDom(()=>{clearTimeout(tick.t);tick.t=setTimeout(tick,120)});
})();