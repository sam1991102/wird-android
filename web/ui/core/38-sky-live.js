;(function(){/* ===== كارت اليوم: سما حيّة + الجو الفعلي =====
 ١) لون السما: نقاط ثابتة على مواعيد الصلاة في مدينة المستخدم (الفجر، الشروق، الضحى، الظهر، العصر، قبيل المغرب، المغرب، الشفق، العشاء)،
    واللون بيتدرّج بينهم حسب الوقت الحالي — فالسما بتتغيّر مع النهار بالتدريج زي الحقيقة.
 ٢) الجو (Open-Meteo، مجاني ومن غير حساب): درجة الحرارة وحالة الجو، بإحداثيات مقرّبة لرقم عشري واحد، ومحفوظة ٣٠ دقيقة.
    من غير نت: السما بتشتغل بالوقت بس والشارة بتختفي. الستايل في css/17-sky-live.css */
var ar=__ar;
/* [أعلى، وسط، أسفل، توهّج] لكل نقطة */
/* ألوان مأخوذة من صور سما حقيقية: الأزرق بيفضل لحد الغروب، والبرتقالي عند الأفق بس، والبنفسجي بعد ما الشمس تغيب */
var K={
 night:["#04060f","#0a1230","#16244a","rgba(190,205,255,.08)"],
 fajr:["#0b1230","#23305e","#5d5a86","rgba(255,170,130,.22)"],
 dawn:["#1d3566","#5d6f9e","#e9a46f","rgba(255,180,120,.45)"],
 sunrise:["#2f5e9e","#7fa3cf","#f6c48f","rgba(255,210,150,.55)"],
 morning:["#2b6cb6","#5a9ad8","#a6cdee","rgba(255,250,225,.35)"],
 noon:["#1d64b8","#3a87d6","#8cc0ec","rgba(255,255,235,.35)"],
 asr:["#2463aa","#4f8bc8","#b8d3e6","rgba(255,235,190,.35)"],
 golden:["#2a5c9c","#6e95c0","#f0c38e","rgba(255,200,120,.55)"],
 maghrib:["#22396e","#8a6f9a","#f08a52","rgba(255,150,80,.60)"],
 dusk:["#141d44","#3d3566","#a45a5c","rgba(220,120,110,.25)"],
 isha:["#0a1030","#141f45","#2a325e","rgba(190,200,255,.10)"]
};
function hex(c){var m=c.match(/[\d.]+/g);if(c[0]==="#")return[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16),1];return m.map(Number)}
function mix(a,b,f){var x=hex(a),y=hex(b);if(a[0]==="#"&&b[0]==="#")return"#"+[0,1,2].map(function(i){return("0"+Math.round(x[i]+(y[i]-x[i])*f).toString(16)).slice(-2)}).join("");return"rgba("+[0,1,2].map(function(i){return Math.round(x[i]+(y[i]-x[i])*f)}).join(",")+","+(x[3]+(y[3]-x[3])*f).toFixed(3)+")"}
function stops(){var t=prayerDay(0).t;return[[t.fajr-1.2,"night"],[t.fajr,"fajr"],[t.sunrise-.4,"dawn"],[t.sunrise,"sunrise"],[t.sunrise+1.3,"morning"],[t.dhuhr,"noon"],[t.asr,"asr"],[t.maghrib-.6,"golden"],[t.maghrib,"maghrib"],[t.maghrib+.45,"dusk"],[t.isha,"isha"],[t.isha+1.2,"night"]]}
function colors(h){var s=stops();if(h<s[0][0])return K.night;for(var i=0;i<s.length-1;i++){var a=s[i],b=s[i+1];if(h>=a[0]&&h<b[0]){var f=(h-a[0])/(b[0]-a[0]);f=f*f*(3-2*f);return K[a[1]].map(function(c,j){return mix(c,K[b[1]][j],f)})}}return K.night}
/* مكان التوهّج: مع الشمس بالنهار، وفوق ناحية القمر بالليل */
/* التوهّج على الشمس نفسها (نفس معادلة مكانها في 31-sky.js)، وعند الأفق قبل الشروق وبعد الغروب */
function glowAt(h){try{var t=prayerDay(0).t;if(h>=t.sunrise-.5&&h<=t.maghrib+.5){var f=Math.max(0,Math.min(1,(h-t.sunrise)/(t.maghrib-t.sunrise)));return[(86-74*f)+"%",(96-74*Math.sin(Math.PI*f))+"%"]}}catch(e){}return["30%","10%"]}

var lastSky="";
function paintSky(){var el=document.getElementById("skyCard");if(!el)return;var h;try{h=__nowH()}catch(e){return}
 var k=Math.round(h*30);if(k===lastSky)return;lastSky=k;/* كل دقيقتين كفاية: التغيير بطيء */
 var c;try{c=colors(h)}catch(e){return}var g=glowAt(h),st=el.style;
 st.setProperty("--sk-top",c[0]);st.setProperty("--sk-mid",c[1]);st.setProperty("--sk-low",c[2]);st.setProperty("--sk-glow",c[3]);st.setProperty("--sk-gx",g[0]);st.setProperty("--sk-gy",g[1]);var ph=phase(h);if(el.dataset.ph!==ph)el.dataset.ph=ph}

/* ===== الجو ===== */
var WX={0:["clear","صافي"],1:["clear","صافي غالبًا"],2:["partly","غائم جزئيًا"],3:["cloudy","غائم"],45:["fog","ضباب"],48:["fog","ضباب"],
 51:["rain","رذاذ"],53:["rain","رذاذ"],55:["rain","رذاذ"],56:["rain","رذاذ متجمّد"],57:["rain","رذاذ متجمّد"],61:["rain","مطر خفيف"],63:["rain","مطر"],65:["rain","مطر غزير"],66:["rain","مطر متجمّد"],67:["rain","مطر متجمّد"],
 71:["snow","ثلج خفيف"],73:["snow","ثلج"],75:["snow","ثلج كثيف"],77:["snow","ثلج"],80:["rain","زخّات مطر"],81:["rain","زخّات مطر"],82:["rain","زخّات غزيرة"],85:["snow","زخّات ثلج"],86:["snow","زخّات ثلج"],95:["storm","عاصفة رعدية"],96:["storm","عاصفة رعدية"],99:["storm","عاصفة رعدية"]};
var IC={clear:'<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 night:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
 partly:'<path d="M8 4.5v1.5M3.5 9H5M4.8 5.8l1 1M12.2 5.8l-1 1"/><path d="M5.6 11.5A3.5 3.5 0 0 1 11.6 8"/><path d="M8 20h9.5a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.6 1.4A3 3 0 0 0 8 20z"/>',
 cloudy:'<path d="M7 19h10.5a4 4 0 0 0 0-8 6 6 0 0 0-11.4 1.8A3.2 3.2 0 0 0 7 19z"/>',
 fog:'<path d="M4 9h16M3 13h18M5 17h14"/>',
 rain:'<path d="M7 15h10.5a4 4 0 0 0 0-8 6 6 0 0 0-11.4 1.8A3.2 3.2 0 0 0 7 15z"/><path d="M8 18l-1 2.5M12 18l-1 2.5M16 18l-1 2.5"/>',
 snow:'<path d="M7 15h10.5a4 4 0 0 0 0-8 6 6 0 0 0-11.4 1.8A3.2 3.2 0 0 0 7 15z"/><path d="M8 19h.01M12 20h.01M16 19h.01"/>',
 storm:'<path d="M7 14h10.5a4 4 0 0 0 0-8 6 6 0 0 0-11.4 1.8A3.2 3.2 0 0 0 7 14z"/><path d="M12.5 15l-2 3.5h3l-2 3.5"/>'};
var KEY="wird-wx",TTL=30*6e4,busy=0;
function coords(){try{if(typeof P==="undefined"||P.lat==null)return null;return[(+P.lat).toFixed(1),(+P.lng).toFixed(1)]}catch(e){return null}}
function cached(c){try{var v=JSON.parse(localStorage.getItem(KEY)||"null");if(v&&v.k===c.join(","))return v}catch(e){}return null}
function load(){var c=coords();if(!c)return;var v=cached(c);if(v)show(v);if((v&&Date.now()-v.at<TTL)||busy||!navigator.onLine)return;busy=1;
 fetch("https://api.open-meteo.com/v1/forecast?latitude="+c[0]+"&longitude="+c[1]+"&current=temperature_2m,weather_code,is_day&timezone=auto").then(function(r){return r.ok?r.json():null}).then(function(j){busy=0;if(!j||!j.current)return;
  var o={k:c.join(","),at:Date.now(),t:Math.round(j.current.temperature_2m),w:j.current.weather_code,d:j.current.is_day};try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}show(o)}).catch(function(){busy=0})}
function show(o){var el=document.getElementById("skyCard");if(!el)return;var m=WX[o.w]||WX[0],kind=m[0];
 if(el.dataset.wx!==kind)el.dataset.wx=kind;clouds(el,kind);
 var b=el.querySelector(".sk-wx");if(!b){b=document.createElement("span");b.className="sk-wx";el.appendChild(b)}
 var ic=kind==="clear"&&!o.d?"night":kind,html='<svg viewBox="0 0 24 24" aria-hidden="true">'+IC[ic]+'</svg><b>'+ar(o.t)+'°</b><span>'+m[1]+'</span>';
 if(b.dataset.h!==html){b.innerHTML=html;b.dataset.h=html}b.hidden=false;b.setAttribute("aria-label","الجو الآن: "+m[1]+"، "+ar(o.t)+" درجة")}
/* ===== السحاب الواقعي =====
 بيتولّد من ضوضاء طبيعية (fractal noise) بنفس طريقة رسم السحاب في الألعاب، ويتحوّل لصورة مرة واحدة لكل كثافة
 (الرسم من الضوضاء تقيل، والصورة الجاهزة خفيفة وهي بتتحرّك). الكثافة من حالة الجو، واللون من نور الوقت (data-ph في CSS) */
var COV={partly:.32,cloudy:.9,rain:.95,storm:.97,snow:.85},CL={};
function cloudSVG(cov){var b=(-(2.55-cov*1.55)).toFixed(2),sh=(cov>.8?.12:.14),f="<feTurbulence type='fractalNoise' baseFrequency='0.0045 0.011' numOctaves='6' seed='7' stitchTiles='stitch'/>";
 return"<svg xmlns='http://www.w3.org/2000/svg' width='760' height='380'><defs>"+
 "<filter id='c' x='0' y='0' width='100%' height='100%'>"+f+"<feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  4 0 0 0 "+b+"'/><feGaussianBlur stdDeviation='1.2'/></filter>"+
 "<filter id='s' x='0' y='0' width='100%' height='100%'>"+f+"<feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  4 0 0 0 "+(b-.15).toFixed(2)+"'/><feOffset dy='10'/><feGaussianBlur stdDeviation='6'/></filter>"+
 "<linearGradient id='v' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='white'/><stop offset='.6' stop-color='white' stop-opacity='.85'/><stop offset='1' stop-color='white' stop-opacity='.2'/></linearGradient><mask id='m'><rect width='760' height='380' fill='url(#v)'/></mask></defs>"+
 "<g mask='url(#m)'><rect width='760' height='380' filter='url(#s)' opacity='"+sh+"'/><rect width='760' height='380' filter='url(#c)'/></g></svg>"}
function cloudImg(kind,cb){var cov=COV[kind];if(!cov)return cb(null);if(CL[kind])return cb(CL[kind]);
 var im=new Image();im.onload=function(){try{var c=document.createElement("canvas");c.width=760;c.height=380;c.getContext("2d").drawImage(im,0,0);CL[kind]="url("+c.toDataURL("image/png")+")"}catch(e){CL[kind]="url(\""+im.src+"\")"}cb(CL[kind])};
 im.onerror=function(){cb(null)};im.src="data:image/svg+xml,"+encodeURIComponent(cloudSVG(cov))}
function clouds(el,kind){var c=el.querySelector(".sk-clouds");if(!c||c.dataset.k===kind)return;c.dataset.k=kind;
 cloudImg(kind,function(u){if(c.dataset.k!==kind)return;if(u){c.style.backgroundImage=u;c.classList.add("on")}else c.classList.remove("on")})}
/* مرحلة النور (للون السحاب): من نفس نقاط الوقت */
function phase(h){try{var t=prayerDay(0).t;if(h<t.fajr-.2||h>=t.maghrib+.8)return"night";if(h<t.sunrise+.6)return"dawn";if(h<t.maghrib-.6)return"day";if(h<t.maghrib+.2)return"sunset";return"dusk"}catch(e){return"day"}}

/* طبقة المطر/الثلج: بتتعمل مرة واحدة */
function fx(el){if(el.querySelector(".sk-fx"))return;var d=document.createElement("div");d.className="sk-fx";d.setAttribute("aria-hidden","true");var h="";for(var i=0;i<48;i++)h+='<i style="left:'+(i*17%100)+'%;animation-delay:-'+((i%12)*.31).toFixed(2)+'s;animation-duration:'+(.55+(i%5)*.09).toFixed(2)+'s"></i>';d.innerHTML=h;el.insertBefore(d,el.querySelector(".sk-info"))}
/* الحركة تقف لما الكارت مش ظاهر */
var io=null;function watch(el){if(io||!window.IntersectionObserver)return;io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle("sk-off",!e.isIntersecting)})});io.observe(el)}

function run(){var el=document.getElementById("skyCard");if(!el)return;fx(el);watch(el);paintSky();load()}
__wOnDom(function(){var el=document.getElementById("skyCard");if(el&&!el.querySelector(".sk-fx"))run()});
var n=0;__wEverySec(function(){if((document.documentElement.dataset.view||"home")!=="home")return;paintSky();if(++n%60===0)load()});
document.addEventListener("visibilitychange",function(){if(!document.hidden)load()});
/* لما المستخدم يغيّر مدينته */
window.addEventListener("storage",function(e){if(e.key==="wird-prayer")load()});
run();
})();
