/*appshell*/;(function(){/* الموقع والتطبيق: كود واحد. "/" بيفتح التطبيق في المتصفح على طول، وصفحة /download للتعريف والتنزيل،
  ونافذة «ثبّت وِرد» في ui/core/19-adhan-sound.js بتعرض التطبيق على زوار الموبايل.
  جوه التطبيق (متثبت على الشاشة الرئيسية، أو تطبيق الأندرويد) html.is-app: من غير زرار «تثبيت» ولا روابط الموقع اللي تحت. */
var C=window.Capacitor;
var app=(C&&C.isNativePlatform&&C.isNativePlatform())||matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
document.documentElement.classList.toggle("is-app",!!app);
})();
