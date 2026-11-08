package dev.pages.wird_azkar.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;

import org.json.JSONObject;

/** إشعار ثابت بالصلاة القادمة وعدّاد تنازلي — يظهر في شريط الإشعارات وعلى شاشة القفل. */
final class OngoingNote {
    static final String CH = "wird_next_prayer";
    static final int ID = 7702;

    static boolean on(Context c) { return WidgetData.p(c).getBoolean("ongoing", false); }

    static void set(Context c, boolean v) {
        WidgetData.p(c).edit().putBoolean("ongoing", v).apply();
        update(c);
        WidgetData.scheduleTick(c);
    }

    static void update(Context c) {
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        if (!on(c)) { nm.cancel(ID); return; }
        try {
            if (Build.VERSION.SDK_INT >= 26 && nm.getNotificationChannel(CH) == null) {
                NotificationChannel ch = new NotificationChannel(CH, "الصلاة القادمة (ثابت)", NotificationManager.IMPORTANCE_LOW);
                ch.setDescription("إشعار ثابت يعرض الصلاة القادمة والوقت المتبقي، ويظهر على شاشة القفل");
                ch.setShowBadge(false);
                ch.setSound(null, null);
                ch.enableVibration(false);
                ch.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
                nm.createNotificationChannel(ch);
            }
            JSONObject P = WidgetData.prayer(c);
            WidgetData.Cfg g = new WidgetData.Cfg();
            g.ampm = true;
            WidgetRender.Nx n = WidgetRender.nextOf(P);
            PrayerCalc.Day D = PrayerCalc.day(P, 0);
            StringBuilder all = new StringBuilder();
            for (int k = 0; k < 6; k++) {
                if (k > 0) all.append("   ");
                all.append(WidgetRender.name(k, D.fri)).append(" ").append(WidgetRender.fmt(D.t[k], P, g));
            }
            String title = "الصلاة القادمة: " + WidgetRender.name(n.k, n.fri);
            String text = "الأذان " + WidgetRender.fmt(n.t, P, g) + "  ·  " + P.optString("name", "");
            Notification.Builder b = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(c, CH) : new Notification.Builder(c);
            b.setSmallIcon(R.drawable.ic_stat_wird)
             .setContentTitle(title)
             .setContentText(text)
             .setStyle(new Notification.BigTextStyle().bigText(text + "\n" + all))
             .setSubText(WidgetRender.hijri(P, g))
             .setWhen(n.t)
             .setShowWhen(true)
             .setUsesChronometer(true)
             .setOngoing(true)
             .setOnlyAlertOnce(true)
             .setCategory(Notification.CATEGORY_STATUS)
             .setVisibility(Notification.VISIBILITY_PUBLIC)
             .setColor(0xFF0F6B4C)
             .setContentIntent(WidgetRender.open(c, "/#prayer", 7703));
            if (Build.VERSION.SDK_INT >= 24) b.setChronometerCountDown(true);
            if (Build.VERSION.SDK_INT < 26) b.setPriority(Notification.PRIORITY_LOW);
            nm.notify(ID, b.build());
        } catch (Exception ignored) {}
    }
}
