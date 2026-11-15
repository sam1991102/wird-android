/* داخل تطبيق أندرويد: الآية وكلماتها والتفسير الميسر من الملفات المضمّنة (/qdata) بدل الإنترنت.
   يرجّع نفس شكل ردود quran.com: [{verse:{text_uthmani,words}}, {tafsir:{text}}] */
(function(){"use strict";
if(!window.__WIRD_NATIVE)return;
var meta=null,T={};
function J(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(u+" "+r.status);return r.json()})}
window.__qLocal=function(s,a){s=+s;a=+a;
 return (meta?Promise.resolve(meta):J("/mushaf/meta.json").then(function(m){return meta=m})).then(function(m){
  var pg=m.p&&m.p[s-1]&&m.p[s-1][a-1];if(!pg)throw new Error("no page");
  return Promise.all([J("/qdata/p/"+pg+".json"),T[s]||(T[s]=J("/qdata/t/"+s+".json").catch(function(e){delete T[s];throw e}))])})
 .then(function(r){var v=null;(r[0].verses||[]).forEach(function(x){if(x.verse_key===s+":"+a)v=x});if(!v)throw new Error("no verse");
  var t=r[1][a];if(t==null)throw new Error("no tafsir");
  return[{verse:v},{tafsir:{text:t}}]})};
})();
