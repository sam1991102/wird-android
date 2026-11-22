/*glass*/(function(){
/* «المظهر الزجاجي»: سماء تتغيّر مع وقت الصلاة (فجر، نهار، مغرب، ليل) والبطاقات زجاج شفاف فوقها.
   الألوان كلها من متغيّرات التصميم في css/22-glass.css، والتمويه الحقيقي بس على الأجهزة اللي تستحمله. */
var R=document.documentElement;
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}}
function on(){return ls("wird-glass")==="1"}
/* الأجهزة الضعيفة أو «تقليل الشفافية»: نفس الشكل من غير تمويه (أخفّ على كارت الشاشة والبطارية) */
function lite(){var c=navigator.hardwareConcurrency||8,m=navigator.deviceMemory||8;
 return c<=4||m<=3||matchMedia("(prefers-reduced-transparency: reduce)").matches||!CSS.supports("backdrop-filter","blur(2px)")&&!CSS.supports("-webkit-backdrop-filter","blur(2px)")}
/* مرحلة السماء من مواقيت اليوم */
function sky(){try{var t=prayerDay(0).t,h=__nowH();
 if(h>=t.fajr&&h<t.sunrise+0.75)return"dawn";if(h>=t.sunrise+0.75&&h<t.asr)return"day";if(h>=t.asr&&h<t.maghrib+0.5)return"dusk";return"night"}catch(e){return"night"}}
function apply(){var g=on();R.classList.toggle("glass",g);R.classList.toggle("glass-lite",g&&lite());
 if(g){R.classList.add("dark");R.classList.remove("sepia");var s=sky();if(R.dataset.sky!==s)R.dataset.sky=s;
  var m=document.querySelector('meta[name="theme-color"]');if(m)m.content={dawn:"#3b2f4a",day:"#12434b",dusk:"#3a2338",night:"#0a1420"}[s]}
 else delete R.dataset.sky}
apply();__wEvery(60,apply);document.addEventListener("visibilitychange",function(){if(!document.hidden)apply()});
window.__wirdGlass={on:on,set:function(v){ls("wird-glass",v?"1":"0");
 /* لما يتقفل: نرجّع المظهر اللي كان مختار (تلقائي/الجهاز/يدوي) */
 if(!v){R.classList.remove("glass","glass-lite");delete R.dataset.sky;window.dispatchEvent(new Event("sysdark"));try{var d=localStorage.getItem("wird-dark");if(localStorage.getItem("wird-theme-mode")==="manual")R.classList.toggle("dark",d==="true")}catch(e){}}
 apply();window.toast&&toast(v?"تم تفعيل المظهر الزجاجي":"رجع المظهر العادي")},apply:apply};
})();
