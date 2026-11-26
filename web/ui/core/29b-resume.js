;(function(){/* استكمال الأذكار من آخر مكان */
var J=function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
var SV=function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
var ar=__ar;
var T=function(m){try{toast(m)}catch(e){}};
function today(){var d=new Date();return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()}
/* ---------- ١) التكملة من آخر مكان ---------- */
var o0=window.openFocus,r0=window.renderFocus,c0=window.closeFocus,restoring=false;
if(typeof r0==="function"){window.renderFocus=function(){var x=r0.apply(this,arguments);window.__wirdCalm&&__wirdCalm.paint();return x}}
if(typeof o0==="function"){window.openFocus=function(cat){var a0=J("wird-resume",{});restoring=true;var x;try{x=o0.apply(this,arguments)}finally{restoring=false}try{var a=a0;var s=a.d===today()?a[cat]:null;if(!window.__wirdTesting&&F&&F.cat===cat&&typeof s==="number"&&s>F.i&&s<F.list.length){F.i=s;restoring=true;renderFocus();restoring=false;T("تابعت من حيث توقفت — "+ar(s+1)+" من "+ar(F.list.length))}}catch(e){restoring=false}return x}}
if(typeof c0==="function"){window.closeFocus=function(){var x=c0.apply(this,arguments);setTimeout(chip,50);return x}}
function chip(){var hs=document.getElementById("heroStart");if(!hs)return;var old=document.getElementById("resumeChip");var a=J("wird-resume",{});var best=null;if(a.d===today())Object.keys(a).forEach(function(k){if(k==="d"||k==="all"||k==="mine")return;var n=0,p=0;try{n=catItems(k).length;p=catPct(k)}catch(e){}if(n&&p<100&&a[k]>0&&a[k]<n&&(!best||a[k]/n>best.i/best.n))best={k:k,i:a[k],n:n,p:p}});
 if(!best){old&&old.remove();return}var nm="";try{nm=catName(best.k)}catch(e){nm=best.k}var html='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/></svg><span>أكمل '+nm+' — '+ar(best.i+1)+' من '+ar(best.n)+'</span>';
 if(!old){old=document.createElement("button");old.type="button";old.id="resumeChip";old.className="resume-chip";var box=hs.closest(".hero-actions")||hs.parentElement;box.parentElement.insertBefore(old,box.nextSibling);old.addEventListener("click",function(){openFocus(old.dataset.k)})}old.dataset.k=best.k;old.innerHTML=html}
function savePos(){try{if(window.__wirdTesting||!F||!F.list||!F.cat||document.getElementById("focus").hidden)return;var a=J("wird-resume",{});if(a.d!==today())a={d:today()};if(a[F.cat]!==F.i){a[F.cat]=F.i;SV("wird-resume",a)}}catch(e){}}
(function w(){var p=document.getElementById("fPos");if(!p)return setTimeout(w,500);new MutationObserver(savePos).observe(p,{childList:true,characterData:true,subtree:true})})();
setTimeout(chip,1500);document.addEventListener("visibilitychange",function(){if(!document.hidden)chip()});
})();
