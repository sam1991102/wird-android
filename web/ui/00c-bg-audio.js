/* تشغيل في الخلفية داخل تطبيق أندرويد: كائن بنفس واجهة Audio يشغّل الصوت من خدمة أندرويد (WirdMedia)
   فيستمر مع قفل الشاشة والخروج من التطبيق، وله إشعار تحكم. على الويب لا يُعرَّف ويُستخدم Audio العادي. */
(function(){"use strict";
var P=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.WirdMedia;
if(!window.__WIRD_NATIVE||!P)return;
var seq=0,inst={},hooked=false;
function hook(){if(hooked)return;hooked=true;P.addListener("media",function(e){if(e&&e.msg)console.warn("[WirdMedia]",e.type,e.msg);var a=inst[e&&e.owner]||(e&&e.type==="error"&&!e.owner&&inst[B._cur]);if(a)a._on(e.type)})}
function meta(){var m=navigator.mediaSession&&navigator.mediaSession.metadata;return{title:(m&&m.title)||document.title.split("|")[0].trim()||"وِرد",artist:(m&&m.artist)||"وِرد"}}
function BgAudio(src){this._id="a"+(++seq);this._src=src||"";this._played="";this._t=0;this._ended=false;this._ls={};
 this.paused=true;this.preload="auto";this.dataset={};this.volume=1;this.duration=NaN;inst[this._id]=this;hook()}
var B=BgAudio.prototype;
Object.defineProperty(B,"src",{get:function(){return this._src},set:function(v){this._src=String(v||"");if(!this._src)this.pause()}});
Object.defineProperty(B,"currentTime",{get:function(){return this._t},set:function(v){this._t=+v||0;if(this._played===this._src&&this._played)P.seek({t:this._t}).catch(function(){})}});
Object.defineProperty(B,"ended",{get:function(){return this._ended}});
["playing","pause","waiting","ended","error","play"].forEach(function(n){var k="_h"+n;Object.defineProperty(B,"on"+n,{get:function(){return this[k]||null},set:function(f){this[k]=f}})});
B.addEventListener=function(n,f){(this._ls[n]=this._ls[n]||[]).push(f)};
B.removeEventListener=function(n,f){var l=this._ls[n];if(l){var i=l.indexOf(f);if(i>=0)l.splice(i,1)}};
B._fire=function(n){var ev={type:n,target:this,currentTarget:this},self=this;(this._ls[n]||[]).slice().forEach(function(f){try{f.call(self,ev)}catch(x){setTimeout(function(){throw x})}});var h=this["_h"+n];if(h)try{h.call(this,ev)}catch(x){setTimeout(function(){throw x})}};
B._dog=function(on){var self=this;clearTimeout(this._w);if(on)this._w=setTimeout(function(){if(!self.paused&&!self._live){console.warn("[WirdMedia] timeout");self._on("error")}},25000)};
B._on=function(t){if(t!=="waiting")this._dog(false);if(t==="playing"){this._live=true;this.paused=false;this._ended=false;this._fire("playing")}
 else if(t==="pause"){if(this.paused)return;this.paused=true;this._fire("pause")}
 else if(t==="waiting")this._fire("waiting");
 else if(t==="ended"){this.paused=true;this._ended=true;this._fire("ended")}
 else if(t==="error"){this.paused=true;this._played="";this._live=false;P.stop().catch(function(){});this._fire("error")}};
B.play=function(){var self=this;if(!this._src)return Promise.reject(new Error("no src"));
 this.paused=false;this._fire("play");
 if(this._played===this._src&&B._cur===this._id){this._ended=false;return P.resume().then(function(){})}
 var src=this._src;this._played=src;this._ended=false;this._live=false;B._cur=this._id;this._dog(true);
 return new Promise(function(ok){setTimeout(ok,0)}).then(function(){var m=meta();return P.play({src:src,title:m.title,artist:m.artist,owner:self._id})}).then(function(){if(self._t>0)P.seek({t:self._t}).catch(function(){})},function(e){self._dog(false);self.paused=true;self._played="";console.warn("[WirdMedia] play failed",e&&e.message);throw e})};
B.pause=function(){if(B._cur!==this._id){this.paused=true;return}var was=!this.paused;this.paused=true;P.pause().catch(function(){});if(was)this._fire("pause")};
B.load=function(){};
B.removeAttribute=function(n){if(n==="src")this.src=""};B.setAttribute=function(n,v){if(n==="src")this.src=v};B.getAttribute=function(n){return n==="src"?this._src||null:null};
B.canPlayType=function(){return"maybe"};
window.__BgAudio=BgAudio;
/* إيقاف من خارج المشغلات (زر الإيقاف العام) */
window.__bgAudioStop=function(){P.stop().catch(function(){});Object.keys(inst).forEach(function(k){inst[k]._on("pause")})};
})();
