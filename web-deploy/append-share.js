
/*nshare*/(function(){var C=window.Capacitor;if(!C||!C.isNativePlatform||!C.isNativePlatform())return;
function has(){try{var h=(C.PluginHeaders||[]).find(function(x){return x.name==="WirdAdhan"});return!!(h&&h.methods.some(function(m){return m.name==="share"}))}catch(e){return false}}
if(!has())return;var P=C.Plugins.WirdAdhan;
function b64(f){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(String(r.result).split(",")[1]||"")};r.onerror=rej;r.readAsDataURL(f)})}
navigator.canShare=function(){return true};
navigator.share=async function(d){d=d||{};var fs=[];for(var f of(d.files||[]))fs.push({name:f.name||"wird.png",mime:f.type||"image/png",data:await b64(f)});var t=[d.text,d.url].filter(Boolean).join("\n");return P.share({files:fs,text:t,title:d.title||""})};
})();
