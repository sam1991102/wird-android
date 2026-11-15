/*view-guard*/(function(){"use strict";
/* كل قسم في الصفحة الرئيسية لازم يكون عليه data-v باسم الصفحة اللي يظهر فيها، وإلا بيظهر في كل الصفحات.
   أي قسم جديد يتضاف من غير data-v بيتعامل كقسم «الرئيسية» تلقائيًا، علشان المشكلة دي متتكررش. */
function fix(){var m=document.querySelector("main");if(!m)return;for(var i=0;i<m.children.length;i++){var s=m.children[i];if(s.tagName==="SECTION"&&!s.dataset.v){s.dataset.v="home";try{console.warn("[view-guard] قسم بدون data-v اتعامل كرئيسية:",s.id||s.className)}catch(e){}}}}
(window.__wOnDom||function(f){document.addEventListener("DOMContentLoaded",f)})(function(){fix();var m=document.querySelector("main");if(m)new MutationObserver(fix).observe(m,{childList:true})});
})();
