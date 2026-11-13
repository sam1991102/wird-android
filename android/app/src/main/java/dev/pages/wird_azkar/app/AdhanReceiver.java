package dev.pages.wird_azkar.app;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;

import androidx.core.app.NotificationCompat;

import org.json.JSONObject;

/** Fired by AlarmManager; also re-arms everything after reboot / clock changes. */
public class AdhanReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent intent) {
        String action = intent.getAction() == null ? "" : intent.getAction();
        AdhanStore.ensureChannels(c);

        if (Intent.ACTION_BOOT_COMPLETED.equals(action)
                || Intent.ACTION_MY_PACKAGE_REPLACED.equals(action)
                || Intent.ACTION_TIME_CHANGED.equals(action)
                || Intent.ACTION_TIMEZONE_CHANGED.equals(action)
                || "android.app.action.SCHEDULE_EXACT_ALARM_PERMISSION_STATE_CHANGED".equals(action)) {
            AdhanStore.armAll(c);
            return;
        }

        String raw = intent.getStringExtra("ev");
        if (raw == null) return;
        JSONObject ev;
        try { ev = new JSONObject(raw); } catch (Exception e) { return; }
        String kind = ev.optString("kind", "notif");
        WirdWidget.refreshAll(c);

        if (kind.equals("adhan") || kind.equals("alarm")) {
            Intent svc = new Intent(c, AdhanService.class);
            svc.putExtra("ev", raw);
            try {
                if (Build.VERSION.SDK_INT >= 26) c.startForegroundService(svc); else c.startService(svc);
                return;
            } catch (Exception e) {
                // النظام منع تشغيل الخدمة من الخلفية (منبه غير دقيق على أندرويد 12+): نكمل بإشعار عادي بدل الانهيار
            }
        }

        // plain reminder (azkar, khatma, fasting …)
        Intent open = new Intent(c, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        open.setData(Uri.parse(AdhanStore.absolute(ev.optString("url", "/"))));
        PendingIntent pi = PendingIntent.getActivity(c, ev.optInt("id", 1), open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        NotificationCompat.Builder b = new NotificationCompat.Builder(c, AdhanStore.CH_GENERAL)
                .setSmallIcon(R.drawable.ic_stat_wird)
                .setContentTitle(ev.optString("title", "وِرد"))
                .setContentText(ev.optString("body", ""))
                .setStyle(new NotificationCompat.BigTextStyle().bigText(ev.optString("body", "")))
                .setColor(0xFFC49A4B)
                .setAutoCancel(true)
                .setContentIntent(pi);
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        nm.notify(ev.optInt("id", 1), b.build());
    }
}
