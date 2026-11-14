
/*dom*/
/* مراقب واحد مشترك لتغيّرات الصفحة بدل مراقب لكل وحدة: يجمع التغيّرات ويشغّل الوحدات مرة واحدة في الفريم.
   __wOnDom(fn): fn تتنادى بعد أي إضافة/حذف عناصر — لازم تكون آمنة لو اتنادت أكتر من مرة. */
(function(){var fns=[],q=0,streak=0,quiet=0;
function run(){q=0;if(++streak>120){streak=0;quiet=Date.now()+500}for(var i=0;i<fns.length;i++){try{fns[i]()}catch(e){console.error(e)}}}
/* تغيير نص بس (زي عدّاد الصلاة كل ثانية) مش محتاج يصحّي الوحدات */
function textOnly(rs){for(var i=0;i<rs.length;i++){var r=rs[i],j;for(j=0;j<r.addedNodes.length;j++)if(r.addedNodes[j].nodeType===1)return false;for(j=0;j<r.removedNodes.length;j++)if(r.removedNodes[j].nodeType===1)return false}return true}
new MutationObserver(function(rs){if(q||Date.now()<quiet||textOnly(rs))return;q=requestAnimationFrame(run)}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(function(){streak=0},1000);
window.__wOnDom=function(fn){fns.push(fn);try{fn()}catch(e){console.error(e)}};
/* __wWait(test, fn, ms): بدل التكرار كل كذا مللي لحد ما عنصر يظهر.
   test() ترجع العنصر (أو أي قيمة) لما يجهز، و fn تتنادى بيه مرة واحدة. لو ما ظهرش خلال ms (افتراضي ٦ ثواني) تتلغي. */
window.__wWait=function(test,fn,ms){var done=0,v;function chk(){if(done)return;try{v=test()}catch(e){v=null}if(!v)return;done=1;var i=fns.indexOf(chk);if(i>-1)fns.splice(i,1);fn(v)}
 chk();if(done)return;fns.push(chk);setTimeout(function(){if(done)return;done=1;var i=fns.indexOf(chk);if(i>-1)fns.splice(i,1)},ms||6000)};})();
