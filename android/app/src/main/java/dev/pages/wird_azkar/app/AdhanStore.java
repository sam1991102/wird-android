package dev.pages.wird_azkar.app;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.AudioAttributes;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;

/** Stores the schedule sent by the web app and arms it in AlarmManager. */
public final class AdhanStore {
    static final String PREFS = "wird_adhan";
    static final String KEY_EVENTS = "events";
    static final String CH_ADHAN = "wird_adhan_v1";
    static final String CH_ALARM = "wird_alarm_v1";
    static final String CH_GENERAL = "wird_general_v2";
    static final String CH_PLAYING = "wird_playing_v1";
    /** ذكر الساعة: قناة بتنزل من فوق (من غير صوت، اهتزاز قصير) وقناة هادية لو المستخدم اختار كده */
    static final int MAX_ARMED = 400;
    static final String CH_DHIKR = "wird_dhikr_v1";
    static final String CH_DHIKR_QUIET = "wird_dhikr_quiet_v1";
    static final String BASE = "https://wird-azkar.pages.dev";

    private AdhanStore() {}

    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    static void ensureChannels(Context c) {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        AudioAttributes aa = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build();

        NotificationChannel adhan = new NotificationChannel(CH_ADHAN, "الأذان", NotificationManager.IMPORTANCE_HIGH);
        adhan.setDescription("تنبيه دخول وقت الصلاة مع صوت الأذان");
        adhan.setSound(null, null); // the adhan itself is played by AdhanService
        adhan.enableVibration(true);
        adhan.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);

        NotificationChannel alarm = new NotificationChannel(CH_ALARM, "منبه الفجر", NotificationManager.IMPORTANCE_HIGH);
        alarm.setDescription("منبه يرنّ حتى توقفه");
        alarm.setSound(null, null);
        alarm.enableVibration(true);
        alarm.setBypassDnd(true);
        alarm.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);

        NotificationChannel general = new NotificationChannel(CH_GENERAL, "الأذكار والتذكيرات", NotificationManager.IMPORTANCE_HIGH);
        general.setDescription("أذكار الصباح والمساء والتذكيرات");
        general.setSound(android.provider.Settings.System.DEFAULT_NOTIFICATION_URI, aa);

        NotificationChannel playing = new NotificationChannel(CH_PLAYING, "تشغيل الأذان", NotificationManager.IMPORTANCE_LOW);
        playing.setSound(null, null);

        nm.createNotificationChannel(adhan);
        nm.createNotificationChannel(alarm);
        nm.createNotificationChannel(general);
        try { nm.deleteNotificationChannel("wird_general_v1"); } catch (Exception ignored) {}
        nm.createNotificationChannel(playing);

        NotificationChannel dhikr = new NotificationChannel(CH_DHIKR, "ذكر الساعة", NotificationManager.IMPORTANCE_HIGH);
        dhikr.setDescription("ذكر قصير بيظهر فوق الشاشة كل فترة");
        dhikr.setSound(null, null);
        dhikr.enableVibration(true);
        dhikr.setVibrationPattern(new long[]{0, 40});
        dhikr.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);
        nm.createNotificationChannel(dhikr);

        NotificationChannel dhikrQuiet = new NotificationChannel(CH_DHIKR_QUIET, "ذكر الساعة (هادي)", NotificationManager.IMPORTANCE_LOW);
        dhikrQuiet.setDescription("ذكر قصير في الإشعارات من غير ما يظهر فوق الشاشة");
        dhikrQuiet.setSound(null, null);
        nm.createNotificationChannel(dhikrQuiet);
    }

    static void save(Context c, JSONArray events) {
        prefs(c).edit().putString(KEY_EVENTS, events.toString()).apply();
    }

    static JSONArray load(Context c) {
        try {
            return new JSONArray(prefs(c).getString(KEY_EVENTS, "[]"));
        } catch (Exception e) {
            return new JSONArray();
        }
    }

    /** أندرويد ١٤+ ممكن يقفل «ملء الشاشة» للتطبيقات غير المنبّهات؛ قبل كده مسموح دايمًا. */
    static boolean canFullScreen(Context c) {
        if (Build.VERSION.SDK_INT < 34) return true;
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        return nm == null || nm.canUseFullScreenIntent();
    }

    static boolean canExact(Context c) {
        if (Build.VERSION.SDK_INT < 31) return true;
        AlarmManager am = c.getSystemService(AlarmManager.class);
        return am.canScheduleExactAlarms();
    }

    private static PendingIntent fireIntent(Context c, int reqCode, JSONObject ev) {
        Intent i = new Intent(c, AdhanReceiver.class);
        i.setAction("dev.pages.wird_azkar.app.FIRE");
        if (ev != null) i.putExtra("ev", ev.toString());
        int flags = PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE;
        return PendingIntent.getBroadcast(c, reqCode, i, flags);
    }

    /** Cancels previously armed alarms and arms every future event. */
    static int armAll(Context c) {
        AlarmManager am = c.getSystemService(AlarmManager.class);
        SharedPreferences p = prefs(c);
        // cancel old
        try {
            JSONArray old = new JSONArray(p.getString("armed", "[]"));
            for (int k = 0; k < old.length(); k++) {
                am.cancel(fireIntent(c, old.getInt(k), null));
            }
        } catch (Exception ignored) {}

        JSONArray events = load(c);
        JSONArray armed = new JSONArray();
        long now = System.currentTimeMillis();
        int count = 0;
        for (int k = 0; k < events.length(); k++) {
            JSONObject ev = events.optJSONObject(k);
            if (ev == null) continue;
            long t = ev.optLong("t", 0);
            if (t <= now) continue;
            int req = ev.optInt("id", k + 1);
            PendingIntent pi = fireIntent(c, req, ev);
            String kind = ev.optString("kind", "notif");
            boolean loud = kind.equals("adhan") || kind.equals("alarm");
            /* أندرويد بيقفل التطبيق لو عدّى ٥٠٠ منبّه: بعد ٤٠٠ نسيب التذكيرات ونكمّل الأذان والمنبّه بس */
            if (count >= MAX_ARMED && !loud) continue;
            try {
                if (loud && canExact(c)) {
                    Intent open = new Intent(c, MainActivity.class);
                    PendingIntent show = PendingIntent.getActivity(c, 7, open, PendingIntent.FLAG_IMMUTABLE);
                    am.setAlarmClock(new AlarmManager.AlarmClockInfo(t, show), pi);
                } else if (canExact(c)) {
                    am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, t, pi);
                } else {
                    am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, t, pi);
                }
                armed.put(req);
                count++;
            } catch (SecurityException se) {
                try {
                    am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, t, pi);
                    armed.put(req);
                    count++;
                } catch (Exception ignored) {}
            } catch (Exception ignored) {
                /* مثلًا حد المنبّهات بتاع النظام: نكمّل الباقي من غير ما التطبيق يقفل */
            }
        }
        p.edit().putString("armed", armed.toString()).apply();
        return count;
    }

    static void snooze(Context c, JSONObject ev, int minutes) {
        try {
            JSONObject copy = new JSONObject(ev.toString());
            copy.put("t", System.currentTimeMillis() + minutes * 60_000L);
            copy.put("id", 900000 + (int) (System.currentTimeMillis() / 1000 % 90000));
            AlarmManager am = c.getSystemService(AlarmManager.class);
            PendingIntent pi = fireIntent(c, copy.getInt("id"), copy);
            if (canExact(c)) {
                Intent open = new Intent(c, MainActivity.class);
                PendingIntent show = PendingIntent.getActivity(c, 7, open, PendingIntent.FLAG_IMMUTABLE);
                am.setAlarmClock(new AlarmManager.AlarmClockInfo(copy.getLong("t"), show), pi);
            } else {
                am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, copy.getLong("t"), pi);
            }
        } catch (Exception ignored) {}
    }

    // ---------- sound files ----------

    static File soundFile(Context c, String url) {
        if (url == null || url.isEmpty()) return null;
        File dir = new File(c.getFilesDir(), "adhan");
        if (!dir.exists()) dir.mkdirs();
        return new File(dir, sha1(url) + ".mp3");
    }

    /** Downloads every distinct sound used by the schedule (runs on a background thread). */
    static void cacheSounds(Context c, JSONArray events) {
        java.util.HashSet<String> seen = new java.util.HashSet<>();
        for (int k = 0; k < events.length(); k++) {
            JSONObject ev = events.optJSONObject(k);
            if (ev == null) continue;
            String s = ev.optString("sound", "");
            if (s.isEmpty() || !seen.add(s)) continue;
            File f = soundFile(c, absolute(s));
            if (f != null && f.exists() && f.length() > 10_000) continue;
            download(absolute(s), f);
        }
    }

    static String absolute(String s) {
        if (s == null || s.isEmpty()) return s;
        int h = s.indexOf('#'); if (h >= 0) s = s.substring(0, h);
        if (s.startsWith("http")) return s;
        return BASE + (s.startsWith("/") ? s : "/" + s);
    }

    private static void download(String url, File out) {
        HttpURLConnection con = null;
        try {
            con = (HttpURLConnection) new URL(url).openConnection();
            con.setConnectTimeout(20000);
            con.setReadTimeout(60000);
            con.setInstanceFollowRedirects(true);
            if (con.getResponseCode() / 100 != 2) return;
            File tmp = new File(out.getPath() + ".part");
            try (InputStream in = con.getInputStream(); FileOutputStream fo = new FileOutputStream(tmp)) {
                byte[] buf = new byte[16384];
                int n;
                while ((n = in.read(buf)) > 0) fo.write(buf, 0, n);
            }
            if (tmp.length() > 10_000) tmp.renameTo(out); else tmp.delete();
        } catch (Exception ignored) {
        } finally {
            if (con != null) con.disconnect();
        }
    }

    private static String sha1(String s) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] d = md.digest(s.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            for (byte b : d) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            return Integer.toHexString(s.hashCode());
        }
    }

    /* ---------- تجديد ذاتي: الأذان يستمر حتى لو لم يُفتح التطبيق ---------- */
    private static long dayNum(long t, java.util.TimeZone tz) { return (long) Math.floor((t + tz.getOffset(t)) / 86400000.0); }

    /** لو قاربت مواعيد الأذان/المنبه المخزّنة على الانتهاء، يولّد ١٤ يومًا إضافية بنفس نمط آخر أسبوع ومن حساب المواقيت المحلي. */
    static void extendIfNeeded(Context c) {
        try {
            JSONArray events = load(c);
            JSONObject P = WidgetData.prayer(c);
            java.util.TimeZone tz = java.util.TimeZone.getTimeZone(P.optString("tz", "Asia/Riyadh"));
            long now = System.currentTimeMillis(), maxT = 0;
            for (int k = 0; k < events.length(); k++) {
                JSONObject ev = events.optJSONObject(k);
                if (ev == null) continue;
                String kind = ev.optString("kind");
                if (kind.equals("adhan") || kind.equals("alarm")) maxT = Math.max(maxT, ev.optLong("t", 0));
            }
            if (maxT == 0 || maxT - now > 5L * 86400000L) return; // لا يوجد أذان مفعّل، أو ما زال الرصيد كافيًا
            long today = dayNum(now, tz), last = dayNum(maxT, tz);
            if (last < today - 30) return; // بيانات قديمة جدًا: ننتظر فتح التطبيق
            JSONArray out = new JSONArray();
            for (int k = 0; k < events.length(); k++) { // نحتفظ بآخر ٨ أيام فقط كقالب + القادم
                JSONObject ev = events.optJSONObject(k);
                if (ev != null && dayNum(ev.optLong("t", 0), tz) >= Math.min(last, today) - 8) out.put(ev);
            }
            long start = Math.max(last, today - 1);
            for (int n = 1; n <= 14; n++) {
                long tgt = start + n, src = tgt;
                while (src > last) src -= 7;       // نفس يوم الأسبوع (الجمعة تبقى جمعة)
                if (src < last - 6) continue;
                PrayerCalc.Day ds = PrayerCalc.day(P, (int) (src - today)), dt = PrayerCalc.day(P, (int) (tgt - today));
                int idx = 0;
                for (int k = 0; k < events.length(); k++) {
                    JSONObject ev = events.optJSONObject(k);
                    if (ev == null) continue;
                    String kind = ev.optString("kind");
                    if (!(kind.equals("adhan") || kind.equals("alarm"))) continue;
                    long t = ev.optLong("t", 0);
                    if (dayNum(t, tz) != src) continue;
                    int best = -1; long bd = Long.MAX_VALUE;
                    for (int q = 0; q < 6; q++) { long d = Math.abs(t - ds.t[q]); if (d < bd) { bd = d; best = q; } }
                    long nt = bd <= 90 * 60000L ? dt.t[best] + (t - ds.t[best]) : t + (tgt - src) * 86400000L;
                    if (nt <= now) continue;
                    JSONObject cp = new JSONObject(ev.toString());
                    cp.put("t", nt);
                    cp.put("id", 1000000 + (int) (tgt % 1000) * 100 + (idx++ % 100));
                    cp.put("gen", true);
                    out.put(cp);
                }
            }
            save(c, out);
            armAll(c);
        } catch (Exception ignored) {}
    }

    static boolean respectSilent(Context c) { return prefs(c).getBoolean("respectSilent", false); }
    static void setRespectSilent(Context c, boolean v) { prefs(c).edit().putBoolean("respectSilent", v).apply(); }
    static boolean phoneSilent(Context c) {
        try {
            android.media.AudioManager am = (android.media.AudioManager) c.getSystemService(Context.AUDIO_SERVICE);
            return am.getRingerMode() != android.media.AudioManager.RINGER_MODE_NORMAL;
        } catch (Exception e) { return false; }
    }
}
