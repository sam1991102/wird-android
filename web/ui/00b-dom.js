
/*dom*/
/* مراقب واحد مشترك لتغيّرات الصفحة بدل مراقب لكل وحدة: يجمع التغيّرات ويشغّل الوحدات مرة واحدة في الفريم.
   __wOnDom(fn): fn تتنادى بعد أي إضافة/حذف عناصر — لازم تكون آمنة لو اتنادت أكتر من مرة. */
(function(){var fns=[],q=0,streak=0,quiet=0;
function run(){q=0;if(++streak>120){streak=0;quiet=Date.now()+500}for(var i=0;i<fns.length;i++){try{fns[i]()}catch(e){console.error(e)}}}
/* تغيير نص بس (زي عدّاد الصلاة كل ثانية) مش محتاج يصحّي الوحدات */
function textOnly(rs){for(var i=0;i<rs.length;i++){var r=rs[i],j;for(j=0;j<r.addedNodes.length;j++)if(r.addedNodes[j].nodeType===1)return false;for(j=0;j<r.removedNodes.length;j++)if(r.removedNodes[j].nodeType===1)return false}return true}
new MutationObserver(function(rs){if(q||Date.now()<quiet||textOnly(rs))return;q=requestAnimationFrame(run)}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(function(){streak=0},1000);
window.__wOnDom=function(fn){fns.push(fn);try{fn()}catch(e){console.error(e)}};})();
