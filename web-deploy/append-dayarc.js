
/*dayarc*/(function(){
/* أذكار اليوم «مسار اليوم»: قوس الشمس من الفجر للعشاء وعليه محطات الأذكار */
var R=document.documentElement,NS="http://www.w3.org/2000/svg",IC={"sun": "<path d=\"M192,144a64.33,64.33,0,0,1-2,16H66a64,64,0,1,1,126-16Z\" opacity=\"0.2\"/><path d=\"M240,152H199.55a73.54,73.54,0,0,0,.45-8,72,72,0,0,0-144,0,73.54,73.54,0,0,0,.45,8H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM72,144a56,56,0,1,1,111.41,8H72.59A56.13,56.13,0,0,1,72,144Zm144,56a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,200ZM72.84,43.58a8,8,0,0,1,14.32-7.16l8,16a8,8,0,0,1-14.32,7.16Zm-56,48.84a8,8,0,0,1,10.74-3.57l16,8a8,8,0,0,1-7.16,14.31l-16-8A8,8,0,0,1,16.84,92.42Zm192,15.16a8,8,0,0,1,3.58-10.73l16-8a8,8,0,1,1,7.16,14.31l-16,8a8,8,0,0,1-10.74-3.58Zm-48-55.16,8-16a8,8,0,0,1,14.32,7.16l-8,16a8,8,0,1,1-14.32-7.16Z\"/>", "moon": "<path d=\"M210.69,158.18A88,88,0,1,1,97.82,45.31,96.08,96.08,0,0,0,192,160,96.78,96.78,0,0,0,210.69,158.18Z\" opacity=\"0.2\"/><path d=\"M240,96a8,8,0,0,1-8,8H216v16a8,8,0,0,1-16,0V104H184a8,8,0,0,1,0-16h16V72a8,8,0,0,1,16,0V88h16A8,8,0,0,1,240,96ZM144,56h8v8a8,8,0,0,0,16,0V56h8a8,8,0,0,0,0-16h-8V32a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16Zm72.77,97a8,8,0,0,1,1.43,8A96,96,0,1,1,95.07,37.8a8,8,0,0,1,10.6,9.06A88.07,88.07,0,0,0,209.14,150.33,8,8,0,0,1,216.77,153Zm-19.39,14.88c-1.79.09-3.59.14-5.38.14A104.11,104.11,0,0,1,88,64c0-1.79,0-3.59.14-5.38A80,80,0,1,0,197.38,167.86Z\"/>", "zz": "<path d=\"M248,112v56H112V80H216A32,32,0,0,1,248,112Z\" opacity=\"0.2\"/><path d=\"M216,72H32V48a8,8,0,0,0-16,0V208a8,8,0,0,0,16,0V176H240v32a8,8,0,0,0,16,0V112A40,40,0,0,0,216,72ZM32,88h72v72H32Zm88,72V88h96a24,24,0,0,1,24,24v48Z\"/>", "book": "<path d=\"M232,56V200H160a32,32,0,0,0-32,32V88a32,32,0,0,1,32-32Z\" opacity=\"0.2\"/><path d=\"M232,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V56A8,8,0,0,0,232,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64ZM160,88h40a8,8,0,0,1,0,16H160a8,8,0,0,1,0-16Zm48,40a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,128Zm0,32a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,160Z\"/>"};
function ar(n){return String(n).replace(/\d/g,function(d){return"٠١٢٣٤٥٦٧٨٩"[d]})}
function hm(h){h=((h%24)+24)%24;var H=Math.floor(h),M=Math.round((h-H)*60);if(M===60){H++;M=0}var pm=H>=12,h12=H%12||12;return ar(h12)+":"+ar(String(M).padStart(2,"0"))+(pm?" م":" ص")}
var W=340,H=132,P0=[322,112],C=[170,-26],P2=[18,112];
function pt(t){var u=1-t;return[u*u*P0[0]+2*u*t*C[0]+t*t*P2[0],u*u*P0[1]+2*u*t*C[1]+t*t*P2[1]]}
function arc(a,b){var d="",n=40;for(var i=0;i<=n;i++){var p=pt(a+(b-a)*i/n);d+=(i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)}return d}
function cat(rx){try{return(categories.find(function(c){return rx.test(c.name)})||{}).id}catch(e){return null}}
function hours(){var d=new Date();return d.getHours()+d.getMinutes()/60}
function render(box){if(!box)return;var t=null;try{t=prayerDay(0).t}catch(e){}
 if(!t){box.innerHTML="";return}
 var span=t.isha-t.fajr,pos=function(h){return Math.max(0,Math.min(1,(h-t.fajr)/span))},now=hours();
 var st=[{k:"morning",n:"الصباح",at:t.sunrise!=null?t.sunrise:t.fajr+1,from:t.fajr,to:t.asr,ic:"sun",rx:/الصباح/},
  {k:"evening",n:"المساء",at:t.asr,from:t.asr,to:t.isha,ic:"moon",rx:/المساء/},
  {k:"sleep",n:"النوم",at:t.isha,from:t.isha,to:t.fajr+24,ic:"zz",rx:/النوم/}];
 var night=now<t.fajr||now>=t.isha,cur=night?"sleep":now>=t.asr?"evening":"morning",sun=pos(now);
 var g='<svg class="da-svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="مسار اليوم">'
  +'<path class="da-track" d="'+arc(0,1)+'"/>'+(night?"":'<path class="da-done" d="'+arc(0,sun)+'"/>');
 if(!night){var s=pt(sun);g+='<circle class="da-sun" cx="'+s[0].toFixed(1)+'" cy="'+s[1].toFixed(1)+'" r="5"/>'}
 st.forEach(function(x){var p=pt(pos(x.at)),on=x.k===cur,past=!on&&(x.k==="morning"?now>=t.asr:x.k==="evening"?now>=t.isha||now<t.fajr:false),r=on?21:16;
  g+='<g class="da-st'+(on?" is-now":"")+(past?" is-past":"")+'" data-k="'+x.k+'" tabindex="0" role="button" aria-label="أذكار '+x.n+'"><circle class="da-halo" cx="'+p[0]+'" cy="'+p[1]+'" r="'+(r+7)+'"/><circle class="da-dot" cx="'+p[0]+'" cy="'+p[1]+'" r="'+r+'"/><svg x="'+(p[0]-r*.6)+'" y="'+(p[1]-r*.6)+'" width="'+(r*1.2)+'" height="'+(r*1.2)+'" viewBox="0 0 256 256" fill="currentColor" class="da-ic">'+IC[x.ic]+'</svg></g>'});
 g+="</svg>";
 var labels='<div class="da-labels">'+st.map(function(x){var on=x.k===cur,left=Math.max(13,Math.min(87,pt(pos(x.at))[0]/W*100));return'<button type="button" class="da-lb'+(on?" is-now":"")+'" data-k="'+x.k+'" style="left:'+left.toFixed(1)+'%"><b>'+x.n+'</b><small>'+(on?"وقتها الآن":hm(x.from))+'</small></button>'}).join("")+"</div>";
 var curS=st.filter(function(x){return x.k===cur})[0],fri=new Date().getDay()===5;
 box.innerHTML='<div class="da-card"><div class="da-hd"><h2>أذكار اليوم</h2>'+(fri?'<button type="button" class="da-kahf" data-sura="18"><svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">'+IC.book+'</svg>سورة الكهف</button>':"")+'</div>'+g+labels+'<button type="button" class="da-go" data-k="'+cur+'">ابدأ أذكار '+curS.n+'</button></div>';
 box.dataset.min=Math.floor(now*60);box._st=st}
function open(k){var box=document.getElementById("homeAlerts"),x=(box&&box._st||[]).filter(function(s){return s.k===k})[0];if(!x)return;var id=cat(x.rx)||k;try{openFocus(id)}catch(e){}}
document.addEventListener("click",function(e){var el=e.target.closest&&e.target.closest("#homeAlerts [data-k],#homeAlerts [data-sura]");if(!el)return;if(el.dataset.sura){window.__openSurahN&&__openSurahN(+el.dataset.sura);return}open(el.dataset.k)});
document.addEventListener("keydown",function(e){if(e.key!=="Enter"&&e.key!==" ")return;var el=e.target.closest&&e.target.closest("#homeAlerts .da-st");if(el){e.preventDefault();open(el.dataset.k)}});
window.__renderDayArc=render;
function tick(){var b=document.getElementById("homeAlerts");if(!b||document.hidden)return;if((R.dataset.view||"home")!=="home")return;if(b.dataset.min!==String(Math.floor(hours()*60)))render(b)}
render(document.getElementById("homeAlerts"));setInterval(tick,60000);document.addEventListener("visibilitychange",tick);
})();
