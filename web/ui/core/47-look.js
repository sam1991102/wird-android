/*look*/;(function(){/* صفحة المظهر بطريقة الإعدادات الحديثة: قايمة مجمّعة، كل سطر فيه اسمه وقيمته الحالية،
  والضغط عليه بيفتح اختياراته تحته في نفس المكان، والمعاينة اللي فوق بتتغير مع كل اختيار.
  كل اختيار محفوظ في wird-look وبيتطبق كلاس أو رمز على html (css/25-look.css). الكلاسيكي = الافتراضي (من غير كلاسات).
  «هادئ» و«كلاسيكي» مجموعات جاهزة، و«إبداعي» نمط الآيفون (wird-skin=ios، ui/09-skin-ios.js).
  الصفوف اللي بتبنيها ملفات تانية (الوضع، حجم خط الأذكار، الأرقام، الاهتزاز، القراءة الهادئة) بتتحط في مجموعاتها. */
var R=document.documentElement,K="wird-look";
var DEF={ac:"",bg:"cream",bgc:"",card:"white",ink:"normal",bar:"color",onTab:"primary",
 font:"tajawal",deco:"diwani",textf:"amiri",weight:"normal",size:100,lh:"normal",
 rd:"normal",shadow:"normal",border:"on",density:"normal",icons:"regular",labels:"on",motion:"full"};
var PRE={classic:{},hadi:{bg:"gray",bar:"light",onTab:"gold",font:"plex",weight:"light",rd:"round",shadow:"soft",border:"off",icons:"thin"}};
var ACS=[["","أخضر وِرد"],["#1b8354","أخضر فاتح"],["#0f5c46","زمردي"],["#2f5d8c","أزرق"],["#7d2e3a","عنابي"],["#7a5a3a","بني"],["#5b4b8a","بنفسجي"],["#22303c","كحلي"]];
var T={"--t-2xs":11,"--t-xs":12,"--t-sm":13,"--t-md":14,"--t-base":16,"--t-lg":18,"--t-xl":20,"--t-2xl":24,"--t-3xl":28,"--t-4xl":32};
var SP={"--s4":4,"--s6":6,"--s8":8,"--s10":10,"--s12":12,"--s14":14,"--s16":16,"--s20":20,"--s24":24,"--s28":28,"--s32":32};
var CLS={bg:["white","gray","custom"],card:["tint"],ink:["soft","strong"],bar:["light"],onTab:["gold"],font:["plex"],deco:["ui"],textf:["ui"],weight:["light","bold"],lh:["tight","airy"],rd:["sharp","round"],shadow:["none","soft","strong"],border:["off"],icons:["thin","fill"],labels:["off"],motion:["off"]};
var PFX={bg:"bg-",card:"cd-",ink:"ink-",bar:"tb-",onTab:"on-",font:"f-",deco:"dc-",textf:"tx-",weight:"w-",lh:"lh-",rd:"rd-",shadow:"sh-",border:"bd-",icons:"ic-",labels:"nl-",motion:"mo-"};

/* القايمة: [المجموعة، [[المفتاح، الاسم، الشرح، النوع، الاختيارات]]] */
var G=[
 ["النمط",[["preset","نمط جاهز","بداية سريعة، وبعدها عدّل اللي تحبه","pre",[["classic","كلاسيكي"],["hadi","هادئ"],["ios","إبداعي"]]]]],
 ["الوضع",[["@theme","الوضع","فاتح أو ورقي أو ليلي، أو حسب الجهاز أو وقت اليوم","host"]]],
 ["الألوان",[
  ["ac","اللون الأساسي","الأزرار والتبويب المختار والعناوين المميزة","color"],
  ["bg","لون الخلفية","","tiles",[["cream","كريمي"],["white","أبيض"],["gray","رمادي"],["custom","من اختيارك"]]],
  ["card","لون البطاقات","","seg",[["white","أبيض"],["tint","بلون الخلفية"]]],
  ["ink","لون الكلام","","seg",[["soft","هادي"],["normal","عادي"],["strong","غامق"]]],
  ["bar","الشريط العلوي","","tiles",[["color","ملوّن"],["light","فاتح"]]],
  ["onTab","لون التبويب المختار","في الشريط السفلي","seg",[["primary","اللون الأساسي"],["gold","دهبي"]]]]],
 ["الخطوط",[
  ["font","خط التطبيق","القوائم والأزرار والكلام","tiles",[["tajawal","تجوّل"],["plex","بلكس"]]],
  ["deco","خط العناوين المميزة","اسم اليوم وعناوين الصفحات","tiles",[["diwani","ديواني"],["ui","نفس خط التطبيق"]]],
  ["textf","خط نص الأذكار","","tiles",[["amiri","أميري"],["ui","نفس خط التطبيق"]]],
  ["weight","سُمك الخط","","seg",[["light","خفيف"],["normal","عادي"],["bold","عريض"]]],
  ["size","حجم خط التطبيق","العناوين والقوائم والأزرار","range"],
  ["@size","حجم خط الأذكار","","host"],
  ["lh","المسافة بين سطور الأذكار","","seg",[["tight","قريبة"],["normal","عادية"],["airy","واسعة"]]]]],
 ["الشكل",[
  ["rd","الزوايا","","tiles",[["sharp","حادة"],["normal","عادية"],["round","مدوّرة"]]],
  ["shadow","ظل البطاقات","","seg",[["none","بدون"],["soft","خفيف"],["normal","عادي"],["strong","واضح"]]],
  ["border","إطار البطاقات","","seg",[["on","يظهر"],["off","مخفي"]]],
  ["density","المسافات","بين العناصر وجوه البطاقات","seg",[["compact","متقاربة"],["normal","عادية"],["comfy","واسعة"]]]]],
 ["الأيقونات والتنقّل",[
  ["icons","شكل الأيقونات","","tiles",[["thin","رفيعة"],["regular","عادية"],["fill","مليانة"]]],
  ["labels","أسماء التبويبات","تحت أيقونات الشريط السفلي","seg",[["on","تظهر"],["off","مخفية"]]],
  ["motion","الحركة","الانتقالات وحركة الأزرار والسما","seg",[["full","كاملة"],["off","بدون"]]]]],
 ["الأرقام والعدّ",[["@digits","الأرقام","","host"],["@vib","الاهتزاز عند العدّ","","host"],["@calm","وضع القراءة الهادئة","","host"]]]
];
var NAME={};G.forEach(function(g){g[1].forEach(function(r){if(r[4])NAME[r[0]]=r[4]})});

function load(){try{var o=JSON.parse(localStorage.getItem(K)||"null");if(o){/* النسخة اللي فاتت كانت بتحفظ rd/icons/bar بأسماء تانية */
  if(o.rd==="round"&&!o.shadow)o.shadow="soft";return Object.assign({},DEF,o)}}catch(e){}
 try{if(localStorage.getItem("wird-skin")==="hadi"){localStorage.setItem("wird-skin","classic");var h=Object.assign({},DEF,PRE.hadi);localStorage.setItem(K,JSON.stringify(h));return h}}catch(e){}
 return Object.assign({},DEF)}
var S=load();
function scale(map,k){Object.keys(map).forEach(function(n){if(k===1)R.style.removeProperty(n);else R.style.setProperty(n,Math.round(map[n]*k*10)/10+"px")})}
function apply(){var c=R.classList;
 Object.keys(CLS).forEach(function(k){CLS[k].forEach(function(v){c.toggle(PFX[k]+v,S[k]===v)})});
 c.toggle("ac-on",!!S.ac);c.remove("hadi");
 if(S.ac)R.style.setProperty("--ac",S.ac);else R.style.removeProperty("--ac");
 if(S.bg==="custom"&&S.bgc)R.style.setProperty("--bgc",S.bgc);else R.style.removeProperty("--bgc");
 scale(T,S.size/100);scale(SP,S.density==="compact"?.82:S.density==="comfy"?1.18:1);
 window.__iconsRedraw&&__iconsRedraw();sync()}
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}apply()}
function skin(){try{return localStorage.getItem("wird-skin")||"classic"}catch(e){return"classic"}}
function setSkin(v){try{localStorage.setItem("wird-skin",v)}catch(e){}R.classList.toggle("ios",v==="ios")}
function preset(){if(skin()==="ios")return"ios";for(var p in PRE){var o=Object.assign({},DEF,PRE[p]),ok=true;for(var q in DEF)if(o[q]!==S[q]){ok=false;break}if(ok)return p}return""}
var ar=function(n){return String(n).replace(/\d/g,function(d){return"٠١٢٣٤٥٦٧٨٩"[+d]})};
function val(k){if(k==="preset"){var p=preset();return p?NAME.preset.filter(function(o){return o[0]===p})[0][1]:"مخصّص"}
 if(k==="ac"){var a=ACS.filter(function(o){return o[0]===S.ac})[0];return a?a[1]:"من اختيارك"}
 if(k==="size")return ar(S.size)+"٪";var o=(NAME[k]||[]).filter(function(x){return x[0]===S[k]})[0];return o?o[1]:""}

/* أشكال الاختيارات */
var HOUSE={thin:'<path d="M217.9,110.1l-80-80a14,14,0,0,0-19.8,0l-80,80A13.92,13.92,0,0,0,34,120v96a6,6,0,0,0,6,6h64a6,6,0,0,0,6-6V158h36v58a6,6,0,0,0,6,6h64a6,6,0,0,0,6-6V120A13.92,13.92,0,0,0,217.9,110.1ZM210,210H158V152a6,6,0,0,0-6-6H104a6,6,0,0,0-6,6v58H46V120a2,2,0,0,1,.58-1.42l80-80a2,2,0,0,1,2.84,0l80,80A2,2,0,0,1,210,120Z"/>',
 regular:'<path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"/>',
 fill:'<path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"/>'};
function thumb(k,v){if(k==="icons")return'<svg viewBox="0 0 256 256" class="lk-ic">'+HOUSE[v]+"</svg>";if(k==="font"||k==="textf"||k==="deco")return k==="deco"?"الجمعة":"بسم الله";return""}
function ctl(r){var k=r[0],t=r[3],o=r[4];
 if(t==="seg")return'<div class="st-seg lk-seg" role="radiogroup" aria-label="'+r[1]+'">'+o.map(function(x){return'<button type="button" role="radio" data-lk="'+k+'" data-v="'+x[0]+'">'+x[1]+"</button>"}).join("")+"</div>";
 if(t==="tiles"||t==="pre")return'<div class="lk-tiles" role="radiogroup" aria-label="'+r[1]+'">'+o.map(function(x){return'<button type="button" role="radio" class="lk-tile" data-lk="'+k+'" data-v="'+x[0]+'"><span class="lk-th lk-th-'+k+'-'+x[0]+'" aria-hidden="true">'+thumb(k,x[0])+'</span><span class="lk-tl">'+x[1]+"</span></button>"}).join("")+(k==="bg"?'<input type="color" class="lk-bgc" data-lk="bgc" aria-label="لون خلفية من اختيارك">':"")+"</div>";
 if(t==="color")return'<div class="lk-sw" role="radiogroup" aria-label="'+r[1]+'">'+ACS.map(function(a){return'<button type="button" role="radio" data-lk="ac" data-v="'+a[0]+'" aria-label="'+a[1]+'" title="'+a[1]+'" style="--sw:'+(a[0]||"var(--lk-def)")+'"></button>'}).join("")+'<label class="lk-pick" title="لون من اختيارك"><input type="color" data-lk="acc" aria-label="لون من اختيارك"></label></div>';
 if(t==="range")return'<div class="lk-range"><span class="lk-a lk-a-s">أ</span><input type="range" min="85" max="130" step="5" data-lk="size" aria-label="'+r[1]+'"><span class="lk-a lk-a-l">أ</span></div>';
 return""}
function rowH(r){var k=r[0];if(r[3]==="host")return'<div class="lk-r lk-host" data-host="'+k.slice(1)+'"></div>';
 return'<div class="lk-r" data-row="'+k+'"><button type="button" class="lk-rh" aria-expanded="false"><span class="lk-rt"><strong>'+r[1]+"</strong>"+(r[2]?"<small>"+r[2]+"</small>":"")+'</span><span class="lk-rv" data-val="'+k+'"></span><svg class="lk-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button><div class="lk-rb"><div class="lk-rbi">'+ctl(r)+"</div></div></div>"}
var LIVE='<div class="lk-live" aria-hidden="true"><div class="lk-lv-bar"><i></i><b>وِرْد</b><i></i></div><div class="lk-lv-strip">الصلاة القادمة <b>العصر</b> بعد ساعة</div><div class="lk-lv-body"><div class="lk-lv-card"><span class="lk-lv-ic"><svg viewBox="0 0 256 256" class="lk-ic lk-lv-house">'+HOUSE.regular+'</svg></span><div><strong>أذكار الصباح</strong><small>٢٠ ذكر · ١٠ دقايق</small></div></div><div class="lk-lv-row"><span class="lk-lv-btn">ابدأ</span><span class="lk-lv-chip">الكهف</span></div></div><div class="lk-lv-dh">سُبْحَانَ اللهِ وَبِحَمْدِهِ</div></div>';
function ui(){var s=document.getElementById("st-look");if(!s)return;var L=s.querySelector(".lk");
 if(!L){[].forEach.call(s.querySelectorAll(".skin-row,.lk-box"),function(x){x.remove()});
  L=document.createElement("div");L.className="lk";
  L.innerHTML=LIVE+G.map(function(g){return'<section class="lk-g"><h3>'+g[0]+'</h3><div class="lk-list">'+g[1].map(rowH).join("")+"</div></section>"}).join("")+'<button type="button" class="lk-reset" data-lk="reset">رجوع للإعدادات الافتراضية</button>';
  var h2=s.querySelector("h2");h2?h2.after(L):s.prepend(L)}
 adopt(s,L);sync()}
/* صف من ملف تاني بيروح لمكانه حسب محتواه */
function adopt(s,L){[].slice.call(s.children).forEach(function(c){if(c===L||c.tagName==="H2")return;
 var h=c.querySelector('[data-seg="theme"]')?"theme":c.querySelector('[data-seg="size"]')?"size":c.querySelector('[data-seg="digits"]')?"digits":c.id==="stLook"||c.querySelector("#tpOn")?"calm":"vib";
 var box=L.querySelector('[data-host="'+h+'"]');(box||L.querySelector(".lk-g:last-of-type .lk-list")).appendChild(c)})}
function sync(){var p=preset();
 document.querySelectorAll("[data-val]").forEach(function(e){e.textContent=val(e.dataset.val)});
 document.querySelectorAll("[data-lk]").forEach(function(b){var k=b.dataset.lk;
  if(k==="preset")b.setAttribute("aria-checked",String(b.dataset.v===p));
  else if(k==="size")b.value=String(S.size);
  else if(k==="acc")b.value=S.ac||"#32735c";
  else if(k==="bgc")b.value=S.bgc||"#f5f2ec";
  else if(b.dataset.v!==undefined)b.setAttribute("aria-checked",String(String(S[k])===b.dataset.v))})}
function set(k,v){if(k==="reset"){setSkin("classic");S=Object.assign({},DEF);return save()}
 if(k==="preset"){if(v==="ios"){setSkin("ios");S=Object.assign({},DEF)}else{setSkin("classic");S=Object.assign({},DEF,PRE[v])}return save()}
 if(k==="bg"&&v==="custom"&&!S.bgc){var i=document.querySelector(".lk-bgc");if(i)i.click()}
 S[k]=k==="size"?+v:v;save()}
document.addEventListener("click",function(e){var t=e.target;if(!t.closest)return;
 var h=t.closest(".lk-rh");if(h){var r=h.parentElement,open=!r.classList.contains("open");r.classList.toggle("open",open);h.setAttribute("aria-expanded",String(open));return}
 var b=t.closest("button[data-lk]");if(!b)return;e.preventDefault();set(b.dataset.lk,b.dataset.v)});
document.addEventListener("input",function(e){var t=e.target;if(!t.dataset||!t.dataset.lk)return;var k=t.dataset.lk;
 if(k==="size")set("size",t.value);else if(k==="acc")set("ac",t.value);else if(k==="bgc"){S.bgc=t.value;set("bg","custom")}});
window.__wirdLook={get:function(){return Object.assign({},S)},set:set};
apply();__wOnDom(ui);ui();
})();
