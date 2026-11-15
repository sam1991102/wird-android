/* داخل تطبيق أندرويد: تحديد الموقع من النظام مباشرة (WirdGeo) بدل موقع المتصفح.
   لو خدمة الموقع مقفولة أو الإذن مرفوض نهائيًا، بنعرض فتح الإعدادات بدل ما يفشل بصمت. */
(function(){"use strict";
var G=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.WirdGeo;
if(!window.__WIRD_NATIVE||!G||!navigator.geolocation)return;
var busy=null;
function err(code,msg){var e={code:code,message:msg,PERMISSION_DENIED:1,POSITION_UNAVAILABLE:2,TIMEOUT:3};return e}
function ask(msg,fn){setTimeout(function(){if(window.confirm(msg))fn()},50)}
function get(){if(busy)return busy;busy=G.get().then(function(r){busy=null;return r},function(e){busy=null;throw e});return busy}
navigator.geolocation.getCurrentPosition=function(ok,fail){
 get().then(function(r){ok&&ok({coords:{latitude:r.lat,longitude:r.lng,accuracy:r.acc,altitude:null,altitudeAccuracy:null,heading:null,speed:null},timestamp:r.t||Date.now()})},
 function(e){var c=e&&e.code;
  if(c==="off"){ask("خدمة الموقع (GPS) مقفولة في الموبايل.\nتفتح الإعدادات وتشغّلها؟",function(){G.openSettings()});fail&&fail(err(2,"off"))}
  else if(c==="denied"){G.state().then(function(s){if(s.perm==="denied")ask("إذن الموقع مرفوض لـ«وِرد».\nتفتح إعدادات التطبيق وتسمح بالموقع؟",function(){G.openAppSettings()})}).catch(function(){});fail&&fail(err(1,"denied"))}
  else fail&&fail(err(3,(e&&e.message)||"timeout"))})};
navigator.geolocation.watchPosition=function(ok,fail,o){navigator.geolocation.getCurrentPosition(ok,fail,o);return 1};
navigator.geolocation.clearWatch=function(){};
var pq=navigator.permissions&&navigator.permissions.query&&navigator.permissions.query.bind(navigator.permissions);
if(navigator.permissions)try{navigator.permissions.query=function(d){if(d&&d.name==="geolocation")return G.state().then(function(s){return{state:s.perm,onchange:null,addEventListener:function(){},removeEventListener:function(){}}});return pq?pq(d):Promise.reject(new Error("unsupported"))}}catch(e){}
})();
