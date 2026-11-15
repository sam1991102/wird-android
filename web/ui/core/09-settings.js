
(()=>{"use strict";
const R=document.documentElement,get=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}},put=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const AR=__ar;
const ic=d=>'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="'+d+'"/></svg>';
const I={gear:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
 sun:"M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2",bell:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0",clock:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",db:"M4 6c0 1.7 3.6 3 8 3s8-1.3 8-3-3.6-3-8-3-8 1.3-8 3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",info:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01"};
const ta=document.querySelector(".top-actions");if(!ta)return;
const gb=document.createElement("button");gb.className="icon-btn";gb.id="settingsBtn";gb.type="button";gb.title="الإعدادات";gb.setAttribute("aria-label","الإعدادات");gb.innerHTML=ic(I.gear);ta.prepend(gb);
let ov;
function sec(id,icon,title,body){return '<section class="st-sec" id="st-'+id+'"><h2>'+ic(icon)+title+'</h2>'+body+'</section>'}
function row(label,ctrl,hint){return '<div class="st-row"><div class="st-l"><strong>'+label+'</strong>'+(hint?'<small>'+hint+'</small>':'')+'</div><div class="st-c">'+ctrl+'</div></div>'}
function seg(name,opts,val){return '<div class="st-seg" role="radiogroup">'+opts.map(([v,t])=>'<button type="button" role="radio" data-seg="'+name+'" data-v="'+v+'" aria-checked="'+(v===val)+'"'+(v==="latin"?" data-latin":"")+'>'+t+'</button>').join("")+'</div>'}
function sw(id,on){return '<label class="st-sw"><input type="checkbox" id="'+id+'"'+(on?" checked":"")+'><span></span></label>'}
function tm(id,v){return '<input type="time" class="st-time" id="'+id+'" value="'+v+'">'}
function themeNow(){return R.classList.contains("dark")?"dark":R.classList.contains("sepia")?"sepia":"light"}
function build(){ov=document.createElement("div");ov.className="st";ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");ov.setAttribute("aria-labelledby","stT");ov.hidden=true;
 const R1=JSON.parse(get("wird-rem2","{}"));const r=(k,d)=>R1[k]!=null?R1[k]:d;
 ov.innerHTML='<header class="st-bar"><button type="button" class="r-btn" data-x aria-label="إغلاق"><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button><strong id="stT">الإعدادات</strong><span style="width:42px"></span></header>'+
 '<nav class="st-tabs" aria-label="أقسام الإعدادات"><a href="#st-look">المظهر</a><a href="#st-prayer">المواقيت</a><a href="#st-remind">التذكيرات</a><a href="#st-data">البيانات</a><a href="#st-about">عن وِرد</a></nav><div class="st-body">'+
 sec("look",I.sun,"المظهر",row("الوضع",seg("theme",[["light","فاتح"],["sepia","ورقي"],["dark","ليلي"]],themeNow()))+row("حجم خط الأذكار",seg("size",[["0","صغير"],["1","عادي"],["2","كبير"],["3","أكبر"],["4","الأكبر"]],get("wird-fs","1")))+row("الأرقام",seg("digits",[["ar","١٢٣"],["latin","123"]],get("wird-digits","ar")),"يُطبَّق بعد إعادة تحميل الصفحة")+row("الاهتزاز عند العدّ",sw("stVib",get("wird-vib","1")!=="0"),"على الهواتف التي تدعمه"))+
 sec("prayer",I.clock,"مواقيت الصلاة",'<div class="st-prayer-slot"></div>')+
 sec("remind",I.bell,"التذكيرات",'<p class="st-note">تُضاف التذكيرات إلى تقويم هاتفك فتصلك حتى لو لم تفتح الموقع. اختر ما تريد ثم اضغط «أضف إلى التقويم» وافتح الملف.</p>'+
  '<h3>الأذكار اليومية</h3>'+row("أذكار الصباح",sw("rm_m",r("m",1))+tm("rt_m",r("tm","06:30")))+row("أذكار المساء",sw("rm_e",r("e",1))+tm("rt_e",r("te","17:30")))+row("أذكار النوم",sw("rm_s",r("s",0))+tm("rt_s",r("ts","22:30")))+
  '<h3>الصلاة</h3>'+row("تنبيه عند كل صلاة",sw("rm_p",r("p",0)),"الفجر والظهر والعصر والمغرب والعشاء لمدة ٣٠ يومًا حسب مدينتك")+row("قبل الأذان بـ",'<select id="rt_pb" class="st-sel"><option value="0">عند الأذان</option><option value="5">٥ دقائق</option><option value="10">١٠ دقائق</option><option value="15">١٥ دقيقة</option></select>')+
  '<h3>السنن</h3>'+row("صيام الاثنين والخميس",sw("rm_mt",r("mt",0)),"تذكير مساء الأحد والأربعاء")+row("الأيام البيض",sw("rm_w",r("w",0)),"١٣ و١٤ و١٥ من كل شهر هجري")+row("سورة الكهف يوم الجمعة",sw("rm_k",r("k",1)))+row("سورة الملك قبل النوم",sw("rm_mu",r("mu",0)))+row("الثلث الأخير من الليل",sw("rm_q",r("q",0)),"يُحسب يوميًا من المغرب إلى الفجر")+
  '<button type="button" class="btn btn-primary st-add">أضف إلى التقويم</button>')+
 sec("data",I.db,"البيانات",'<div class="st-backup-slot"></div>'+row("مسح التقدّم",'<button type="button" class="btn btn-ghost st-reset">مسح</button>',"يحذف العدّ والإحصائيات من هذا الجهاز"))+
 sec("about",I.info,"عن وِرد",'<div class="ab-hero"><img class="ab-ic" src="/icon-512.png" alt="" width="84" height="84"><h3 class="ab-nm">وِرد</h3><p class="ab-tg">أذكارك ووِردك من القرآن ومواقيت الصلاة</p><p class="st-ver ab-ver">الإصدار '+AR(41)+'</p></div>'+
  '<blockquote class="ab-hd"><p>«لا يزالُ لسانُك رطبًا من ذكرِ الله»</p><cite>رواه الترمذي وابن ماجه</cite></blockquote>'+
  '<h3 class="ab-h">مبادئ وِرد</h3><ul class="ab-pr"><li><b>مجاني بالكامل</b><span>بلا إعلانات ولا اشتراكات</span></li><li><b>من غير حساب</b><span>تبدأ على طول من غير تسجيل</span></li><li><b>تقدّمك على جهازك</b><span>العدّ والختمة والإعدادات ما بتتبعتش لأي سيرفر</span></li><li><b>المصادر موثّقة</b><span>كل ذكر وحديث مكتوب مصدره</span></li></ul>'+
  '<h3 class="ab-h">المصادر</h3><ul class="ab-src"><li><b>نص المصحف وخطوطه</b><span>مصحف المدينة النبوية من مجمع الملك فهد لطباعة المصحف الشريف، عن طريق <bdi data-latin dir="ltr">quran.com</bdi></span></li><li><b>التفسير الميسر</b><span>من مجمع الملك فهد، عن طريق <bdi data-latin dir="ltr">quran.com</bdi></span></li><li><b>التلاوات</b><span>عن طريق <bdi data-latin dir="ltr">islamic.network</bdi> و<bdi data-latin dir="ltr">quran.com</bdi></span></li><li><b>الإذاعات</b><span>روابط البث المباشر من <bdi data-latin dir="ltr">mp3quran.net</bdi> وغيره</span></li><li><b>مواقيت الصلاة</b><span>بتتحسب على جهازك بالمعادلات الفلكية وطريقة الحساب اللي تختارها</span></li></ul>'+
  '<div class="ab-act"><button type="button" class="btn btn-primary ab-share">شارك وِرد</button><div class="st-links"><a href="/privacy.html">سياسة الخصوصية</a><a href="/contact.html">تواصل معنا</a><a href="/about.html">عن الموقع</a></div></div>'+
  '<p class="ab-dua">لا تنسونا من صالح دعائكم</p>')+'</div>';
 document.body.append(ov);
 const ps=document.getElementById("prayerSettings");if(ps){ov.querySelector(".st-prayer-slot").append(ps);ps.hidden=false;ps.classList.add("st-inner")}
 const bk=document.querySelector(".backup");if(bk){ov.querySelector(".st-backup-slot").append(bk)}
 ov.querySelector("[data-x]").onclick=close;
 ov.addEventListener("click",e=>{const b=e.target.closest("[data-seg]");if(b){const g=b.dataset.seg,v=b.dataset.v;b.parentElement.querySelectorAll("button").forEach(x=>x.setAttribute("aria-checked",x===b));apply(g,v)}
  const a=e.target.closest(".st-tabs a");if(a){e.preventDefault();ov.querySelector(a.getAttribute("href")).scrollIntoView({behavior:"smooth",block:"start"})}});
 ov.querySelector("#stVib").onchange=e=>{put("wird-vib",e.target.checked?"1":"0")};
 ov.querySelector(".st-add").onclick=addAll;
 ov.querySelector(".ab-share").onclick=async()=>{const u="https://wird-azkar.pages.dev",t="وِرد: أذكار وقرآن ومواقيت الصلاة، مجاني من غير إعلانات";
  try{if(navigator.share){await navigator.share({title:"وِرد",text:t,url:u});return}}catch(e){if(e&&e.name==="AbortError")return}
  try{await navigator.clipboard.writeText(t+"\n"+u);toast("اتنسخ رابط وِرد، ابعته لمين ما تحب")}catch(e){toast(u)}};
 ov.querySelector(".st-reset").onclick=()=>{(window.__wConfirm?__wConfirm:function(m){return Promise.resolve(confirm(m))})("حذف كل العدّ والإحصائيات؟\nهيتمسحوا من الجهاز ده ومش هتقدر ترجّعهم.",{ok:"حذف",danger:true}).then(y=>{if(!y)return;Object.keys(localStorage).filter(k=>/^wird-(day|progress|history|tasbih|counter)$/.test(k)).forEach(k=>localStorage.removeItem(k));location.reload()})};
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!ov.hidden)close()})}
function apply(g,v){if(g==="theme"){const tb=document.getElementById("themeBtn");for(let i=0;i<3&&themeNow()!==v;i++)tb&&tb.click()}
 else if(g==="size"){window.__setFS&&window.__setFS(+v)}
 else if(g==="digits"){put("wird-digits",v);typeof toast==="function"&&toast("سيتغيّر شكل الأرقام بعد إعادة التحميل");setTimeout(()=>location.reload(),900)}}
const pad=n=>String(n).padStart(2,"0");
const ymd=(y,m,d)=>y+pad(m)+pad(d);
function hm(h){h=((h%24)+24)%24;const m=Math.round(h*60);return[Math.floor(m/60)%24,m%60]}
function ev(uid,date,hh,mm,title,desc,rule){return["BEGIN:VEVENT","UID:"+uid+"@"+location.host,"DTSTAMP:"+new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z","DTSTART:"+date+"T"+pad(hh)+pad(mm)+"00","DURATION:PT10M",rule?"RRULE:"+rule:null,"SUMMARY:"+title,"DESCRIPTION:"+desc,"BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+title,"TRIGGER:PT0M","END:VALARM","END:VEVENT"].filter(Boolean).join("\r\n")}
function hijri(d){try{const p=new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn",{day:"numeric",month:"numeric"}).formatToParts(d);return{d:+p.find(x=>x.type==="day").value,m:+p.find(x=>x.type==="month").value}}catch(e){return null}}
function addAll(){const $=s=>ov.querySelector(s)||document.querySelector(s),on=id=>$("#"+id).checked,t=id=>($("#"+id).value||"06:00").split(":").map(Number);
 const S={m:on("rm_m"),e:on("rm_e"),s:on("rm_s"),p:on("rm_p"),mt:on("rm_mt"),w:on("rm_w"),k:on("rm_k"),mu:on("rm_mu"),q:on("rm_q"),tm:$("#rt_m").value,te:$("#rt_e").value,ts:$("#rt_s").value};put("wird-rem2",JSON.stringify(S));
 const now=new Date(),today=ymd(now.getFullYear(),now.getMonth()+1,now.getDate()),O=location.origin,E=[];
 if(S.m){const[h,m]=t("rt_m");E.push(ev("w-m",today,h,m,"أذكار الصباح — وِرد",O+"/morning","FREQ=DAILY"))}
 if(S.e){const[h,m]=t("rt_e");E.push(ev("w-e",today,h,m,"أذكار المساء — وِرد",O+"/evening","FREQ=DAILY"))}
 if(S.s){const[h,m]=t("rt_s");E.push(ev("w-s",today,h,m,"أذكار النوم — وِرد",O+"/sleep","FREQ=DAILY"))}
 if(S.mu){E.push(ev("w-mu",today,22,0,"سورة الملك قبل النوم — وِرد",O+"/#mushaf","FREQ=DAILY"))}
 if(S.k){E.push(ev("w-k",today,9,0,"سورة الكهف — يوم الجمعة",O+"/friday","FREQ=WEEKLY;BYDAY=FR"))}
 if(S.mt){E.push(ev("w-mt",today,21,0,"غدًا صيام سنّة (الاثنين/الخميس)","تذكير من وِرد","FREQ=WEEKLY;BYDAY=SU,WE"))}
 if(S.w){for(let i=0;i<370;i++){const d=new Date(now.getTime()+i*864e5),h=hijri(d);if(h&&h.d===12)E.push(ev("w-w-"+i,ymd(d.getFullYear(),d.getMonth()+1,d.getDate()),21,0,"غدًا أول الأيام البيض (١٣ و١٤ و١٥)","تذكير بصيام الأيام البيض — وِرد"))}}
 if((S.p||S.q)&&typeof prayerDay==="function"){const before=+$("#rt_pb").value||0;
  for(let k=0;k<30;k++){const{t:T,L}=prayerDay(k),D=ymd(L.y,L.m,L.d);
   if(S.p)["fajr","dhuhr","asr","maghrib","isha"].forEach(p=>{const[h,m]=hm(T[p]-before/60);E.push(ev("w-p-"+p+"-"+D,D,h,m,(before?"بعد "+before+" د: ":"")+"صلاة "+PNAMES[p],"مواقيت "+P.name+" — وِرد"))});
   if(S.q){const N=prayerDay(k+1).t.fajr+24,q=T.maghrib+2*(N-T.maghrib)/3;const[h,m]=hm(q);const dd=q>=24?(()=>{const x=prayerDay(k+1).L;return ymd(x.y,x.m,x.d)})():D;E.push(ev("w-q-"+D,dd,h,m,"الثلث الأخير من الليل","وقت النزول الإلهي والدعاء — وِرد"))}}}
 if(!E.length){typeof toast==="function"&&toast("اختر تذكيرًا واحدًا على الأقل");return}
 const ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//wird//ar","CALSCALE:GREGORIAN","X-WR-CALNAME:وِرد"].concat(E,["END:VCALENDAR"]).join("\r\n");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([ics],{type:"text/calendar;charset=utf-8"}));a.download="wird-reminders.ics";document.body.append(a);a.click();a.remove();
 typeof toast==="function"&&toast("افتح الملف لإضافة "+AR(E.length)+" تذكيرًا إلى تقويمك")}
let lf;function open(sectionId){lf=document.activeElement;if(!ov)build();ov.hidden=false;R.classList.add("reader-open");
 ov.querySelectorAll('[data-seg="theme"]').forEach(b=>b.setAttribute("aria-checked",b.dataset.v===themeNow()));
 if(sectionId){const s=ov.querySelector("#st-"+sectionId);s&&setTimeout(()=>s.scrollIntoView({block:"start"}),30)}else ov.querySelector(".st-body").scrollTop=0;ov.querySelector("[data-x]").focus()}
function close(){ov.hidden=true;if(!document.querySelector(".reader:not([hidden]),.mp:not([hidden])"))R.classList.remove("reader-open");lf&&lf.focus&&lf.focus()}
window.__openSettings=open;
if(navigator.vibrate){const v0=navigator.vibrate.bind(navigator);navigator.vibrate=(...a)=>get("wird-vib","1")!=="0"&&v0(...a)}gb.onclick=()=>open();
const psb=document.getElementById("prayerSettingsBtn");if(psb){const n=psb.cloneNode(true);psb.replaceWith(n);n.addEventListener("click",()=>open("prayer"))}
if(location.hash==="#settings")setTimeout(()=>open(),300);
})();
(()=>{"use strict";
const R=document.documentElement,get=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}},put=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const SIZES=[20,24,28,32,36];
function applyFS(i){i=Math.max(0,Math.min(4,i|0));R.classList.remove("large-text");R.style.setProperty("--text-size",SIZES[i]+"px");R.style.setProperty("--focus-scale",(.85+i*.15).toFixed(2));put("wird-fs",i)}
let FS=+get("wird-fs",get("wird-large-text","false")==="true"?2:1);applyFS(FS);
const fb=document.getElementById("fontBtn");if(fb){const n=fb.cloneNode(true);fb.replaceWith(n);n.title="حجم الخط";n.setAttribute("aria-label","تكبير الخط");n.addEventListener("click",()=>{FS=(FS+1)%5;applyFS(FS);typeof toast==="function"&&toast("حجم الخط: "+["صغير","عادي","كبير","أكبر","الأكبر"][FS])})}
window.__setFS=i=>{FS=i;applyFS(i)};
const lib=document.getElementById("library");if(!lib)return;
const head=lib.querySelector(".section-head"),search=document.getElementById("searchInput");
const grid=document.createElement("div");grid.className="cat-grid";grid.id="catGrid";
const intro=document.createElement("div");intro.className="lib-intro";intro.innerHTML='<p>اختر قسمًا لتقرأ أذكاره بالعدّاد، أو ابحث في كل الأذكار.</p>';
const back=document.createElement("button");back.type="button";back.className="lib-back";back.innerHTML='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg> كل الأقسام';
const tb=lib.querySelector(".toolbar");head.before(back);head.after(intro);tb.after(grid);intro.after(tb);
const GROUPS=[["اليوم والليلة",["morning","evening","sleep","wake","prayer","adhan"]],["المسجد والعبادة",["wudu","masjid","quran","friday","istikhara"]],["أحوال الحياة",["home","food","travel","market","weather","family","daily"]],["الشدة والدعاء",["kurb","sick","grief","general"]],["المواسم",["ramadan","hajj"]]];
function tile(id){const c=categories.find(x=>x.id===id);if(!c)return"";const n=catItems(id).length,p=Math.round(typeof catPct==="function"?catPct(id):0);
 return '<button type="button" class="cat-tile" data-tile="'+id+'" style="--tp:'+p+'"><span class="ct-ic">'+ic(id)+'</span><span class="ct-tx"><strong>'+c.name+'</strong><small>'+n+' '+(n>=3&&n<=10?"أذكار":"ذكرًا")+(p?' · '+p+'٪':'')+'</small></span>'+(p>=100?'<span class="ct-done" aria-label="مكتمل">✓</span>':'')+'<span class="ct-bar"><i></i></span></button>'}
function renderGrid(){const fav=typeof favorites!=="undefined"?favorites.size:0;
 let h='<div class="cg-top"><button type="button" class="cat-tile wide" data-tile="mine"><span class="ct-ic">'+ic("mine")+'</span><span class="ct-tx"><strong>وِردي الخاص</strong><small>'+fav+' ذكرًا اخترته</small></span></button><button type="button" class="cat-tile wide" data-tile="all"><span class="ct-ic">'+ic("all")+'</span><span class="ct-tx"><strong>كل الأذكار</strong><small>'+adhkar.length+' ذكرًا</small></span></button></div>';
 const used=new Set(GROUPS.flatMap(g=>g[1]));const rest=categories.filter(c=>c.id!=="all"&&c.id!=="mine"&&!used.has(c.id)).map(c=>c.id);
 GROUPS.concat(rest.length?[["أقسام أخرى",rest]]:[]).forEach(([t,ids])=>{const tl=ids.map(tile).join("");if(tl)h+='<h3 class="cg-h">'+t+'</h3><div class="cg-list">'+tl+'</div>'});grid.innerHTML=h}
const lt=document.getElementById("libTitle");function mode(m){R.dataset.lib=m;if(m==="grid"){renderGrid();lt.textContent="أقسام الأذكار"}else if(lt.textContent==="أقسام الأذكار"&&typeof activeCategory!=="undefined")lt.textContent=activeCategory==="all"?"كل الأذكار":catName(activeCategory)}
grid.addEventListener("click",e=>{const t=e.target.closest("[data-tile]");if(!t)return;setCategory(t.dataset.tile);mode("list");scrollTo({top:0,behavior:"instant"})});
back.addEventListener("click",()=>{search.value="";search.dispatchEvent(new Event("input"));mode("grid");scrollTo({top:0,behavior:"instant"})});
const orig=setCategory;window.setCategory=setCategory=function(...a){const r=orig.apply(this,a);if(R.dataset.lib==="grid")mode("list");return r};
search.addEventListener("input",()=>{if(search.value.trim())mode("list")});
document.addEventListener("click",e=>{if(e.target.closest('.bottom-nav.nav5 [data-tab="library"]')){search.value="";mode("grid")}},true);
mode(slugFromPath()?"list":"grid");
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&R.dataset.lib==="grid")renderGrid()});
const f=document.getElementById("focus");if(f)new MutationObserver(()=>{if(f.hidden&&R.dataset.lib==="grid")renderGrid()}).observe(f,{attributes:true,attributeFilter:["hidden"]});
})();