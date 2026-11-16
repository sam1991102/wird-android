

;(function(){/* أرقام آيات الرقية */try{var S={"rq-1":1,"rq-2":255,"rq-3":285,"rq-4":1,"rq-5":1,"rq-6":1,"rq-7":117,"rq-8":81,"rq-9":69,"rq-10":82};var A=__ar;
adhkar.forEach(function(a){var s=S[a.id];if(!s||/﴿/.test(a.text))return;var n=s;a.text=a.text.replace(/\s*۝\s*/g,function(){return" ﴿"+A(n++)+"﴾ "}).replace(/\s*$/," ﴿"+A(n)+"﴾")})}catch(e){}})();
;(function(){/* توحيد ترقيم الآيات والمصادر */try{
var A=__ar;var B=function(n){return" ﴿"+A(n)+"﴾"};
var RX=/سورة\s+([^،:—\-0-9]+?)\s*(?:،\s*(?:آية|الآيات)\s*|:\s*)(\d+)(?:\s*[-–]\s*(\d+))?/;
adhkar.forEach(function(a){if(!a||!a.text)return;var t=a.text;
 if(!/﴿/.test(t)){
  /* المعوذات في الصباح والمساء والنوم: بسملة ثم آيات مفصولة بنجمة */
  var m0=t.match(/^(بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ)\.\s*([\s\S]+)$/);
  if(m0&&/\*/.test(m0[2])){var n=1;a.text=m0[1]+" "+m0[2].trim().replace(/\s*\*\s*/g,function(){return B(n++)+" "})+B(n)}
  else{var m=String(a.source||"").match(RX);if(m){var s=+m[2],e=m[3]?+m[3]:s,cnt=e-s+1;
   if(cnt===1){a.text=t.trim()+B(s)}
   else{var sep=/\s\*\s/.test(t)?/\s*\*\s*/g:/،\s*/g;var parts=t.split(sep);if(parts.length===cnt){a.text=parts.map(function(p,i){return p.trim()+B(s+i)}).join(" ")}}}}
 }
 /* المصدر: أرقام عربية وصيغة موحّدة */
 if(a.source){a.source=String(a.source).replace(/،\s*حديث\s*(\d+)/g," ($1)").replace(/(سورة\s+[^،:—]+?)،\s*(?:آية|الآيات)\s*/g,"$1: ").replace(/\s*[-–]\s*(?=\d)/g,"–").replace(/\d+/g,function(x){return A(x)})}
})}catch(e){}})();
;(function(){/* ترقيم آيات إضافي: آية الكرسي وأدعية قرآنية بصيغة مختصرة */try{
var A=__ar;var B=function(n){return" ﴿"+A(n)+"﴾"};var E=function(s){return String(s).replace(/[٠-٩]/g,__en)};
adhkar.forEach(function(a){if(!a||!a.text||/﴿/.test(a.text))return;var t=a.text.trim();
 if(/الْحَيُّ الْقَيُّومُ/.test(t)&&/وَهُوَ الْعَلِيُّ الْعَظِيمُ\.?$/.test(t)){a.text=t.replace(/\.?$/,"")+B(255);return}
 var m=E(a.source||"").match(/^(?:سورة\s+)?(البقرة|آل عمران|طه|الأعراف|إبراهيم|الإسراء|الفرقان|الأنبياء|الكهف|المؤمنون|الحشر|التحريم|نوح|القصص|الممتحنة|يونس|هود|الشعراء|النمل|الصافات|غافر|الدخان|الأحقاف|المائدة|النساء|الأنعام|يوسف|الرعد|مريم|الحج|النور)\s*[:،]\s*(\d+)(?:\s*[-–]\s*(\d+))?/);if(!m)return;
 var s=+m[2],e=m[3]?+m[3]:s;
 if(s===e){a.text=t+B(s)}
 else if(m[1]==="طه"&&s===25&&e===26){a.text=t.replace(/(صَدْرِي)\s*،?\s*/,"$1"+B(25)+" ")+B(26)}
 else{var parts=t.split(/\s*[،*]\s*/);if(parts.length===e-s+1)a.text=parts.map(function(p,i){return p+B(s+i)}).join(" ")}
 a.source=String(a.source).replace(/^(?!سورة)/,"سورة ").replace(/\s*-\s*/g,"–")})}catch(e){}})();
;(function(){/* حذف الدعاء المكرر (طه ٢٥–٢٦) داخل «أدعية قرآنية» — النسخة الكاملة ٩٧ باقية */try{var i=adhkar.findIndex(function(a){return a.id===1009||a.id==="1009"});if(i>-1&&adhkar.some(function(a){return String(a.id)==="97"})){adhkar.splice(i,1);try{if(favorites.has(1009)||favorites.has("1009")){favorites.delete(1009);favorites.delete("1009");favorites.add(97);store.set("wird-favorites",[...favorites])}}catch(e){}}}catch(e){}})();
;(function(){/* دعاء بديل في «أدعية قرآنية»: الحشر ١٠ */try{if(!adhkar.some(function(a){return a.id==="x4-1"}))adhkar.push({id:"x4-1",cat:"quran",text:"رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَحِيمٌ ﴿١٠﴾",repeat:1,fadl:"دعاء المؤمنين لمن سبقهم بالإيمان، وسؤال الله سلامة القلب",source:"سورة الحشر: ١٠"})}catch(e){}})();
;(function(){/* أسماء السور في مصادر الأذكار لتسهيل البحث */try{var M={1:"آية الكرسي",21:"آية الكرسي",2:"سورة الإخلاص",22:"سورة الإخلاص",56:"سورة الإخلاص",3:"سورة الفلق",23:"سورة الفلق",57:"سورة الفلق",4:"سورة الناس",24:"سورة الناس",58:"سورة الناس"};adhkar.forEach(function(a){var p=M[a.id];if(p&&a.source&&a.source.indexOf(p)!==0)a.source=p+" — "+a.source})}catch(e){}})();
;(function(){/* شارة الوقت الحالي + خط المصحف للنص القرآني */
var NM={fajr:"وقت الفجر",duha:"وقت الضحى",day:"وقت الظهر",asr:"وقت العصر",maghrib:"وقت المغرب",night:"الليل"};
function chip(){var tp=document.documentElement.getAttribute("data-tp");var s=document.querySelector(".tb-strip");if(!s)return;var c=s.querySelector(".tp-chip");if(!tp){c&&c.remove();return}if(!c){c=document.createElement("span");c.className="tp-chip";c.innerHTML="<i></i><b></b>";s.appendChild(c)}var t=NM[tp]||"";if(c.lastChild.textContent!==t)c.lastChild.textContent=t}
new MutationObserver(chip).observe(document.documentElement,{attributes:true,attributeFilter:["data-tp"]});setTimeout(chip,1500);
var QR=/[ٱۖۗۚۛۙۘ]/;function tag(){["#fText",".wp-rq .wp-ar"].forEach(function(s){document.querySelectorAll(s).forEach(function(e){e.classList.toggle("q-uth",QR.test(e.textContent))})})}
new MutationObserver(function(){clearTimeout(tag.t);tag.t=setTimeout(tag,60)}).observe(document.body,{childList:true,subtree:true,characterData:true});})();
;(function(){/* توحيد صيغة المصادر + علامة درجة الحديث */try{
var R=[[/^صحيح البخاري \(([^)]+)\)،\s*ومسلم \(([^)]+)\)/,"متفق عليه: البخاري ($1)، ومسلم ($2)"],[/^صحيح البخاري ومسلم/,"متفق عليه"],[/^صحيح مسلم/,"رواه مسلم"],[/^صحيح البخاري/,"رواه البخاري"],[/^سنن أبي داود والترمذي/,"رواه أبو داود والترمذي"],[/^سنن أبي داود/,"رواه أبو داود"],[/^سنن الترمذي/,"رواه الترمذي"],[/^سنن النسائي/,"رواه النسائي"],[/^سنن ابن ماجه/,"رواه ابن ماجه"],[/^مسند أحمد/,"رواه أحمد"]];
adhkar.forEach(function(a){if(!a||!a.source)return;var s=String(a.source),pre="",m=s.match(/^((?:سورة [^—]+|آية الكرسي) — )(.*)$/);if(m){pre=m[1];s=m[2]}
 if(/في إسناده ضعف|إسناده ضعيف/.test(s))a.grade="w";else if(/موقوف/.test(s))a.grade="m";
 if(!/^سورة /.test(s)){R.forEach(function(r){s=s.replace(r[0],r[1])})}a.source=pre+s})}catch(e){}
var GL={w:"إسناده ضعيف",m:"موقوف على صحابي"};
function badge(){try{var el=document.getElementById("fSrc");if(!el||!F||!F.list)return;var d=F.list[F.i];var b=document.getElementById("fGrade");if(d&&d.grade){if(!b){b=document.createElement("span");b.id="fGrade";el.parentNode.insertBefore(b,el)}b.className="grade-b g-"+d.grade;b.textContent=GL[d.grade]}else if(b)b.remove()}catch(e){}}
var r1=window.renderFocus;if(typeof r1==="function")window.renderFocus=function(){var x=r1.apply(this,arguments);badge();return x};})();
;(function(){/* مراجعة المصادر (v220): أرقام موثّقة بمطابقة النص في كتب السنة + درجات الألباني */try{
var S={
17:"رواه مسلم (٢٦٩٢)",
6:"رواه أبو داود (٥٠٦٨)، والترمذي (٣٣٩١)",26:"رواه أبو داود (٥٠٦٨)، والترمذي (٣٣٩١)",
52:"متفق عليه: البخاري (٦٣٢٠)، ومسلم (٢٧١٤)",
63:"رواه مسلم (٢٣٤)",64:"رواه الترمذي (٥٥)",66:"رواه مسلم (٧١٣)",69:"رواه مسلم (٧١٣)",
73:"رواه البخاري (٥٤٥٨)",77:"رواه أبو داود (٥٠٩٥)، والترمذي (٣٤٢٦)",
79:"متفق عليه: البخاري (٦٣٤٦)، ومسلم (٢٧٣٠)",80:"رواه أبو داود (٥٠٩٠)","x2-49":"رواه أبو داود (٥٠٩٠)",
83:"رواه البخاري (٦٣٦٣)",85:"رواه مسلم (١٣٤٢)",100:"رواه البخاري (١١٦٢)",101:"رواه البخاري (٣٦١٦)",
102:"رواه أبو داود (٣١٠٦)، والترمذي (٢٠٨٣)","rq-14":"رواه أبو داود (٣١٠٦)، والترمذي (٢٠٨٣)",
103:"متفق عليه: البخاري (٥٦٧٥)، ومسلم (٢١٩١)",1028:"متفق عليه: البخاري (٥٦٧٥)، ومسلم (٢١٩١)","rq-12":"متفق عليه: البخاري (٥٦٧٥)، ومسلم (٢١٩١)",
105:"رواه مسلم (٢٢٠٢)",1026:"رواه مسلم (٢٢٠٢)","rq-11":"رواه مسلم (٢٢٠٢)",
106:"رواه البخاري (١٠٣٢)",107:"متفق عليه: البخاري (٨٤٦)، ومسلم (٧١)",108:"متفق عليه: البخاري (١٠١٤)، ومسلم (٨٩٧)",
109:"رواه مسلم (٨٩٩)",110:"متفق عليه: البخاري (٦١٣)، ومسلم (٣٨٥)",111:"رواه مسلم (٣٨٤)",112:"رواه البخاري (٦١٤)",
113:"متفق عليه: البخاري (١٤٢)، ومسلم (٣٧٥)",114:"رواه أبو داود (٣٠)، والترمذي (٧)",
116:"متفق عليه: البخاري (٦١١٥)، ومسلم (٢٦١٠)",117:"رواه البخاري (٦٢٢٤)",118:"رواه الترمذي (٣٤٣٢)",119:"رواه الترمذي (٣٤٣٣)",
120:"متفق عليه: البخاري (٦٣٨٤)، ومسلم (٢٧٠٤)",123:"متفق عليه: البخاري (٦٤٠٦)، ومسلم (٢٦٩٤)","x3-4":"متفق عليه: البخاري (٦٤٠٦)، ومسلم (٢٦٩٤)",
124:"رواه أبو داود (٢٣٥٧)",126:"متفق عليه: البخاري (١٨٩٤)، ومسلم (١١٥١)",128:"متفق عليه: البخاري (١٥٤٩)، ومسلم (١١٨٤)",
129:"رواه الترمذي (٣٥٨٥)",130:"رواه أبو داود (١٨٩٢)",132:"رواه أبو داود (٢١٣٠)، والترمذي (١٠٩١)",133:"متفق عليه: البخاري (١٤١)، ومسلم (١٤٣٤)",
135:"رواه البخاري (٣٣٧١)","rq-15":"رواه البخاري (٣٣٧١)",136:"رواه مسلم (٩١٨)",137:"متفق عليه: البخاري (١٢٨٤)، ومسلم (٩٢٣)",
138:"رواه مسلم (٩٦٣)",139:"رواه مسلم (٩٧٥)",140:"رواه الترمذي (٣٤٢٨)",141:"رواه البخاري (٣٣٧٠)",
1013:"رواه مسلم (٢٧٢١)","x2-39":"رواه مسلم (٢٧٢١)",1014:"رواه مسلم (٢٧٢٠)",1015:"رواه الترمذي (٢١٤٠)، وصححه الألباني",
1021:"رواه أبو داود (٣٢٠١)، والترمذي (١٠٢٤)، وصححه الألباني",1025:"رواه مسلم (٢١٨٦)","rq-13":"رواه مسلم (٢١٨٦)",
"x2-2":"رواه أبو داود (١٥١٧)","x2-3":"رواه أبو داود (١٥١٦)، والترمذي (٣٤٣٤)","x2-5":"متفق عليه: البخاري (٨٣٤)، ومسلم (٢٧٠٥)",
"x2-6":"رواه مسلم (٤٨٣)","x2-15":"رواه الترمذي (٣٤٦٤)","x2-25":"رواه الترمذي (٣٥٦٣)","x2-27":"رواه ابن ماجه (٩٢٥)",
"x2-30":"رواه مسلم (٢٦٩٧)","x2-33":"رواه الترمذي (٣٥٩٩)، وابن ماجه (٢٥١)","x2-36":"رواه أبو داود (١٥٢٢)، والنسائي (١٣٠٣)",
"x2-38":"متفق عليه: البخاري (٦٣٨٩)، ومسلم (٢٦٩٠)","x2-43":"رواه مسلم (٢٧٣٩)","x2-44":"رواه مسلم (٢٧٢٢)","x2-50":"رواه أبو داود (١٥٢٥)",
"x3-1":"رواه أبو داود (١٠٤٧)، والنسائي (١٣٧٤)، وصححه الألباني","x2-14":"رواه مسلم (٢٧٢٦)","rq-16":"رواه مسلم (٢٧٠٨)",104:"رواه مسلم (٢٢٠٢)",115:"رواه أبو داود (٤٠٢٣)، وحسّنه الألباني",125:"رواه الترمذي (٣٥١٣)",127:"رواه الترمذي (٣٤٥١)",
14:"رواه أبو داود (٥٠٧٢)، والترمذي (٣٣٨٩) — ضعّفه الألباني",34:"رواه أبو داود (٥٠٧٢)، والترمذي (٣٣٨٩) — ضعّفه الألباني",
10:"رواه أبو داود (٥٠٨١) موقوفًا على أبي الدرداء، وحكم عليه الألباني بالوضع مرفوعًا",30:"رواه أبو داود (٥٠٨١) موقوفًا على أبي الدرداء، وحكم عليه الألباني بالوضع مرفوعًا"};
var G={14:"w",34:"w",10:"w",30:"w"};
adhkar.forEach(function(a){var k=String(a.id);if(!(k in S)&&!(a.id in S))return;var v=S[k]||S[a.id];var m=String(a.source||"").match(/^((?:سورة [^—]+|آية الكرسي) — )/);a.source=(m?m[1]:"")+v;if(G[k])a.grade=G[k]})}catch(e){}})();
;(function(){/* ===== مكتبة الأحاديث (v220): الأربعون النووية كاملة + منهج التوثيق ===== */
var ar=__ar;
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
var N=function(t){return String(t||"").replace(/[ً-ْٰـ]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه")};
var T=function(m){try{toast(m)}catch(e){}};
var DATA=null,COL="n",DS={},CN={n:"الأربعون النووية",q:"الأحاديث القدسية"};function load(c){c=c||"n";if(DS[c])return Promise.resolve(DS[c]);return fetch(c==="q"?"/qudsi.json":"/nawawi.json").then(function(r){return r.json()}).then(function(j){DS[c]=j;if(c==="n")DATA=j;return j})}
var NOTE={41:"قال ابن رجب في «جامع العلوم والحكم»: تصحيح هذا الحديث بعيد جدًا. فيُذكر هنا لأنه من الأربعين، مع التنبيه على ضعفه."};
var root=null;
function close(silent){if(!root)return;root.remove();root=null;document.documentElement.classList.remove("wp-open");if(!silent&&history.state&&history.state.hd)history.back()}
addEventListener("popstate",function(){if(root&&!(history.state&&history.state.hd))close(true)});
function card(h,open){return'<article class="wp-card hd-c'+(open?" open":"")+'" id="hd-'+h.n+'" data-n="'+h.n+'"><button type="button" class="hd-top" aria-expanded="'+(open?"true":"false")+'"><span class="hd-n">'+ar(h.n)+'</span><span class="hd-t">'+esc(h.title)+'</span></button><div class="hd-body"><p class="hd-full">'+esc(h.text).replace(/\n/g,"<br>")+'</p><p class="hd-src">'+esc(h.src||"")+(h.ref?'<br><small>'+esc(h.ref)+'</small>':"")+'</p>'+((COL==="n"&&NOTE[h.n])||h.note?'<p class="hd-note">'+esc(h.note||NOTE[h.n])+'</p>':"")+'<div class="hd-act"><button type="button" class="btn btn-ghost btn-sm" data-a="copy">نسخ</button><button type="button" class="btn btn-ghost btn-sm" data-a="share">مشاركة</button><button type="button" class="btn btn-ghost btn-sm" data-a="img">صورة</button></div></div></article>'}
function page(focusN){if(root)close(true);root=document.createElement("div");root.className="wp-page tl-page";root.id="hadithLib";
 root.innerHTML='<header class="wp-h"><button type="button" class="wp-back" aria-label="رجوع">→</button><div><h1>مكتبة الأحاديث</h1><p>نصوص موثّقة مع مصادرها</p></div></header><div class="wp-body"><div class="hd-seg" role="tablist"><button type="button" role="tab" data-c="n">الأربعون النووية</button><button type="button" role="tab" data-c="q">الأحاديث القدسية</button></div><section class="wp-card hd-intro"><b>الأربعون النووية</b><small>٤٢ حديثًا جمعها الإمام النووي، بنصّها وتخريجه لكل حديث.</small><details><summary>منهج التوثيق</summary><ul><li>النص منقول كما هو من متن «الأربعين النووية» دون اختصار.</li><li>التخريج المذكور تحت كل حديث هو تخريج الإمام النووي نفسه.</li><li>أرقام الأحاديث في البخاري حسب ترقيم «فتح الباري»، وفي مسلم حسب ترقيم محمد فؤاد عبد الباقي.</li><li>ما في إسناده كلام نُبّه عليه بنقل كلام أهل العلم.</li></ul></details></section><label class="hd-s"><input type="search" id="hdQ" placeholder="ابحث في الأحاديث…" aria-label="ابحث في الأحاديث"></label><div id="hdList"><p class="wp-note">جارٍ التحميل…</p></div></div>';
 document.body.appendChild(root);document.documentElement.classList.add("wp-open");root.querySelector(".wp-back").onclick=function(){close()};requestAnimationFrame(function(){root&&root.classList.add("in")});setTimeout(function(){root&&root.classList.add("in")},60);
 if(!history.state||!history.state.hd)try{history.pushState({hd:1},"","/hadith")}catch(e){}
 var list=root.querySelector("#hdList");
 var INTRO_N=root.querySelector(".hd-intro").innerHTML,INTRO_Q='<b>الأحاديث القدسية</b><small>٤٠ حديثًا قدسيًا من مجموعة «الأربعون القدسية»، بنصّها وتخريج جامعها.</small><details><summary>منهج التوثيق</summary><ul><li>النص من مجموعة «الأربعون القدسية» المتداولة، بعد تنظيفه من علامات الحواشي.</li><li>التخريج تحت كل حديث هو تخريج الجامع كما ورد.</li><li>«رقم الحديث» أُضيف فقط حيث طابقنا النص حرفيًا مع الأصل: مسلم بترقيم عبد الباقي، والسنن بترقيمها المشهور. ولم نُضف أرقام البخاري لاختلاف الطبعات في ترقيمه.</li><li>ما ضعّفه أهل العلم نُبّه عليه تحت الحديث.</li></ul></details>';
 function go(c){COL=c;root.querySelector(".hd-intro").innerHTML=c==="q"?INTRO_Q:INTRO_N;root.querySelectorAll(".hd-seg button").forEach(function(b){b.setAttribute("aria-selected",b.dataset.c===c?"true":"false")});list.innerHTML='<p class="wp-note">جارٍ التحميل…</p>';
 load(c).then(function(L){function draw(q){var nq=N(q.trim());var R=L.filter(function(h){return!nq||N(h.text).indexOf(nq)>-1||N(h.title).indexOf(nq)>-1||String(h.n)===q.trim()});list.innerHTML=R.length?R.map(function(h){return card(h,h.n===focusN)}).join(""):'<p class="wp-note">لا توجد نتائج.</p>'}
  draw("");var qi=root.querySelector("#hdQ");var tm;qi.value="";qi.oninput=function(){clearTimeout(tm);tm=setTimeout(function(){draw(qi.value)},150)};
  if(focusN){var el=root.querySelector("#hd-"+focusN);el&&el.scrollIntoView({block:"start"})}}).catch(function(){list.innerHTML='<p class="wp-note">تعذّر تحميل الأحاديث. تحقّق من الاتصال ثم أعد المحاولة.</p>'})}
 root.querySelector(".hd-seg").addEventListener("click",function(e){var b=e.target.closest("[data-c]");if(b&&b.dataset.c!==COL)go(b.dataset.c)});go(COL==="q"&&!focusN?"q":"n");
 list.addEventListener("click",function(e){var c=e.target.closest(".hd-c");if(!c)return;var h=DS[COL]&&DS[COL][+c.dataset.n-1];if(e.target.closest(".hd-top")){var o=c.classList.toggle("open");c.querySelector(".hd-top").setAttribute("aria-expanded",o?"true":"false");return}var b=e.target.closest("[data-a]");if(!b||!h)return;var msg=h.text+"\n["+h.src+"]\n— "+CN[COL]+": "+ar(h.n);
  if(b.dataset.a==="copy"){try{copyText(msg)}catch(x){navigator.clipboard&&navigator.clipboard.writeText(msg)}T("تم النسخ")}else if(b.dataset.a==="share"){if(navigator.share)navigator.share({text:msg+"\n"+location.origin+"/hadith"}).catch(function(){});else{navigator.clipboard&&navigator.clipboard.writeText(msg);T("تم النسخ")}}else if(window.__shareImg)__shareImg(h.text.length>420?h.text.slice(0,420).replace(/\s\S*$/,"")+"…":h.text,CN[COL]+" — "+ar(h.n))})}
window.__openHadith=page;
function day(){var s=document.querySelector(".hadith-day");if(!s||s.dataset.lib)return;s.dataset.lib=1;var now=new Date(),doy=Math.floor((now-new Date(now.getFullYear(),0,0))/864e5),n=(doy%42)+1;
 load().then(function(L){var h=L[n-1];if(!h)return;var t=s.querySelector("#hdText");if(t){t.innerHTML=esc(h.text).replace(/\n/g,"<br>");t.classList.add("hd-day-full")}var r=s.querySelector(".dy-ref");if(r)r.textContent="الأربعون النووية — الحديث "+ar(n);
  var src=s.querySelector(".hd-day-src");if(!src){src=document.createElement("p");src.className="hd-day-src";t&&t.after(src)}src.textContent=h.src+(NOTE[n]?" — "+NOTE[n]:"");
  var mb=s.querySelector('[data-hd="more"]');if(mb){mb.hidden=false;mb.textContent="مكتبة الأحاديث";mb.dataset.hd="lib";mb.addEventListener("click",function(e){e.stopImmediatePropagation();page(n)},true)}
  s.addEventListener("click",function(e){var b=e.target.closest('[data-hd="copy"],[data-hd="share"]');if(!b)return;e.stopImmediatePropagation();var msg=h.text+"\n["+h.src+"]\n— الأربعون النووية: "+ar(n);if(b.dataset.hd==="copy"){try{copyText(msg)}catch(x){}T("تم النسخ")}else if(navigator.share)navigator.share({text:msg+"\n"+location.origin+"/hadith"}).catch(function(){});else{try{copyText(msg)}catch(x){}T("تم النسخ")}},true)}).catch(function(){s.dataset.lib=""})}
function entries(){var p=document.querySelector(".dr2 .dr-p");if(p&&!p.querySelector('[data-n="hadith"]')){var ref=p.querySelector('[data-n="tools"]')||p.querySelector('[data-n="ruqya"]');if(ref){var b=ref.cloneNode(true);b.dataset.n="hadith";b.removeAttribute("id");var l=b.querySelector(".dr-l");if(l)l.textContent="مكتبة الأحاديث";var sv=b.querySelector("svg");if(sv)sv.innerHTML='<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6M9 11h6"/>';ref.after(b);b.addEventListener("click",function(e){e.stopImmediatePropagation();var x=p.querySelector(".dr-x");x&&x.click();setTimeout(function(){page()},150)},true)}}
 var sh=document.querySelector("#lib2 .l2-sh");if(sh&&!sh.querySelector('[data-sp="hadith"]')){var c=document.createElement("button");c.type="button";c.className="l2-shb l2-hd";c.dataset.sp="hadith";c.innerHTML='<span class="l2-si"><svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6M9 11h6"/></svg></span><b>مكتبة الأحاديث</b><small>الأربعون النووية كاملة</small>';sh.appendChild(c);c.addEventListener("click",function(e){e.stopImmediatePropagation();page()},true)}
 day()}
__wOnDom(function(){clearTimeout(entries.t);entries.t=setTimeout(entries,0)});setTimeout(entries,1200);
if(location.pathname.replace(/^\/|\/$/g,"")==="hadith")setTimeout(function(){page()},900);
})();

;(function(){/* ذكر اليوم: استبعاد ما في إسناده ضعف من الاختيار اليومي */try{if(typeof dailyPool!=="undefined"&&dailyPool.length){for(var i=dailyPool.length-1;i>=0;i--)if(dailyPool[i].grade)dailyPool.splice(i,1);if(typeof renderDaily==="function")renderDaily()}}catch(e){}})();