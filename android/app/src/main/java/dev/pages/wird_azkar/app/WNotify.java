package dev.pages.wird_azkar.app;

import android.app.AlarmManager;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;

import org.json.JSONObject;

/** شكل الإشعارات: صورة لكل نوع، وزر «ذكّرني بعد ١٥ دقيقة» للتذكيرات */
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
}
