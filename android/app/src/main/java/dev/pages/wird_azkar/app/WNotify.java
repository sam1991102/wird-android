package dev.pages.wird_azkar.app;

import android.app.AlarmManager;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;

import androidx.core.app.NotificationCompat;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/** شكل الإشعارات: صورة لكل نوع، وزر «ذكّرني بعد ١٥ دقيقة» للتذكيرات، وإشعار «ذكر الساعة» بزراير العدّ */
final class WNotify {
    static final String ACT_LATER = "dev.pages.wird_azkar.app.LATER";
    static final long LATER_MS = 15 * 60_000L;

    private WNotify() {}

    /** نوع الإشعار من بياناته: أذان، صباح، ضحى، مساء، نوم، كهف، عام */
    static String type(JSONObject ev) {
        String kind = ev.optString("kind", "");
        if (kind.equals("adhan") || kind.equals("alarm")) return "adhan";
        String t = ev.optString("title", "") + " " + ev.optString("body", "") + " " + ev.optString("url", "");
        if (t.contains("الضحى")) return "duha";
        if (t.contains("الكهف")) return "kahf";
        if (t.contains("الصباح")) return "morning";
        if (t.contains("المساء")) return "evening";
        if (t.contains("النوم")) return "sleep";
        return "general";
    }

    static Bitmap largeIcon(Context c, JSONObject ev) {
        int id;
        switch (type(ev)) {
            case "adhan": id = R.drawable.wn_adhan; break;
            case "duha": id = R.drawable.wn_duha; break;
            case "kahf": id = R.drawable.wn_kahf; break;
            case "morning": id = R.drawable.wn_morning; break;
            case "evening": id = R.drawable.wn_evening; break;
            case "sleep": id = R.drawable.wn_sleep; break;
            default: id = R.drawable.wn_general;
        }
        return BitmapFactory.decodeResource(c.getResources(), id);
    }

    /** زر «لاحقًا»: يعيد نفس التذكير بعد ١٥ دقيقة */
    static PendingIntent laterIntent(Context c, String raw, int id) {
        Intent i = new Intent(c, AdhanReceiver.class).setAction(ACT_LATER);
        i.putExtra("ev", raw);
        i.putExtra("nid", id);
        return PendingIntent.getBroadcast(c, 20_000 + id, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static void scheduleLater(Context c, Intent in) {
        String raw = in.getStringExtra("ev");
        int nid = in.getIntExtra("nid", 1);
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        nm.cancel(nid);
        if (raw == null) return;
        Intent fire = new Intent(c, AdhanReceiver.class);
        fire.putExtra("ev", raw);
        PendingIntent pi = PendingIntent.getBroadcast(c, 30_000 + nid, fire, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        long at = System.currentTimeMillis() + LATER_MS;
        if (Build.VERSION.SDK_INT >= 23) am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
        else am.set(AlarmManager.RTC_WAKEUP, at, pi);
    }

    /* ===== ذكر الساعة ===== */
    static final String ACT_DHIKR = "dev.pages.wird_azkar.app.DHIKR";
    static final int DHIKR_NID = 4243; // غير 4242 بتاع إشعار تشغيل الأذان
    private static final String P_DATE = "dh_taps_date", P_N = "dh_taps_n", P_KEY = "dh_cur_key", P_DONE = "dh_cur_done", P_EV = "dh_cur_ev";

    private static String today() { return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date()); }

    private static String ar(int n) {
        String d = "٠١٢٣٤٥٦٧٨٩", s = String.valueOf(n);
        StringBuilder b = new StringBuilder();
        for (char ch : s.toCharArray()) b.append(ch >= '0' && ch <= '9' ? d.charAt(ch - '0') : ch);
        return b.toString();
    }

    /** صورة الإشعار على حسب وقت اليوم */
    private static Bitmap dhikrIcon(Context c) {
        int h = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        int id = h < 11 ? R.drawable.wn_morning : h < 15 ? R.drawable.wn_duha : h < 19 ? R.drawable.wn_evening : R.drawable.wn_sleep;
        return BitmapFactory.decodeResource(c.getResources(), id);
    }

    private static PendingIntent tapIntent(Context c, int req, int n, boolean close) {
        Intent i = new Intent(c, AdhanReceiver.class).setAction(ACT_DHIKR);
        i.putExtra("n", n);
        i.putExtra("close", close);
        return PendingIntent.getBroadcast(c, 40_000 + req, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** يرسم إشعار الذكر (والتطبيق مفتوح ما يظهرش). الجديد بيحل محل القديم برقم ثابت */
    static void dhikr(Context c, JSONObject ev, String raw) {
        if (MainActivity.foreground) return;
        SharedPreferences p = AdhanStore.prefs(c);
        JSONObject x = ev.optJSONObject("x");
        String key = x != null ? x.optString("key", "") : "";
        if (!key.equals(p.getString(P_KEY, ""))) p.edit().putString(P_KEY, key).putInt(P_DONE, 0).apply();
        p.edit().putString(P_EV, raw).apply();
        show(c, ev, false);
    }

    private static void show(Context c, JSONObject ev, boolean update) {
        SharedPreferences p = AdhanStore.prefs(c);
        JSONObject x = ev.optJSONObject("x");
        String text = x != null ? x.optString("text", ev.optString("body", "")) : ev.optString("body", "");
        String fadl = x != null ? x.optString("fadl", "") : "";
        String src = x != null ? x.optString("src", "") : "";
        int reps = x != null ? Math.max(1, x.optInt("reps", 1)) : 1;
        int done = p.getInt(P_DONE, 0);
        String foot = fadl.isEmpty() ? src : (src.isEmpty() ? fadl : fadl + " — " + src);

        Intent open = new Intent(c, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        open.setData(Uri.parse(AdhanStore.absolute(ev.optString("url", "/"))));
        PendingIntent pi = PendingIntent.getActivity(c, DHIKR_NID, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        String ch = ev.optInt("heads", 1) == 1 ? AdhanStore.CH_DHIKR : AdhanStore.CH_DHIKR_QUIET;

        NotificationCompat.Builder b = new NotificationCompat.Builder(c, ch)
                .setSmallIcon(R.drawable.ic_stat_wird)
                .setColor(0xFF0E4A3A)
                .setSubText("ذكر الساعة")
                .setContentTitle(ev.optString("title", "ذكر"))
                .setContentText(text)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(foot.isEmpty() ? text : text + "\n\n" + foot))
                .setLargeIcon(dhikrIcon(c))
                .setCategory(NotificationCompat.CATEGORY_REMINDER)
                .setPriority(ch.equals(AdhanStore.CH_DHIKR) ? NotificationCompat.PRIORITY_HIGH : NotificationCompat.PRIORITY_LOW)
                .setOnlyAlertOnce(update)
                .setAutoCancel(true)
                .setTimeoutAfter(55 * 60_000L)
                .setContentIntent(pi);
        if (reps > 1) {
            b.setProgress(reps, Math.min(done, reps), false);
            if (done > 0) b.setSubText("ذكر الساعة · " + ar(Math.min(done, reps)) + " من " + ar(reps));
            b.addAction(0, "قلتها ✓", tapIntent(c, 1, Math.max(1, reps - done), true));
            b.addAction(0, "+" + ar(10), tapIntent(c, 2, 10, false));
        } else {
            b.addAction(0, "قلتها ✓", tapIntent(c, 1, 1, true));
        }
        b.addAction(0, "بعدين", laterIntent(c, AdhanStore.prefs(c).getString(P_EV, ""), DHIKR_NID));
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        nm.notify(DHIKR_NID, b.build());
    }

    /** ضغطة «قلتها» أو «+١٠»: تتحسب لعدّاد اليوم، وتقفل الإشعار لو خلص العدد */
    static void dhikrTap(Context c, Intent in) {
        SharedPreferences p = AdhanStore.prefs(c);
        int n = Math.max(1, in.getIntExtra("n", 1));
        String d = today();
        int had = d.equals(p.getString(P_DATE, "")) ? p.getInt(P_N, 0) : 0;
        int done = p.getInt(P_DONE, 0) + n;
        p.edit().putString(P_DATE, d).putInt(P_N, had + n).putInt(P_DONE, done).apply();
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        JSONObject ev = null;
        try { ev = new JSONObject(p.getString(P_EV, "{}")); } catch (Exception ignored) {}
        JSONObject x = ev != null ? ev.optJSONObject("x") : null;
        int reps = x != null ? Math.max(1, x.optInt("reps", 1)) : 1;
        if (in.getBooleanExtra("close", true) || done >= reps || ev == null) nm.cancel(DHIKR_NID);
        else show(c, ev, true);
    }

    /** الضغطات من آخر مرة اتفتح فيها التطبيق: {التاريخ، العدد} وبيصفّرها */
    static String[] takeTaps(Context c) {
        SharedPreferences p = AdhanStore.prefs(c);
        String d = p.getString(P_DATE, "");
        int n = p.getInt(P_N, 0);
        p.edit().putInt(P_N, 0).apply();
        return new String[]{d, String.valueOf(n)};
    }
}
