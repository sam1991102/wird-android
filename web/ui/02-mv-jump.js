
/*mv-jump*/(function(){
var N=["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"],META=null;
function nz(s){return String(s).replace(/[\u064B-\u0652\u0670\u0640]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/^(سوره|سورة)\s*/,"").replace(/^ال/,"").trim()}
var NZ=N.map(nz);
function dg(s){return String(s).replace(/[٠-٩]/g,function(d){return "٠١٢٣٤٥٦٧٨٩".indexOf(d)}).replace(/[۰-۹]/g,function(d){return "۰۱۲۳۴۵۶۷۸۹".indexOf(d)})}
function ar(n){return String(n).replace(/\d/g,function(d){return "٠١٢٣٤٥٦٧٨٩"[d]})}
async function meta(){if(!META)META=await (await fetch("/mushaf/meta.json")).json();return META}
async function resolve(q){q=dg(q).trim();if(!q)return null;var m=await meta(),P=m.p,J=m.j;
 var jm=q.match(/^(?:الجزء|جزء|ج)\s*(\d+)$/);if(jm){var k=+jm[1];if(k<1||k>30)return {err:"الأجزاء من ١ إلى ٣٠"};for(var s=0;s<114;s++)for(var a=0;a<J[s].length;a++)if(J[s][a]===k)return {p:P[s][a],l:"الجزء "+ar(k)}}
 var sa=q.match(/^(\d+)\s*[:：\-\/ ]\s*(\d+)$/);if(sa)return ay(+sa[1],+sa[2],P);
 if(/^\d+$/.test(q)){var p=+q;return p>=1&&p<=604?{p:p,l:"صفحة "+ar(p)}:{err:"الصفحات من ١ إلى ٦٠٤"}}
 var nm=q.match(/^(.*?)\s*(\d+)?$/),key=nz(nm[1]),i=NZ.indexOf(key);if(i<0)i=NZ.findIndex(function(x){return x.indexOf(key)===0});if(i<0)return {err:"لم أجد سورة بهذا الاسم"};
 return ay(i+1,nm[2]?+nm[2]:1,P)}
function ay(s,a,P){if(s<1||s>114)return {err:"السور من ١ إلى ١١٤"};if(a<1||a>P[s-1].length)return {err:"سورة "+N[s-1]+" "+ar(P[s-1].length)+" آية"};return {p:P[s-1][a-1],l:"سورة "+N[s-1]+" · آية "+ar(a)}}
function ui(){var v=document.getElementById("mushafView");if(!v||document.getElementById("mvJump"))return;var ref=v.querySelector(".mv-actions");if(!ref)return;
 var f=document.createElement("form");f.id="mvJump";f.className="mv-jump";f.setAttribute("role","search");
 f.innerHTML='<label for="mvJq" class="mv-jl">انتقل إلى</label><div class="mv-jr"><input id="mvJq" type="search" inputmode="text" autocomplete="off" placeholder="صفحة ٢٥٠ · البقرة ٢٥٥ · ٢:٢٥٥ · جزء ١٥"><button type="submit" class="btn btn-primary">اذهب</button></div><p class="mv-jm" aria-live="polite"></p>';
 ref.parentElement.insertBefore(f,ref);var inp=f.querySelector("input"),msg=f.querySelector(".mv-jm");
 inp.addEventListener("input",async function(){var r=await resolve(inp.value);msg.textContent=!inp.value.trim()?"":r&&r.err?r.err:r?r.l+" ← صفحة "+ar(r.p):"";msg.classList.toggle("err",!!(r&&r.err))});
 f.addEventListener("submit",async function(e){e.preventDefault();var r=await resolve(inp.value);if(!r||r.err){msg.textContent=r?r.err:"اكتب رقم صفحة أو اسم سورة";msg.classList.add("err");return}inp.blur();window.__openPage&&window.__openPage(r.p)})}
new MutationObserver(function(){clearTimeout(ui.t);ui.t=setTimeout(ui,0)}).observe(document.body,{childList:true,subtree:true});ui();
window.__mvResolve=resolve;
})();
