
/*dom*/
/* مراقب واحد مشترك لتغيّرات الصفحة بدل مراقب لكل وحدة: يجمع التغيّرات ويشغّل الوحدات مرة واحدة في الفريم.
   __wOnDom(fn): fn تتنادى بعد أي إضافة/حذف عناصر — لازم تكون آمنة لو اتنادت أكتر من مرة. */
(function(){var fns=[],q=0,streak=0,quiet=0;
function run(){q=0;if(++streak>120){streak=0;quiet=Date.now()+500}for(var i=0;i<fns.length;i++){try{fns[i]()}catch(e){console.error(e)}}}
new MutationObserver(function(){if(q||Date.now()<quiet)return;q=requestAnimationFrame(run)}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(function(){streak=0},1000);
window.__wOnDom=function(fn){fns.push(fn);try{fn()}catch(e){console.error(e)}};})();
