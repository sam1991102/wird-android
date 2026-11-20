(function(){var st=document.getElementById("fStage");if(!st)return;var sx=0,sy=0,mv=false,t0=0;
st.addEventListener("touchstart",function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY;mv=false;t0=Date.now()},{passive:true});
st.addEventListener("touchmove",function(e){var t=e.touches[0];if(Math.abs(t.clientX-sx)>10||Math.abs(t.clientY-sy)>10)mv=true},{passive:true});
st.addEventListener("click",function(e){var sel=String(getSelection&&getSelection()||"");if(mv||sel.length>0||e.target.closest(".f-acts")){e.stopImmediatePropagation();mv=false}},true);
var bot=document.querySelector("#focus .focus-bottom");if(!bot||document.getElementById("fActs"))return;
var bar=document.createElement("div");bar.id="fActs";bar.className="f-acts";
var I={fav:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',img:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',copy:'<path d="M9 9h11v11H9zM5 15H4V4h11v1"/>',share:'<path d="M4 12v8h16v-8M12 3v12M8 7l4-4 4 4"/>',reset:'<path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5"/>'};
var L=[["fav","وِردي"],["img","صورة"],["copy","نسخ"],["share","مشاركة"],["reset","إعادة"]];
bar.innerHTML=L.map(function(x){return'<button type="button" data-a="'+x[0]+'"><svg viewBox="0 0 24 24">'+I[x[0]]+'</svg><span>'+x[1]+'</span></button>'}).join("");
bot.parentElement.insertBefore(bar,bot);
function cur(){try{return F.list[F.i]}catch(e){return null}}
function paint(){var t=cur();if(!t)return;var on=favorites.has(t.id);var b=bar.querySelector('[data-a="fav"]');b.classList.toggle("on",on);b.querySelector("span").textContent=on?"في وِردي":"وِردي"}
bar.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;e.stopPropagation();var t=cur();if(!t)return;var k=b.dataset.a;
if(k==="fav"){favorites.has(t.id)?favorites.delete(t.id):favorites.add(t.id);try{store.set("wird-favorites",[...favorites]);updateFav()}catch(x){}paint();window.toast&&toast(favorites.has(t.id)?"اتضاف لوِردي ✓":"أُزيل من وِردي")}
else if(k==="img"){window.__shareImg&&__shareImg(t.text,[t.fadl,t.source].filter(Boolean).join(" — "))}
else if(k==="copy"){try{copyText(t.text)}catch(x){}}
else if(k==="share"){try{shareText(t.text)}catch(x){}}
else if(k==="reset"){delete progress[t.id];try{saveDay()}catch(x){}renderFocus()}});
var rf=window.renderFocus;new MutationObserver(paint).observe(document.getElementById("fText"),{childList:true,characterData:true,subtree:true});
var h=document.querySelector("#focus .focus-hint");if(h)h.textContent="اضغط على النص أو الدائرة للعدّ، واسحب لقراءة الذكر الطويل";
})();