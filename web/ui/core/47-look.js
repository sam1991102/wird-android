/*look*/;(function(){/* تخصيص المظهر: الخط، ووزنه، وحجمه، واللون الأساسي، والخلفية، والاستدارة، والشريط العلوي، والأيقونات.
  كل اختيار محفوظ في wird-look وبيتطبق كلاس على html (css/25-look.css). الكلاسيكي = الافتراضي من غير أي كلاس.
  «هادئ» و«كلاسيكي» مجموعات جاهزة، و«إبداعي» هو نمط الآيفون القديم (wird-skin=ios، ui/09-skin-ios.js). */
var R=document.documentElement,K="wird-look";
var DEF={font:"tajawal",weight:"normal",size:100,ac:"",bg:"cream",rd:"normal",bar:"color",icons:"regular"};
var PRE={classic:DEF,hadi:{font:"plex",weight:"light",size:100,ac:"",bg:"gray",rd:"round",bar:"light",icons:"thin"}};
var ACS=[["","أخضر وِرد"],["#1b8354","أخضر فاتح"],["#0f5c46","زمردي"],["#2f5d8c","أزرق"],["#7d2e3a","عنابي"],["#7a5a3a","بني"],["#5b4b8a","بنفسجي"]];
var BASE={"--t-2xs":11,"--t-xs":12,"--t-sm":13,"--t-md":14,"--t-base":16,"--t-lg":18,"--t-xl":20,"--t-2xl":24,"--t-3xl":28,"--t-4xl":32};
function load(){try{var o=JSON.parse(localStorage.getItem(K)||"null");if(o)return Object.assign({},DEF,o)}catch(e){}
 /* اللي كان مختار «هادئ» في النسخة اللي فاتت ينتقل لنفس الاختيارات هنا */
 try{if(localStorage.getItem("wird-skin")==="hadi"){localStorage.setItem("wird-skin","classic");localStorage.setItem(K,JSON.stringify(PRE.hadi));return Object.assign({},PRE.hadi)}}catch(e){}return Object.assign({},DEF)}
var S=load();
function apply(){var c=R.classList;c.toggle("f-plex",S.font==="plex");c.toggle("w-light",S.weight==="light");c.toggle("bg-white",S.bg==="white");c.toggle("bg-gray",S.bg==="gray");
 c.toggle("rd-round",S.rd==="round");c.toggle("tb-light",S.bar==="light");c.toggle("ic-thin",S.icons==="thin");c.toggle("ac-on",!!S.ac);c.remove("hadi");
 if(S.ac)R.style.setProperty("--ac",S.ac);else R.style.removeProperty("--ac");
 var k=S.size/100;Object.keys(BASE).forEach(function(n){if(k===1)R.style.removeProperty(n);else R.style.setProperty(n,Math.round(BASE[n]*k*10)/10+"px")});
 window.__iconsRedraw&&__iconsRedraw();sync()}
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}apply()}
function preset(){var s=null;try{s=localStorage.getItem("wird-skin")}catch(e){}if(s==="ios")return"ios";
 for(var p in PRE){var o=PRE[p],ok=true;for(var q in DEF)if(o[q]!==S[q]){ok=false;break}if(ok)return p}return"custom"}
var ar=function(n){return String(n).replace(/\d/g,function(d){return"٠١٢٣٤٥٦٧٨٩"[+d]})};
function seg(k,opts){return'<div class="st-seg lk-seg" role="radiogroup">'+opts.map(function(o){return'<button type="button" role="radio" data-lk="'+k+'" data-v="'+o[0]+'">'+o[1]+'</button>'}).join("")+"</div>"}
function row(t,h,body){return'<div class="st-row lk-row"><div class="st-l"><strong>'+t+"</strong>"+(h?"<small>"+h+"</small>":"")+"</div>"+body+"</div>"}
function ui(){var s=document.getElementById("st-look");if(!s||s.querySelector(".lk-row"))return;
 var old=s.querySelector(".skin-row");if(old)old.remove();
 var box=document.createElement("div");box.className="lk-box";
 box.innerHTML=
  row("نمط جاهز","اختار واحد كبداية، وعدّل اللي تحبه تحت",seg("preset",[["classic","كلاسيكي"],["hadi","هادئ"],["ios","إبداعي"]]))+
  row("الخط","",seg("font",[["tajawal","تجوّل"],["plex","بلكس"]]))+
  row("وزن الخط","«خفيف» بيشيل العريض من كل التطبيق",seg("weight",[["normal","عادي"],["light","خفيف"]]))+
  row("حجم خط التطبيق","العناوين والقوائم والأزرار. حجم خط الأذكار له إعداد لوحده",'<div class="lk-range"><input type="range" min="85" max="130" step="5" data-lk="size" aria-label="حجم خط التطبيق"><output></output></div>')+
  row("اللون الأساسي","في الوضع الفاتح",'<div class="lk-sw">'+ACS.map(function(a){return'<button type="button" role="radio" data-lk="ac" data-v="'+a[0]+'" aria-label="'+a[1]+'" title="'+a[1]+'" style="--sw:'+(a[0]||"var(--lk-def,#32735c)")+'"></button>'}).join("")+'<label title="لون من اختيارك"><input type="color" data-lk="acc" aria-label="لون من اختيارك"></label></div>')+
  row("الخلفية","في الوضع الفاتح",seg("bg",[["cream","كريمي"],["white","أبيض"],["gray","رمادي فاتح"]]))+
  row("الاستدارة","",seg("rd",[["normal","عادية"],["round","مدوّرة"]]))+
  row("الشريط العلوي","",seg("bar",[["color","ملوّن"],["light","فاتح"]]))+
  row("الأيقونات","",seg("icons",[["regular","عادية"],["thin","رفيعة"]]))+
  '<button type="button" class="btn lk-reset" data-lk="reset">رجّع الكلاسيكي</button>';
 var h=s.querySelector(".st-row");h?s.insertBefore(box,h):s.appendChild(box);sync()}
function sync(){var p=preset();document.querySelectorAll("[data-lk]").forEach(function(b){var k=b.dataset.lk;
  if(k==="preset")b.setAttribute("aria-checked",b.dataset.v===p);
  else if(k==="size"){b.value=S.size;var o=b.parentElement.querySelector("output");if(o)o.textContent=ar(S.size)+"٪"}
  else if(k==="acc")b.value=S.ac||"#32735c";
  else if(b.dataset.v!==undefined)b.setAttribute("aria-checked",String(S[k])===b.dataset.v)})}
function setSkin(v){try{localStorage.setItem("wird-skin",v)}catch(e){}R.classList.toggle("ios",v==="ios")}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("button[data-lk]");if(!b)return;e.preventDefault();var k=b.dataset.lk,v=b.dataset.v;
 if(k==="reset"){setSkin("classic");S=Object.assign({},DEF);return save()}
 if(k==="preset"){if(v==="ios"){setSkin("ios");S=Object.assign({},DEF)}else{setSkin("classic");S=Object.assign({},PRE[v])}return save()}
 S[k]=v;save()});
document.addEventListener("input",function(e){var t=e.target;if(!t.dataset||!t.dataset.lk)return;if(t.dataset.lk==="size"){S.size=+t.value;save()}else if(t.dataset.lk==="acc"){S.ac=t.value;save()}});
apply();__wOnDom(ui);
})();
