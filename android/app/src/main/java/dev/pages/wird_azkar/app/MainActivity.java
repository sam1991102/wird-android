package dev.pages.wird_azkar.app;

import android.content.res.Configuration;
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
