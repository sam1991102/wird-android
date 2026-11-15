/*w-ui*/(function(){"use strict";
/* أشكال النوافذ الموحّدة في وِرد — ٣ أشكال بس:
   ١) صفحة كاملة  window.__wPage({title,sub,cls,html,onClose}) → {el,body,close}
      نفس شكل .wp-page: شريط أخضر بعنوان كبير وسهم رجوع على اليمين. للمحتوى اللي بيتقري أو بيتصفح.
   ٢) لوحة من تحت .wd-sheet (موجودة): للاختيارات السريعة، وزرار × على الشمال.
   ٣) رسالة تأكيد window.__wConfirm(msg,{ok,cancel,danger}) → Promise<boolean> بدل confirm() بتاع النظام. */
var R=document.documentElement;
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

window.__wPage=function(o){o=o||{};
 var el=document.createElement("div");el.className="wp-page tl-page "+(o.cls||"");if(o.id)el.id=o.id;
 el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label",o.title||"");
 el.innerHTML='<header class="wp-h"><button type="button" class="wp-back" aria-label="رجوع">→</button><div><h1>'+esc(o.title)+'</h1>'+(o.sub?'<p>'+esc(o.sub)+'</p>':'')+'</div></header><div class="wp-body"></div>';
 var body=el.querySelector(".wp-body");if(o.html)body.innerHTML=o.html;
 var closed=false;
 function close(){if(closed)return;closed=true;el.classList.remove("in");try{o.onClose&&o.onClose()}catch(e){}
  setTimeout(function(){el.remove();if(!document.querySelector(".wp-page"))R.classList.remove("wp-open")},180)}
 el.querySelector(".wp-back").onclick=close;
 el.addEventListener("click",function(e){if(e.target.closest("[data-x]"))close()});
 document.body.appendChild(el);R.classList.add("wp-open");
 requestAnimationFrame(function(){el.classList.add("in")});setTimeout(function(){el.classList.add("in")},60);
 return{el:el,body:body,close:close}};

var q=[],busy=false;
window.__wConfirm=function(msg,o){o=o||{};return new Promise(function(res){q.push({msg:msg,o:o,res:res});next()})};
function next(){if(busy||!q.length)return;busy=true;var it=q.shift(),o=it.o,prev=document.activeElement;
 var d=document.createElement("div");d.className="w-dlg";d.setAttribute("role","alertdialog");d.setAttribute("aria-modal","true");
 var lines=String(it.msg).split("\n"),head=o.title||lines.shift(),rest=lines.join("\n").trim();
 d.innerHTML='<div class="w-dlg-c"><h2 class="w-dlg-t">'+esc(head)+'</h2>'+(rest?'<p class="w-dlg-p">'+esc(rest)+'</p>':'')+
  '<div class="w-dlg-b"><button type="button" class="w-dlg-no" data-x>'+esc(o.cancel||"إلغاء")+'</button><button type="button" class="w-dlg-ok'+(o.danger?' danger':'')+'">'+esc(o.ok||"موافق")+'</button></div></div>';
 var t=d.querySelector(".w-dlg-t");t.id="wdlg"+Date.now();d.setAttribute("aria-labelledby",t.id);
 function done(v){if(!d.isConnected)return;d.classList.add("out");setTimeout(function(){d.remove();busy=false;try{prev&&prev.focus&&prev.focus()}catch(e){}next()},150);it.res(v)}
 d.querySelector(".w-dlg-ok").onclick=function(){done(true)};d.querySelector(".w-dlg-no").onclick=function(){done(false)};
 d.addEventListener("click",function(e){if(e.target===d)done(false)});
 d.addEventListener("keydown",function(e){if(e.key==="Escape"){e.stopPropagation();done(false)}
  if(e.key==="Tab"){var b=d.querySelectorAll("button"),f=b[0],l=b[b.length-1];if(e.shiftKey&&document.activeElement===f){e.preventDefault();l.focus()}else if(!e.shiftKey&&document.activeElement===l){e.preventDefault();f.focus()}}});
 document.body.appendChild(d);setTimeout(function(){d.querySelector(o.danger?".w-dlg-no":".w-dlg-ok").focus()},30)}
/* زرار الرجوع في أندرويد يقفل رسالة التأكيد كإلغاء */
window.__wConfirmOpen=function(){return !!document.querySelector(".w-dlg:not(.out)")};
window.__wConfirmCancel=function(){var b=document.querySelector(".w-dlg:not(.out) .w-dlg-no");if(b){b.click();return true}return false};
})();
