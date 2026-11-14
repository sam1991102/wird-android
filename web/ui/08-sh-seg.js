
/*sh-seg*/(function(){
/* صفحات الإعدادات الفرعية تُفتح خارج نافذة الإعدادات، فأزرار الاختيار [data-seg] (المظهر، حجم الخط، الأرقام، اتجاه التقليب…)
   تفقد المستمع المفوَّض على النافذة. نمرّر الضغطة إلى زر وسيط داخل النافذة ليعمل نفس المنطق. */
function proxy(){var st=document.querySelector(".st");if(!st)return null;var p=st.querySelector(".sh-proxy");if(!p){p=document.createElement("div");p.className="sh-proxy";p.hidden=true;p.innerHTML='<button type="button"></button>';(st.querySelector(".st-body")||st).appendChild(p)}return p.firstChild}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".sh-page [data-seg]");if(!b)return;var x=proxy();if(!x)return;
b.parentElement.querySelectorAll("button").forEach(function(o){o.setAttribute("aria-checked",o===b)});
x.dataset.seg=b.dataset.seg;x.dataset.v=b.dataset.v;x.click()},true);
})();
