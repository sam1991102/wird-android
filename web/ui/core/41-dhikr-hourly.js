;(function(){"use strict";
/* ===== ذكر الساعة: تذكير بذكر قصير مطلق كل ساعة (أو ٢ أو ٣) على حسب وقت اليوم =====
 القايمة مختارة بإيد بمصادر موثّقة (من غير أدعية الأحوال: سفر، مرض، زواج …).
 الأحداث بتدخل جدولة الأذان (__wirdPush.buildEvents ← __dhikrEvents)، وفي التطبيق بتوصل الأندرويد بنوع dhikr
 فيرسمها بزراير «قلتها» و«+١٠» و«بعدين» (AdhanReceiver/WNotify). الضغطات بترجع لعدّاد اليوم عند فتح التطبيق.
 الإعدادات: قسم #st-dr في صفحة الإعدادات. التصميم: docs/superpowers/specs/2026-11-20-dhikr-hourly-notif-design.md */
var ar=__ar;
/* [مفتاح، نوع، العنوان، النص، الفضل، المصدر، عدد المرات]  النوع: tas تسبيح/تهليل، haw حوقلة، ist استغفار، sal صلاة على النبي، dua دعاء */
var L=[
 ["sbh","tas","سبحان الله وبحمده","سُبْحَانَ اللَّهِ وَبِحَمْدِهِ","من قالها في يوم مائة مرة حُطّت خطاياه وإن كانت مثل زبد البحر","متفق عليه",100],
 ["sbh2","tas","كلمتان خفيفتان","سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ","خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن","متفق عليه",1],
 ["tahl","tas","لا إله إلا الله وحده","لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ","من قالها في يوم مائة مرة كانت له عدل عشر رقاب، وكُتبت له مائة حسنة","متفق عليه",100],
 ["arba","tas","أحب الكلام إلى الله","سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ","أحبّ الكلام إلى الله أربع","رواه مسلم",1],
 ["hamd","tas","الحمد لله","الْحَمْدُ لِلَّهِ","والحمد لله تملأ الميزان","رواه مسلم",1],
 ["juw","tas","عدد خلقه","سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ","قالها النبي ﷺ ثلاثًا، ولو وُزنت بذكرٍ من أول النهار لوزنته","رواه مسلم",3],
 ["tawh","tas","لا إله إلا الله","لَا إِلَهَ إِلَّا اللَّهُ","أفضل الذكر لا إله إلا الله","رواه الترمذي وحسّنه الألباني",1],
 ["nakh","tas","سبحان الله العظيم وبحمده","سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ","غُرست له نخلة في الجنة","رواه الترمذي وصحّحه الألباني",1],
 ["rida","tas","رضيت بالله ربًّا","رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ رَسُولًا","وجبت له الجنة","رواه مسلم",1],
 ["hawl","haw","لا حول ولا قوة إلا بالله","لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ","كنز من كنوز الجنة","متفق عليه",1],
 ["hasb","haw","حسبي الله","حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ","","سورة التوبة: ١٢٩",1],
 ["ist","ist","أستغفر الله","أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ","كان النبي ﷺ يستغفر الله ويتوب إليه في اليوم أكثر من سبعين مرة","رواه البخاري",100],
 ["ist2","ist","رب اغفر لي","رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ، إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ","كانوا يعدّونها للنبي ﷺ في المجلس الواحد مائة مرة","رواه أبو داود والترمذي وصحّحه الألباني",1],
 ["ist3","ist","الحي القيوم","أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ","غُفر له وإن كان فرّ من الزحف","رواه أبو داود والترمذي وصحّحه الألباني",1],
 ["yunus","ist","دعوة ذي النون","لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ","لم يدعُ بها مسلم في شيء قط إلا استجاب الله له","رواه الترمذي وصحّحه الألباني",1],
 ["sal","sal","الصلاة على النبي ﷺ","اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ","من صلّى عليّ صلاة صلّى الله عليه بها عشرًا","رواه مسلم",10],
 ["ibr","sal","الصلاة الإبراهيمية","اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ","علّمها النبي ﷺ أصحابه","متفق عليه",1],
 ["rabbana","dua","ربنا آتنا","رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً، وَفِي الْآخِرَةِ حَسَنَةً، وَقِنَا عَذَابَ النَّارِ","كان أكثر دعاء النبي ﷺ","متفق عليه",1],
 ["afw","dua","العفو","اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي","","رواه الترمذي وصحّحه الألباني",1],
 ["thbt","dua","ثبّت قلبي","يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ","كان أكثر دعاء النبي ﷺ","رواه الترمذي وصحّحه الألباني",1],
 ["ain","dua","أعنّي على ذكرك","اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ","أوصى بها النبي ﷺ معاذًا دبر كل صلاة","رواه أبو داود والنسائي وصحّحه الألباني",1],
 ["huda","dua","الهدى والتقى","اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى، وَالتُّقَى، وَالْعَفَافَ، وَالْغِنَى","","رواه مسلم",1],
 ["afia","dua","العفو والعافية","اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ","","رواه أبو داود وابن ماجه وصحّحه الألباني",1]
].map(function(a){return{key:a[0],type:a[1],title:a[2],text:a[3],fadl:a[4],src:a[5],reps:a[6]}});
/* أنواع كل فترة من اليوم */
var BUCKET={am:["tas","dua"],noon:["tas","haw"],asr:["ist"],night:["sal","dua","haw"]};
var PR=["fajr","dhuhr","asr","maghrib","isha"],QUIET=.25,AFTER=20/60;
var DEF={on:false,every:1,from:"08:00",to:"22:00",heads:1};
function get(){var s={};try{s=JSON.parse(localStorage.getItem("wird-dr")||"{}")||{}}catch(e){}
 /* الشكل القديم (أوقات ثابتة + تكرار): نحتفظ بالتفعيل بس */
 if(s.list||s.every===0){s={on:!!s.on}}return Object.assign({},DEF,s)}
function set(s){try{localStorage.setItem("wird-dr",JSON.stringify(s))}catch(e){}try{window.__wirdPush&&__wirdPush.sync(true)}catch(e){}}
var mins=function(hm){var p=String(hm||"0:0").split(":");return(+p[0]||0)*60+(+p[1]||0)};
function bucketAt(h,t){h=h%24;if(h<t.fajr)return"night";if(h<t.dhuhr)return"am";if(h<t.asr)return"noon";if(h<t.maghrib)return"asr";return"night"}
/* فترات يوم واحد بتوقيت المدينة (ساعات، ممكن تعدّي ٢٤ لو الفترة بتعدّي نص الليل) */
function slots(s,t){var a=mins(s.from),b=mins(s.to),out=[];if(b<=a)b+=1440;var step=Math.max(1,Math.min(3,+s.every||1))*60;
 for(var m=a;m<=b&&out.length<18;m+=step){var h=m/60;PR.forEach(function(p){if(h>=t[p]&&h<t[p]+QUIET)h=t[p]+AFTER});out.push(h)}return out}
/* اختيار ثابت من (اليوم، رقم الفترة) ومن غير تكرار في نفس اليوم */
function pickDay(dayNum,hours,t,isFri){var used={},res=[];
 hours.forEach(function(h,i){var b=bucketAt(h,t),types=isFri&&i%2===0?["sal"]:BUCKET[b];
  var pool=L.filter(function(x){return types.indexOf(x.type)>=0&&!used[x.key]});if(!pool.length)pool=L.filter(function(x){return!used[x.key]});if(!pool.length)pool=L;
  var it=pool[(dayNum*7+i*3)%pool.length];used[it.key]=1;res.push(it)});return res}
function ev(it,at,s){var b=it.text+(it.fadl||it.src?"\n"+[it.fadl,it.src].filter(Boolean).join(" — "):"");
 return{t:at,title:it.title+(it.reps>1?" · "+ar(it.reps)+(it.reps<=10?" مرات":" مرة"):""),body:b,tag:"dhikr-"+it.key,url:"/#tasbih",heads:s.heads?1:0,x:{key:it.key,text:it.text,fadl:it.fadl,src:it.src,reps:it.reps}}}
window.__dhikrEvents=function(days){var s=get();if(!s.on)return[];var out=[];
 for(var k=0;k<Math.min(days||4,4);k++){var d;try{d=prayerDay(k)}catch(e){break}var D=d.L,base=Date.UTC(D.y,D.m-1,D.d),hs=slots(s,d.t),its=pickDay(Math.floor(base/864e5),hs,d.t,d.isFri);
  hs.forEach(function(h,i){out.push(ev(its[i],Math.round(base+(h-D.off)*3600e3),s))})}return out};
window.__dhikrList=L;

/* ===== الضغطات من الإشعار (قلتها / +١٠) بترجع لعدّاد اليوم ===== */
function taps(){var pl=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.WirdAdhan;if(!pl||!pl.dhikrTaps)return;
 pl.dhikrTaps().then(function(r){var n=r&&+r.n||0;if(!n||typeof day==="undefined")return;if(r.date!==dayKey())return;day.tasbih=(day.tasbih||0)+n;saveDay();try{renderAll()}catch(e){}window.toast&&toast("اتضاف "+ar(n)+" ذكر من الإشعارات")}).catch(function(){})}
if(window.__WIRD_NATIVE){setTimeout(taps,1500);document.addEventListener("visibilitychange",function(){if(!document.hidden)taps()})}

/* ===== الإعدادات: قسم #st-dr ===== */
var TIMES=[];for(var h=0;h<24;h++)TIMES.push((h<10?"0":"")+h+":00");
function lbl(hm){var h=+hm.slice(0,2);return ar((h%12||12))+(h<12?" ص":" م")}
function opt(v,cur,t){return'<option value="'+v+'"'+(String(v)===String(cur)?" selected":"")+'>'+t+'</option>'}
function html(s){var sw=function(id,on){return'<label class="st-sw"><input type="checkbox" id="'+id+'"'+(on?" checked":"")+'><span></span></label>'};
 var row=function(l,h,c){return'<div class="st-row"><div class="st-l"><strong>'+l+'</strong>'+(h?'<small>'+h+'</small>':'')+'</div><div class="st-c">'+c+'</div></div>'};
 var a=L[new Date().getHours()%L.length];
 return'<h2>ذكر الساعة</h2><p class="st-note">ذكر قصير من السنة كل فترة، بيتغيّر على حسب وقت اليوم ومش بيتكرر في نفس اليوم. تقدر تعدّه من الإشعار نفسه من غير ما تفتح التطبيق.</p>'+
 row("تفعيل ذكر الساعة","",sw("drOn",s.on))+
 '<div class="dh-more"'+(s.on?"":" hidden")+'>'+
 row("كل قد إيه","",'<select id="drEv" class="st-sel">'+opt(1,s.every,"كل ساعة")+opt(2,s.every,"كل ساعتين")+opt(3,s.every,"كل ٣ ساعات")+'</select>')+
 row("من","",'<select id="drFrom" class="st-sel">'+TIMES.map(function(x){return opt(x,s.from,lbl(x))}).join("")+'</select>')+
 row("لحد","مفيش تذكير برّه الفترة دي",'<select id="drTo" class="st-sel">'+TIMES.map(function(x){return opt(x,s.to,lbl(x))}).join("")+'</select>')+
 (window.__WIRD_NATIVE?row("يظهر فوق الشاشة","ولو قفلته يوصل بهدوء في الإشعارات",sw("drHeads",s.heads)):"")+
 '<p class="st-note">مش بيوصلك في الربع ساعة اللي بعد الأذان، ولا والتطبيق مفتوح.</p>'+
 '<div class="dh-prev" aria-label="مثال للإشعار"><div class="dh-top"><span class="dh-app">و</span>وِرد · ذكر الساعة</div><b>'+a.title+'</b><p class="dh-tx">'+a.text+'</p><small>'+[a.fadl,a.src].filter(Boolean).join(" — ")+'</small><div class="dh-act"><span>قلتها ✓</span><span>+'+ar(10)+'</span><span>بعدين</span></div></div>'+
 '</div>'}
function build(){var st=document.querySelector(".st"),ad=st&&st.querySelector("#st-adhan");if(!ad||document.getElementById("st-dr"))return;
 var sec=document.createElement("section");sec.className="st-sec";sec.id="st-dr";sec.innerHTML=html(get());ad.after(sec);
 sec.addEventListener("change",function(e){var s=get(),t=e.target;
  if(t.id==="drOn"){s.on=t.checked;sec.querySelector(".dh-more").hidden=!s.on;if(s.on){var p=window.__wirdPush&&__wirdPush.state&&__wirdPush.state();if(p&&!p.on&&window.toast)toast("فعّل الإشعارات الأول من «الإشعارات»")}}
  else if(t.id==="drEv")s.every=+t.value;else if(t.id==="drFrom")s.from=t.value;else if(t.id==="drTo")s.to=t.value;else if(t.id==="drHeads")s.heads=t.checked?1:0;else return;
  set(s)})}
build();__wOnDom(build);
})();
