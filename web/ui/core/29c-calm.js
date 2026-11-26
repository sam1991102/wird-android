;(function(){/* وضع القراءة الهادئة (window.__wirdCalm) */
var J=function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
var SV=function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
var T=function(m){try{toast(m)}catch(e){}};
/* ---------- ٢) وضع القراءة الهادئة ---------- */
function calmOn(){return document.documentElement.classList.contains("calm")}
function setCalm(v){document.documentElement.classList.toggle("calm",!!v);SV("wird-calm",v?1:0);paintCalm()}
function paintCalm(){var f=document.getElementById("focus");if(!f)return;var top=f.querySelector(".focus-top");if(top&&!document.getElementById("fCalm")){var b=document.createElement("button");b.type="button";b.id="fCalm";b.className="icon-btn";b.setAttribute("aria-label","وضع القراءة الهادئة");b.title="وضع القراءة الهادئة";b.innerHTML='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';var cl=document.getElementById("fClose");top.insertBefore(b,cl?cl.nextSibling:top.firstChild);b.addEventListener("click",function(){setCalm(!calmOn());T(calmOn()?"وضع هادئ — اضغط على الذكر للعدّ":"عدت إلى الوضع العادي")})}var cb=document.getElementById("fCalm");if(cb)cb.setAttribute("aria-pressed",calmOn()?"true":"false")}
if(J("wird-calm",0))document.documentElement.classList.add("calm");
window.__wirdCalm={on:calmOn,set:setCalm,paint:paintCalm};
})();
