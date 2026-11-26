(function(){
 const T=m=>typeof toast==="function"&&toast(m);const ar=__ar;
 const J=(k,v)=>{try{if(v===undefined)return JSON.parse(localStorage.getItem(k)||"null");localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}};
 const esc=t=>String(t).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[m]);
 const PG={"hj-sheet":"تقويم أم القرى وأيامه المميزة","nm-sheet":"تسعة وتسعون اسمًا ومعانيها","bm-sheet":"الآيات التي حفظتها من المصحف"};
 /* المحتوى اللي بيتقري بيفتح صفحة كاملة بنفس شكل باقي الصفحات؛ البحث يفضل لوحة سريعة */
 const open=(cls,html)=>{if(PG[cls]&&window.__wPage){document.querySelectorAll(".wp-page."+cls).forEach(x=>x.remove());
   const m=html.match(/^<div class="tl-h">([^<]*)<\/div>/);const title=m?m[1]:"";const body=m?html.slice(m[0].length):html;let s=null;
   const pg=__wPage({title:title,sub:PG[cls],cls:"tl-pg "+cls,html:'<div class="tl-pg-b">'+body+'</div>',onClose:()=>{s&&s.dispatchEvent(new Event("tlclose"))}});s=pg.el;return s}
  document.querySelectorAll(".wd-sheet."+cls).forEach(x=>x.remove());const s=document.createElement("div");s.className="wd-sheet tl-sheet "+cls;s.setAttribute("role","dialog");s.setAttribute("aria-modal","true");s.innerHTML='<div class="wd-card tl-card"><button type="button" class="wd-x" data-x aria-label="إغلاق">×</button>'+html+'</div>';s.addEventListener("click",e=>{if(e.target===s||e.target.closest("[data-x]")){s.hidden=true;s.dispatchEvent(new Event("tlclose"));setTimeout(()=>s.remove(),50)}});document.body.appendChild(s);return s};
 /* ===== هجري ===== */
 const HF=new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn",{day:"numeric",month:"numeric",year:"numeric"});
 const hj=d=>{const p={};HF.formatToParts(d).forEach(x=>p[x.type]=x.value);return{d:+p.day,m:+p.month,y:parseInt(p.year)}};
 const HM=["محرم","صفر","ربيع الأول","ربيع الآخر","جمادى الأولى","جمادى الآخرة","رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة"];
 const OCC={"1-1":"رأس السنة الهجرية","1-9":"تاسوعاء — يُستحب صيامه","1-10":"عاشوراء — صيامه يكفّر السنة الماضية","9-1":"أول رمضان","10-1":"عيد الفطر","12-1":"أول العشر من ذي الحجة","12-9":"يوم عرفة — صيامه يكفّر سنتين","12-10":"عيد الأضحى","12-11":"أيام التشريق","12-12":"أيام التشريق","12-13":"أيام التشريق"};
 const fastNote=(h,wd)=>{const o=OCC[h.m+"-"+h.d];if(o)return o;if(h.m===9)return"رمضان";if([13,14,15].includes(h.d)&&!(h.m===12&&h.d===13))return"من الأيام البيض — يُستحب صيامها";if(wd===1)return"الإثنين — يُستحب صيامه";if(wd===4)return"الخميس — يُستحب صيامه";return""};
 const HS=()=>Object.assign({on:false,mt:1,white:1,big:1},J("wird-hijri")||{});
 window.__hijriEvents=days=>{const s=HS();if(!s.on)return[];const out=[],now=new Date();for(let i=0;i<(days||3)+1;i++){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i+1,12),h=hj(d),wd=d.getDay(),o=OCC[h.m+"-"+h.d];let msg="";
  if(s.big&&o&&/صيام/.test(o))msg="غدًا "+o.split(" — ")[0]+"، "+o.split(" — ")[1];else if(s.white&&[13,14,15].includes(h.d)&&h.m!==9&&!(h.m===12&&h.d===13))msg="غدًا من الأيام البيض، يُستحب صيامها";else if(s.mt&&(wd===1||wd===4)&&h.m!==9)msg="غدًا "+(wd===1?"الإثنين":"الخميس")+"، يُستحب صيامه";
  if(msg)out.push({t:new Date(now.getFullYear(),now.getMonth(),now.getDate()+i,20,30).getTime(),title:"تذكير بالصيام",body:msg,tag:"fast-"+i,url:"/"})}return out};
 const hijriSheet=()=>{let off=0;const s=open("hj-sheet",'<div class="tl-h">التقويم الهجري</div><div class="hj-today"></div><div class="hj-nav"><button type="button" class="btn btn-ghost btn-sm" data-h="p">الشهر السابق</button><b class="hj-title"></b><button type="button" class="btn btn-ghost btn-sm" data-h="n">الشهر التالي</button></div><div class="hj-grid"></div><div class="hj-list"></div><div class="tl-sub">تذكير بالصيام <small>(إشعار مساء اليوم السابق)</small></div><div class="hj-opts"></div><p class="wd-meta">التاريخ حسب تقويم أم القرى، وقد يختلف يومًا حسب رؤية الهلال في بلدك.</p>');
  const today=new Date();today.setHours(12,0,0,0);const th=hj(today);
  s.querySelector(".hj-today").innerHTML='<div class="hj-big">'+ar(th.d)+' '+HM[th.m-1]+' '+ar(th.y)+' هـ</div><div class="wd-meta">'+today.toLocaleDateString("ar-EG",{weekday:"long",day:"numeric",month:"long",year:"numeric"})+'</div>'+(fastNote(th,today.getDay())?'<div class="hj-note">'+fastNote(th,today.getDay())+'</div>':'');
  const draw=()=>{let d=new Date(today);let h=hj(d);d.setDate(d.getDate()-(h.d-1));let k=0;while(k<off){d.setDate(d.getDate()+30);h=hj(d);d.setDate(d.getDate()-(h.d-1));k++}while(k>off){d.setDate(d.getDate()-1);h=hj(d);d.setDate(d.getDate()-(h.d-1));k--}
   const m0=hj(d);s.querySelector(".hj-title").textContent=HM[m0.m-1]+" "+ar(m0.y);let g='';["أحد","إثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"].forEach(w=>g+='<span class="hj-w">'+w+'</span>');for(let i=0;i<d.getDay();i++)g+='<span></span>';const items=[];
   for(let x=new Date(d);;x.setDate(x.getDate()+1)){const h=hj(x);if(h.m!==m0.m)break;const n=fastNote(h,x.getDay()),o=OCC[h.m+"-"+h.d];const isT=x.toDateString()===today.toDateString();g+='<span class="hj-d'+(isT?" on":"")+(o?" occ":/البيض/.test(n)?" wh":"")+'" title="'+esc(n)+'"><b>'+ar(h.d)+'</b><small>'+ar(x.getDate())+'</small></span>';if(o)items.push('<li><b>'+ar(h.d)+' '+HM[h.m-1]+'</b> ('+x.toLocaleDateString("ar-EG",{day:"numeric",month:"short"})+'): '+o+'</li>')}
   s.querySelector(".hj-grid").innerHTML=g;s.querySelector(".hj-list").innerHTML=items.length?'<ul>'+items.join("")+'</ul>':'<p class="wd-meta">صيام الأيام البيض: ١٣ و١٤ و١٥ من الشهر.</p>'};
  const opts=()=>{const o=HS();s.querySelector(".hj-opts").innerHTML=[["on","تفعيل تذكير الصيام"],["mt","الإثنين والخميس"],["white","الأيام البيض"],["big","عرفة وعاشوراء وتاسوعاء"]].map(([k,l])=>'<label class="pm-row"><span>'+l+'</span><span class="st-sw"><input type="checkbox" data-o="'+k+'"'+(o[k]?" checked":"")+'><span></span></span></label>').join("")};
  draw();opts();s.addEventListener("click",e=>{const b=e.target.closest("[data-h]");if(b){off+=b.dataset.h==="n"?1:-1;draw()}});
  s.addEventListener("change",e=>{const k=e.target.dataset.o;if(!k)return;const o=HS();o[k]=e.target.checked?1:0;if(k==="on")o.on=e.target.checked;J("wird-hijri",o);try{__wirdPush.sync()}catch(x){}if(k==="on"&&o.on){const p=window.__wirdPush&&__wirdPush.state&&__wirdPush.state();T(p&&!p.on?"فعّل الإشعارات أولًا من الإعدادات":"تم تفعيل تذكير الصيام")}})};
 /* ===== الأدعية ===== */
 
 
 window.__openHijri=hijriSheet;
 /* ===== بطاقة الأدوات في الرئيسية ===== */
 const mk=()=>{const after=document.querySelector(".hadith-day")||document.querySelector(".ayah-day");if(!after||document.querySelector(".tools-day"))return!!after;const h=hj(new Date());const sec=document.createElement("section");sec.className="container section tools-day";sec.dataset.v="home";
  sec.innerHTML='<div class="tl-grid"><button type="button" class="tl-tile" data-t="h"><span class="tl-ic">🌙</span><b>التقويم الهجري</b><small>'+ar(h.d)+' '+HM[h.m-1]+'</small></button><button type="button" class="tl-tile" data-t="q"><span class="tl-ic">🧭</span><b>اتجاه القبلة</b><small>بالبوصلة</small></button><button type="button" class="tl-tile" data-t="d"><span class="tl-ic">🤲</span><b>الأدعية</b><small>من القرآن والسنة</small></button></div>';
  after.after(sec);sec.addEventListener("click",e=>{const b=e.target.closest("[data-t]");if(!b)return;({h:hijriSheet,q:()=>window.__openQibla(),d:()=>window.__openDuas()})[b.dataset.t]()});return true};
 if(!mk())__wWait(mk,()=>{})
})();
