

(function(){
 const ar=__ar;let snd;
 const nm=s=>{try{const x=window.__MUSHAF_IDX&&__MUSHAF_IDX[s-1];return x?String(x[0]||x.n||"").replace(/^سُ?و?رَ?ةُ?\s*/,"").replace(/^سورة\s*/,""):""}catch(e){return""}};
 document.addEventListener("click",async e=>{const w=e.target.closest(".mp .mp-w");if(!w)return;const s=+w.dataset.s,a=+w.dataset.a;if(!s||!a)return;e.stopPropagation();
  const isEnd=w.classList.contains("mp-e");const pg=w.closest(".mp-page")||document;const same=[...pg.querySelectorAll('.mp-w[data-s="'+s+'"][data-a="'+a+'"]:not(.mp-e)')];const pos=isEnd?0:same.indexOf(w)+1;
  document.querySelectorAll(".mp-w.wd-on").forEach(x=>x.classList.remove("wd-on"));same.forEach(x=>x.classList.add("wd-on"));
  let sh=document.querySelector(".wd-sheet");if(!sh){sh=document.createElement("div");sh.className="wd-sheet";sh.setAttribute("role","dialog");sh.setAttribute("aria-modal","true");document.body.appendChild(sh);
   sh.addEventListener("click",ev=>{if(ev.target===sh||ev.target.closest("[data-x]")){sh.hidden=true;document.querySelectorAll(".mp-w.wd-on").forEach(x=>x.classList.remove("wd-on"));snd&&snd.pause();return}
    const b=ev.target.closest("[data-wd]");if(!b)return;const k=b.dataset.wd;
    if(k==="w"||k==="a"){snd=snd||new Audio();snd.src=b.dataset.u;snd.play().catch(()=>typeof toast==="function"&&toast("تعذّر التشغيل"))}
    else if(k==="c"){const t=sh.dataset.copy;navigator.clipboard&&navigator.clipboard.writeText(t);typeof toast==="function"&&toast("تم النسخ")}})}
  sh.hidden=false;sh.innerHTML='<div class="wd-card"><button type="button" class="wd-x" data-x aria-label="إغلاق">×</button><div class="wd-load">جارٍ التحميل…</div></div>';
  try{const[vr,tf]=await Promise.all([fetch("https://api.quran.com/api/v4/verses/by_key/"+s+":"+a+"?words=true&word_fields=text_uthmani&fields=text_uthmani").then(r=>r.json()),fetch("https://api.quran.com/api/v4/tafsirs/16/by_ayah/"+s+":"+a).then(r=>r.json())]);
   const v=vr.verse,ws=v.words.filter(x=>x.char_type_name==="word"),wd=pos?ws[pos-1]:null;const T=((tf.tafsir&&tf.tafsir.text)||"").replace(/<[^>]+>/g,"").trim();
   const ayah=v.text_uthmani||ws.map(x=>x.text_uthmani).join(" ");const ref=(nm(s)?"سورة "+nm(s)+" — ":"")+"الآية "+ar(a);sh.dataset.copy="﴿"+ayah+"﴾ ["+(nm(s)||ar(s))+": "+ar(a)+"]"+(T?"\nالتفسير الميسر: "+T:"");
   const esc=t=>String(t).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[m]);
   sh.querySelector(".wd-card").innerHTML='<button type="button" class="wd-x" data-x aria-label="إغلاق">×</button>'+
    (wd?'<div class="wd-word">'+esc(wd.text_uthmani)+'</div><div class="wd-meta">الكلمة '+ar(pos)+' من '+ar(ws.length)+' · '+esc(ref)+'</div>':'<div class="wd-meta">'+esc(ref)+'</div>')+
    '<p class="wd-ayah">﴿'+esc(ayah)+'﴾</p>'+(T?'<div class="wd-tf"><b>التفسير الميسر</b><p>'+esc(T)+'</p></div>':'')+
    '<div class="wd-act">'+(wd&&wd.audio_url?'<button type="button" class="btn btn-ghost btn-sm" data-wd="w" data-u="https://audio.qurancdn.com/'+esc(wd.audio_url)+'">نطق الكلمة</button>':'')+'<button type="button" class="btn btn-ghost btn-sm" data-wd="a" data-u="'+(window.__qariUrl?__qariUrl(v.id):"https://cdn.islamic.network/quran/audio/128/ar.alafasy/"+v.id+".mp3")+'">استماع للآية</button><button type="button" class="btn btn-ghost btn-sm" data-wd="c">نسخ</button></div>'}
  catch(x){sh.querySelector(".wd-load").textContent="تعذّر التحميل، تأكد من الاتصال بالإنترنت"}
 },true);
})();

;document.addEventListener("change",e=>{if(e.target&&e.target.id==="azSound"&&window.__pv)__pv.pause()});

(function(){const SITE="https://wird-azkar.pages.dev";const TAG="\n\n📿 تطبيق «وِرد» للأذكار والقرآن والأذان — مجاني وبدون إعلانات، ثبّته على شاشتك ليصلك الأذان:\n"+SITE+"/?i=1";
 const add=t=>{t=String(t||"");if(!t.trim()||t.includes("wird-azkar.pages.dev"))return t;t=t.replace(/\s*\n?https?:\/\/[^\s]*wird[^\s]*\s*$/,"").replace(/\s+$/,"");return t+TAG};
 if(navigator.share){const s=navigator.share.bind(navigator);navigator.share=d=>{d=Object.assign({},d||{});if(d.url&&!/wird-azkar\.pages\.dev/.test(d.url))d.url=SITE;if(!d.url&&!d.files)d.text=add(d.text||d.title||"");else if(d.text&&!d.files){d.text=add(d.text);delete d.url}return s(d)}}
 if(navigator.clipboard&&navigator.clipboard.writeText){const w=navigator.clipboard.writeText.bind(navigator.clipboard);navigator.clipboard.writeText=t=>w(String(t||"").length>15?add(t):t)}
 if(typeof window.copyText==="function"){const ct=window.copyText;window.copyText=function(t,...r){return ct.call(this,String(t||"").length>15?add(t):t,...r)}}
})();