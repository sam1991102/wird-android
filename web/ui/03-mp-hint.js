
/*mp-hint*/(function(){function h(){var b=document.querySelector(".mp-book .mp-w");if(!b)return;try{if(localStorage.getItem("wird-mp-hint"))return;localStorage.setItem("wird-mp-hint","1")}catch(e){return}var t=document.createElement("div");t.className="mp-hint";t.textContent="اضغط على أي كلمة لعرض الآية وتفسيرها الميسّر";document.body.appendChild(t);setTimeout(function(){t.classList.add("out")},4200);setTimeout(function(){t.remove()},5000)}
new MutationObserver(function(){clearTimeout(h.t);h.t=setTimeout(h,0)}).observe(document.body,{childList:true,subtree:true})})();
