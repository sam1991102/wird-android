package dev.pages.wird_azkar.app;

import android.content.Intent;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WirdAdhanPlugin.class);
        super.onCreate(savedInstanceState);
        AdhanStore.ensureChannels(this);
        AdhanStore.armAll(this);
        WidgetData.refreshAll(this);
        lockScreen(getIntent());
        goTo(getIntent(), 2500);
    }

    /** الظهور فوق شاشة القفل لمنبّه الفجر فقط، لا لباقي التطبيق. */
    @SuppressWarnings("deprecation") // الـ flags القديمة للأجهزة قبل أندرويد ٨.١ بس
    private void lockScreen(Intent i) {
        boolean alarm = i != null && i.getBooleanExtra("wird_alarm", false);
        try {
            if (android.os.Build.VERSION.SDK_INT >= 27) { setShowWhenLocked(alarm); setTurnScreenOn(alarm); }
            else if (alarm) getWindow().addFlags(android.view.WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED | android.view.WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
            else getWindow().clearFlags(android.view.WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED | android.view.WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
        } catch (Exception ignored) {}
        if (i != null) i.removeExtra("wird_alarm");
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        lockScreen(intent);
        goTo(intent, 0);
    }

    /** فتح قسم داخل التطبيق من الويدجت أو الإشعار. */
    private void goTo(Intent i, long delay) {
        if (i == null) return;
        String path = i.getStringExtra("wird_path");
        Uri d = i.getData();
        if (path == null && d != null && "wird-azkar.pages.dev".equals(d.getHost())) {
            path = (d.getPath() == null ? "/" : d.getPath()) + (d.getFragment() != null ? "#" + d.getFragment() : "");
        }
        if (path == null) return;
        i.removeExtra("wird_path");
        final String q = org.json.JSONObject.quote(path); // نص JS آمن (يمنع حقن كود عبر Intent)
        WebView wv = getBridge() != null ? getBridge().getWebView() : null;
        if (wv == null) return;
        String js = "(function(){var p=" + q + ";var h=p.indexOf('#')>=0?p.slice(p.indexOf('#')):'';var b=p.split('#')[0]||'/';"
                + "if(location.pathname===b&&h){if(location.hash===h)dispatchEvent(new HashChangeEvent('hashchange'));else location.hash=h;}"
                + "else location.href=b+(b.indexOf('?')<0?'?app=android':'')+h;})()";
        wv.postDelayed(() -> wv.evaluateJavascript(js, null), delay);
    }

    /* يبلّغ الصفحة بوضع النظام (فاتح/ليلي) لأن WebView لا يحدّث prefers-color-scheme دائمًا */
    private void pushSystemTheme() {
        try {
            int night = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
            boolean dark = night == Configuration.UI_MODE_NIGHT_YES;
            WebView wv = getBridge() != null ? getBridge().getWebView() : null;
            if (wv != null) {
                String js = "window.__sysDark=" + dark + ";try{dispatchEvent(new Event('sysdark'))}catch(e){}";
                wv.post(() -> wv.evaluateJavascript(js, null));
                wv.postDelayed(() -> wv.evaluateJavascript(js, null), 1500);
            }
        } catch (Exception ignored) {}
    }

    @Override
    public void onResume() {
        super.onResume();
        pushSystemTheme();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        pushSystemTheme();
    }
}
