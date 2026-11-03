(function(){
  var isApp = /WirdAndroid\//.test(navigator.userAgent) || !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  if (!isApp) return;
  window.__WIRD_NATIVE = true;
  document.documentElement.classList.add('native-app');
  try { Object.defineProperty(navigator, 'standalone', { get: function(){ return true; } }); } catch (e) {}

  function plug(){ return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.WirdAdhan; }
  function waitPlug(ms){ return new Promise(function(res){ var t0 = Date.now(); (function poll(){ var p = plug(); if (p || Date.now() - t0 > ms) return res(p); setTimeout(poll, 100); })(); }); }

  // ---- Notification permission shim (the Android WebView has no Notification API) ----
  var PK = 'wird-native-perm';
  function permVal(){ try { return localStorage.getItem(PK) || 'default'; } catch (e) { return 'default'; } }
  function NotificationShim(){}
  Object.defineProperty(NotificationShim, 'permission', { get: permVal });
  NotificationShim.requestPermission = function(){
    return waitPlug(5000).then(function(p){
      if (!p) return 'denied';
      return p.requestPermissions().then(function(){
        var t0 = Date.now();
        return new Promise(function(res){ (function poll(){
          p.status().then(function(s){
            if (s.notifications) { try { localStorage.setItem(PK, 'granted'); } catch (e) {} return res('granted'); }
            if (Date.now() - t0 > 25000) return res('denied');
            setTimeout(poll, 700);
          }, function(){ res('denied'); });
        })(); });
      });
    });
  };
  window.Notification = NotificationShim;

  // ---- Push shim: the app schedules everything natively instead of using web push ----
  if (!('PushManager' in window)) window.PushManager = function(){};
  var fakeSub = { endpoint: 'native://wird', toJSON: function(){ return { endpoint: 'native://wird', keys: {} }; }, unsubscribe: function(){ return Promise.resolve(true); } };
  var fakePM = { getSubscription: function(){ return Promise.resolve(permVal() === 'granted' ? fakeSub : null); }, subscribe: function(){ return Promise.resolve(fakeSub); }, permissionState: function(){ return Promise.resolve(permVal() === 'granted' ? 'granted' : 'prompt'); } };
  try {
    if (window.ServiceWorkerRegistration) Object.defineProperty(ServiceWorkerRegistration.prototype, 'pushManager', { configurable: true, get: function(){ return fakePM; } });
  } catch (e) {}

  function hash(s){ var h = 0; for (var i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; } return Math.abs(h) % 800000 + 1000; }
  function adhanUrl(fajr){
    try {
      var st = JSON.parse(localStorage.getItem('wird-push') || '{}');
      var A = window.__ADHANS || {};
      var key = st.sound || 'none';
      if (fajr && st.soundFajr && A[st.soundFajr] && A[st.soundFajr].u) return A[st.soundFajr].u;
      return (A[key] && A[key].u) || '';
    } catch (e) { return ''; }
  }
  function toNative(events){
    return (events || []).map(function(e){
      var tag = e.tag || '';
      var kind = tag.indexOf('alarm') === 0 ? 'alarm' : (tag.indexOf('adhan-') === 0 ? 'adhan' : 'notif');
      var sound = kind === 'adhan' ? adhanUrl(tag === 'adhan-fajr') : '';
      if (kind === 'adhan' && !sound) kind = 'notif';
      return { id: hash(tag + '|' + e.t), t: e.t, kind: kind, title: e.title || 'وِرد', body: e.body || '', url: e.url || '/', sound: sound };
    }).filter(function(e){ return e.kind !== 'notif' || e.title !== 'وِرد'; });
  }
  var lastCheck = 0;
  function afterSchedule(r){
    if (!r || Date.now() - lastCheck < 6 * 3600e3) return;
    lastCheck = Date.now();
    var p = plug(); if (!p) return;
    p.status().then(function(s){
      if (!s.exact && confirm('حتى يعمل الأذان في وقته بالضبط، اسمح لـ«وِرد» بضبط المنبهات.\nاضغط «موافق» ثم فعّل الخيار.')) return p.openExactSettings();
      if (!s.battery && !localStorage.getItem('wird-batt-asked')) { localStorage.setItem('wird-batt-asked', '1'); if (confirm('حتى لا يوقف الهاتف الأذان لتوفير البطارية، اسمح لـ«وِرد» بالعمل في الخلفية.')) return p.openBatterySettings(); }
    });
  }
  var _fetch = window.fetch.bind(window);
  window.fetch = function(input, init){
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (/\/api\/push\/sync(\?|$)/.test(url)) {
      var body = {}; try { body = JSON.parse(init && init.body || '{}'); } catch (e) {}
      return waitPlug(8000).then(function(p){
        if (!p) return new Response('{"ok":false}', { status: 503 });
        return p.schedule({ events: toNative(body.events) }).then(function(r){
          afterSchedule(r);
          return new Response(JSON.stringify({ ok: true, armed: r.armed }), { status: 200, headers: { 'content-type': 'application/json' } });
        });
      });
    }
    if (/\/api\/push\/remove(\?|$)/.test(url)) {
      var p = plug(); if (p) p.schedule({ events: [] });
      return Promise.resolve(new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } }));
    }
    return _fetch(input, init);
  };
  window.__wirdNative = {
    test: function(kind){ var p = plug(); return p && p.test({ kind: kind || 'adhan', sound: kind === 'alarm' ? '' : adhanUrl(false) }); },
    stop: function(){ var p = plug(); return p && p.stop(); },
    status: function(){ var p = plug(); return p ? p.status() : Promise.resolve(null); },
    settings: function(){ var p = plug(); return p && p.openChannelSettings(); }
  };
  // keep the native schedule fresh every time the app opens
  document.addEventListener('visibilitychange', function(){ if (!document.hidden && window.__wirdPush) try { window.__wirdPush.sync(true); } catch (e) {} });
  window.addEventListener('load', function(){ setTimeout(function(){ if (window.__wirdPush) try { window.__wirdPush.sync(true); } catch (e) {} }, 2500); });
})();
