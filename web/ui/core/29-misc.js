;(function(){
/* ===== إصلاحات عامة (v189–v191) ===== */
var p=location.pathname.replace(/^\/|\/$/g,'');var M={ruqya:'__openRuqya',names:'__openNames'};
if(M[p])setTimeout(function(){if(!document.querySelector('.wp-page')&&typeof window[M[p]]==='function')window[M[p]]()},900);
var f=document.getElementById('bkFile');if(f&&!f.getAttribute('aria-label'))f.setAttribute('aria-label','اختيار ملف النسخة الاحتياطية');
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persisted().then(function(x){if(!x)navigator.storage.persist()})}catch(e){}
function fri(){var s=document.getElementById("season");if(!s||s.hidden||!/الجمعة/.test(s.textContent))return;try{var d=prayerDay(0);var n=new Date();var h=n.getHours()+n.getMinutes()/60;if(n.getDay()===5&&h>=d.t.maghrib)s.hidden=true}catch(e){}}
setTimeout(fri,1500);__wEvery(60,fri);
})();
