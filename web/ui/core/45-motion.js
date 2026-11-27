;(function(){/* الحركة: انتقال ناعم بين التبويبات بـ View Transitions (خاصية في المتصفح، من غير مكتبات).
  الاتجاه حسب ترتيب التبويب في الشريط السفلي، والشريطين العلوي والسفلي ثابتين مش بيتحركوا.
  بيتقفل لوحده مع «تقليل الحركة» أو لو المتصفح مش بيدعمه، فيرجع للتبديل العادي. */
var R=document.documentElement,rm=matchMedia("(prefers-reduced-motion: reduce)");
var orig=window.__setView;if(typeof orig!=="function"||!document.startViewTransition)return;
function idx(v){var a=[].slice.call(document.querySelectorAll(".bottom-nav [data-tab]")).map(function(x){return x.dataset.tab});var i=a.indexOf(v);return i<0?0:i}
window.__setView=function(v,top){
 if(R.dataset.view===v||rm.matches||document.hidden)return orig.apply(this,arguments);
 var args=arguments,self=this;R.dataset.vtDir=idx(v)>idx(R.dataset.view)?"fwd":"back";
 var t=document.startViewTransition(function(){orig.apply(self,args)});
 /* انتقال اتلغى عشان جه بعده انتقال تاني: طبيعي، مش خطأ */
 [t.ready,t.updateCallbackDone].forEach(function(p){p&&p.catch(function(){})});
 t.finished.catch(function(){}).finally(function(){delete R.dataset.vtDir});
};
})();
