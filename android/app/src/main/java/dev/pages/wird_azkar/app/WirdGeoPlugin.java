package dev.pages.wird_azkar.app;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationManager;
import android.os.CancellationSignal;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;

import androidx.core.content.ContextCompat;
import androidx.core.location.LocationManagerCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

/**
 * تحديد الموقع من أندرويد مباشرة بدل موقع المتصفح (اللي بيفشل على بعض الأجهزة زي شاومي).
 * JS: WirdGeo.get() → {lat,lng,acc,t} أو رفض بكود: denied | off | timeout
 *     WirdGeo.state() → {perm: granted|denied|prompt, on: boolean}
 *     WirdGeo.openSettings() يفتح إعدادات خدمة الموقع، openAppSettings() إعدادات التطبيق
 * الموقع التقريبي (COARSE) كفاية لمواقيت الصلاة والقبلة.
 */
@CapacitorPlugin(name = "WirdGeo", permissions = {
        @Permission(alias = "loc", strings = { Manifest.permission.ACCESS_COARSE_LOCATION })
})
public class WirdGeoPlugin extends Plugin {
    private static final long FRESH_MS = 30 * 60 * 1000L;
    private static final long TIMEOUT_MS = 12000L; // المستخدم مايستناش أكتر من كده؛ بعدها آخر موقع معروف أو رسالة واضحة

    private LocationManager lm() {
        return (LocationManager) getContext().getSystemService(Context.LOCATION_SERVICE);
    }

    private boolean on() {
        LocationManager m = lm();
        return m != null && LocationManagerCompat.isLocationEnabled(m);
    }

    @PluginMethod
    public void state(PluginCall call) {
        JSObject r = new JSObject();
        PermissionState s = getPermissionState("loc");
        r.put("perm", s == PermissionState.GRANTED ? "granted" : s == PermissionState.DENIED ? "denied" : "prompt");
        r.put("on", on());
        call.resolve(r);
    }

    @PluginMethod
    public void get(PluginCall call) {
        if (getPermissionState("loc") != PermissionState.GRANTED) {
            requestPermissionForAlias("loc", call, "permCb");
            return;
        }
        locate(call);
    }

    @PermissionCallback
    private void permCb(PluginCall call) {
        if (getPermissionState("loc") == PermissionState.GRANTED) locate(call);
        else call.reject("لم يُسمح بالوصول للموقع", "denied");
    }

    private Location best() {
        LocationManager m = lm();
        Location b = null;
        for (String p : new String[] { LocationManager.NETWORK_PROVIDER, LocationManager.GPS_PROVIDER, LocationManager.PASSIVE_PROVIDER }) {
            try {
                Location l = m.getLastKnownLocation(p);
                if (l != null && (b == null || l.getTime() > b.getTime())) b = l;
            } catch (SecurityException | IllegalArgumentException ignored) { }
        }
        return b;
    }

    private void send(PluginCall call, Location l) {
        JSObject r = new JSObject();
        r.put("lat", l.getLatitude());
        r.put("lng", l.getLongitude());
        r.put("acc", l.hasAccuracy() ? l.getAccuracy() : 5000);
        r.put("t", l.getTime());
        call.resolve(r);
    }

    private void locate(PluginCall call) {
        if (!on()) { call.reject("خدمة الموقع متوقفة", "off"); return; }
        Location last = best();
        if (last != null && System.currentTimeMillis() - last.getTime() < FRESH_MS) { send(call, last); return; }
        LocationManager m = lm();
        String provider = m.isProviderEnabled(LocationManager.NETWORK_PROVIDER) ? LocationManager.NETWORK_PROVIDER
                : m.isProviderEnabled(LocationManager.GPS_PROVIDER) ? LocationManager.GPS_PROVIDER : null;
        if (provider == null) {
            if (last != null) send(call, last); else call.reject("خدمة الموقع متوقفة", "off");
            return;
        }
        final boolean[] done = { false };
        final CancellationSignal cancel = new CancellationSignal();
        final Handler h = new Handler(Looper.getMainLooper());
        Runnable timeout = () -> {
            if (done[0]) return;
            done[0] = true;
            cancel.cancel();
            Location l = best();
            if (l != null) send(call, l); else call.reject("تعذّر تحديد الموقع، جرّب في مكان مفتوح", "timeout");
        };
        h.postDelayed(timeout, TIMEOUT_MS);
        try {
            LocationManagerCompat.getCurrentLocation(m, provider, cancel, ContextCompat.getMainExecutor(getContext()), l -> {
                if (done[0]) return;
                done[0] = true;
                h.removeCallbacks(timeout);
                if (l != null) { send(call, l); return; }
                Location b = best();
                if (b != null) send(call, b); else call.reject("تعذّر تحديد الموقع، جرّب في مكان مفتوح", "timeout");
            });
        } catch (SecurityException e) {
            done[0] = true;
            h.removeCallbacks(timeout);
            call.reject("لم يُسمح بالوصول للموقع", "denied");
        }
    }

    @PluginMethod
    public void openSettings(PluginCall call) {
        Intent i = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try { getContext().startActivity(i); call.resolve(); } catch (Exception e) { call.reject("no settings"); }
    }

    @PluginMethod
    public void openAppSettings(PluginCall call) {
        Intent i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                android.net.Uri.fromParts("package", getContext().getPackageName(), null)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try { getContext().startActivity(i); call.resolve(); } catch (Exception e) { call.reject("no settings"); }
    }
}
