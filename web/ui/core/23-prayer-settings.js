(function(){
/* موقع المواقيت: تحديث تلقائي من موقع الجهاز، واختيار طريقة الحساب حسب البلد.
   الواجهة كلها في 40-prayer-page.js (صفحة «إعدادات المواقيت» ونافذة المدينة في 00f-city.js) */
var FRESH=6*3600e3;
/* أقرب مدينة معروفة (لحد ~١٢ درجة) تحدد طريقة الحساب، وغير كده رابطة العالم الإسلامي */
window.__nearMethod=function(la,lo){try{var b=null,bd=1e9;CITIES.forEach(function(c){var d=Math.hypot(c[2]-la,(c[3]-lo)*Math.cos(la*Math.PI/180));if(d<bd){bd=d;b=c}});return bd<12&&b?b[5]:"mwl"}catch(e){return P.method}};
/* حدّد موقعي: silent=true للتحديث في الخلفية (من غير رسائل) */
window.__wirdGeo=function(silent){return new Promise(function(res){if(!navigator.geolocation){res(false);return}
 navigator.geolocation.getCurrentPosition(function(p){var la=+p.coords.latitude.toFixed(4),lo=+p.coords.longitude.toFixed(4),tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone}catch(e){}
  var moved=P.city!=="geo"||P.pick||Math.hypot(la-P.lat,(lo-P.lng)*Math.cos(la*Math.PI/180))>0.03;
  P=Object.assign({},P,moved?{city:"geo",name:"موقعي الحالي",pick:0,lat:la,lng:lo,tz:tz||P.tz}:{},P.mUser?{}:{method:__nearMethod(la,lo)},{geoT:Date.now()});
  savePrayer();try{window.__wirdPush&&__wirdPush.sync(true)}catch(e){}if(!silent&&window.toast)toast("تم ضبط المواقيت حسب موقعك");res(true)},
 function(){if(!silent&&window.toast)toast("ما قدرناش نحدد موقعك — ابحث عن مدينتك");res(false)},{timeout:15000,maximumAge:3*3600e3})})};
function stale(){return P.city==="geo"&&!P.pick&&(!P.geoT||Date.now()-P.geoT>FRESH)}
function auto(){if(P.pick)return;/* مدينة اختارها المستخدم بنفسه */
 var q=navigator.permissions&&navigator.permissions.query?navigator.permissions.query({name:"geolocation"}):Promise.reject();
 q.then(function(st){if(st.state==="granted"&&(P.city!=="geo"||stale()))__wirdGeo(true)},function(){if(stale())__wirdGeo(true)})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",auto);else setTimeout(auto,300);
document.addEventListener("visibilitychange",function(){if(!document.hidden&&stale())__wirdGeo(true)});
})();
