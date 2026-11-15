package dev.pages.wird_azkar.app;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;

/**
 * JS API (window.Capacitor.Plugins.WirdAdhan):
 *   schedule({events:[{id,t,kind:'adhan'|'alarm'|'notif',title,body,url,sound}]}) -> {armed}
 *   status() -> {notifications, exact, battery, alarmVolume}
 *   requestPermissions() / openExactSettings() / openBatterySettings() / openChannelSettings()
 *   test({kind,sound}) plays a sample now; stop() stops playback.
 */
@CapacitorPlugin(name = "WirdAdhan")
public class WirdAdhanPlugin extends Plugin {

    @Override
    public void load() {
        AdhanStore.ensureChannels(getContext());
    }

    @PluginMethod
    public void schedule(PluginCall call) {
        JSArray arr = call.getArray("events");
        final Context c = getContext();
        try {
            JSONArray events = arr == null ? new JSONArray() : new JSONArray(arr.toString());
            AdhanStore.save(c, events);
            int n = AdhanStore.armAll(c);
            WirdWidget.refreshAll(c);
            new Thread(() -> AdhanStore.cacheSounds(c, events)).start();
            JSObject r = new JSObject();
            r.put("armed", n);
            r.put("exact", AdhanStore.canExact(c));
            call.resolve(r);
        } catch (Exception e) {
            call.reject("schedule failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void status(PluginCall call) {
        Context c = getContext();
        JSObject r = new JSObject();
        r.put("notifications", NotificationManagerCompat.from(c).areNotificationsEnabled());
        r.put("exact", AdhanStore.canExact(c));
        PowerManager pm = (PowerManager) c.getSystemService(Context.POWER_SERVICE);
        r.put("battery", Build.VERSION.SDK_INT < 23 || pm.isIgnoringBatteryOptimizations(c.getPackageName()));
        r.put("alarmMuted", AdhanService.isMuted(c));
        r.put("fullScreen", AdhanStore.canFullScreen(c));
        r.put("oem", Build.MANUFACTURER == null ? "" : Build.MANUFACTURER.toLowerCase(java.util.Locale.ROOT));
        r.put("autostart", autostartIntent(c) != null);
        try { r.put("version", c.getPackageManager().getPackageInfo(c.getPackageName(), 0).versionName); } catch (Exception ignored) {}
        call.resolve(r);
    }

    /** أندرويد ١٤+: صفحة السماح بعرض منبّه الفجر على الشاشة كلها. */
    @PluginMethod
    public void openFullScreenSettings(PluginCall call) {
        try {
            if (Build.VERSION.SDK_INT >= 34) {
                Intent i = new Intent(android.provider.Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT,
                        android.net.Uri.parse("package:" + getContext().getPackageName()));
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(i);
            }
        } catch (Exception ignored) {}
        call.resolve();
    }

    @PluginMethod
    public void requestPermissions(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 33 && ContextCompat.checkSelfPermission(getContext(),
                Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.POST_NOTIFICATIONS}, 501);
        }
        call.resolve();
    }

    @PluginMethod
    public void openExactSettings(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 31) {
            Intent i = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM, Uri.parse("package:" + getContext().getPackageName()));
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
        }
        call.resolve();
    }

    /** صفحة «التشغيل التلقائي» عند الشركات اللي بتقفل التطبيقات في الخلفية (شاومي، أوبو، فيفو، هواوي...). */
    static Intent autostartIntent(Context c) {
        String[][] T = {
            {"com.miui.securitycenter", "com.miui.permcenter.autostart.AutoStartManagementActivity"},
            {"com.coloros.safecenter", "com.coloros.safecenter.permission.startup.StartupAppListActivity"},
            {"com.coloros.safecenter", "com.coloros.safecenter.startupapp.StartupAppListActivity"},
            {"com.oplus.safecenter", "com.oplus.safecenter.permission.startup.StartupAppListActivity"},
            {"com.vivo.permissionmanager", "com.vivo.permissionmanager.activity.BgStartUpManagerActivity"},
            {"com.iqoo.secure", "com.iqoo.secure.ui.phoneoptimize.AddWhiteListActivity"},
            {"com.huawei.systemmanager", "com.huawei.systemmanager.startupmgr.ui.StartupNormalAppListActivity"},
            {"com.huawei.systemmanager", "com.huawei.systemmanager.optimize.process.ProtectActivity"},
            {"com.hihonor.systemmanager", "com.hihonor.systemmanager.startupmgr.ui.StartupNormalAppListActivity"},
            {"com.letv.android.letvsafe", "com.letv.android.letvsafe.AutobootManageActivity"},
            {"com.asus.mobilemanager", "com.asus.mobilemanager.autostart.AutoStartActivity"}};
        for (String[] t : T) {
            Intent i = new Intent().setComponent(new android.content.ComponentName(t[0], t[1])).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            try { if (!c.getPackageManager().queryIntentActivities(i, 0).isEmpty()) return i; } catch (Exception ignored) {}
        }
        return null;
    }

    @PluginMethod
    public void openAutostart(PluginCall call) {
        Context c = getContext();
        Intent i = autostartIntent(c);
        try {
            if (i == null) i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + c.getPackageName())).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            c.startActivity(i);
            call.resolve();
        } catch (Exception e) {
            try { c.startActivity(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + c.getPackageName())).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); call.resolve(); }
            catch (Exception x) { call.reject("no settings"); }
        }
    }

    @PluginMethod
    public void openBatterySettings(PluginCall call) {
        try { // نفتح قائمة إعدادات البطارية ليختار المستخدم بنفسه (بدون الإذن المقيَّد في سياسة Google Play)
            Intent i = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
        } catch (Exception e) {
            try {
                Intent i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + getContext().getPackageName()));
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(i);
            } catch (Exception ignored) {}
        }
        call.resolve();
    }

    @PluginMethod
    public void openChannelSettings(PluginCall call) {
        Intent i = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
        i.putExtra(Settings.EXTRA_APP_PACKAGE, getContext().getPackageName());
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(i);
        call.resolve();
    }

    @PluginMethod
    public void test(PluginCall call) {
        try {
            org.json.JSONObject ev = new org.json.JSONObject();
            ev.put("kind", call.getString("kind", "adhan"));
            ev.put("title", "تجربة الأذان");
            ev.put("body", "هكذا سيعمل التنبيه في وقت الصلاة");
            ev.put("sound", call.getString("sound", ""));
            Intent svc = new Intent(getContext(), AdhanService.class);
            svc.putExtra("ev", ev.toString());
            if (Build.VERSION.SDK_INT >= 26) getContext().startForegroundService(svc); else getContext().startService(svc);
            call.resolve();
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void keepAwake(PluginCall call) {
        final boolean on = Boolean.TRUE.equals(call.getBoolean("on", false));
        getActivity().runOnUiThread(() -> {
            if (on) getActivity().getWindow().addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            else getActivity().getWindow().clearFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        });
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        Intent svc = new Intent(getContext(), AdhanService.class).setAction(AdhanService.ACT_STOP);
        getContext().startService(svc);
        call.resolve();
    }

    /** مرآة لمفاتيح الويب التي تحتاجها الويدجت: setData({key, value}) أو setData({items:{k:v}}) */
    @PluginMethod
    public void setData(PluginCall call) {
        Context c = getContext();
        try {
            com.getcapacitor.JSObject items = call.getObject("items");
            if (items != null) {
                java.util.Iterator<String> it = items.keys();
                while (it.hasNext()) { String k = it.next(); WidgetData.put(c, k, items.isNull(k) ? null : items.getString(k)); }
            } else {
                String k = call.getString("key");
                if (k != null) WidgetData.put(c, k, call.getString("value"));
            }
        } catch (Exception ignored) {}
        WidgetData.refreshAll(c);
        call.resolve();
    }

    /** الإشعار الثابت للصلاة القادمة: setOngoing({on:true|false}) → {on} */
    @PluginMethod
    public void setOngoing(PluginCall call) {
        Boolean v = call.getBoolean("on");
        if (v != null) OngoingNote.set(getContext(), v);
        JSObject r = new JSObject();
        r.put("on", OngoingNote.on(getContext()));
        call.resolve(r);
    }

    /** مشاركة صور/نص عبر قائمة المشاركة في أندرويد:
     *  share({files:[{name,mime,data(base64)}], text, title}) */
    @PluginMethod
    public void share(PluginCall call) {
        try {
            Context c = getContext();
            JSArray files = call.getArray("files", new JSArray());
            String text = call.getString("text", "");
            String title = call.getString("title", "");
            java.util.ArrayList<Uri> uris = new java.util.ArrayList<>();
            String mime = "text/plain";
            java.io.File dir = new java.io.File(c.getCacheDir(), "share");
            dir.mkdirs();
            for (int i = 0; i < files.length(); i++) {
                org.json.JSONObject f = files.getJSONObject(i);
                String name = f.optString("name", "wird-" + i + ".png").replaceAll("[^A-Za-z0-9._-]", "_");
                byte[] b = android.util.Base64.decode(f.optString("data", ""), android.util.Base64.DEFAULT);
                java.io.File out = new java.io.File(dir, name);
                try (java.io.FileOutputStream fo = new java.io.FileOutputStream(out)) { fo.write(b); }
                uris.add(androidx.core.content.FileProvider.getUriForFile(c, c.getPackageName() + ".fileprovider", out));
                mime = f.optString("mime", "image/png");
            }
            Intent it;
            if (uris.size() > 1) {
                it = new Intent(Intent.ACTION_SEND_MULTIPLE);
                it.putParcelableArrayListExtra(Intent.EXTRA_STREAM, uris);
            } else {
                it = new Intent(Intent.ACTION_SEND);
                if (uris.size() == 1) it.putExtra(Intent.EXTRA_STREAM, uris.get(0));
            }
            it.setType(uris.isEmpty() ? "text/plain" : mime);
            if (text != null && !text.isEmpty()) it.putExtra(Intent.EXTRA_TEXT, text);
            if (title != null && !title.isEmpty()) it.putExtra(Intent.EXTRA_SUBJECT, title);
            it.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            Intent ch = Intent.createChooser(it, title == null || title.isEmpty() ? "مشاركة" : title);
            ch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            c.startActivity(ch);
            call.resolve();
        } catch (Exception e) {
            call.reject("share failed: " + e.getMessage());
        }
    }

    /** احترام الوضع الصامت: setRespectSilent({on}) → {on}. */
    @PluginMethod
    public void setRespectSilent(PluginCall call) {
        Boolean v = call.getBoolean("on");
        if (v != null) AdhanStore.setRespectSilent(getContext(), v);
        JSObject r = new JSObject();
        r.put("on", AdhanStore.respectSilent(getContext()));
        call.resolve(r);
    }
}
