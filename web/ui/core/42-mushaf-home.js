;(function(){"use strict";
/* ===== صفحة المصحف: «المصحف المفتوح» =====
 فوق: المصحف مفتوح على الصفحتين اللي وقفت عندهم (بإطار الصفحة وعلامة القراءة) + «أكمل».
 تحته: الختمة كشريط ٣٠ جزء، البحث، سور اليوم، وكل السور كروت بزخرفة المصحف.
 لما تنزل لتحت، بيظهر شريط «أكمل» صغير ثابت فوق.
 القارئ: __openPage (08-mushaf-pages.js). الختمة: __khatma / __openKhatma (13-khatma.js). البحث: __mvResolve (02-mv-jump.js).
 الستايل: css/21-mushaf-home.css (التصميم: نفس التصوّر المعتمد بالظبط) */
var ar=__ar,TOT=604;
var JUZ=[1,22,42,62,82,102,121,142,162,182,201,222,242,262,282,302,322,342,362,382,402,422,442,462,482,502,522,542,562,582];
var IDX=window.__MUSHAF_IDX||[];
var nm=function(i){return String((IDX[i]||[""])[0]).replace(/^سُورَةُ\s*/,"").replace(/[ً-ْٰ]/g,"")};
var ayt=function(n){return ar(n)+(n>=3&&n<=10?" آيات":" آية")};
var G=function(k,d){try{var v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}};
var juzOf=function(p){var j=1;for(var i=0;i<30;i++)if(p>=JUZ[i])j=i+1;return j};
var page=function(){var v=parseInt(String(G("wird-mushaf-page","")).replace(/\D/g,""),10);return v>=1&&v<=TOT?v:0};
var META=null;function meta(){return META?Promise.resolve(META):fetch("/mushaf/meta.json").then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(m){return META=m})}
var TXT={};function sura(s){return TXT[s]?Promise.resolve(TXT[s]):fetch("/mushaf/"+s+".json").then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){return TXT[s]=d})}
/* آيات صفحة: [[سورة، آية]...] من meta.p */
function onPage(m,p){var out=[];for(var s=0;s<114;s++){var P=m.p[s];if(!P||P[0]>p||P[P.length-1]<p)continue;for(var a=0;a<P.length;a++)if(P[a]===p)out.push([s+1,a+1])}return out}
function leafText(p){return meta().then(function(m){var v=onPage(m,p);if(!v.length)return{s:0,t:""};var s=v[0][0];
 return sura(s).then(function(d){return{s:s,a:v[0][1],t:v.filter(function(x){return x[0]===s}).map(function(x){return(d[x[1]-1]||"")+" ۝"}).join(" ")}}).catch(function(){return{s:s,a:v[0][1],t:""}})}).catch(function(){return{s:0,t:""}})}
function when(t){if(!t)return"";var d=new Date(+t),n=new Date(),y=new Date(n);y.setDate(n.getDate()-1);
 var hm=d.getHours()%12||12,mm=String(d.getMinutes()).padStart(2,"0"),ap=d.getHours()<12?"ص":"م",tm=ar(hm+":"+mm)+" "+ap;
 return d.toDateString()===n.toDateString()?"النهارده "+tm:d.toDateString()===y.toDateString()?"امبارح "+tm:ar(d.getDate()+"/"+(d.getMonth()+1))}
var I={search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',bm:'<path d="M7 3h10v18l-5-4-5 4z"/>',go:'<path d="M15 5 8 12l7 7z"/>'};
var svg=function(d,c){return'<svg viewBox="0 0 24 24"'+(c?' class="'+c+'"':"")+' aria-hidden="true">'+d+'</svg>'};
/* سور اليوم: الجمعة الكهف، وبالليل الملك */
function today(){var night=false,fri=new Date().getDay()===5;try{var t=prayerDay(0).t,h=__nowH();night=h>=t.maghrib||h<t.fajr;fri=prayerDay(0).isFri||fri}catch(e){}
 var L=[[18,"يوم الجمعة"],[67,"قبل النوم"],[32,"قبل النوم"],[36,null]];var hl=fri?18:night?67:0;
 return{label:fri?"الجمعة":night?"الليلة":"",list:L.map(function(x){return{n:x[0],sub:x[1]||ayt((IDX[x[0]-1]||[])[2]||0),hl:x[0]===hl}})}}
function tile(n,sub,hl){return'<button type="button" class="mh-sc'+(hl?" today":"")+'" data-s="'+n+'"><span class="mh-med">'+ar(n)+'</span><span><b>'+nm(n-1)+'</b><small>'+sub+'</small></span></button>'}

var v,built=false;
function build(){v=document.getElementById("mushafView");if(!v||built)return;built=true;
 v.classList.add("mh");v.classList.remove("container");v.innerHTML=
 '<div class="mh-stage">'+
  '<div class="mh-hd"><button type="button" class="mh-ic" data-a="find" aria-label="بحث في المصحف">'+svg(I.search)+'</button><h2>المصحف الشريف</h2><button type="button" class="mh-ic" data-a="bm" aria-label="آياتي المحفوظة">'+svg(I.bm)+'</button></div>'+
  '<button type="button" class="mh-book" data-a="go" aria-label="أكمل القراءة"><span class="mh-leaf r"><span class="mh-fr"></span><span class="mh-sh" data-k="rsh"></span><span class="mh-tx" data-k="rtx"></span><span class="mh-pn" data-k="rpn"></span></span><span class="mh-leaf l"><span class="mh-fr"></span><span class="mh-mark"></span><span class="mh-sh" data-k="lsh"></span><span class="mh-tx" data-k="ltx"></span><span class="mh-pn" data-k="lpn"></span></span></button>'+
  '<div class="mh-under"><div class="mh-t"><b data-k="ut"></b><small data-k="us"></small></div><button type="button" class="mh-go" data-a="go"><span data-k="gl">أكمل</span>'+svg(I.go)+'</button></div>'+
 '</div>'+
 '<div class="mh-mini" aria-hidden="true"><div class="mh-t"><b data-k="mt"></b><small data-k="ms"></small></div><button type="button" class="mh-go" data-a="go" tabindex="-1"><span data-k="gl2">أكمل</span>'+svg(I.go)+'</button></div>'+
 '<div class="mh-jz"><div class="mh-lb"><button type="button" data-a="kh" data-k="kl"></button><span data-k="kr"></span></div><div class="mh-strip" role="list" aria-label="الأجزاء"></div></div>'+
 '<label class="mh-find">'+svg(I.search)+'<input type="search" enterkeyhint="go" autocomplete="off" placeholder="سورة، صفحة، ٢:٢٥٥، أو كلمة" aria-label="بحث في المصحف"></label><p class="mh-msg" aria-live="polite"></p>'+
 '<div class="mh-sec"><b>سور اليوم</b><small data-k="tl"></small></div><div class="mh-grid" data-k="today"></div>'+
 '<div class="mh-sec"><b>كل السور</b><small>'+ar(114)+' سورة</small></div><div class="mh-grid" data-k="all">'+IDX.map(function(m,i){return tile(i+1,(m[1]==="m"?"مكية":"مدنية")+" · "+ar(m[2]))}).join("")+'</div>';
 var strip=v.querySelector(".mh-strip");strip.innerHTML=JUZ.map(function(p,i){return'<button type="button" role="listitem" data-j="'+(i+1)+'" aria-label="الجزء '+ar(i+1)+'">'+ar(i+1)+'</button>'}).join("");
 v.addEventListener("click",click);
 var inp=v.querySelector(".mh-find input"),msg=v.querySelector(".mh-msg");
 inp.addEventListener("input",function(){var q=inp.value.trim().replace(/[ً-ْ]/g,"");v.querySelectorAll('[data-k="all"] .mh-sc').forEach(function(b){b.hidden=!!q&&b.textContent.indexOf(q)<0});msg.textContent=""});
 inp.form||inp.addEventListener("keydown",function(e){if(e.key!=="Enter")return;e.preventDefault();var q=inp.value.trim();if(!q)return;
  (window.__mvResolve?__mvResolve(q):Promise.resolve(null)).then(function(r){if(r&&r.p){inp.blur();__openPage(r.p);return}
   /* مش سورة/صفحة/آية: نبحث بالكلمة في الآيات */
   if(window.__openSearch){__openSearch();setTimeout(function(){var s=document.querySelector(".tl-sheet input[type=search],.se-in input,.tl-sheet input");if(s){s.value=q;s.dispatchEvent(new Event("input",{bubbles:true}))}},250)}
   else msg.textContent=r&&r.err||"ما لقيناش نتيجة"})});
 addEventListener("scroll",mini,{passive:true});
 draw()}
function click(e){var b=e.target.closest("[data-a],[data-s],[data-j]");if(!b||!v.contains(b))return;
 if(b.dataset.s){window.__openSurahN(+b.dataset.s,b,{side:true});return}
 if(b.dataset.j){__openPage(JUZ[+b.dataset.j-1],b);return}
 var a=b.dataset.a;
 if(a==="go")__openPage(page()||1,b);
 else if(a==="find"){var i=v.querySelector(".mh-find input");i.scrollIntoView({block:"center",behavior:"smooth"});setTimeout(function(){i.focus()},250)}
 else if(a==="bm")window.__openBookmarks&&__openBookmarks();
 else if(a==="kh")window.__openKhatma&&__openKhatma()}
var mq=0;function mini(){if(mq||!v)return;mq=requestAnimationFrame(function(){mq=0;var st=v.querySelector(".mh-stage");if(!st)return;var on=document.documentElement.dataset.view==="mushaf"&&st.getBoundingClientRect().bottom<70;v.classList.toggle("mh-scrolled",on)})}
function put(k,t){var e=v.querySelector('[data-k="'+k+'"]');if(e&&e.textContent!==t)e.textContent=t}
function draw(){if(!v)return;var p=page(),start=!p,P=p||1,R=P%2===0?P-1:P,Lp=Math.min(TOT,R+1);
 /* صفحة اليمين فردية واللي على الشمال بعدها، زي المصحف الحقيقي؛ العلامة على الصفحة اللي وقفت عندها */
 v.querySelector(".mh-mark").style.display=P===Lp&&P!==R?"":"none";v.querySelector(".mh-leaf.r").classList.toggle("cur",P===R);
 put("rpn",ar(R));put("lpn",ar(Lp));put("lsh","الجزء "+ar(juzOf(Lp)));
 leafText(R).then(function(x){put("rsh",x.s?"سورة "+nm(x.s-1):"");put("rtx",x.t)});
 leafText(Lp).then(function(x){put("ltx",x.t)});
 leafText(P).then(function(x){var s=x.s?nm(x.s-1):"";
  if(start){put("ut","ابدأ من الفاتحة");put("us","صفحة ١ · الجزء ١");put("mt","ابدأ من الفاتحة");put("ms","صفحة ١")}
  else{put("ut","أكمل من "+(s||"صفحة "+ar(P)));put("us",(x.a?"آية "+ar(x.a)+" · ":"")+(when(G("wird-mushaf-at",""))||"صفحة "+ar(P)));put("mt","أكمل من "+(s||"المصحف"));put("ms","صفحة "+ar(P)+" · الجزء "+ar(juzOf(P)))}});
 put("gl",start?"ابدأ":"أكمل");put("gl2",start?"ابدأ":"أكمل");
 /* الختمة */
 var k=window.__khatma&&__khatma.load(),strip=v.querySelectorAll(".mh-strip [data-j]");
 if(k&&k.pos<TOT){var pl=__khatma.plan(k),cj=juzOf(Math.min(TOT,k.pos+1));
  var d=pl.d,prev=d===0?k.sp-1:pl.endFor(Math.min(d,k.days-1)-1),tot=Math.max(1,pl.endFor(Math.min(d,k.days-1))-prev),rd=Math.max(0,Math.min(tot,k.pos-prev));
  put("kl","ختمتك "+ar(pl.pct)+"٪ · الجزء "+ar(cj));put("kr","وِرد النهارده "+ar(rd)+" من "+ar(tot)+" صفحة");
  strip.forEach(function(b,i){var j=i+1,end=j<30?JUZ[j]-1:TOT;b.className=end<=k.pos?"d":j===cj?"c":""})}
 else{put("kl",k?"أتممت الختمة · ابدأ ختمة جديدة":"ابدأ ختمة");put("kr",p?"أنت في الجزء "+ar(juzOf(P)):"");var cj2=p?juzOf(P):0;strip.forEach(function(b,i){b.className=i+1===cj2?"c":""})}
 v.querySelector(".mh-lb [data-a=kh]").classList.toggle("lnk",!(k&&k.pos<TOT));
 /* سور اليوم */
 var td=today();put("tl",td.label);var g=v.querySelector('[data-k="today"]'),h=td.list.map(function(x){return tile(x.n,x.sub,x.hl)}).join("");if(g.dataset.h!==h){g.innerHTML=h;g.dataset.h=h}}
/* وقت آخر قراءة */
addEventListener("wird-mp-page",function(){try{localStorage.setItem("wird-mushaf-at",Date.now())}catch(e){}if(v)draw()});
__wWait(function(){return document.getElementById("mushafView")},build,15000);
__wOnView(function(){if(document.documentElement.dataset.view==="mushaf"){build();draw();mini()}});
document.addEventListener("visibilitychange",function(){if(!document.hidden&&v)draw()});
addEventListener("wird-khatma",function(){if(v)draw()});
})();
