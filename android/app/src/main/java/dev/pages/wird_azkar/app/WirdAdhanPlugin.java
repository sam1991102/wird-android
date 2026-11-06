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
        try { r.put("version", c.getPackageManager().getPackageInfo(c.getPackageName(), 0).versionName); } catch (Exception ignored) {}
        call.resolve(r);
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

    @PluginMethod
    public void openBatterySettings(PluginCall call) {
        try {
            Intent i = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:" + getContext().getPackageName()));
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
        } catch (Exception e) {
            Intent i = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
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
}
